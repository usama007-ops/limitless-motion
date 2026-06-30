-- ============================================================
-- Limitless Motion - Supabase Schema Migration
-- Replaces all PocketBase collections
-- ============================================================

-- 0. EXTENSIONS
create extension if not exists "pgcrypto";

-- 1. PROFILES (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  name text,
  is_premium boolean default false,
  current_tier text check (current_tier in ('basic', 'premium', 'elite')),
  billing_cycle text check (billing_cycle in ('monthly', 'yearly')),
  membership_start_date date,
  membership_end_date date,
  stripe_customer_id text,
  stripe_subscription_id text,
  default_payment_method_id text,
  role text default 'user' check (role in ('user', 'admin')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, new.raw_user_meta_data->>'name');
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2. TERMS ACCEPTANCE
create table if not exists public.terms_acceptance (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  accepted_at timestamptz default now(),
  ip_address text,
  user_agent text
);

alter table public.terms_acceptance enable row level security;

create policy "Users can insert own acceptance"
  on public.terms_acceptance for insert
  with check (auth.uid() = user_id);

create policy "Users can view own acceptance"
  on public.terms_acceptance for select
  using (auth.uid() = user_id);

-- 3. WORKOUT PROGRAMS
create table if not exists public.workout_programs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  goal text not null,
  difficulty text check (difficulty in ('beginner', 'intermediate', 'advanced')),
  session_duration numeric not null check (session_duration >= 1),
  target_audience text,
  category text check (category in ('burn', 'move', 'think', 'community', 'align')),
  social boolean default false,
  workout_type text check (workout_type in ('strength', 'cardio', 'flexibility', 'mindfulness', 'mobility', 'hiit', 'functional')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.workout_programs enable row level security;

create policy "Anyone can view workout programs"
  on public.workout_programs for select
  using (true);

create policy "Admins can insert workout programs"
  on public.workout_programs for insert
  with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "Admins can update workout programs"
  on public.workout_programs for update
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "Admins can delete workout programs"
  on public.workout_programs for delete
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- 4. WORKOUT DAYS
create table if not exists public.workout_days (
  id uuid primary key default gen_random_uuid(),
  program_id uuid references public.workout_programs(id) on delete cascade not null,
  day_of_week numeric not null check (day_of_week >= 1 and day_of_week <= 7),
  day_name text not null,
  focus_area text,
  estimated_duration numeric,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.workout_days enable row level security;

create policy "Anyone can view workout days"
  on public.workout_days for select using (true);

create policy "Admins can write workout days"
  on public.workout_days for insert with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "Admins can update workout days"
  on public.workout_days for update using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "Admins can delete workout days"
  on public.workout_days for delete using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- 5. EXERCISES
create table if not exists public.exercises (
  id uuid primary key default gen_random_uuid(),
  program_id uuid references public.workout_programs(id) on delete cascade,
  day_id uuid references public.workout_days(id) on delete cascade,
  exercise_name text not null,
  sets numeric not null check (sets >= 1),
  reps text,
  duration text,
  rest_period text,
  muscle_groups jsonb,
  difficulty text check (difficulty in ('beginner', 'intermediate', 'advanced')),
  form_tips text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.exercises add column if not exists program_id uuid references public.workout_programs(id) on delete cascade;

alter table public.exercises enable row level security;

create policy "Anyone can view exercises"
  on public.exercises for select using (true);

create policy "Admins can write exercises"
  on public.exercises for insert with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- 6. WORKOUTS (user-logged workouts)
create table if not exists public.workouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  exercise_name text not null,
  date date not null,
  sets numeric not null check (sets >= 1),
  reps numeric not null check (reps >= 1),
  weight numeric,
  weight_unit text check (weight_unit in ('lbs', 'kg')),
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.workouts enable row level security;

create policy "Users can CRUD own workouts"
  on public.workouts for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 7. USER WORKOUT PROGRESS
create table if not exists public.user_workout_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  program_id uuid references public.workout_programs(id) on delete cascade not null,
  current_day numeric default 1 check (current_day >= 1),
  start_date date,
  completed_exercises jsonb,
  completed_days jsonb default '[]'::jsonb,
  weights jsonb,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.user_workout_progress enable row level security;

create policy "Users can CRUD own progress"
  on public.user_workout_progress for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 8. WORKOUT VIDEOS
create table if not exists public.workout_videos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  duration numeric,
  difficulty text not null check (difficulty in ('beginner', 'intermediate', 'advanced')),
  category text not null check (category in ('cardio', 'strength', 'flexibility', 'yoga', 'hiit', 'pilates', 'dance', 'other')),
  video_file_url text,
  upload_date timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.workout_videos enable row level security;

create policy "Anyone can view workout videos"
  on public.workout_videos for select using (true);

create policy "Admins can write workout videos"
  on public.workout_videos for insert with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- 9. WORKOUT CHALLENGES
create table if not exists public.workout_challenges (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  duration text,
  start_date date,
  end_date date,
  participant_count numeric default 0,
  rules text,
  badge text,
  prize text,
  status text check (status in ('active', 'upcoming', 'completed')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.workout_challenges enable row level security;

create policy "Anyone can view challenges"
  on public.workout_challenges for select using (true);

create policy "Authenticated users can insert challenges"
  on public.workout_challenges for insert
  with check (auth.role() = 'authenticated');

-- 10. CHALLENGE PARTICIPANTS
create table if not exists public.challenge_participants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  challenge_id uuid references public.workout_challenges(id) on delete cascade not null,
  joined_date date,
  completion_status text check (completion_status in ('in-progress', 'completed', 'abandoned')),
  progress_percent numeric,
  score numeric,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.challenge_participants enable row level security;

create policy "Users can CRUD own participation"
  on public.challenge_participants for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 11. RECOVERY FLOWS
create table if not exists public.recovery_flows (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null check (type in ('stretch', 'mobility', 'breathing')),
  duration numeric,
  stretches jsonb,
  instructions text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.recovery_flows enable row level security;

create policy "Anyone can view recovery flows"
  on public.recovery_flows for select using (true);

create policy "Admins can write recovery flows"
  on public.recovery_flows for insert with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- 12. MEAL RECIPES
create table if not exists public.meal_recipes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text check (category in ('breakfast', 'lunch', 'dinner', 'snack')),
  season text check (season in ('fasting', 'non-fasting', 'both')),
  ingredients jsonb,
  instructions text,
  protein_grams numeric,
  carbs_grams numeric,
  fats_grams numeric,
  calories_total numeric,
  prep_time_minutes numeric,
  cook_time_minutes numeric,
  image_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.meal_recipes enable row level security;

create policy "Anyone can view meal recipes"
  on public.meal_recipes for select
  using (true);

create policy "Admins can write meal recipes"
  on public.meal_recipes for insert with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- 13. ETHIOPIAN MEALS
create table if not exists public.ethiopian_meals (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  prep_time_minutes numeric not null check (prep_time_minutes >= 5),
  ingredients jsonb,
  calories_total numeric,
  protein_grams numeric,
  carbs_grams numeric,
  fats_grams numeric,
  meal_prep_instructions text,
  category text check (category in ('breakfast', 'lunch', 'dinner', 'snack')),
  season text check (season in ('fasting', 'non-fasting', 'both')),
  image_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.ethiopian_meals enable row level security;

create policy "Anyone can view ethiopian meals"
  on public.ethiopian_meals for select
  using (true);

create policy "Admins can write ethiopian meals"
  on public.ethiopian_meals for insert with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- 14. HIGH PROTEIN MEALS
create table if not exists public.high_protein_meals (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text check (category in ('breakfast', 'lunch', 'dinner', 'snack')),
  protein_grams numeric not null check (protein_grams >= 10),
  calories_total numeric,
  carbs_grams numeric,
  fats_grams numeric,
  prep_time_minutes numeric,
  ingredients jsonb,
  instructions text,
  description text,
  image_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.high_protein_meals enable row level security;

create policy "Anyone can view high protein meals"
  on public.high_protein_meals for select
  using (true);

create policy "Admins can write high protein meals"
  on public.high_protein_meals for insert with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- 15. FASTING BREAKFASTS
create table if not exists public.fasting_breakfasts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  ingredients jsonb,
  prep_time_minutes numeric check (prep_time_minutes >= 5),
  cook_time_minutes numeric,
  protein_grams numeric,
  fiber_grams numeric,
  calories_total numeric,
  instructions text,
  image_url text,
  is_featured boolean default false,
  category text check (category in ('ethiopian', 'global')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.fasting_breakfasts enable row level security;

create policy "Anyone can view fasting breakfasts"
  on public.fasting_breakfasts for select
  using (true);

create policy "Admins can write fasting breakfasts"
  on public.fasting_breakfasts for insert with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- 16. MACRO GOALS
create table if not exists public.macro_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  protein_target numeric not null,
  carbs_target numeric not null,
  fats_target numeric not null,
  total_calories numeric,
  surplus_deficit text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.macro_goals enable row level security;

create policy "Users can CRUD own macro goals"
  on public.macro_goals for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 17. MEAL PLANS
create table if not exists public.meal_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  plan_name text,
  start_date date,
  end_date date,
  macro_goals_id uuid references public.macro_goals(id),
  meal_plan_data jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.meal_plans enable row level security;

create policy "Users can CRUD own meal plans"
  on public.meal_plans for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 18. MEMBERSHIPS
create table if not exists public.memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  tier text not null check (tier in ('Basic', 'Premium', 'Elite')),
  status text not null check (status in ('active', 'paused', 'cancelled')),
  start_date date not null,
  renewal_date date not null,
  stripe_subscription_id text,
  auto_renew boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.memberships enable row level security;

create policy "Users can CRUD own memberships"
  on public.memberships for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 19. PAYMENT METHODS
create table if not exists public.payment_methods (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text not null check (type in ('credit_card', 'debit_card', 'apple_pay', 'google_pay')),
  stripe_payment_method_id text not null,
  last4_digits text,
  expiry_month numeric,
  expiry_year numeric,
  is_default boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.payment_methods enable row level security;

create policy "Users can CRUD own payment methods"
  on public.payment_methods for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 20. PAYMENT HISTORY
create table if not exists public.payment_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  amount numeric not null,
  currency text default 'usd',
  status text not null check (status in ('pending', 'completed', 'failed')),
  stripe_transaction_id text,
  receipt_url text,
  billing_cycle text check (billing_cycle in ('monthly', 'annual')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.payment_history enable row level security;

create policy "Users can view own payment history"
  on public.payment_history for select
  using (auth.uid() = user_id);

create policy "Admins can insert payment history"
  on public.payment_history for insert
  with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- 21. COACHING BOOKINGS
create table if not exists public.coaching_bookings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  session_length text not null check (session_length in ('30-min', '60-min')),
  availability text,
  goals text,
  status text default 'pending' check (status in ('pending', 'confirmed', 'completed')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.coaching_bookings enable row level security;

create policy "Anyone can create bookings"
  on public.coaching_bookings for insert
  with check (true);

create policy "Admins can view all bookings"
  on public.coaching_bookings for select
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- 22. VIDEOS
create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  video_file_url text,
  guest_name text,
  category text check (category in ('Workout Tutorials', 'Meal Prep', 'Coaching Tips', 'Motivational')),
  view_count numeric default 0,
  upload_date timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.videos enable row level security;

create policy "Anyone can view videos"
  on public.videos for select using (true);

create policy "Admins can write videos"
  on public.videos for insert with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- 23. PODCASTS
create table if not exists public.podcasts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  platform text check (platform in ('Spotify', 'Apple Podcasts', 'YouTube', 'Other')),
  podcast_link text not null,
  speaker_name text,
  audio_file_url text,
  duration numeric,
  upload_date timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.podcasts enable row level security;

create policy "Anyone can view podcasts"
  on public.podcasts for select using (true);

create policy "Admins can write podcasts"
  on public.podcasts for insert with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- 24. AFFIRMATIONS
create table if not exists public.affirmations (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  date date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.affirmations enable row level security;

create policy "Anyone can view affirmations"
  on public.affirmations for select using (true);

create policy "Admins can write affirmations"
  on public.affirmations for insert with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- 25. COMMUNITY POSTS
create table if not exists public.community_posts (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('success story', 'progress update', 'motivation', 'workout win')),
  content text not null,
  author_id uuid references public.profiles(id) on delete cascade not null,
  author_name text,
  date timestamptz default now(),
  likes numeric default 0,
  comments jsonb default '[]'::jsonb,
  image_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.community_posts enable row level security;

create policy "Anyone can view community posts"
  on public.community_posts for select using (true);

create policy "Authenticated users can create posts"
  on public.community_posts for insert
  with check (auth.uid() = author_id);

create policy "Users can update own posts"
  on public.community_posts for update
  using (auth.uid() = author_id);

create policy "Users can delete own posts"
  on public.community_posts for delete
  using (auth.uid() = author_id);

-- 26. SUCCESS STORIES
create table if not exists public.success_stories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  age numeric not null check (age >= 1),
  gender text,
  goal text not null,
  results_summary text,
  timeline_weeks numeric not null check (timeline_weeks >= 1),
  testimonial text not null,
  workout_consistency numeric not null check (workout_consistency >= 0 and workout_consistency <= 100),
  story_type text check (story_type in ('Weight Loss', 'Strength', 'Health', 'Confidence', 'Athletic Performance', 'Postpartum Recovery')),
  timeline_category text check (timeline_category in ('8-12 weeks', '12-16 weeks', '16+ weeks')),
  before_photo_url text,
  after_photo_url text,
  metrics jsonb,
  milestones jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.success_stories enable row level security;

create policy "Anyone can view success stories"
  on public.success_stories for select using (true);

create policy "Admins can write success stories"
  on public.success_stories for insert with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- 27. ATTIRE RECOMMENDATIONS
create table if not exists public.attire_recommendations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  image_url text,
  category text not null check (category in ('workout gear', 'casual wear', 'accessories')),
  product_link text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.attire_recommendations enable row level security;

create policy "Anyone can view attire recommendations"
  on public.attire_recommendations for select using (true);

create policy "Admins can write attire recommendations"
  on public.attire_recommendations for insert with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- 28. APPAREL PRODUCTS
create table if not exists public.apparel_products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric not null check (price >= 0.01),
  image_url text,
  category text,
  in_stock boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.apparel_products enable row level security;

create policy "Anyone can view apparel products"
  on public.apparel_products for select using (true);

create policy "Admins can write apparel products"
  on public.apparel_products for insert with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- 29. ACHIEVEMENTS
create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  badge_name text not null,
  description text,
  unlocked_date timestamptz default now(),
  category text check (category in ('strength', 'endurance', 'nutrition', 'consistency')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.achievements enable row level security;

create policy "Users can CRUD own achievements"
  on public.achievements for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 30. USER PROGRESS
create table if not exists public.user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  weight numeric,
  body_fat_percentage numeric,
  workout_strength_gain numeric,
  workout_endurance_gain numeric,
  nutrition_adherence_percent numeric,
  calories_consumed numeric,
  macros_tracked jsonb,
  progress_photo_url text,
  date date not null,
  weekly_report jsonb,
  monthly_report jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.user_progress enable row level security;

create policy "Users can CRUD own progress"
  on public.user_progress for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- INDEXES
create index if not exists idx_workouts_user_id on public.workouts(user_id);
create index if not exists idx_workouts_date on public.workouts(date desc);
create index if not exists idx_workout_days_program_id on public.workout_days(program_id);
create index if not exists idx_exercises_day_id on public.exercises(day_id);
create index if not exists idx_exercises_program_id on public.exercises(program_id);
create index if not exists idx_user_workout_progress_user_id on public.user_workout_progress(user_id);
create index if not exists idx_meal_plans_user_id on public.meal_plans(user_id);
create index if not exists idx_macro_goals_user_id on public.macro_goals(user_id);
create index if not exists idx_payment_history_user_id on public.payment_history(user_id);
create index if not exists idx_community_posts_created on public.community_posts(created_at desc);
create index if not exists idx_affirmations_date on public.affirmations(date desc);
create index if not exists idx_memberships_user_id on public.memberships(user_id);

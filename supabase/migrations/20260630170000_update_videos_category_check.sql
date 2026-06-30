alter table if exists public.videos
  drop constraint if exists videos_category_check;

alter table if exists public.videos
  add constraint videos_category_check
  check (category in ('Workout Tutorials', 'Meal Prep', 'Coaching Tips', 'Motivational', 'Cardio', 'Strength', 'Flexibility', 'Yoga', 'HIIT', 'Pilates', 'Dance', 'Other'));

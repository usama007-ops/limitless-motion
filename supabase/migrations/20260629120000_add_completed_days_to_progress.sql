alter table public.user_workout_progress
add column if not exists completed_days jsonb default '[]'::jsonb;

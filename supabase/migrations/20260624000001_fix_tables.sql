-- Add category column to videos table
alter table if exists public.videos
  add column if not exists category text
  check (category in ('Workout Tutorials', 'Meal Prep', 'Coaching Tips', 'Motivational'));

-- Fix duration check on workout_challenges to accept user-facing values
alter table if exists public.workout_challenges
  drop constraint if exists workout_challenges_duration_check;

-- Add season column to ethiopian_meals for fasting/non-fasting categorization
alter table public.ethiopian_meals
  add column if not exists season text check (season in ('fasting', 'non-fasting', 'both'));

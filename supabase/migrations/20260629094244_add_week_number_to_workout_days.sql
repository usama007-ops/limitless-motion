alter table public.workout_days add column if not exists week_number numeric not null default 1 check (week_number >= 1);
create index if not exists idx_workout_days_week on public.workout_days(program_id, week_number, day_of_week);

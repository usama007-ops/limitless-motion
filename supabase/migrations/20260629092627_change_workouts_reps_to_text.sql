alter table public.workouts drop constraint if exists workouts_reps_check;
alter table public.workouts alter column reps type text using reps::text;

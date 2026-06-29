alter table public.exercises add column if not exists program_id uuid references public.workout_programs(id) on delete cascade;
create index if not exists idx_exercises_program_id on public.exercises(program_id);

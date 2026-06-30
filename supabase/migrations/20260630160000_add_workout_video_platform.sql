alter table if exists public.workout_videos
  add column if not exists platform text check (platform in ('youtube', 'vimeo', 'self_hosted', 'other')) default 'self_hosted',
  add column if not exists video_id text;

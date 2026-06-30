-- Add platform and video_id columns to videos table
alter table public.videos
  add column if not exists platform text check (platform in ('youtube', 'vimeo', 'self_hosted', 'other')) default 'self_hosted',
  add column if not exists video_id text;

-- Update RLS to keep same policies

-- Also update schema.sql reference

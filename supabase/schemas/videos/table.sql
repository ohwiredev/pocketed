create table videos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null default auth.uid(),
  video_url text not null,
  title text not null,
  thumbnail_url text,
  category text,
  platform text,
  aspect_ratio text,
  notes text,
  created_at timestamp with time zone default now()
);

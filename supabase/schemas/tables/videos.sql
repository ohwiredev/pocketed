create table videos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  url text not null,
  title text,
  thumbnail_url text,
  platform text,
  notes text,
  created_at timestamp default now()
);

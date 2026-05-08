create table tags (
  id uuid primary key default gen_random_uuid(),
  video_id uuid references videos on delete cascade,
  label text not null
);

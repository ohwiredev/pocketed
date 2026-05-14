drop table if exists tags;

create table tags (
  id uuid primary key default gen_random_uuid(),
  video_id uuid references videos on delete cascade not null,
  user_id uuid references auth.users not null default auth.uid(),
  label text not null,
  created_at timestamp with time zone default now()
);

-- Indexes
create index tags_video_id_idx on tags(video_id);
create index tags_label_idx on tags(label);
create index tags_user_id_idx on tags(user_id);

-- No duplicate tags on the same video
alter table tags add constraint tags_video_label_unique unique (video_id, label);

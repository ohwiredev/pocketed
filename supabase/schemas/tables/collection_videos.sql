create table collection_videos (
  collection_id uuid references collections on delete cascade,
  video_id uuid references videos on delete cascade,
  primary key (collection_id, video_id)
);

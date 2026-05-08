alter table collection_videos enable row level security;

create policy "Users see own collection_videos"
  on collection_videos for all
  using (
    collection_id in (select id from collections where user_id = auth.uid())
  );

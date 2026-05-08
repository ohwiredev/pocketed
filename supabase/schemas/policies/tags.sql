alter table tags enable row level security;

create policy "Users see own tags"
  on tags for all
  using (
    video_id in (select id from videos where user_id = auth.uid())
  );

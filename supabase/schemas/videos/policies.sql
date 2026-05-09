alter table videos enable row level security;

create policy "Users see own videos"
  on videos for all
  using (auth.uid() = user_id);

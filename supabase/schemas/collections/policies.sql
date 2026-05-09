alter table collections enable row level security;

create policy "Users see own collections"
  on collections for all
  using (auth.uid() = user_id);

alter table tags enable row level security;

create policy "Users manage own tags"
  on tags for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

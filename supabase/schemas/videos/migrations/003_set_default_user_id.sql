-- Set default value for user_id to auth.uid() in videos table
ALTER TABLE videos 
ALTER COLUMN user_id SET DEFAULT auth.uid();

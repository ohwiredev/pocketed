-- Alter collection_videos table to add created_at column
ALTER TABLE collection_videos 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

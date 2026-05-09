-- Alter videos table to match the updated schema
-- 1. Rename 'url' to 'video_url'
ALTER TABLE videos RENAME COLUMN url TO video_url;

-- 2. Make 'title' NOT NULL (Ensure no NULL values exist before running this if it's a live DB)
ALTER TABLE videos ALTER COLUMN title SET NOT NULL;

-- 3. Add new columns
ALTER TABLE videos ADD COLUMN description text;
ALTER TABLE videos ADD COLUMN duration text;
ALTER TABLE videos ADD COLUMN category text;
ALTER TABLE videos ADD COLUMN aspect_ratio text;

-- 4. Update 'created_at' to include time zone
ALTER TABLE videos ALTER COLUMN created_at TYPE timestamp with time zone;

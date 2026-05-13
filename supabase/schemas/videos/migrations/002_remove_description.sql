-- Remove description and duration columns from videos table
ALTER TABLE videos DROP COLUMN description;
ALTER TABLE videos DROP COLUMN duration;

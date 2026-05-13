-- Remove category column from videos table (replaced by platform-based filtering in UI)
alter table videos drop column if exists category;

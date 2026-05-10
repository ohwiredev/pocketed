export interface Collection {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
  video_count?: number;
  thumbnails?: string[];
}

export interface CollectionVideo {
  collection_id: string;
  video_id: string;
}

export interface Video {
  id: string;
  user_id: string;
  title: string;
  thumbnailUrl: string;
  videoUrl: string;
  platform: "tiktok" | "youtube" | "instagram";
  aspectRatio: "vertical" | "horizontal";
  notes?: string;
  author?: string;
  tags?: string[];
  createdAt: string;
}

export interface Video {
  id: string;
  user_id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: string;
  category: string;
  platform: "tiktok" | "youtube" | "instagram";
  aspectRatio: "vertical" | "horizontal";
  notes?: string;
  createdAt: string;
}

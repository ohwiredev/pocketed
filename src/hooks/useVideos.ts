import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import type { Video } from "@/types/video";

export function useVideos() {
  const { session, isInitialized } = useAuth();
  const user = session?.user;
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVideos = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from("videos")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      const formattedVideos: Video[] = (data || []).map((v: any) => ({
        id: v.id,
        user_id: v.user_id,
        title: v.title,
        description: v.description,
        thumbnailUrl: v.thumbnail_url,
        videoUrl: v.video_url,
        duration: v.duration,
        category: v.category,
        platform: v.platform,
        aspectRatio: v.aspect_ratio,
        notes: v.notes,
        createdAt: v.created_at,
      }));

      setVideos(formattedVideos);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isInitialized) {
      fetchVideos();
    }
  }, [user, isInitialized]);

  return { videos, loading, error, refresh: fetchVideos };
}

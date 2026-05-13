import useSWR from "swr";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import type { Video } from "@/types/video";

export function useVideos() {
  const { session, isInitialized } = useAuth();
  const user = session?.user;

  const { data, error, isLoading, mutate } = useSWR(
    isInitialized && user ? ["videos", user.id] : null,
    async () => {
      const { data, error: fetchError } = await supabase
        .from("videos")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      const formattedVideos: Video[] = (data || []).map((v: any) => ({
        id: v.id,
        user_id: v.user_id,
        title: v.title,
        thumbnailUrl: v.thumbnail_url,
        videoUrl: v.video_url,
        category: v.category,
        platform: v.platform,
        aspectRatio: v.aspect_ratio,
        notes: v.notes,
        createdAt: v.created_at,
      }));

      return formattedVideos;
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 10000,
    },
  );

  return {
    videos: data || [],
    loading: isLoading,
    error: error?.message || null,
    refresh: mutate,
  };
}

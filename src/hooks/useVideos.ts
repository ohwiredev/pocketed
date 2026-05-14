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
        .select("*, tags(label)")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      const formattedVideos: Video[] = (data || []).map((v: any) => ({
        id: v.id,
        user_id: v.user_id,
        title: v.title,
        thumbnailUrl: v.thumbnail_url,
        videoUrl: v.video_url,
        platform: v.platform,
        aspectRatio: v.aspect_ratio,
        notes: v.notes,
        author: v.author,
        tags: v.tags ? v.tags.map((t: any) => t.label) : [],
        createdAt: v.created_at,
      }));

      return formattedVideos;
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 10000,
    },
  );

  const updateVideoTags = async (videoId: string, newTags: string[]) => {
    try {
      // 1. Delete existing tags
      const { error: deleteError } = await supabase
        .from("tags")
        .delete()
        .eq("video_id", videoId);

      if (deleteError) throw deleteError;

      // 2. Insert new tags
      if (newTags.length > 0) {
        const { error: insertError } = await supabase
          .from("tags")
          .insert(newTags.map((tag) => ({ video_id: videoId, label: tag })));

        if (insertError) throw insertError;
      }

      // 3. Optimistically update local data
      mutate(
        (prevVideos) =>
          prevVideos?.map((v) =>
            v.id === videoId ? { ...v, tags: newTags } : v,
          ),
        false,
      );
    } catch (err: any) {
      console.error("Failed to update tags", err.message);
      throw err;
    }
  };

  const updateVideoNotes = async (videoId: string, newNotes: string) => {
    try {
      const { error: updateError } = await supabase
        .from("videos")
        .update({ notes: newNotes })
        .eq("id", videoId);

      if (updateError) throw updateError;

      mutate(
        (prevVideos) =>
          prevVideos?.map((v) =>
            v.id === videoId ? { ...v, notes: newNotes } : v,
          ),
        false,
      );
    } catch (err: any) {
      console.error("Failed to update notes", err.message);
      throw err;
    }
  };

  const deleteVideo = async (videoId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from("videos")
        .delete()
        .eq("id", videoId);

      if (deleteError) throw deleteError;

      mutate(
        (prevVideos) => prevVideos?.filter((v) => v.id !== videoId),
        false,
      );
    } catch (err: any) {
      console.error("Failed to delete video", err.message);
      throw err;
    }
  };

  return {
    videos: data || [],
    loading: isLoading,
    error: error?.message || null,
    refresh: mutate,
    updateVideoTags,
    updateVideoNotes,
    deleteVideo,
  };
}

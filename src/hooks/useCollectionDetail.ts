import useSWR from "swr";
import { supabase } from "@/lib/supabase";
import type { Video } from "@/types/video";

export function useCollectionDetail(collectionId: string | undefined) {
  // Fetch collection name separately if needed or together
  const {
    data: collection,
    error: colError,
    isLoading: colLoading,
  } = useSWR(collectionId ? ["collection", collectionId] : null, async () => {
    const { data, error } = await supabase
      .from("collections")
      .select("name")
      .eq("id", collectionId)
      .single();
    if (error) throw error;
    return data;
  });

  const {
    data: videos,
    error: videosError,
    isLoading: videosLoading,
    mutate: mutateVideos,
  } = useSWR(
    collectionId ? ["collection-videos", collectionId] : null,
    async () => {
      const { data, error } = await supabase
        .from("collection_videos")
        .select(`
          video:videos(*)
        `)
        .eq("collection_id", collectionId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data || []).map((v: any) => ({
        id: v.video.id,
        user_id: v.video.user_id,
        title: v.video.title,
        thumbnailUrl: v.video.thumbnail_url,
        videoUrl: v.video.video_url,
        category: v.video.category,
        platform: v.video.platform,
        aspectRatio: v.video.aspect_ratio,
        notes: v.video.notes,
        createdAt: v.video.created_at,
      })) as Video[];
    },
  );

  const addVideosToCollection = async (videoIds: string[]) => {
    if (!collectionId) return;

    try {
      const inserts = videoIds.map((vId) => ({
        collection_id: collectionId,
        video_id: vId,
      }));

      const { error: addError } = await supabase
        .from("collection_videos")
        .insert(inserts);

      if (addError) throw addError;

      // Re-fetch to get full video objects
      mutateVideos();
    } catch (err: any) {
      console.error(err.message);
      throw err;
    }
  };

  const removeVideoFromCollection = async (videoId: string) => {
    if (!collectionId) return;

    try {
      const { error: removeError } = await supabase
        .from("collection_videos")
        .delete()
        .eq("collection_id", collectionId)
        .eq("video_id", videoId);

      if (removeError) throw removeError;

      // Optimistic update
      mutateVideos((prev) => prev?.filter((v) => v.id !== videoId), false);
    } catch (err: any) {
      console.error(err.message);
      throw err;
    }
  };

  return {
    videos: videos || [],
    loading: colLoading || videosLoading,
    collectionName: collection?.name || "",
    error: (colError || videosError)?.message || null,
    addVideosToCollection,
    removeVideoFromCollection,
    mutateVideos,
  };
}

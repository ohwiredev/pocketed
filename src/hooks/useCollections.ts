import useSWR from "swr";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import type { Collection } from "@/types/collection";

export function useCollections() {
  const { session, isInitialized } = useAuth();
  const user = session?.user;

  const { data, error, isLoading, mutate } = useSWR(
    isInitialized && user ? ["collections", user.id] : null,
    async () => {
      const { data, error: fetchError } = await supabase
        .from("collections")
        .select(`
          *,
          collection_videos(
            video:videos(thumbnail_url)
          )
        `)
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      const formattedCollections: Collection[] = (data || []).map((c: any) => ({
        id: c.id,
        user_id: c.user_id,
        name: c.name,
        created_at: c.created_at,
        video_count: c.collection_videos?.length || 0,
        thumbnails:
          c.collection_videos
            ?.slice(0, 4)
            .map((cv: any) => cv.video?.thumbnail_url)
            .filter(Boolean) || [],
      }));

      return formattedCollections;
    },
    {
      revalidateOnFocus: false, // Optional: adjust based on preference
      dedupingInterval: 10000,
    },
  );

  const createCollection = async (name: string) => {
    if (!user) return;
    const { data, error: createError } = await supabase
      .from("collections")
      .insert([{ name, user_id: user.id }])
      .select()
      .single();

    if (createError) throw createError;

    // Optimistic update
    const newCollection: Collection = {
      ...data,
      video_count: 0,
      thumbnails: [],
    };

    mutate((prev) => [newCollection, ...(prev || [])], false);
    return data;
  };

  const deleteCollection = async (id: string) => {
    const { error: deleteError } = await supabase
      .from("collections")
      .delete()
      .eq("id", id);

    if (deleteError) throw deleteError;

    mutate((prev) => prev?.filter((c) => c.id !== id), false);
  };

  const renameCollection = async (id: string, name: string) => {
    const { error: updateError } = await supabase
      .from("collections")
      .update({ name })
      .eq("id", id);

    if (updateError) throw updateError;

    mutate(
      (prev) => prev?.map((c) => (c.id === id ? { ...c, name } : c)),
      false,
    );
  };

  return {
    collections: data || [],
    loading: isLoading,
    error: error?.message || null,
    createCollection,
    deleteCollection,
    renameCollection,
    refresh: mutate,
  };
}

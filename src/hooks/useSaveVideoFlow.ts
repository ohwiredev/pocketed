import { useCallback, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Video } from "@/types/video";

export type SaveFlowState =
  | "idle"
  | "loading"
  | "success"
  | "error"
  | "duplicate";

export type SaveFlowResult = {
  state: SaveFlowState;
  savedVideo: Video | null;
  tags: string[];
  notes: string;
  errorMsg: string;
  save: (url: string) => Promise<void>;
  addTag: (label: string) => void;
  removeTag: (label: string) => void;
  setNotes: (notes: string) => void;
  updateNotes: () => void;
  reset: () => void;
};

function normalizeVideo(raw: Record<string, unknown>): Video {
  return {
    id: raw.id as string,
    user_id: raw.user_id as string,
    title: (raw.title as string) || "Untitled",
    thumbnailUrl: raw.thumbnail_url as string,
    videoUrl: raw.video_url as string,
    platform: raw.platform as Video["platform"],
    aspectRatio: (raw.aspect_ratio as Video["aspectRatio"]) || "horizontal",
    notes: (raw.notes as string) || "",
    author: raw.author as string | undefined,
    tags: [],
    createdAt: raw.created_at as string,
  };
}

export function useSaveVideoFlow(): SaveFlowResult {
  const [state, setState] = useState<SaveFlowState>("idle");
  const [savedVideo, setSavedVideo] = useState<Video | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [notes, setNotesState] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const save = useCallback(async (url: string) => {
    if (!url.trim()) return;

    // Blur active element to hide keyboard on mobile immediately
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    // Wait for the virtual keyboard to fully dismiss
    await new Promise((resolve) => setTimeout(resolve, 300));

    setState("loading");
    setErrorMsg("");

    try {
      const { data, error } = await supabase.functions.invoke("save-video", {
        body: { url },
      });

      if (error) {
        throw new Error(error.message || "Failed to save video");
      }

      // Check for structured duplicate response
      if (data?.status === "duplicate") {
        const existingVideo = data.video ? normalizeVideo(data.video) : null;
        setSavedVideo(existingVideo);
        setState("duplicate");
        return;
      }

      if (data?.error) {
        throw new Error(data.error || "Failed to save video");
      }

      const newVideo = normalizeVideo(data);

      setSavedVideo(newVideo);

      // Fetch associated tags
      const { data: tagData } = await supabase
        .from("tags")
        .select("label")
        .eq("video_id", newVideo.id);

      const loadedTags = tagData ? tagData.map((t) => t.label) : [];
      setTags(loadedTags);
      setNotesState(newVideo.notes || "");

      setState("success");
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
      setState("error");
    }
  }, []);

  const addTag = useCallback(
    (label: string) => {
      const trimmed = label.trim().toLowerCase().replace(/^#/, "");
      if (!trimmed || !savedVideo) return;

      if (!tags.includes(trimmed)) {
        const newTags = [...tags, trimmed];
        setTags(newTags);
        updateVideoTagsInDb(savedVideo.id, newTags);
      }
    },
    [tags, savedVideo],
  );

  const removeTag = useCallback(
    (label: string) => {
      if (!savedVideo) return;
      const newTags = tags.filter((t) => t !== label);
      setTags(newTags);
      updateVideoTagsInDb(savedVideo.id, newTags);
    },
    [tags, savedVideo],
  );

  const setNotes = useCallback((value: string) => {
    setNotesState(value);
  }, []);

  const updateNotes = useCallback(() => {
    if (savedVideo && notes !== savedVideo.notes) {
      updateVideoNotesInDb(savedVideo.id, notes);
      setSavedVideo({ ...savedVideo, notes });
    }
  }, [savedVideo, notes]);

  const reset = useCallback(() => {
    setState("idle");
    setSavedVideo(null);
    setTags([]);
    setNotesState("");
    setErrorMsg("");
  }, []);

  return {
    state,
    savedVideo,
    tags,
    notes,
    errorMsg,
    save,
    addTag,
    removeTag,
    setNotes,
    updateNotes,
    reset,
  };
}

// ── Database helpers (kept separate from hook to avoid SWR dependency) ──

async function updateVideoTagsInDb(videoId: string, newTags: string[]) {
  try {
    const { error: deleteError } = await supabase
      .from("tags")
      .delete()
      .eq("video_id", videoId);

    if (deleteError) throw deleteError;

    if (newTags.length > 0) {
      const { error: insertError } = await supabase
        .from("tags")
        .insert(newTags.map((tag) => ({ video_id: videoId, label: tag })));

      if (insertError) throw insertError;
    }
  } catch (err: unknown) {
    const errorMsg =
      err instanceof Error ? err.message : "Failed to update tags";
    console.error(errorMsg);
    throw err;
  }
}

async function updateVideoNotesInDb(videoId: string, newNotes: string) {
  try {
    const { error: updateError } = await supabase
      .from("videos")
      .update({ notes: newNotes })
      .eq("id", videoId);

    if (updateError) throw updateError;
  } catch (err: unknown) {
    const errorMsg =
      err instanceof Error ? err.message : "Failed to update tags";
    console.error(errorMsg);
    throw err;
  }
}

import { CheckCircle2, Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
} from "@/components/ui/responsive-modal";
import { useVideos } from "@/hooks/useVideos";
import { supabase } from "@/lib/supabase";
import type { Video } from "@/types/video";

interface SaveSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

type SaveState = "input" | "loading" | "success" | "error";

export default function SaveSheet({ isOpen, onClose }: SaveSheetProps) {
  const { refresh, updateVideoTags, updateVideoNotes } = useVideos();

  const [url, setUrl] = useState("");
  const [saveState, setSaveState] = useState<SaveState>("input");
  const [errorMsg, setErrorMsg] = useState("");
  const [savedVideo, setSavedVideo] = useState<Video | null>(null);
  const [notes, setNotes] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setUrl("");
      setSaveState("input");
      setErrorMsg("");
      setSavedVideo(null);
      setNotes("");
      setTags([]);
      setTagInput("");
    }
  }, [isOpen]);

  const handleSave = async () => {
    if (!url.trim()) return;

    // Blur active element to hide keyboard on mobile immediately
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    // Wait for the virtual keyboard to fully dismiss
    await new Promise((resolve) => setTimeout(resolve, 300));

    setSaveState("loading");
    setErrorMsg("");

    try {
      const { data, error } = await supabase.functions.invoke("save-video", {
        body: { url },
      });

      if (error) {
        throw new Error(error.message || "Failed to save video");
      }
      if (data?.error) {
        throw new Error(data.error || "Failed to save video");
      }
      const rawVideo = data;

      const newVideo: Video = {
        id: rawVideo.id,
        user_id: rawVideo.user_id,
        title: rawVideo.title,
        thumbnailUrl: rawVideo.thumbnail_url,
        videoUrl: rawVideo.video_url,
        platform: rawVideo.platform,
        aspectRatio: rawVideo.aspect_ratio,
        notes: rawVideo.notes,
        author: rawVideo.author,
        tags: [],
        createdAt: rawVideo.created_at,
      };

      setSavedVideo(newVideo);

      refresh();

      const { data: tagData } = await supabase
        .from("tags")
        .select("label")
        .eq("video_id", newVideo.id);

      const loadedTags = tagData ? tagData.map((t) => t.label) : [];
      setTags(loadedTags);
      setNotes(newVideo.notes || "");

      setSaveState("success");
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
      setSaveState("error");
    }
  };

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (!trimmed) return;

    const newTag = trimmed.toLowerCase().replace(/^#/, "");
    if (!tags.includes(newTag)) {
      const newTags = [...tags, newTag];
      setTags(newTags);
      setTagInput("");
      if (savedVideo) {
        updateVideoTags(savedVideo.id, newTags);
      }
    } else {
      setTagInput("");
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    const newTags = tags.filter((t) => t !== tagToRemove);
    setTags(newTags);
    if (savedVideo) {
      updateVideoTags(savedVideo.id, newTags);
    }
  };

  const handleNotesBlur = () => {
    if (savedVideo && notes !== savedVideo.notes) {
      updateVideoNotes(savedVideo.id, notes);
      setSavedVideo({ ...savedVideo, notes });
    }
  };

  return (
    <ResponsiveModal open={isOpen} onOpenChange={onClose}>
      <ResponsiveModalContent
        className="sm:max-w-md min-h-[32dvh] max-h-[92dvh] p-0"
        aria-describedby={undefined}
      >
        {saveState === "input" || saveState === "error" ? (
          <div className="p-6 min-h-[35dvh]">
            <ResponsiveModalHeader className="mb-4 p-0">
              <ResponsiveModalTitle className="text-xl font-serif">
                Save a Video
              </ResponsiveModalTitle>
            </ResponsiveModalHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
              className="space-y-4"
            >
              <Input
                placeholder="Paste TikTok, Instagram, or YouTube URL..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                autoFocus
                className="h-12 sm:h-10"
                type="text"
                inputMode="url"
                enterKeyHint="go"
              />
              {saveState === "error" && (
                <p className="text-sm text-destructive font-medium">
                  {errorMsg}
                </p>
              )}
              <Button
                type="submit"
                className="w-full h-12 sm:h-10"
                disabled={!url.trim()}
              >
                Save
              </Button>
            </form>
          </div>
        ) : saveState === "loading" ? (
          <div className="p-12 flex flex-col items-center justify-center space-y-4 min-h-[300px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground font-medium animate-pulse">
              Fetching metadata and tags...
            </p>
          </div>
        ) : (
          <div className="p-6 pb-8 sm:pb-6">
            <ResponsiveModalHeader className="mb-6 flex flex-row items-center gap-2 space-y-0 p-0 text-left">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
              <ResponsiveModalTitle className="text-xl font-serif text-green-600 dark:text-green-400">
                Pocketed!
              </ResponsiveModalTitle>
            </ResponsiveModalHeader>

            {savedVideo && (
              <div className="space-y-6">
                <div className="flex gap-4 p-3 rounded-xl bg-muted/50 border border-border/50">
                  <div className="h-20 w-16 shrink-0 overflow-hidden rounded bg-black/5">
                    <img
                      src={savedVideo.thumbnailUrl}
                      alt="Thumbnail"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <p className="text-sm font-semibold line-clamp-2 leading-snug">
                      {savedVideo.title}
                    </p>
                    {savedVideo.author && (
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        @{savedVideo.author} · {savedVideo.platform}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground/60 uppercase tracking-wider">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {tags.map((tag) => (
                      <div
                        key={tag}
                        className="flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground"
                      >
                        <span className="opacity-50">#</span>
                        {tag}
                        <button
                          onClick={() => handleTagRemove(tag)}
                          className="ml-1 opacity-50 hover:opacity-100 p-1"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      addTag();
                    }}
                  >
                    <Input
                      placeholder="Add a tag and press Enter..."
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      className="h-10 sm:h-8 text-sm bg-transparent border-dashed"
                      enterKeyHint="done"
                    />
                  </form>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground/60 uppercase tracking-wider">
                    Notes (optional)
                  </label>
                  <textarea
                    placeholder="Why did you save this?"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    onBlur={handleNotesBlur}
                    className="w-full min-h-[80px] p-3 text-sm rounded-xl border bg-transparent resize-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                  />
                </div>

                <Button
                  className="w-full h-12 sm:h-10 mt-2"
                  onClick={onClose}
                  size="lg"
                >
                  Done
                </Button>
              </div>
            )}
          </div>
        )}
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
}

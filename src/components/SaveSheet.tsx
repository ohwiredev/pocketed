import { CheckCircle2, Loader2, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
} from "@/components/ui/responsive-modal";
import { useSaveVideoFlow } from "@/hooks/useSaveVideoFlow";
import { useVideos } from "@/hooks/useVideos";

interface SaveSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SaveSheet({ isOpen, onClose }: SaveSheetProps) {
  const { refresh } = useVideos();
  const {
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
  } = useSaveVideoFlow();

  const [url, setUrl] = useState("");
  const [tagInput, setTagInput] = useState("");

  const handleSave = () => {
    save(url);
  };

  const handleClose = () => {
    reset();
    setUrl("");
    setTagInput("");
    refresh();
    onClose();
  };

  const handleAddTag = () => {
    addTag(tagInput);
    setTagInput("");
  };

  const showInput = state === "idle" || state === "error";

  return (
    <ResponsiveModal open={isOpen} onOpenChange={handleClose}>
      <ResponsiveModalContent
        key={isOpen ? "open" : "closed"}
        className="sm:max-w-md p-0"
        aria-describedby={undefined}
      >
        {showInput ? (
          <div className="p-6">
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
              {state === "error" && (
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
        ) : state === "loading" ? (
          <div className="p-12 flex flex-col items-center justify-center space-y-4 min-h-[300px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground font-medium animate-pulse">
              Fetching metadata and tags...
            </p>
          </div>
        ) : state === "duplicate" ? (
          <div className="p-6 pb-8 sm:pb-6">
            <ResponsiveModalHeader className="mb-6 flex flex-row items-center gap-2 space-y-0 p-0 text-left">
              <ResponsiveModalTitle className="text-xl font-serif">
                Already saved
              </ResponsiveModalTitle>
            </ResponsiveModalHeader>
            <p className="text-sm text-muted-foreground mb-4">
              This video is already in your library.
            </p>
            {savedVideo && (
              <div className="flex gap-4 p-3 rounded-xl bg-muted/50 border border-border/50 mb-6">
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
            )}
            <Button
              className="w-full h-12 sm:h-10"
              onClick={handleClose}
              size="lg"
            >
              Done
            </Button>
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
                          onClick={() => removeTag(tag)}
                          type="button"
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
                      handleAddTag();
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
                    onBlur={updateNotes}
                    className="w-full min-h-20 p-3 text-sm rounded-xl border bg-transparent resize-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                  />
                </div>

                <Button
                  className="w-full h-12 sm:h-10 mt-2"
                  onClick={handleClose}
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

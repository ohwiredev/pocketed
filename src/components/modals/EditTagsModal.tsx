import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalFooter,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
} from "@/components/ui/responsive-modal";
import { cn } from "@/lib/utils";
import type { Video } from "@/types/video";

interface EditTagsModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: Video | null;
  onSaveTags: (videoId: string, newTags: string[]) => Promise<void>;
}

export default function EditTagsModal({
  isOpen,
  onClose,
  video,
  onSaveTags,
}: EditTagsModalProps) {
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Initialize tags when modal opens or video changes
  useEffect(() => {
    if (isOpen && video) {
      setTags(video.tags || []);
    } else if (!isOpen) {
      setTags([]);
      setInputValue("");
    }
  }, [isOpen, video]);

  const handleAddTag = () => {
    const trimmed = inputValue.trim().toLowerCase().replace(/^#/, "");
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setInputValue("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSave = async () => {
    if (!video) return;
    
    // Blur to hide keyboard on mobile
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    
    // Wait for the virtual keyboard to fully dismiss before layout changes
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    setIsSaving(true);
    try {
      await onSaveTags(video.id, tags);
      onClose();
    } catch (error) {
      console.error("Failed to save tags", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!video) return null;

  const hasChanges =
    JSON.stringify([...tags].sort()) !==
    JSON.stringify([...(video.tags || [])].sort());

  return (
    <ResponsiveModal open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <ResponsiveModalContent className="sm:max-w-xl bg-white border-none shadow-2xl p-0">
        <ResponsiveModalHeader className="p-6 pb-2">
          <ResponsiveModalTitle className="text-2xl font-serif">
            Edit Tags
          </ResponsiveModalTitle>
        </ResponsiveModalHeader>

        <div className="px-6 space-y-6 pb-4 sm:pb-0">
          <div>
            <p className="text-sm font-medium text-foreground/60 mb-3 px-1 line-clamp-1">
              {video.title.split("#")[0].trim()}
            </p>
            <div className="relative group">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddTag();
                }}
                className="flex gap-2 flex-1"
              >
                <div className="relative flex-1">
                  <Input
                    placeholder="Add a tag..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="pr-10 bg-white/50 border-primary/20 focus-visible:ring-primary/30 focus-visible:border-primary transition-all duration-300 rounded-xl h-12 sm:h-10"
                    enterKeyHint="done"
                  />
                  {inputValue && (
                    <button
                      type="button"
                      onClick={() => setInputValue("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/30 hover:text-foreground/50 h-8 w-8 flex items-center justify-center"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <Button
                  type="submit"
                  size="icon"
                  className="rounded-xl shadow-lg shadow-primary/10 transition-transform active:scale-95 h-12 w-12 sm:h-10 sm:w-10 shrink-0"
                  disabled={!inputValue.trim()}
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </form>
              <p className="text-[10px] text-foreground/40 mt-2 ml-1 flex items-center gap-1">
                <span className="px-1 py-0.5 rounded bg-muted font-mono text-[9px]">
                  ENTER
                </span>
                to add tag
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-foreground/40 uppercase tracking-wider ml-1">
              Current Tags ({tags.length})
            </h3>
            <div
              className={cn(
                "min-h-[120px] max-h-[240px] overflow-y-auto rounded-2xl border border-primary/10 bg-primary/5 p-4 transition-all duration-300",
                tags.length === 0 &&
                  "flex items-center justify-center border-dashed",
              )}
            >
              {tags.length === 0 ? (
                <div className="text-center space-y-2">
                  <p className="text-sm text-foreground/30 italic">
                    No tags added yet
                  </p>
                  <p className="text-[11px] text-foreground/20">
                    Add tags to help organize your library
                  </p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <div
                      key={tag}
                      className="group flex items-center gap-1.5 rounded-full bg-secondary pl-3 pr-1 py-1.5 text-xs font-semibold text-secondary-foreground shadow-sm min-h-[32px]"
                    >
                      <span className="opacity-70 text-[10px]">#</span>
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 rounded-full p-1.5 bg-black/10 hover:bg-black/20 text-white transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <ResponsiveModalFooter className="m-0 flex flex-col sm:flex-row items-center justify-end gap-2 bg-primary/5">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isSaving}
            className="hover:bg-primary/10 w-full sm:w-auto order-2 sm:order-1 h-12 sm:h-10"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || !hasChanges}
            className="transition-all duration-300 active:scale-95 w-full sm:w-auto order-1 sm:order-2 h-12 sm:h-10"
          >
            {isSaving ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </div>
            ) : (
              "Save Tags"
            )}
          </Button>
        </ResponsiveModalFooter>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
}

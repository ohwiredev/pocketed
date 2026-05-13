import { X, Plus, Tags } from "lucide-react";
import { useState, type KeyboardEvent } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Video } from "@/types/video";

interface EditTagsModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: Video | null;
  onSaveTags: (videoId: string, newTags: string[]) => Promise<void>;
}

export default function EditTagsModal({ isOpen, onClose, video, onSaveTags }: EditTagsModalProps) {
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Initialize tags when modal opens
  if (video && isOpen && tags.length === 0 && !inputValue && !isSaving) {
    setTags(video.tags || []);
  }

  const handleAddTag = () => {
    const trimmed = inputValue.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setInputValue("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSave = async () => {
    if (!video) return;
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

  const handleClose = () => {
    setTags([]);
    setInputValue("");
    setIsSaving(false);
    onClose();
  };

  if (!video) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md bg-white/80 backdrop-blur-xl border-white/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-serif">
            <Tags className="h-5 w-5 text-primary" />
            Edit Tags
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <div className="mb-4">
            <p className="text-sm font-medium text-foreground/80 mb-2 truncate">
              {video.title}
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="Add a tag..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-white/50"
              />
              <Button onClick={handleAddTag} size="icon" variant="secondary">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-[10px] text-foreground/50 mt-1.5 ml-1">
              Press Enter to add
            </p>
          </div>

          <div className="min-h-[100px] rounded-lg border border-border/50 bg-white/30 p-3 shadow-inner">
            {tags.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-foreground/40 italic">
                No tags added yet
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 rounded-full bg-secondary/80 pl-3 pr-1.5 py-1 text-xs font-medium text-secondary-foreground shadow-sm"
                  >
                    #{tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="rounded-full p-0.5 hover:bg-secondary-foreground/20 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-2">
          <Button variant="ghost" onClick={handleClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Tags"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

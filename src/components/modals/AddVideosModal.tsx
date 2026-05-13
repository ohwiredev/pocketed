import { Loader2, Search } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useVideos } from "@/hooks/useVideos";

interface AddVideosModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (videoIds: string[]) => Promise<void>;
  alreadyInCollection: string[];
}

export default function AddVideosModal({
  isOpen,
  onClose,
  onAdd,
  alreadyInCollection,
}: AddVideosModalProps) {
  const { videos, loading } = useVideos();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredVideos = videos.filter(
    (video) =>
      !alreadyInCollection.includes(video.id) &&
      video.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleToggle = (videoId: string) => {
    setSelectedIds((prev) =>
      prev.includes(videoId)
        ? prev.filter((id) => id !== videoId)
        : [...prev, videoId],
    );
  };

  const handleSubmit = async () => {
    if (selectedIds.length === 0) return;

    try {
      setIsSubmitting(true);
      await onAdd(selectedIds);
      setSelectedIds([]);
      onClose();
    } catch (error) {
      console.error("Failed to add videos:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl h-[80vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="font-serif text-2xl">Add Videos</DialogTitle>
          <DialogDescription>
            Select videos from your library to add to this collection.
          </DialogDescription>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search your library..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-2">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredVideos.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center p-8">
              <div className="mb-4 rounded-full bg-muted p-4">
                <Search className="h-8 w-8 text-muted-foreground/40" />
              </div>
              <p className="text-sm font-medium text-foreground">
                {searchQuery ? "No matching videos found" : "Nothing to add"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {searchQuery
                  ? "Try a different search term"
                  : "All your videos are already in this collection!"}
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredVideos.map((video) => (
                <div
                  key={video.id}
                  className="flex items-center space-x-3 rounded-lg p-2 hover:bg-muted transition-colors cursor-pointer"
                  onClick={() => handleToggle(video.id)}
                >
                  <Checkbox
                    checked={selectedIds.includes(video.id)}
                    onCheckedChange={() => handleToggle(video.id)}
                  />
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded bg-muted">
                    <img
                      src={video.thumbnailUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {video.title}
                    </p>
                    <p className="text-xs text-muted-foreground uppercase">
                      {video.platform}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter className="m-0 border-t bg-background p-6 pt-4">
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            disabled={selectedIds.length === 0 || isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting
              ? "Adding..."
              : selectedIds.length === 0
                ? "Add videos"
                : `Add ${selectedIds.length} video${
                    selectedIds.length === 1 ? "" : "s"
                  }`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

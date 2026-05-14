import { Loader2, Plus, Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useCollections } from "@/hooks/useCollections";
import { supabase } from "@/lib/supabase";
import type { Video } from "@/types/video";

interface AddToCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: Video | null;
}

export default function AddToCollectionModal({
  isOpen,
  onClose,
  video,
}: AddToCollectionModalProps) {
  const {
    collections,
    loading: collectionsLoading,
    createCollection,
    refresh,
  } = useCollections();
  const [searchQuery, setSearchQuery] = useState("");
  const [existingCollectionIds, setExistingCollectionIds] = useState<string[]>(
    [],
  );
  const [checkingExisting, setCheckingExisting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null); // collection id being submitted
  const [isCreating, setIsCreating] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const checkExistingCollections = useCallback(async () => {
    if (!video) return;
    setCheckingExisting(true);
    try {
      const { data, error } = await supabase
        .from("collection_videos")
        .select("collection_id")
        .eq("video_id", video.id);

      if (error) throw error;
      setExistingCollectionIds(data.map((row) => row.collection_id));
    } catch (error) {
      console.error("Failed to check existing collections:", error);
    } finally {
      setCheckingExisting(false);
    }
  }, [video]);

  useEffect(() => {
    if (isOpen && video) {
      checkExistingCollections();
      setSearchQuery("");
      setShowCreateForm(false);
      setNewCollectionName("");
    }
  }, [isOpen, video]);


  const handleAddToCollection = async (collectionId: string) => {
    if (!video) return;
    setIsSubmitting(collectionId);
    try {
      const { error } = await supabase
        .from("collection_videos")
        .insert([{ collection_id: collectionId, video_id: video.id }]);

      if (error) throw error;

      // Update local state to show it's added
      setExistingCollectionIds((prev) => [...prev, collectionId]);

      // Refresh collections to update the video counts
      refresh();
    } catch (error) {
      console.error("Failed to add video to collection:", error);
    } finally {
      setIsSubmitting(null);
    }
  };

  const handleCreateCollection = async () => {
    if (!newCollectionName.trim() || !video) return;
    setIsCreating(true);
    try {
      const newCollection = await createCollection(newCollectionName.trim());
      if (newCollection) {
        await handleAddToCollection(newCollection.id);
        setShowCreateForm(false);
        setNewCollectionName("");
      }
    } catch (error) {
      console.error("Failed to create collection and add video:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const filteredCollections = collections.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const isLoading = collectionsLoading || checkingExisting;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md h-[70vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="font-serif text-2xl">
            Add to Collection
          </DialogTitle>
          <DialogDescription>
            Choose a collection to add "{video?.title}" to.
          </DialogDescription>
          {!showCreateForm && (
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search collections..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-2">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : showCreateForm ? (
            <div className="flex flex-col gap-4 py-4">
              <div>
                <label
                  htmlFor="name"
                  className="text-sm font-medium mb-1 block"
                >
                  Collection Name
                </label>
                <Input
                  id="name"
                  placeholder="e.g., Cooking Recipes"
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCreateCollection();
                  }}
                />
              </div>
            </div>
          ) : filteredCollections.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center p-8">
              <p className="text-sm font-medium text-foreground">
                {searchQuery ? "No matching collections" : "No collections yet"}
              </p>
              <Button
                variant="link"
                onClick={() => setShowCreateForm(true)}
                className="mt-2 text-primary"
              >
                Create one now
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredCollections.map((collection) => {
                const isAlreadyIn = existingCollectionIds.includes(
                  collection.id,
                );
                return (
                  <div
                    key={collection.id}
                    className="flex items-center justify-between space-x-3 rounded-lg border p-3"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {collection.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {collection.video_count} videos
                      </p>
                    </div>
                    <Button
                      variant={isAlreadyIn ? "secondary" : "default"}
                      size="sm"
                      disabled={isAlreadyIn || isSubmitting === collection.id}
                      onClick={() => handleAddToCollection(collection.id)}
                    >
                      {isSubmitting === collection.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : isAlreadyIn ? (
                        "Added"
                      ) : (
                        "Add"
                      )}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <DialogFooter className="m-0 border-t bg-background p-6 pt-4 flex sm:justify-between items-center">
          {showCreateForm ? (
            <>
              <Button variant="ghost" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
              <Button
                disabled={!newCollectionName.trim() || isCreating}
                onClick={handleCreateCollection}
              >
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create & Add"
                )}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                onClick={() => setShowCreateForm(true)}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                New Collection
              </Button>
              <Button onClick={onClose}>Done</Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

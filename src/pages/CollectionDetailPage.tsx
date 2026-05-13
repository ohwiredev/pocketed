import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Pencil, Play, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AddVideosModal from "@/components/modals/AddVideosModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import VideoCard from "@/components/VideoCard";
import { useCollectionDetail } from "@/hooks/useCollectionDetail";
import { useCollections } from "@/hooks/useCollections";
import { useTitle } from "@/hooks/useTitle";

export default function CollectionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    videos,
    loading,
    collectionName,
    addVideosToCollection,
    removeVideoFromCollection, // Need to add this to the hook return or fetch it from useCollections
  } = useCollectionDetail(id);

  // Actually, let's use the renameCollection from useCollections if needed,
  // or just implement a simple update here.
  // For simplicity, I'll add a state for editing.
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [localName, setLocalName] = useState("");

  const { renameCollection: globalRename } = useCollections();

  useEffect(() => {
    if (collectionName) {
      setLocalName(collectionName);
      setEditedName(collectionName);
    }
  }, [collectionName]);

  const handleRename = async () => {
    if (!id || !editedName.trim() || editedName === localName) {
      setIsEditing(false);
      return;
    }
    try {
      await globalRename(id, editedName);
      setLocalName(editedName);
      setIsEditing(false);
    } catch (error) {
      console.error("Rename failed:", error);
    }
  };

  useTitle(localName || "Collection");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  if (loading && !localName) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="container mx-auto max-w-7xl px-4 pt-8 md:px-8 pb-24 md:pb-8">
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/collections")}
          className="mb-4 -ml-2 gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Collections
        </Button>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            {isEditing ? (
              <Input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                onBlur={handleRename}
                onKeyDown={(e) => e.key === "Enter" && handleRename()}
                className="text-2xl font-bold font-serif h-12 md:text-4xl"
                autoFocus
              />
            ) : (
              <>
                <h1 className="font-serif text-4xl font-bold text-foreground md:text-5xl">
                  {localName}
                </h1>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => setIsEditing(true)}
                >
                  <Pencil className="h-4 w-4 text-muted-foreground" />
                </Button>
              </>
            )}
          </div>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="w-full md:w-auto gap-2 shadow-lg"
          >
            <Plus className="h-5 w-5" />
            Add Videos
          </Button>
        </div>
        <p className="mt-2 text-muted-foreground">
          {videos.length} {videos.length === 1 ? "video" : "videos"} saved in
          this collection
        </p>
      </div>

      {videos.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex h-[50vh] flex-col items-center justify-center text-center"
        >
          <div className="relative mb-6">
            <div className="absolute inset-0 animate-pulse rounded-full bg-primary/10 blur-xl" />
            <div className="relative rounded-full bg-primary/5 p-10">
              <Play className="h-16 w-16 text-primary/40" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-foreground">
            Collection is empty
          </h2>
          <p className="mt-2 max-w-sm text-muted-foreground">
            Start adding videos from your library to this collection.
          </p>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            variant="outline"
            className="mt-8 gap-2 px-8 hover:bg-primary hover:text-white transition-all"
          >
            <Plus className="h-5 w-5" />
            Add videos
          </Button>
        </motion.div>
      ) : (
        <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 xl:columns-4">
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onRemove={removeVideoFromCollection}
            />
          ))}
        </div>
      )}

      <AddVideosModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={addVideosToCollection}
        alreadyInCollection={videos.map((v) => v.id)}
      />
    </main>
  );
}

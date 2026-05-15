import { AnimatePresence, motion } from "framer-motion";
import { PackageOpen, Plus } from "lucide-react";
import { useCallback, useState } from "react";
import type { PlatformFilter } from "@/components/FilterBar";
import FilterBar from "@/components/FilterBar";
import AddToCollectionModal from "@/components/modals/AddToCollectionModal";
import DeleteConfirmationModal from "@/components/modals/DeleteConfirmationModal";
import EditTagsModal from "@/components/modals/EditTagsModal";
import SaveSheet from "@/components/SaveSheet";
import VideoCard from "@/components/VideoCard";
import { useAuth } from "@/hooks/useAuth";
import { useMeta } from "@/hooks/useMeta";
import { useTitle } from "@/hooks/useTitle";
import { useVideos } from "@/hooks/useVideos";
import type { Video } from "@/types/video";

export default function HomePage() {
  useTitle("Home");
  useMeta({
    description:
      "Browse your pocketed videos, search by title or tags, and filter by platform.",
  });

  const { session } = useAuth();
  const { videos, loading, updateVideoTags, deleteVideo } = useVideos();
  const [activePlatform, setActivePlatform] = useState<PlatformFilter>("all");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [addingVideoToCollection, setAddingVideoToCollection] =
    useState<Video | null>(null);
  const [videoToDelete, setVideoToDelete] = useState<Video | null>(null);
  const [isSaveSheetOpen, setIsSaveSheetOpen] = useState(false);

  // Derive top tags
  const tagCounts = new Map<string, number>();
  videos.forEach((v) => {
    v.tags?.forEach((t) => {
      tagCounts.set(t, (tagCounts.get(t) || 0) + 1);
    });
  });

  const topTags = Array.from(tagCounts.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);

  const toggleTag = (tag: string) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const filteredVideos = videos.filter((video) => {
    const matchesPlatform =
      activePlatform === "all" || video.platform === activePlatform;

    // AND logic for tags
    const matchesTags =
      activeTags.length === 0 ||
      activeTags.every((tag) => video.tags?.includes(tag));

    const query = searchQuery.toLowerCase();

    const matchesSearch =
      !searchQuery ||
      video.title.toLowerCase().includes(query) ||
      video.author?.toLowerCase().includes(query) ||
      video.tags?.some((tag) => tag.toLowerCase().includes(query)) ||
      video.notes?.toLowerCase().includes(query);

    return matchesPlatform && matchesTags && matchesSearch;
  });

  const clearAllFilters = useCallback(() => {
    setActivePlatform("all");
    setActiveTags([]);
    setSearchQuery("");
  }, []);

  const userName =
    session?.user?.user_metadata?.display_name ||
    session?.user?.email?.split("@")[0] ||
    "User";

  const videoCount = videos.length;

  // Check if any filters are active
  const hasActiveFilters =
    activeTags.length > 0 || activePlatform !== "all" || searchQuery.length > 0;

  return (
    <main className="min-h-screen relative">
      {/* Welcome Hero (scrolls away) */}
      <section className="container mx-auto max-w-7xl px-4 md:px-8 pt-8">
        <div className="mb-6 mt-4 flex flex-col items-center text-center">
          <h1 className="mb-2 font-serif text-3xl font-bold tracking-tight md:text-4xl">
            Welcome back, {userName}!
          </h1>
          <p className="text-sm text-foreground/60 max-w-md">
            You've pocketed{" "}
            <span className="font-bold text-foreground">
              {videoCount} videos
            </span>{" "}
            so far. What would you like to watch today?
          </p>
        </div>
      </section>

      {/* Sticky Filter Bar */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activePlatform={activePlatform}
        onSelectPlatform={setActivePlatform}
        activeTags={activeTags}
        onToggleTag={toggleTag}
        topTags={topTags}
        videos={videos}
        filteredCount={filteredVideos.length}
        totalCount={videoCount}
        onClearAll={clearAllFilters}
      />

      {/* Video Feed */}
      <section className="container mx-auto max-w-7xl px-4 md:px-8 mt-6 pb-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : filteredVideos.length > 0 ? (
          <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 xl:columns-4">
            <AnimatePresence mode="popLayout">
              {filteredVideos.map((video) => (
                <motion.div
                  key={video.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <VideoCard
                    video={video}
                    onEditTags={(v) => setEditingVideo(v)}
                    onAddToCollection={(v) => setAddingVideoToCollection(v)}
                    onTagClick={(tag) => setActiveTags([tag])}
                    onRemove={() => setVideoToDelete(video)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          /* Enhanced Empty State */
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-foreground/4">
              <PackageOpen className="size-7 text-foreground/30" />
            </div>
            <p className="text-base font-medium text-foreground/60 mb-1">
              {hasActiveFilters
                ? "No videos match your filters"
                : "You haven't pocketed any videos yet."}
            </p>
            {hasActiveFilters && (
              <>
                <p className="text-sm text-foreground/40 mb-4 max-w-sm">
                  Try removing some filters or searching for something else.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20 transition-colors cursor-pointer"
                >
                  Clear all filters
                </button>
              </>
            )}
          </motion.div>
        )}
      </section>

      {/* Floating Action Button */}
      <div className="fixed bottom-24 right-6 md:bottom-12 md:right-12 z-50">
        <button
          onClick={() => setIsSaveSheetOpen(true)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label="Add new video"
        >
          <Plus className="h-6 w-6" />
        </button>
      </div>

      <EditTagsModal
        isOpen={!!editingVideo}
        onClose={() => setEditingVideo(null)}
        video={editingVideo}
        onSaveTags={updateVideoTags}
      />

      <AddToCollectionModal
        isOpen={!!addingVideoToCollection}
        onClose={() => setAddingVideoToCollection(null)}
        video={addingVideoToCollection}
      />

      <SaveSheet
        isOpen={isSaveSheetOpen}
        onClose={() => setIsSaveSheetOpen(false)}
      />

      <DeleteConfirmationModal
        isOpen={!!videoToDelete}
        onClose={() => setVideoToDelete(null)}
        onConfirm={async () => {
          if (videoToDelete) {
            await deleteVideo(videoToDelete.id);
          }
        }}
        title="Remove Video"
        description="Are you sure you want to remove this video? This action cannot be undone."
      />
    </main>
  );
}

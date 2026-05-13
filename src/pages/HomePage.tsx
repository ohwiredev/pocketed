import { motion } from "framer-motion";
import { useState } from "react";
import type { PlatformFilter } from "@/components/FilterChips";
import FilterChips from "@/components/FilterChips";
import AddToCollectionModal from "@/components/modals/AddToCollectionModal";
import EditTagsModal from "@/components/modals/EditTagsModal";
import SearchBar from "@/components/SearchBar";
import VideoCard from "@/components/VideoCard";
import { useAuth } from "@/hooks/useAuth";
import { useTitle } from "@/hooks/useTitle";
import { useVideos } from "@/hooks/useVideos";
import type { Video } from "@/types/video";

export default function HomePage() {
  useTitle("Home");

  const { session } = useAuth();
  const { videos, loading, updateVideoTags } = useVideos();
  const [activePlatform, setActivePlatform] = useState<PlatformFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [addingVideoToCollection, setAddingVideoToCollection] =
    useState<Video | null>(null);

  const filteredVideos = videos.filter((video) => {
    const matchesPlatform =
      activePlatform === "all" || video.platform === activePlatform;

    const query = searchQuery.toLowerCase();

    const matchesSearch =
      !searchQuery ||
      video.title.toLowerCase().includes(query) ||
      video.author?.toLowerCase().includes(query) ||
      video.tags?.some((tag) => tag.toLowerCase().includes(query)) ||
      video.notes?.toLowerCase().includes(query);

    return matchesPlatform && matchesSearch;
  });

  const userName =
    session?.user?.user_metadata?.display_name ||
    session?.user?.email?.split("@")[0] ||
    "User";

  const videoCount = videos.length;

  return (
    <main className="container mx-auto max-w-7xl px-4 pt-8 md:px-8">
      <section className="mb-10 mt-4 flex flex-col items-center text-center">
        <h1 className="mb-2 font-serif text-3xl font-bold tracking-tight md:text-4xl">
          Welcome back, {userName}!
        </h1>
        <p className="mb-8 text-sm text-foreground/60 max-w-md">
          You've pocketed{" "}
          <span className="font-bold text-foreground">{videoCount} videos</span>{" "}
          so far. What would you like to watch today?
        </p>
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </section>

      {/* Filters & Feed Section */}
      <section className="mt-8">
        <div className="mb-8 w-full">
          <FilterChips
            activePlatform={activePlatform}
            onSelectPlatform={setActivePlatform}
            videos={videos}
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 xl:columns-4">
            {filteredVideos.map((video) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <VideoCard
                  video={video}
                  onEditTags={(v) => setEditingVideo(v)}
                  onAddToCollection={(v) => setAddingVideoToCollection(v)}
                />
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filteredVideos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-lg font-medium text-foreground/60">
              {searchQuery
                ? `No videos found matching "${searchQuery}"`
                : activePlatform === "all"
                  ? "You haven't pocketed any videos yet."
                  : `No videos saved from ${activePlatform} yet.`}
            </p>
          </div>
        )}
      </section>

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
    </main>
  );
}

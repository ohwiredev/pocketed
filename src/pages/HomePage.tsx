import { motion } from "framer-motion";
import FilterChips from "@/components/FilterChips";
import SearchBar from "@/components/SearchBar";
import VideoCard from "@/components/VideoCard";
import { mockVideos } from "@/data/mockVideos";

import { useAuth } from "@/hooks/useAuth";
import { useTitle } from "@/hooks/useTitle";

export default function HomePage() {
  useTitle("Home");
  const { session } = useAuth();

  const userName =
    session?.user?.user_metadata?.display_name ||
    session?.user?.email?.split("@")[0] ||
    "User";
  const videoCount = mockVideos.length;

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
        <SearchBar />
      </section>

      {/* Filters & Feed Section */}
      <section className="mt-8">
        <div className="mb-8 w-full">
          <FilterChips />
        </div>

        {/* Masonry Layout using CSS Columns */}
        <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 xl:columns-4">
          {mockVideos.map((video) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <VideoCard video={video} />
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}

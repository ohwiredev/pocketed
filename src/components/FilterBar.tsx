import { AnimatePresence, motion } from "framer-motion";
import { Command, Filter, Search, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import instagramIcon from "@/assets/icons/instagram-icon.svg";
import tiktokIcon from "@/assets/icons/tiktok-icon-light.svg";
import youtubeIcon from "@/assets/icons/youtube.svg";
import { cn } from "@/lib/utils";
import type { Video } from "@/types/video";

export type PlatformFilter = "all" | "tiktok" | "youtube" | "instagram";

const PLATFORMS: {
  value: PlatformFilter;
  label: string;
  icon?: string;
  color: string;
}[] = [
  { value: "all", label: "All", color: "bg-foreground/10 text-foreground" },
  {
    value: "tiktok",
    label: "TikTok",
    icon: tiktokIcon,
    color: "bg-[#010101]/10 text-[#010101]",
  },
  {
    value: "youtube",
    label: "YouTube",
    icon: youtubeIcon,
    color: "bg-[#FF0000]/10 text-[#FF0000]",
  },
  {
    value: "instagram",
    label: "Instagram",
    icon: instagramIcon,
    color: "bg-[#E1306C]/10 text-[#E1306C]",
  },
];

interface FilterBarProps {
  // Search
  searchQuery: string;
  onSearchChange: (value: string) => void;

  // Platform
  activePlatform: PlatformFilter;
  onSelectPlatform: (platform: PlatformFilter) => void;

  // Tags
  activeTags: string[];
  onToggleTag: (tag: string) => void;
  topTags: { label: string; count: number }[];

  // Data
  videos: Video[];
  filteredCount: number;
  totalCount: number;

  // Actions
  onClearAll: () => void;
}

export default function FilterBar({
  searchQuery,
  onSearchChange,
  activePlatform,
  onSelectPlatform,
  activeTags,
  onToggleTag,
  topTags,
  videos,
  filteredCount,
  totalCount,
  onClearAll,
}: FilterBarProps) {
  const searchRef = useRef<HTMLInputElement>(null);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const hasActiveFilters =
    activeTags.length > 0 || activePlatform !== "all" || searchQuery.length > 0;
  const isFiltering = hasActiveFilters;

  // Populated platforms (only show platforms that have videos)
  const populatedPlatforms = PLATFORMS.filter(
    (p) => p.value === "all" || videos.some((v) => v.platform === p.value),
  );

  // Keyboard shortcut: Cmd/Ctrl+K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === "Escape" && document.activeElement === searchRef.current) {
        onSearchChange("");
        searchRef.current?.blur();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onSearchChange]);

  const clearAllFilters = useCallback(() => {
    onClearAll();
    setIsMobileFiltersOpen(false);
  }, [onClearAll]);

  return (
    <div className="sticky top-[64px] z-30">
      <div className="bg-background/80 backdrop-blur-xl border-b border-border/30 px-4 md:px-8 pt-4 pb-3">
        <div className="container mx-auto max-w-7xl">
          {/* Row 1: Search Bar */}
          <div className="relative w-full group mb-3">
            <input
              ref={searchRef}
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search your library..."
              className="h-12 w-full rounded-xl border border-border/50 bg-white/60 pl-11 pr-24 text-sm backdrop-blur-md outline-none transition-all placeholder:text-foreground/40 focus:border-primary/50 focus:bg-white/80 focus:ring-4 focus:ring-primary/10 shadow-sm"
            />
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-3.5">
              <Search className="size-4 text-foreground/50 group-focus-within:text-primary transition-colors" />
            </div>

            {/* Right side: clear button or ⌘K hint */}
            <div className="absolute inset-y-0 right-0 flex items-center gap-2 pr-3">
              {searchQuery ? (
                <button
                  onClick={() => onSearchChange("")}
                  className="flex items-center justify-center rounded-md p-1 text-foreground/40 hover:text-foreground hover:bg-foreground/5 transition-all"
                  title="Clear search"
                >
                  <X className="size-4" />
                </button>
              ) : (
                <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded-md border border-border/60 bg-muted/50 px-1.5 py-0.5 text-[10px] font-medium text-foreground/40">
                  <Command className="size-2.5" />K
                </kbd>
              )}

              {/* Mobile filter toggle */}
              <button
                onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                className={cn(
                  "flex md:hidden items-center justify-center rounded-lg p-1.5 transition-all",
                  isMobileFiltersOpen || hasActiveFilters
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/40 hover:text-foreground hover:bg-foreground/5",
                )}
                title="Toggle filters"
              >
                <Filter className="size-4" />
                {hasActiveFilters && !isMobileFiltersOpen && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                    {activeTags.length + (activePlatform !== "all" ? 1 : 0)}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Row 2+3: Platform + Tags (Desktop: always visible, Mobile: collapsible) */}
          <div
            className={cn(
              "md:block transition-all duration-300 overflow-hidden md:overflow-visible",
              isMobileFiltersOpen
                ? "max-h-[500px] opacity-100"
                : "max-h-0 md:max-h-[500px] opacity-0 md:opacity-100",
            )}
          >
            {/* Single Row: Platform Toggles + Tags */}
            <div className="flex items-center w-full mb-1">
              <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto pb-1 flex-1">
                {/* Platform Toggles */}
                {populatedPlatforms.map(({ value, label, icon, color }) => {
                  const isActive = activePlatform === value;
                  return (
                    <button
                      key={value}
                      onClick={() => onSelectPlatform(value)}
                      className={cn(
                        "flex-none relative inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer",
                        isActive
                          ? `${color} shadow-sm`
                          : "bg-transparent text-foreground/50 hover:bg-foreground/5 hover:text-foreground/80",
                      )}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="platform-active"
                          className="absolute inset-0 rounded-lg bg-foreground/6"
                          transition={{
                            type: "spring",
                            bounce: 0.15,
                            duration: 0.5,
                          }}
                        />
                      )}
                      <span className="relative z-10 flex items-center gap-1.5">
                        {icon && (
                          <img src={icon} alt={label} className="size-3.5" />
                        )}
                        {label}
                      </span>
                    </button>
                  );
                })}

                {/* Divider */}
                {topTags.length > 0 && (
                  <div className="w-px h-5 bg-border/40 mx-1 flex-none" />
                )}

                {/* Tag Chips */}
                {topTags.length > 0 && (
                  <>
                    <button
                      onClick={() => {
                        if (activeTags.length > 0) {
                          // Clear all tags
                          for (const t of activeTags) onToggleTag(t);
                        }
                      }}
                      className={cn(
                        "flex-none inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-all duration-200 cursor-pointer",
                        activeTags.length === 0
                          ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                          : "bg-foreground/4 text-foreground/50 hover:bg-foreground/8 hover:text-foreground/70 border border-border/30",
                      )}
                    >
                      All Tags
                    </button>

                    {topTags.map(({ label, count }) => {
                      const isActive = activeTags.includes(label);
                      return (
                        <motion.button
                          key={label}
                          layout
                          onClick={() => onToggleTag(label)}
                          className={cn(
                            "flex-none inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-all duration-200 cursor-pointer",
                            isActive
                              ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                              : "bg-foreground/4 text-foreground/50 hover:bg-foreground/8 hover:text-foreground/70 border border-border/30",
                          )}
                        >
                          <span>#{label}</span>
                          <span
                            className={cn(
                              "text-[10px]",
                              isActive
                                ? "text-primary-foreground/70"
                                : "text-foreground/30",
                            )}
                          >
                            {count}
                          </span>
                        </motion.button>
                      );
                    })}
                  </>
                )}
              </div>

              {/* Result count (desktop) */}
              <div className="hidden sm:flex ml-3 pl-3 border-l border-border/30 items-center flex-none pb-1">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={filteredCount}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    className="text-xs text-foreground/40 font-medium whitespace-nowrap"
                  >
                    {isFiltering
                      ? `${filteredCount} of ${totalCount}`
                      : `${totalCount} videos`}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Row 4: Active Filter Summary Strip */}
          <AnimatePresence>
            {hasActiveFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="flex items-center gap-2 pt-2.5 mt-1 border-t border-border/20">
                  <span className="text-[10px] font-medium text-foreground/35 uppercase tracking-wider flex-none">
                    Filters
                  </span>

                  <div className="flex flex-wrap items-center gap-1.5 flex-1 min-w-0">
                    {/* Search query pill */}
                    {searchQuery && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="inline-flex items-center gap-1 rounded-md bg-foreground/6 px-2 py-0.5 text-[11px] font-medium text-foreground/60"
                      >
                        "{searchQuery}"
                        <button
                          onClick={() => onSearchChange("")}
                          className="ml-0.5 rounded-full p-0.5 hover:bg-foreground/10 transition-colors"
                        >
                          <X className="size-2.5" />
                        </button>
                      </motion.span>
                    )}

                    {/* Platform pill */}
                    {activePlatform !== "all" && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="inline-flex items-center gap-1 rounded-md bg-foreground/6 px-2 py-0.5 text-[11px] font-medium text-foreground/60"
                      >
                        {PLATFORMS.find((p) => p.value === activePlatform)
                          ?.icon && (
                          <img
                            src={
                              PLATFORMS.find((p) => p.value === activePlatform)
                                ?.icon
                            }
                            alt=""
                            className="size-3"
                          />
                        )}
                        {
                          PLATFORMS.find((p) => p.value === activePlatform)
                            ?.label
                        }
                        <button
                          onClick={() => onSelectPlatform("all")}
                          className="ml-0.5 rounded-full p-0.5 hover:bg-foreground/10 transition-colors"
                        >
                          <X className="size-2.5" />
                        </button>
                      </motion.span>
                    )}

                    {/* Tag pills */}
                    {activeTags.map((tag) => (
                      <motion.span
                        key={tag}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary"
                      >
                        #{tag}
                        <button
                          onClick={() => onToggleTag(tag)}
                          className="ml-0.5 rounded-full p-0.5 hover:bg-primary/20 transition-colors"
                        >
                          <X className="size-2.5" />
                        </button>
                      </motion.span>
                    ))}
                  </div>

                  {/* Clear all + mobile count */}
                  <div className="flex items-center gap-2 flex-none">
                    <span className="sm:hidden text-[10px] text-foreground/40 font-medium">
                      {filteredCount}/{totalCount}
                    </span>
                    <button
                      onClick={clearAllFilters}
                      className="text-[11px] font-medium text-foreground/40 hover:text-destructive transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Clear all
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

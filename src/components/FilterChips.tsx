import instagramIcon from "@/assets/icons/instagram-icon.svg";
import tiktokIcon from "@/assets/icons/tiktok-icon-light.svg";
import youtubeIcon from "@/assets/icons/youtube.svg";
import type { Video } from "@/types/video";

export type PlatformFilter = "all" | "tiktok" | "youtube" | "instagram";

const PLATFORMS: { value: PlatformFilter; label: string; icon?: string }[] = [
  { value: "all", label: "All" },
  { value: "tiktok", label: "TikTok", icon: tiktokIcon },
  { value: "youtube", label: "YouTube", icon: youtubeIcon },
  { value: "instagram", label: "Instagram", icon: instagramIcon },
];

interface FilterChipsProps {
  activePlatform: PlatformFilter;
  onSelectPlatform: (platform: PlatformFilter) => void;
  videos: Video[];
  activeTags: string[];
  onToggleTag: (tag: string) => void;
  topTags: { label: string; count: number }[];
}

export default function FilterChips({
  activePlatform,
  onSelectPlatform,
  videos,
  activeTags,
  onToggleTag,
  topTags,
}: FilterChipsProps) {
  const populatedPlatforms = PLATFORMS.filter(
    (p) => p.value === "all" || videos.some((v) => v.platform === p.value),
  );

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Tag Filters (Primary) */}
      <div className="no-scrollbar flex w-full items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => {
            // If clicking All, clear all tag filters
            activeTags.forEach((t) => onToggleTag(t));
          }}
          className={`flex-none inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-all ${
            activeTags.length === 0
              ? "bg-secondary text-secondary-foreground shadow-md shadow-secondary/20 border border-secondary"
              : "bg-white/5 text-foreground/70 hover:bg-white/10 hover:text-foreground border border-border/40"
          }`}
        >
          All
        </button>
        {topTags.map(({ label }) => {
          const isActive = activeTags.includes(label);
          return (
            <button
              key={label}
              onClick={() => onToggleTag(label)}
              className={`flex-none inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-all ${
                isActive
                  ? "bg-secondary text-secondary-foreground shadow-md shadow-secondary/20 border border-secondary"
                  : "bg-white/5 text-foreground/70 hover:bg-white/10 hover:text-foreground border border-border/40"
              }`}
            >
              #{label}
            </button>
          );
        })}
      </div>

      {/* Platform Filters (Secondary) */}
      <div className="no-scrollbar flex w-full items-center gap-2 overflow-x-auto pb-2">
        {populatedPlatforms.map(({ value, label, icon }) => (
          <button
            key={value}
            onClick={() => onSelectPlatform(value)}
            className={`flex-none inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
              activePlatform === value
                ? "bg-foreground/10 text-foreground shadow-sm border border-border/50"
                : "bg-transparent text-foreground/60 hover:bg-white/5 hover:text-foreground border border-transparent"
            }`}
          >
            {icon && <img src={icon} alt={label} className="size-3" />}
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

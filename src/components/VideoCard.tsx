import { motion } from "framer-motion";
import {
  ExternalLink,
  FolderPlus,
  MoreVertical,
  Play,
  Tags,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import instagramIcon from "@/assets/icons/instagram-icon.svg";
import tiktokIcon from "@/assets/icons/tiktok-icon-dark.svg";
import youtubeIcon from "@/assets/icons/youtube.svg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Video } from "@/types/video";

interface VideoCardProps {
  video: Video;
  onRemove?: (id: string) => void;
  onEditTags?: (video: Video) => void;
  onAddToCollection?: (video: Video) => void;
  onTagClick?: (tag: string) => void;
}

export default function VideoCard({
  video,
  onRemove,
  onEditTags,
  onAddToCollection,
  onTagClick,
}: VideoCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const PlatformIcon = () => {
    switch (video.platform) {
      case "youtube":
        return <img src={youtubeIcon} alt="YouTube" className="size-3" />;
      case "instagram":
        return <img src={instagramIcon} alt="Instagram" className="size-3" />;
      case "tiktok":
        return <img src={tiktokIcon} alt="TikTok" className="size-3" />;
      default:
        return <Play className="size-3" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-border/50 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:bg-white/10 hover:shadow-xl mb-6 break-inside-avoid"
    >
      <div className="relative overflow-hidden bg-black/20">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full object-cover transition-transform duration-700"
          style={{
            aspectRatio: video.aspectRatio === "horizontal" ? "16/9" : "9/16",
          }}
        />

        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-80" />

        {/* Platform Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-md bg-black/60 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
          <PlatformIcon />
          {video.platform}
        </div>

        <Link to={video.videoUrl} target="_blank">
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md shadow-lg border border-white/30">
              <ExternalLink className="size-5" />
            </div>
          </div>
        </Link>
      </div>

      <div className="p-4">
        {video.author && (
          <p className="mb-2 text-[10px] font-medium text-foreground/40">
            {video.author}
          </p>
        )}

        <h3 className="mb-2 line-clamp-2 font-sans text-base font-semibold leading-snug group-hover:text-primary transition-colors">
          {video.title}
        </h3>

        {video.tags && video.tags.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {video.tags.map((tag) => (
              <span
                key={tag}
                onClick={(e) => {
                  e.stopPropagation();
                  onTagClick?.(tag);
                }}
                className={cn(
                  "inline-flex items-center rounded-md bg-secondary/80 px-2 py-0.5 text-[10px] font-medium text-secondary-foreground",
                  onTagClick &&
                    "cursor-pointer hover:bg-secondary hover:shadow-sm",
                )}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {video.notes && (
          <p className="line-clamp-2 text-xs italic text-foreground/60 border-l-2 border-primary/20 pl-2">
            "{video.notes}"
          </p>
        )}
      </div>

      {/* Action Menu */}
      {(onRemove || onEditTags || onAddToCollection) && (
        <div
          className={cn(
            "absolute top-3 right-3 z-10 transition-opacity",
            isOpen
              ? "opacity-100"
              : "opacity-100 md:opacity-0 md:group-hover:opacity-100",
          )}
        >
          <DropdownMenu onOpenChange={setIsOpen}>
            <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur shadow-sm hover:bg-white transition-colors">
              <MoreVertical className="size-4 text-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="min-w-48 bg-white/95 backdrop-blur-xl border-none shadow-2xl p-1.5"
            >
              {onEditTags && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditTags(video);
                  }}
                  className="cursor-pointer gap-3"
                >
                  <Tags className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Edit Tags</span>
                </DropdownMenuItem>
              )}
              {onAddToCollection && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCollection(video);
                  }}
                  className="cursor-pointer gap-3"
                >
                  <FolderPlus className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Add to collection</span>
                </DropdownMenuItem>
              )}
              {onRemove && (
                <DropdownMenuItem
                  variant="destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(video.id);
                  }}
                  className="cursor-pointer gap-3"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="text-sm">Remove Video</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </motion.div>
  );
}

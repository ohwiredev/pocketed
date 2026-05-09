import type { Video } from "@/types/video";
import { motion } from "framer-motion";
import { Clock, Play, ExternalLink } from "lucide-react";
import instagramIcon from "@/assets/icons/instagram-icon.svg";
import tiktokIcon from "@/assets/icons/tiktok-icon-dark.svg";
import youtubeIcon from "@/assets/icons/youtube.svg";

interface VideoCardProps {
  video: Video;
}

export default function VideoCard({ video }: VideoCardProps) {
  
  const PlatformIcon = () => {
    switch(video.platform) {
      case "youtube": return <img src={youtubeIcon} alt="YouTube" className="size-3" />;
      case "instagram": return <img src={instagramIcon} alt="Instagram" className="size-3" />;
      case "tiktok": return <img src={tiktokIcon} alt="TikTok" className="size-3" />;
      default: return <Play className="size-3" />;
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="group cursor-pointer overflow-hidden rounded-2xl border border-border/50 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:bg-white/10 hover:shadow-xl mb-6 break-inside-avoid"
    >
      <div className="relative overflow-hidden bg-black/20">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full object-cover transition-transform duration-700"
          style={{ aspectRatio: video.aspectRatio === "horizontal" ? "16/9" : "9/16" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-80" />
        
        {/* Platform Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-md bg-black/60 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
          <PlatformIcon />
          {video.platform}
        </div>

        <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-md bg-black/60 px-2 py-1 text-[10px] font-medium text-white backdrop-blur-md">
          <Clock className="size-3" />
          {video.duration}
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md shadow-lg border border-white/30">
            <ExternalLink className="size-5" />
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="mb-3 flex items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-primary">
            {video.category}
          </span>
          <div className="h-1 w-1 rounded-full bg-foreground/20" />
          <span className="text-[10px] font-medium text-foreground/40">{video.createdAt}</span>
        </div>
        <h3 className="mb-2 line-clamp-2 font-sans text-base font-semibold leading-snug group-hover:text-primary transition-colors">
          {video.title}
        </h3>
        {video.notes && (
          <p className="line-clamp-2 text-xs italic text-foreground/60 border-l-2 border-primary/20 pl-2">
            "{video.notes}"
          </p>
        )}
      </div>
    </motion.div>
  );
}

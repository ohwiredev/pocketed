import { motion } from "framer-motion";
import { Folder, MoreVertical, Play } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Collection } from "@/types/collection";

interface CollectionCardProps {
  collection: Collection;
  onDelete?: (id: string) => void;
  onRename?: (id: string, name: string) => void;
}

export default function CollectionCard({
  collection,
  onDelete,
  onRename,
}: CollectionCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const thumbnails = collection.thumbnails || [];

  // Create an array of 4 items for the mosaic, filling gaps with null
  const mosaicItems = [
    ...thumbnails,
    ...Array(Math.max(0, 4 - thumbnails.length)).fill(null),
  ].slice(0, 4);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group relative"
    >
      <Link to={`/collection/${collection.id}`} className="block">
        <div className="aspect-square w-full overflow-hidden rounded-2xl bg-muted ring-1 ring-border transition-all group-hover:ring-primary/50 group-hover:shadow-xl group-hover:shadow-primary/5">
          <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-0.5">
            {mosaicItems.map((thumb, i) => (
              <div
                key={i}
                className="relative h-full w-full bg-primary/10 overflow-hidden"
              >
                {thumb ? (
                  <img
                    src={thumb}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-primary/5">
                    <Folder className="h-1/3 w-1/3 text-primary/20" />
                  </div>
                )}
                {/* Subtle overlay */}
                <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/5" />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3 px-1">
          <h3 className="font-serif text-lg font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {collection.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {collection.video_count}{" "}
            {collection.video_count === 1 ? "video" : "videos"}
          </p>
        </div>
      </Link>

      {/* Action Menu */}
      <div
        className={cn(
          "absolute top-2 right-2 transition-opacity",
          isOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100",
        )}
      >
        <DropdownMenu onOpenChange={setIsOpen}>
          <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur shadow-sm hover:bg-white transition-colors">
            <MoreVertical className="h-4 w-4 text-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-32 bg-white/95 backdrop-blur-xl border-none shadow-2xl"
          >
            <DropdownMenuItem
              onClick={() => onRename?.(collection.id, collection.name)}
              className="cursor-pointer"
            >
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete?.(collection.id)}
              className="cursor-pointer text-destructive focus:text-destructive"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  );
}

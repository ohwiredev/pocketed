import { AnimatePresence, motion } from "framer-motion";
import { FolderPlus, Loader2, Plus } from "lucide-react";
import { useState } from "react";
import CollectionCard from "@/components/CollectionCard";
import CreateCollectionModal from "@/components/modals/CreateCollectionModal";
import { Button } from "@/components/ui/button";
import { useCollections } from "@/hooks/useCollections";
import { useTitle } from "@/hooks/useTitle";

export default function CollectionsPage() {
  useTitle("Collections");
  const {
    collections,
    loading,
    createCollection,
    deleteCollection,
    renameCollection,
  } = useCollections();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <main className="container mx-auto max-w-7xl px-4 pt-8 md:px-8 pb-24 md:pb-8">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="font-serif text-4xl font-bold text-foreground md:text-5xl">
            Collections
          </h1>
          <p className="mt-2 text-muted-foreground">
            Organize your saved videos into themes
          </p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="hidden md:flex gap-2 shadow-lg transition-all"
        >
          <Plus className="h-5 w-5" />
          New Collection
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex h-[50vh] items-center justify-center"
          >
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </motion.div>
        ) : collections.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex h-[60vh] flex-col items-center justify-center text-center"
          >
            <div className="relative mb-8">
              <div className="absolute inset-0 rounded-full blur-2xl" />
              <div className="relative rounded-full bg-primary/5 p-12 ring-1 ring-primary/20 backdrop-blur-sm">
                <FolderPlus className="h-16 w-16 text-primary/60" />
              </div>
            </div>
            <h2 className="text-3xl font-serif font-bold text-foreground">
              No collections yet
            </h2>
            <p className="mt-3 max-w-sm text-base md:text-lg text-muted-foreground">
              Group your saved videos into curated collections to find them in seconds.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
          >
            {collections.map((collection) => (
              <CollectionCard
                key={collection.id}
                collection={collection}
                onDelete={deleteCollection}
                onRename={renameCollection}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button for Mobile */}
      <Button
        onClick={() => setIsCreateModalOpen(true)}
        className="fixed bottom-24 right-6 h-14 w-14 rounded-full shadow-2xl md:hidden z-50"
        size="icon"
      >
        <Plus className="h-8 w-8" />
      </Button>

      <CreateCollectionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={createCollection}
      />
    </main>
  );
}

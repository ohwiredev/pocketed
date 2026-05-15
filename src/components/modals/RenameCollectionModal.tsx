import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalDescription,
  ResponsiveModalFooter,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
} from "@/components/ui/responsive-modal";

interface RenameCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRename: (id: string, newName: string) => Promise<void>;
  collectionId: string | null;
  currentName: string;
}

export default function RenameCollectionModal({
  isOpen,
  onClose,
  onRename,
  collectionId,
  currentName,
}: RenameCollectionModalProps) {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName(currentName);
    }
  }, [isOpen, currentName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !collectionId || name === currentName) {
      onClose();
      return;
    }

    try {
      // Blur to hide keyboard on mobile
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      setIsSubmitting(true);
      await onRename(collectionId, name);
      onClose();
    } catch (error) {
      console.error("Failed to rename collection:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ResponsiveModal open={isOpen} onOpenChange={onClose}>
      <ResponsiveModalContent className="sm:max-w-md bg-white/95 backdrop-blur-xl border-none shadow-2xl">
        <ResponsiveModalHeader>
          <ResponsiveModalTitle className="font-serif text-2xl">
            Rename Collection
          </ResponsiveModalTitle>
          <ResponsiveModalDescription>
            Enter a new name for your collection.
          </ResponsiveModalDescription>
        </ResponsiveModalHeader>
        <form onSubmit={handleSubmit} className="space-y-4 px-4 pb-4 sm:p-0">
          <div className="space-y-2">
            <Label htmlFor="rename-collection">Collection name</Label>
            <Input
              id="rename-collection"
              placeholder="e.g. Workout ideas, Travel inspo..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={50}
              className="bg-white/50 h-11 sm:h-9"
              autoFocus
            />
            <p className="text-right text-xs text-muted-foreground">
              {name.length}/50
            </p>
          </div>
          <ResponsiveModalFooter className="flex flex-col sm:flex-row gap-2 sm:justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-11 sm:h-9 order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!name.trim() || isSubmitting}
              className="h-11 sm:h-9 order-1 sm:order-2"
            >
              {isSubmitting ? "Renaming..." : "Save Changes"}
            </Button>
          </ResponsiveModalFooter>
        </form>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
}

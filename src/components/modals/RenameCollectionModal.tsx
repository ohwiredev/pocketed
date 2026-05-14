import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-xl border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">
            Rename Collection
          </DialogTitle>
          <DialogDescription>
            Enter a new name for your collection.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="rename-collection">Collection name</Label>
            <Input
              id="rename-collection"
              placeholder="e.g. Workout ideas, Travel inspo..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={50}
              className="bg-white/50"
              autoFocus
            />
            <p className="text-right text-xs text-muted-foreground">
              {name.length}/50
            </p>
          </div>
          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim() || isSubmitting}>
              {isSubmitting ? "Renaming..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

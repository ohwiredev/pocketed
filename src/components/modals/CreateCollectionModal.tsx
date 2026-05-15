import { useState } from "react";
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

interface CreateCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string) => Promise<void>;
}

export default function CreateCollectionModal({
  isOpen,
  onClose,
  onCreate,
}: CreateCollectionModalProps) {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setIsSubmitting(true);
      await onCreate(name);
      setName("");
      onClose();
    } catch (error) {
      console.error("Failed to create collection:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ResponsiveModal open={isOpen} onOpenChange={onClose}>
      <ResponsiveModalContent className="sm:max-w-md">
        <ResponsiveModalHeader>
          <ResponsiveModalTitle className="font-serif text-2xl">
            New Collection
          </ResponsiveModalTitle>
          <ResponsiveModalDescription>
            Create a new collection to organize your saved videos.
          </ResponsiveModalDescription>
        </ResponsiveModalHeader>
        <form onSubmit={handleSubmit} className="space-y-4 px-4 pb-4 sm:p-0">
          <div className="space-y-2">
            <Label htmlFor="name">Collection name</Label>
            <Input
              id="name"
              placeholder="e.g. Workout ideas, Travel inspo..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={50}
              autoFocus
              className="h-11 sm:h-9"
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
              {isSubmitting ? "Creating..." : "Create"}
            </Button>
          </ResponsiveModalFooter>
        </form>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
}

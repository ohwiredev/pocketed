import { AlertTriangle, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalDescription,
  ResponsiveModalFooter,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
} from "@/components/ui/responsive-modal";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title: string;
  description: string;
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
}: DeleteConfirmationModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <ResponsiveModal open={isOpen} onOpenChange={onClose}>
      <ResponsiveModalContent className="sm:max-w-[400px]">
        <ResponsiveModalHeader className="flex flex-col items-center text-center space-y-4 pt-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="space-y-2 flex flex-col items-center text-center">
            <ResponsiveModalTitle className="font-serif text-2xl text-center w-full">
              {title}
            </ResponsiveModalTitle>
            <ResponsiveModalDescription className="text-center text-muted-foreground line-clamp-3 w-full">
              {description}
            </ResponsiveModalDescription>
          </div>
        </ResponsiveModalHeader>

        <ResponsiveModalFooter className="m-0 flex flex-col sm:flex-row gap-2 mt-4 px-4 pb-4 sm:px-0 sm:pb-0">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isDeleting}
            className="sm:flex-1 order-2 sm:order-1 h-11 sm:h-9"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="sm:flex-1 order-1 sm:order-2 h-11 sm:h-9"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </ResponsiveModalFooter>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
}

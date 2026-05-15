import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

// Context to track if we are rendering desktop or mobile
const ResponsiveModalContext = React.createContext<{ isDesktop: boolean }>({
  isDesktop: true,
});

export function ResponsiveModal({
  children,
  open,
  onOpenChange,
}: React.ComponentProps<typeof Dialog>) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <ResponsiveModalContext.Provider value={{ isDesktop }}>
      {isDesktop ? (
        <Dialog open={open} onOpenChange={onOpenChange}>
          {children}
        </Dialog>
      ) : (
        <Drawer open={open} onOpenChange={onOpenChange}>
          {children}
        </Drawer>
      )}
    </ResponsiveModalContext.Provider>
  );
}

export function ResponsiveModalTrigger(
  props: React.ComponentProps<typeof DialogTrigger>,
) {
  const { isDesktop } = React.useContext(ResponsiveModalContext);
  return isDesktop ? (
    <DialogTrigger {...props} />
  ) : (
    <DrawerTrigger {...props} />
  );
}

export function ResponsiveModalContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogContent>) {
  const { isDesktop } = React.useContext(ResponsiveModalContext);

  if (isDesktop) {
    return (
      <DialogContent className={className} {...props}>
        {children}
      </DialogContent>
    );
  }

  return (
    <DrawerContent className={className} {...props}>
      {children}
    </DrawerContent>
  );
}

export function ResponsiveModalHeader({
  className,
  ...props
}: React.ComponentProps<typeof DialogHeader>) {
  const { isDesktop } = React.useContext(ResponsiveModalContext);
  return isDesktop ? (
    <DialogHeader className={className} {...props} />
  ) : (
    <DrawerHeader className={cn("text-left", className)} {...props} />
  );
}

export function ResponsiveModalTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogTitle>) {
  const { isDesktop } = React.useContext(ResponsiveModalContext);
  return isDesktop ? (
    <DialogTitle className={className} {...props} />
  ) : (
    <DrawerTitle className={className} {...props} />
  );
}

export function ResponsiveModalDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogDescription>) {
  const { isDesktop } = React.useContext(ResponsiveModalContext);
  return isDesktop ? (
    <DialogDescription className={className} {...props} />
  ) : (
    <DrawerDescription className={className} {...props} />
  );
}

export function ResponsiveModalFooter({
  className,
  ...props
}: React.ComponentProps<typeof DialogFooter>) {
  const { isDesktop } = React.useContext(ResponsiveModalContext);
  return isDesktop ? (
    <DialogFooter className={className} {...props} />
  ) : (
    <DrawerFooter className={cn("pt-2", className)} {...props} />
  );
}

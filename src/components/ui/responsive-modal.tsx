import * as React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

interface ResponsiveModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function ResponsiveModal({
  open,
  onOpenChange,
  children,
}: ResponsiveModalProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return isDesktop ? (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children}
    </Dialog>
  ) : (
    <Drawer open={open} onOpenChange={onOpenChange}>
      {children}
    </Drawer>
  );
}

interface ResponsiveModalTriggerProps {
  asChild?: boolean;
  children: React.ReactNode;
}

export function ResponsiveModalTrigger({
  asChild,
  children,
}: ResponsiveModalTriggerProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return isDesktop ? (
    <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
  ) : (
    <DrawerTrigger asChild={asChild}>{children}</DrawerTrigger>
  );
}

interface ResponsiveModalContentProps
  extends React.ComponentProps<typeof DialogContent> {}

export function ResponsiveModalContent({
  className,
  children,
  ...props
}: ResponsiveModalContentProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return isDesktop ? (
    <DialogContent className={cn(className)} {...props}>
      {children}
    </DialogContent>
  ) : (
    <DrawerContent className={cn(className)}>{children}</DrawerContent>
  );
}

export function ResponsiveModalHeader({
  className,
  ...props
}: React.ComponentProps<typeof DialogHeader>) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return isDesktop ? (
    <DialogHeader className={cn(className)} {...props} />
  ) : (
    <DrawerHeader className={cn("text-left", className)} {...props} />
  );
}

export function ResponsiveModalTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogTitle>) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return isDesktop ? (
    <DialogTitle className={cn(className)} {...props} />
  ) : (
    <DrawerTitle className={cn(className)} {...props} />
  );
}

export function ResponsiveModalDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogDescription>) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return isDesktop ? (
    <DialogDescription className={cn(className)} {...props} />
  ) : (
    <DrawerDescription className={cn(className)} {...props} />
  );
}

export function ResponsiveModalFooter({
  className,
  ...props
}: React.ComponentProps<typeof DialogFooter>) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return isDesktop ? (
    <DialogFooter className={cn(className)} {...props} />
  ) : (
    <DrawerFooter className={cn("pt-2", className)} {...props} />
  );
}

export function ResponsiveModalClose({
  ...props
}: React.ComponentProps<typeof DialogClose>) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return isDesktop ? <DialogClose {...props} /> : <DrawerClose {...props} />;
}
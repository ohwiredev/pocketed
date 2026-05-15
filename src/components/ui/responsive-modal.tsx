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
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <div className="hidden md:block">{children}</div>
      </Dialog>
      <Drawer open={open} onOpenChange={onOpenChange}>
        <div className="md:hidden">{children}</div>
      </Drawer>
    </>
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
  return (
    <>
      <DialogTrigger asChild={asChild} className="hidden md:block">
        {children}
      </DialogTrigger>
      <DrawerTrigger asChild={asChild} className="md:hidden">
        {children}
      </DrawerTrigger>
    </>
  );
}

interface ResponsiveModalContentProps
  extends React.ComponentProps<typeof DialogContent> {}

export function ResponsiveModalContent({
  className,
  children,
  ...props
}: ResponsiveModalContentProps) {
  return (
    <>
      <DialogContent className={cn(className)} {...props}>
        {children}
      </DialogContent>
      <DrawerContent className={cn(className)}>
        {children}
      </DrawerContent>
    </>
  );
}

export function ResponsiveModalHeader({
  className,
  ...props
}: React.ComponentProps<typeof DialogHeader>) {
  return (
    <>
      <DialogHeader className={cn(className)} {...props} />
      <DrawerHeader className={cn("text-left", className)} {...props} />
    </>
  );
}

export function ResponsiveModalTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogTitle>) {
  return (
    <>
      <DialogTitle className={cn(className)} {...props} />
      <DrawerTitle className={cn(className)} {...props} />
    </>
  );
}

export function ResponsiveModalDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogDescription>) {
  return (
    <>
      <DialogDescription className={cn(className)} {...props} />
      <DrawerDescription className={cn(className)} {...props} />
    </>
  );
}

export function ResponsiveModalFooter({
  className,
  ...props
}: React.ComponentProps<typeof DialogFooter>) {
  return (
    <>
      <DialogFooter className={cn(className)} {...props} />
      <DrawerFooter className={cn("pt-2", className)} {...props} />
    </>
  );
}

export function ResponsiveModalClose({
  ...props
}: React.ComponentProps<typeof DialogClose>) {
  return (
    <>
      <DialogClose {...props} />
      <DrawerClose {...props} />
    </>
  );
}
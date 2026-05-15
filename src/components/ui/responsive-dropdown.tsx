import * as React from "react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

const ResponsiveDropdownContext = React.createContext<{
  isDesktop: boolean;
  setIsOpen?: (open: boolean) => void;
}>({ isDesktop: true });

export function ResponsiveDropdownMenu({
  children,
  open,
  onOpenChange,
}: React.ComponentProps<typeof DropdownMenu>) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [internalOpen, setInternalOpen] = React.useState(open || false);
  const isControlled = open !== undefined;

  const handleOpenChange = (newOpen: boolean) => {
    if (!isControlled) setInternalOpen(newOpen);
    if (onOpenChange) onOpenChange(newOpen);
  };

  const isOpen = isControlled ? open : internalOpen;

  return (
    <ResponsiveDropdownContext.Provider
      value={{ isDesktop, setIsOpen: handleOpenChange }}
    >
      {isDesktop ? (
        <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
          {children}
        </DropdownMenu>
      ) : (
        <Drawer open={isOpen} onOpenChange={handleOpenChange}>
          {children}
        </Drawer>
      )}
    </ResponsiveDropdownContext.Provider>
  );
}

export function ResponsiveDropdownMenuTrigger(
  props: React.ComponentProps<typeof DropdownMenuTrigger>,
) {
  const { isDesktop } = React.useContext(ResponsiveDropdownContext);
  return isDesktop ? (
    <DropdownMenuTrigger {...props} />
  ) : (
    <DrawerTrigger {...props} />
  );
}

export function ResponsiveDropdownMenuContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuContent>) {
  const { isDesktop } = React.useContext(ResponsiveDropdownContext);

  if (isDesktop) {
    return (
      <DropdownMenuContent className={className} {...props}>
        {children}
      </DropdownMenuContent>
    );
  }

  return (
    <DrawerContent className={cn("px-4 pb-8 pt-2 outline-none", className)}>
      <div className="flex flex-col gap-2 mt-4 outline-none">{children}</div>
    </DrawerContent>
  );
}

interface ResponsiveDropdownMenuItemProps
  extends React.ComponentProps<typeof DropdownMenuItem> {
  variant?: "default" | "destructive";
}

export function ResponsiveDropdownMenuItem({
  className,
  children,
  variant,
  onClick,
  ...props
}: ResponsiveDropdownMenuItemProps) {
  const { isDesktop, setIsOpen } = React.useContext(ResponsiveDropdownContext);

  const handleClick = (
    e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>,
  ) => {
    if (onClick) onClick(e as any);
    if (!isDesktop && setIsOpen) {
      setIsOpen(false);
    }
  };

  if (isDesktop) {
    return (
      <DropdownMenuItem
        className={className}
        variant={variant}
        onClick={handleClick as any}
        {...props}
      >
        {children}
      </DropdownMenuItem>
    );
  }

  return (
    <div
      className={cn(
        "flex w-full items-center rounded-xl p-4 text-base font-medium transition-colors hover:bg-muted active:bg-muted/80 outline-none cursor-pointer",
        variant === "destructive" ? "text-destructive" : "text-foreground",
        className,
      )}
      onClick={handleClick}
      role="menuitem"
      tabIndex={0}
      {...(props as any)}
    >
      {children}
    </div>
  );
}

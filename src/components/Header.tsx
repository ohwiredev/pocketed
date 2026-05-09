import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import trademark from "@/assets/trademark.svg";

export default function Header() {
  const { signOut, session } = useAuth();
  const user = session?.user;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        <div className="flex items-center">
          <img src={trademark} alt="Pocketed" className="h-12 w-auto" />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 pl-2">
            <Avatar className="h-9 w-9 border border-primary/20">
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-primary/10 text-primary uppercase text-xs">
                {user?.email?.substring(0, 2) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="hidden flex-col md:flex">
              <span className="text-xs font-bold leading-none">{user?.email?.split('@')[0] || "User"}</span>
              <button 
                onClick={signOut}
                className="flex items-center gap-1 text-[10px] font-medium text-foreground/50 hover:text-destructive transition-colors mt-0.5"
              >
                <LogOut className="size-3" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

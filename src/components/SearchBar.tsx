import { Plus, Search } from "lucide-react";
import { Button } from "./ui/button";

export default function SearchBar() {
  return (
    <div className="relative w-full max-w-2xl mx-auto group">
      <input
        type="text"
        placeholder="Search your library or paste a link to save..."
        className="h-14 w-full rounded-2xl border border-border/50 bg-white/5 pl-12 pr-24 text-base backdrop-blur-md outline-none transition-all placeholder:text-foreground/40 focus:border-primary/50 focus:bg-white/10 focus:ring-4 focus:ring-primary/10 shadow-lg shadow-black/5"
      />
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-4">
        <Search className="size-5 text-foreground/60 group-focus-within:text-primary transition-colors" />
      </div>
      <div className="absolute inset-y-0 right-1.5 flex items-center">
        <Button
          size="sm"
          className="h-11 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 px-4 font-semibold shadow-md"
        >
          <Plus className="mr-1.5 size-4" />
          Save
        </Button>
      </div>
    </div>
  );
}

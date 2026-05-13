import { Search, X } from "lucide-react";

interface SearchBarProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value = "",
  onChange,
  placeholder = "Search your library...",
}: SearchBarProps) {
  return (
    <div className="relative w-full max-w-2xl mx-auto group">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="h-14 w-full rounded-2xl border border-border/50 bg-white/5 pl-12 pr-12 text-base backdrop-blur-md outline-none transition-all placeholder:text-foreground/40 focus:border-primary/50 focus:bg-white/10 focus:ring-4 focus:ring-primary/10 shadow-lg shadow-black/5"
      />
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-4">
        <Search className="size-5 text-foreground/60 group-focus-within:text-primary transition-colors" />
      </div>
      {value && (
        <button
          onClick={() => onChange?.("")}
          className="absolute inset-y-0 right-0 flex items-center pr-4 text-foreground/40 hover:text-foreground transition-colors"
          title="Clear search"
        >
          <X className="size-5" />
        </button>
      )}
    </div>
  );
}

import { useState } from "react";

const categories = [
  "All Saves",
  "Tutorials",
  "Inspiration",
  "Recipes",
  "Tech Reviews",
  "Fitness",
  "Music",
  "Comedy",
];

export default function FilterChips() {
  const [activeCategory, setActiveCategory] = useState("All Saves");

  return (
    <div className="no-scrollbar flex w-full items-center gap-2 overflow-x-auto pb-2">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setActiveCategory(category)}
          className={`flex-none rounded-full px-5 py-2 text-sm font-medium transition-all ${
            activeCategory === category
              ? "bg-secondary text-secondary-foreground shadow-md shadow-secondary/20 border border-secondary"
              : "bg-white/5 text-foreground/70 hover:bg-white/10 hover:text-foreground border border-border/40"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

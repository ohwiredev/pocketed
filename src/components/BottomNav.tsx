import { motion } from "framer-motion";
import { Bookmark, Home, Library, User } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { icon: Home, label: "Home", path: "/home" },
  { icon: Library, label: "Collections", path: "/collections" },
  { icon: Bookmark, label: "Saves", path: "/save" },
  { icon: User, label: "Profile", path: "/profile" },
];

export default function BottomNav() {
  const location = useLocation();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <nav className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full border border-black/5 bg-white/80 p-2 shadow-2xl shadow-black/10 backdrop-blur-xl md:bottom-8">
      {navItems.map((item, index) => {
        const isActive = location.pathname === item.path;
        const Icon = item.icon;

        return (
          <Link
            key={item.path}
            to={item.path}
            className="relative flex h-12 w-12 items-center justify-center rounded-full transition-colors"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {isActive && (
              <motion.div
                layoutId="active-nav"
                className="absolute inset-0 rounded-full bg-primary"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            {hoveredIndex === index && !isActive && (
              <motion.div
                layoutId="hover-nav"
                className="absolute inset-0 rounded-full bg-black/5"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <Icon
              className={`relative z-10 size-5 ${
                isActive ? "text-primary-foreground" : "text-foreground/70"
              }`}
            />
          </Link>
        );
      })}
    </nav>
  );
}

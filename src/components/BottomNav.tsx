import { AnimatePresence, motion } from "framer-motion";
import { Bookmark, Home, Library, User } from "lucide-react";
import { memo, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { icon: Home, label: "Home", path: "/home" },
  { icon: Library, label: "Collections", path: "/collections" },
  { icon: Bookmark, label: "Saves", path: "/save" },
  { icon: User, label: "Profile", path: "/profile" },
];

const ITEM_SIZE = 48;
const GAP = 4;
const ITEM_STEP = ITEM_SIZE + GAP;

const springTransition = {
  type: "spring",
  bounce: 0.2,
  duration: 0.6,
} as const;

export default memo(function BottomNav() {
  const location = useLocation();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const activeIndex = useMemo(
    () => navItems.findIndex((item) => location.pathname === item.path),
    [location.pathname],
  );

  return (
    <nav
      aria-label="Bottom Navigation"
      className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full border border-black/5 bg-white/80 p-2 shadow-2xl shadow-black/10 backdrop-blur-xl md:bottom-8"
    >
      {/* Single always-mounted active pill — slides via x animation, never unmounts */}
      {activeIndex >= 0 && (
        <motion.div
          className="absolute left-2 top-2 h-12 w-12 rounded-full bg-primary"
          animate={{ x: activeIndex * ITEM_STEP }}
          transition={springTransition}
        />
      )}

      {navItems.map((item, index) => {
        const isActive = index === activeIndex;
        const Icon = item.icon;

        return (
          <Link
            key={item.path}
            to={item.path}
            aria-label={item.label}
            title={item.label}
            className="relative flex h-12 w-12 items-center justify-center rounded-full outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onFocus={() => setHoveredIndex(index)}
            onBlur={() => setHoveredIndex(null)}
          >
            <AnimatePresence>
              {hoveredIndex === index && !isActive && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-black/5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                />
              )}
            </AnimatePresence>
            <Icon
              className={`relative z-10 size-5 transition-colors ${
                isActive ? "text-primary-foreground" : "text-foreground/70"
              }`}
            />
          </Link>
        );
      })}
    </nav>
  );
});

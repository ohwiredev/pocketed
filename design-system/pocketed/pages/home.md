# Home Page Overrides

> **PROJECT:** Pocketed
> **Generated:** 2026-05-09
> **Page Type:** Dashboard / Personal Utility

> ⚠️ **IMPORTANT:** Rules in this file **override** the Master file (`design-system/MASTER.md`).
> Only deviations from the Master are documented here. For all other rules, refer to the Master.

---

## Page-Specific Rules

### Layout Overrides

- **Max Width:** 1200px (standard)
- **Layout:** Masonry grid for main feed.
- **Sections:** 1. Header (Omnibar), 2. AI Filter Chips, 3. Masonry Video Feed.

### Typography & Color Overrides

- Use Master typography and colors. 
- Focus on high contrast for scannability.

### Component Overrides

- **NO Hero Sections:** Do not use large, cinematic auto-playing hero videos.
- **Omnibar:** Search bar must double as a "Paste Link to Save" input.
- **Video Cards:** Must support mixed aspect ratios (vertical/horizontal) using a masonry layout. Must include platform indicators (TikTok, IG, YT).

---

## Recommendations

- Efficiency: Optimize for "Time to First Action". The user should be able to paste a link or search immediately upon loading.
- Layout: Use CSS columns (`columns-1 sm:columns-2 lg:columns-3 xl:columns-4`) for the masonry effect to handle vertical and horizontal video thumbnails elegantly without forced cropping.

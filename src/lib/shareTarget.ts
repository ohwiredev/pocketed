const STORAGE_KEY = "pocketed-pending-share";

export type PendingShare = {
  url: string;
  source: "share_target" | "manual" | "bookmarklet";
  createdAt: string;
};

export function savePendingShare(url: string, source: PendingShare["source"] = "share_target"): void {
  try {
    const pending: PendingShare = {
      url,
      source,
      createdAt: new Date().toISOString(),
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(pending));
  } catch {
    // sessionStorage may be unavailable in some environments
  }
}

export function getPendingShare(): PendingShare | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PendingShare;
  } catch {
    return null;
  }
}

export function clearPendingShare(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // noop
  }
}

export function detectPlatform(url: string): "tiktok" | "instagram" | "youtube" | null {
  if (url.includes("tiktok")) return "tiktok";
  if (url.includes("instagram")) return "instagram";
  if (url.includes("youtube") || url.includes("youtu.be")) return "youtube";
  return null;
}

/** Normalize URLs for consistent duplicate detection */
export function normalizeUrl(url: string): string {
  try {
    const u = new URL(url);
    // Normalize YouTube: youtu.be -> youtube.com/watch
    if (u.hostname === "youtu.be") {
      const vid = u.pathname.slice(1).split("?")[0];
      if (vid) return `https://www.youtube.com/watch?v=${vid}`;
    }
    // Strip tracking/fbclid params from supported platforms
    if (u.hostname.includes("tiktok.com") || u.hostname.includes("instagram.com") || u.hostname.includes("youtube.com")) {
      const clean = new URL(u.origin + u.pathname);
      // Keep only essential params for YouTube
      if (u.hostname.includes("youtube.com")) {
        const v = u.searchParams.get("v");
        if (v) clean.searchParams.set("v", v);
      }
      return clean.toString();
    }
    return u.toString();
  } catch {
    return url;
  }
}

/** Check if the app is running in standalone/PWA mode */
export function isRunningStandalone(): boolean {
  return (window.navigator as Navigator & { standalone?: boolean }).standalone || window.matchMedia("(display-mode: standalone)").matches;
}

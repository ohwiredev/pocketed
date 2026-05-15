const STORAGE_KEY = "pocketed-pending-share";
const SHARED_URL_PATTERN = /https?:\/\/[^\s<>"']+/i;

export type PendingShare = {
  url: string;
  source: "share_target" | "manual" | "bookmarklet";
  createdAt: string;
};

function setStoredPendingShare(value: string): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, value);
  } catch {
    // sessionStorage may be unavailable in some environments
  }

  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // localStorage may be unavailable in some environments
  }
}

function getStoredPendingShare(): string | null {
  try {
    const sessionValue = sessionStorage.getItem(STORAGE_KEY);
    if (sessionValue) return sessionValue;
  } catch {
    // noop
  }

  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function clearStoredPendingShare(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // noop
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // noop
  }
}

export function savePendingShare(
  url: string,
  source: PendingShare["source"] = "share_target",
): void {
  const pending: PendingShare = {
    url,
    source,
    createdAt: new Date().toISOString(),
  };

  setStoredPendingShare(JSON.stringify(pending));
}

export function getPendingShare(): PendingShare | null {
  try {
    const raw = getStoredPendingShare();
    if (!raw) return null;
    return JSON.parse(raw) as PendingShare;
  } catch {
    return null;
  }
}

export function clearPendingShare(): void {
  clearStoredPendingShare();
}

export function detectPlatform(
  url: string,
): "tiktok" | "instagram" | "youtube" | null {
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
    if (
      u.hostname.includes("tiktok.com") ||
      u.hostname.includes("instagram.com") ||
      u.hostname.includes("youtube.com")
    ) {
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

/** Extract the first shareable URL from direct URL input or shared text blobs */
export function extractUrlFromShareInput(input?: string | null): string {
  const trimmedInput = input?.trim();
  if (!trimmedInput) return "";

  const matchedUrl = trimmedInput.match(SHARED_URL_PATTERN)?.[0];
  const candidate = (matchedUrl ?? trimmedInput).replace(/[),.!?]+$/, "");

  return normalizeUrl(candidate);
}

/** Check if the app is running in standalone/PWA mode */
export function isRunningStandalone(): boolean {
  return (
    (window.navigator as Navigator & { standalone?: boolean }).standalone ||
    window.matchMedia("(display-mode: standalone)").matches
  );
}

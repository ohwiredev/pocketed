import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Loader2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import trademark from "@/assets/brand/trademark.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useMeta } from "@/hooks/useMeta";
import { useSaveVideoFlow } from "@/hooks/useSaveVideoFlow";
import { useTitle } from "@/hooks/useTitle";
import {
  clearPendingShare,
  detectPlatform,
  extractUrlFromShareInput,
  getPendingShare,
  isRunningStandalone,
  normalizeUrl,
  savePendingShare,
} from "@/lib/shareTarget";

type SavePageState =
  | "idle"
  | "confirm"
  | "auth-required"
  | "saving"
  | "saved"
  | "error"
  | "duplicate";

const PLATFORM_LABELS: Record<string, string> = {
  tiktok: "TikTok",
  instagram: "Instagram",
  youtube: "YouTube",
};

const LOADING_MESSAGES = [
  "Fetching title and thumbnail...",
  "Adding smart tags...",
  "Saving to your library...",
];

const fadeSlide = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.25, ease: "easeOut" as const },
};

function resolveSharedUrl(searchParams: URLSearchParams): string {
  const fromParams = extractUrlFromShareInput(
    searchParams.get("url") || searchParams.get("text") || "",
  );
  if (fromParams) return fromParams;

  const pending = getPendingShare();
  if (pending?.url) return pending.url;

  // Fallback: try to extract from the full href if the browser appended params there.
  try {
    const href = new URL(window.location.href);
    return extractUrlFromShareInput(
      href.searchParams.get("url") || href.searchParams.get("text") || "",
    );
  } catch {
    return "";
  }
}

export default function SavePage() {
  useTitle("Save to Pocketed");
  useMeta({
    description:
      "Save a video to your Pocketed library from TikTok, Instagram, or YouTube.",
  });

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { session, isInitialized } = useAuth();
  const {
    state: flowState,
    savedVideo,
    tags,
    notes,
    errorMsg,
    save,
    addTag,
    removeTag,
    setNotes,
    updateNotes,
    reset,
  } = useSaveVideoFlow();

  const resolvedSharedUrl = resolveSharedUrl(searchParams);
  const [url, setUrl] = useState(resolvedSharedUrl);
  const [tagInput, setTagInput] = useState("");
  const [pageState, setPageState] = useState<SavePageState>("idle");
  const [loadMsgIdx, setLoadMsgIdx] = useState(0);
  const autoSaveAttempted = useRef<string | null>(null);
  const isSavingRef = useRef(false);

  const platform = url ? detectPlatform(url) : null;
  const platformLabel = platform ? PLATFORM_LABELS[platform] : null;
  const showInstallBanner = !isRunningStandalone() && pageState === "idle";

  // Rotate loading messages during save
  useEffect(() => {
    if (pageState !== "saving") {
      setLoadMsgIdx(0);
      return;
    }
    const interval = setInterval(() => {
      setLoadMsgIdx((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [pageState]);

  // Sync shared URLs from query params or storage into local state.
  useEffect(() => {
    if (!resolvedSharedUrl) return;

    setUrl((currentUrl) => currentUrl || resolvedSharedUrl);
    savePendingShare(resolvedSharedUrl, "share_target");
  }, [resolvedSharedUrl]);

  // Sync flow state to page state
  useEffect(() => {
    if (flowState === "loading") setPageState("saving");
    else if (flowState === "success") {
      // Brief pause so the user sees the saving state resolve
      const t = setTimeout(() => setPageState("saved"), 400);
      return () => clearTimeout(t);
    } else if (flowState === "error") setPageState("error");
    else if (flowState === "duplicate") setPageState("duplicate");
  }, [flowState]);

  // When URL is resolved and auth is ready, show confirm or auth-required
  useEffect(() => {
    if (!isInitialized || !url || pageState !== "idle") return;

    if (session) {
      setPageState("confirm");
    } else {
      setPageState("auth-required");
    }
  }, [isInitialized, session, url, pageState]);

  const handleConfirmSave = () => {
    if (!url.trim() || isSavingRef.current) return;
    isSavingRef.current = true;
    autoSaveAttempted.current = url;
    setPageState("saving");
    save(url).finally(() => { isSavingRef.current = false; });
  };

  const handleManualSave = () => {
    if (!url.trim() || isSavingRef.current) return;
    const normalized = normalizeUrl(url.trim());
    setUrl(normalized);
    savePendingShare(normalized, "manual");
    handleConfirmSave();
  };

  const handleRetry = () => {
    if (isSavingRef.current) return;
    isSavingRef.current = true;
    autoSaveAttempted.current = url;
    setPageState("saving");
    save(url).finally(() => { isSavingRef.current = false; });
  };

  const handleDone = () => {
    clearPendingShare();
    reset();
    if (isRunningStandalone()) {
      window.close();
      return;
    }
    navigate("/home");
  };

  const handleCancel = () => {
    clearPendingShare();
    reset();
    navigate("/home");
  };

  const handleEditLink = () => {
    reset();
    setPageState("idle");
  };

  const fadeProps = { ...fadeSlide, key: pageState };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Top: compact branding */}
      <header className="flex items-center justify-between px-4 py-3">
        <Link to="/" aria-label="go home">
          <img src={trademark} alt="Pocketed" className="h-8 w-auto" />
        </Link>
      </header>

      {/* Install banner for mobile web */}
      {showInstallBanner && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mx-4 mb-2 rounded-lg bg-primary/10 px-4 py-2 text-center text-xs font-medium text-primary"
        >
          Install Pocketed to save straight from TikTok, Instagram, and YouTube
        </motion.div>
      )}

      {/* Middle: state-specific content */}
      <main className="flex flex-1 flex-col items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <AnimatePresence mode="wait">
            <motion.div {...fadeProps} className="space-y-6">
              {/* Idle */}
              {pageState === "idle" && (
                <div className="space-y-4 text-center">
                  <h1 className="text-xl font-semibold">Save a Video</h1>
                  <p className="text-sm text-muted-foreground">
                    Paste a TikTok, Instagram, or YouTube URL
                  </p>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleManualSave();
                    }}
                    className="space-y-4"
                  >
                    <Input
                      placeholder="Paste video URL..."
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="h-12"
                      type="text"
                      inputMode="url"
                      enterKeyHint="go"
                    />
                    <Button
                      type="submit"
                      className="w-full h-12"
                      disabled={!url.trim()}
                    >
                      Save
                    </Button>
                  </form>
                </div>
              )}

              {/* Confirm: URL prefilled from share target, one tap to save */}
              {pageState === "confirm" && (
                <div className="space-y-6 text-center">
                  <div className="space-y-2">
                    <h1 className="text-xl font-semibold">Save this video?</h1>
                    <p className="text-sm text-muted-foreground">
                      We'll fetch the title, thumbnail, and add smart tags
                    </p>
                  </div>

                  <div className="rounded-xl border bg-muted/30 p-3 text-left">
                    {platformLabel && (
                      <p className="text-xs text-muted-foreground mb-1">
                        From {platformLabel}
                      </p>
                    )}
                    <p className="truncate text-sm font-medium">{url}</p>
                  </div>

                  <div className="space-y-3">
                    <Button className="w-full h-12" onClick={handleConfirmSave}>
                      Save to Pocketed
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full h-12 text-muted-foreground"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Auth required */}
              {pageState === "auth-required" && (
                <div className="space-y-6 text-center">
                  <div className="space-y-2">
                    <h1 className="text-xl font-semibold">
                      Sign in to save this video
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      We'll keep your link ready
                    </p>
                  </div>

                  <div className="rounded-xl border bg-muted/30 p-3 text-left">
                    {platformLabel && (
                      <p className="text-xs text-muted-foreground mb-1">
                        From {platformLabel}
                      </p>
                    )}
                    <p className="truncate text-sm font-medium">{url}</p>
                  </div>

                  <div className="space-y-3">
                    <Button
                      className="w-full h-12"
                      onClick={() => navigate(`/login?redirectTo=/save`)}
                    >
                      Sign in
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full h-12"
                      onClick={() => navigate(`/signup?redirectTo=/save`)}
                    >
                      Create account
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full h-12 text-muted-foreground"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Saving */}
              {pageState === "saving" && (
                <div className="space-y-4 text-center py-12">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                  <div className="space-y-1">
                    <p className="font-medium">
                      {platformLabel
                        ? `Saving from ${platformLabel}...`
                        : "Saving this to Pocketed"}
                    </p>
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={loadMsgIdx}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.2 }}
                        className="text-sm text-muted-foreground"
                      >
                        {LOADING_MESSAGES[loadMsgIdx]}
                      </motion.p>
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {/* Saved */}
              {pageState === "saved" && savedVideo && (
                <div className="space-y-6 text-center">
                  <div className="space-y-1">
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                      <h1 className="text-xl font-semibold text-green-600 dark:text-green-400">
                        Saved to Pocketed
                      </h1>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      You can tweak the tags now or do it later
                    </p>
                  </div>

                  <div className="space-y-4 text-left">
                    <div className="flex gap-4 rounded-xl border bg-muted/50 p-3">
                      <div className="h-20 w-16 shrink-0 overflow-hidden rounded bg-black/5">
                        <img
                          src={savedVideo.thumbnailUrl}
                          alt="Thumbnail"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col justify-center">
                        <p className="line-clamp-2 text-sm font-semibold leading-snug">
                          {savedVideo.title}
                        </p>
                        {savedVideo.author && (
                          <p className="mt-1 truncate text-xs text-muted-foreground">
                            @{savedVideo.author} · {savedVideo.platform}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-foreground/60">
                        Tags
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <div
                            key={tag}
                            className="flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground"
                          >
                            <span className="opacity-50">#</span>
                            {tag}
                            <button
                              onClick={() => removeTag(tag)}
                              type="button"
                              className="ml-1 p-1 opacity-50 hover:opacity-100"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          addTag(tagInput);
                          setTagInput("");
                        }}
                      >
                        <Input
                          placeholder="Add a tag and press Enter..."
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          className="h-10 border-dashed bg-transparent text-sm"
                          enterKeyHint="done"
                        />
                      </form>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-foreground/60">
                        Notes (optional)
                      </label>
                      <textarea
                        placeholder="Why did you save this?"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        onBlur={updateNotes}
                        className="w-full min-h-20 resize-none rounded-xl border bg-transparent p-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <Button className="w-full h-12" onClick={handleDone}>
                      Done
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full h-12"
                      onClick={() => {
                        clearPendingShare();
                        reset();
                        navigate("/home");
                      }}
                    >
                      View library
                    </Button>
                  </div>
                </div>
              )}

              {/* Error */}
              {pageState === "error" && (
                <div className="space-y-6 text-center">
                  <div className="space-y-1">
                    <h1 className="text-xl font-semibold text-destructive">
                      We couldn't save that video
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      {errorMsg ||
                        "The link might be private, deleted, or unsupported"}
                    </p>
                  </div>

                  <div className="rounded-xl border bg-muted/30 p-3 text-left">
                    {platformLabel && (
                      <p className="text-xs text-muted-foreground mb-1">
                        From {platformLabel}
                      </p>
                    )}
                    <p className="truncate text-sm font-medium">{url}</p>
                  </div>

                  <div className="space-y-3">
                    <Button className="w-full h-12" onClick={handleRetry}>
                      Try again
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full h-12"
                      onClick={handleEditLink}
                    >
                      Edit link
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full h-12 text-muted-foreground"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Duplicate */}
              {pageState === "duplicate" && (
                <div className="space-y-6 text-center">
                  <div className="space-y-1">
                    <h1 className="text-xl font-semibold">Already saved</h1>
                    <p className="text-sm text-muted-foreground">
                      This video is already in your library
                    </p>
                  </div>

                  {savedVideo && (
                    <div className="flex gap-4 rounded-xl border bg-muted/50 p-3 text-left">
                      <div className="h-20 w-16 shrink-0 overflow-hidden rounded bg-black/5">
                        <img
                          src={savedVideo.thumbnailUrl}
                          alt="Thumbnail"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col justify-center">
                        <p className="line-clamp-2 text-sm font-semibold leading-snug">
                          {savedVideo.title}
                        </p>
                        {savedVideo.author && (
                          <p className="mt-1 truncate text-xs text-muted-foreground">
                            @{savedVideo.author} · {savedVideo.platform}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <Button
                      className="w-full h-12"
                      onClick={() => {
                        clearPendingShare();
                        reset();
                        navigate("/home");
                      }}
                    >
                      Open library
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full h-12 text-muted-foreground"
                      onClick={handleCancel}
                    >
                      Dismiss
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Bottom: subtle footer */}
      <footer className="px-4 py-3 text-center">
        <p className="text-xs text-muted-foreground">
          Pocketed — Your AI-powered video library
        </p>
      </footer>
    </div>
  );
}

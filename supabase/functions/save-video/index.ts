import { createClient } from "@supabase/supabase-js";
import { corsHeaders } from "../_shared/cors.ts";

// ── Helpers ─────────────────────────────────────────────────────────

function getAspectRatio(width: number, height: number): string {
  return height > width ? "vertical" : "horizontal";
}

function normalizeUrl(url: string): string {
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") {
      const vid = u.pathname.slice(1).split("?")[0];
      if (vid) return `https://www.youtube.com/watch?v=${vid}`;
    }
    if (
      u.hostname.includes("tiktok.com") ||
      u.hostname.includes("instagram.com") ||
      u.hostname.includes("youtube.com")
    ) {
      const clean = new URL(u.origin + u.pathname);
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

type Platform = "tiktok" | "instagram" | "youtube";

function detectPlatform(url: string): Platform | null {
  if (url.includes("tiktok")) return "tiktok";
  if (url.includes("instagram")) return "instagram";
  if (url.includes("youtube") || url.includes("youtu.be")) return "youtube";

  return null;
}

function isValidUrl(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

async function getInstagramMetadata(url: string) {
  const response = await fetch(
    `https://api.microlink.io/?url=${encodeURIComponent(url)}`,
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch instagram metadata: ${response.statusText}`,
    );
  }

  const { data } = await response.json();

  const description = data.description || "";
  const afterColon = description.split(": ").slice(1).join(": ");
  const content = afterColon
    .replace(
      /^[\u201c\u201d\u2018\u2019"']+|[\u201c\u201d\u2018\u2019"'.]+$/g,
      "",
    )
    .trim();
  const firstSentence = content.split(/[.!?\n]/)[0].trim();

  return {
    title: firstSentence,
    thumbnail_url: data.image?.url,
    aspect_ratio: getAspectRatio(
      data.image?.width || 0,
      data.image?.height || 0,
    ),
    video_url: url,
    author: data.author,
  };
}

async function getOEmbedMetadata(
  platform: Exclude<Platform, "instagram">,
  url: string,
) {
  const oembedUrls = {
    tiktok: `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`,
    youtube: `https://www.youtube.com/oembed?url=${encodeURIComponent(
      url,
    )}&format=json`,
  };

  const response = await fetch(oembedUrls[platform]);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch ${platform} metadata: ${response.statusText}`,
    );
  }

  return await response.json();
}

// ── Handler ─────────────────────────────────────────────────────────

const SUPABASE_PUBLISHABLE_KEYS = JSON.parse(
  Deno.env.get("SUPABASE_PUBLISHABLE_KEYS")!,
);

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Only accept POST
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  // ── Parse & validate request body ──────────────────────────────

  let url: string;
  let notes: string | undefined;

  try {
    const body = await req.json();
    url = body.url;
    notes = body.notes;
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  if (!url || typeof url !== "string" || !isValidUrl(url)) {
    return new Response(JSON.stringify({ error: "A valid URL is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  // ── Detect platform ────────────────────────────────────────────

  const platform = detectPlatform(url);

  if (!platform) {
    return new Response(JSON.stringify({ error: "Unsupported platform" }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  // ── Fetch metadata ─────────────────────────────────────────────

  let meta;

  try {
    if (platform === "instagram") {
      meta = await getInstagramMetadata(url);
    } else {
      meta = await getOEmbedMetadata(platform, url);
    }
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to fetch metadata";

    console.error("Metadata fetch error:", message);

    return new Response(JSON.stringify({ error: message }), {
      status: 502,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  // ── Save to database ──────────────────────────────────────────

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    SUPABASE_PUBLISHABLE_KEYS.default,
    {
      global: {
        headers: { Authorization: req.headers.get("Authorization")! },
      },
    },
  );

  // ── Normalize URL for consistent duplicate detection ──────────

  const normalizedUrl = normalizeUrl(url);

  // ── Check for existing duplicate ──────────────────────────────

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: existing } = await supabase
      .from("videos")
      .select("*")
      .eq("user_id", user.id)
      .eq("video_url", normalizedUrl)
      .maybeSingle();

    if (existing) {
      console.log("Duplicate video detected for user:", user.id, "url:", normalizedUrl);
      return new Response(
        JSON.stringify({ status: "duplicate", video: existing }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        },
      );
    }
  }

  const { data: video, error } = await supabase
    .from("videos")
    .insert({
      title: meta.title || "Untitled",
      thumbnail_url: meta.thumbnail_url,
      aspect_ratio:
        meta.aspect_ratio ||
        getAspectRatio(
          meta.thumbnail_width || meta.width || 0,
          meta.thumbnail_height || meta.height || 0,
        ),
      video_url: normalizedUrl,
      platform,
      notes: notes || null,
      author: meta.author || meta.author_name || null,
    })
    .select()
    .single();

  if (error) {
    console.error("Supabase error:", JSON.stringify(error));
    return new Response(
      JSON.stringify({
        error: error.message,
        details: error.details,
        hint: error.hint,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    );
  }

  // Invoke auto-tag function synchronously so tags are ready when returning
  // In a production app, a Database Webhook on INSERT to 'videos' is preferred.
  try {
    const { error: tagError } = await supabase.functions.invoke("auto-tag", {
      body: {
        video_id: video.id,
        title: video.title,
        platform: video.platform,
      },
    });

    if (tagError) {
      console.error("Auto-tag invocation failed:", tagError);
    }
  } catch (err) {
    console.error("Failed to trigger auto-tag:", err);
  }

  return new Response(JSON.stringify(video), {
    status: 200,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
});

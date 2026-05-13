import { createClient } from "@supabase/functions-js";

// ── Helpers ─────────────────────────────────────────────────────────

function getAspectRatio(width: number, height: number): string {
  return height > width ? "verticle" : "horizontal";
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
  const content = afterColon.replace(/^[""']|[""']\.*$/g, "").trim();
  const firstSentence = content.match(/^[^.!?]*[.!?]/)?.[0].trim() ?? content;

  return {
    title: firstSentence,
    thumbnail_url: data.image?.url,
    aspect_ratio: getAspectRatio(
      data.image?.width || 0,
      data.image?.height || 0,
    ),
    video_url: url,
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
  // Only accept POST
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
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
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!url || typeof url !== "string" || !isValidUrl(url)) {
    return new Response(JSON.stringify({ error: "A valid URL is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // ── Detect platform ────────────────────────────────────────────

  const platform = detectPlatform(url);

  if (!platform) {
    return new Response(JSON.stringify({ error: "Unsupported platform" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
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
      headers: { "Content-Type": "application/json" },
    });
  }

  // ── Save to database ──────────────────────────────────────────

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    SUPABASE_PUBLISHABLE_KEYS["default"],
    {
      global: {
        headers: { Authorization: req.headers.get("Authorization")! },
      },
    },
  );

  const { data: video, error } = await supabase
    .from("videos")
    .insert({
      title: meta.title || "Untitled",
      thumbnail_url: meta.thumbnail_url,
      aspect_ratio:
        meta.aspect_ratio ||
        getAspectRatio(
          meta.width || meta.thumbnail_width || 0,
          meta.height || meta.thumbnail_height || 0,
        ),
      video_url: url,
      platform,
      notes: notes || null,
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
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  return new Response(JSON.stringify(video), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});

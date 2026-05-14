import { createClient } from "@supabase/supabase-js";
import { corsHeaders } from "../_shared/cors.ts";

// ── Constants ───────────────────────────────────────────────────────

const GEMINI_MODEL = "gemini-3.1-flash-lite";
const GEMINI_API_BASE =
  "https://generativelanguage.googleapis.com/v1beta/models";
const MAX_TAGS = 3;
const MIN_TAGS = 2;

// ── Supabase setup ──────────────────────────────────────────────────

const SUPABASE_PUBLISHABLE_KEYS = JSON.parse(
  Deno.env.get("SUPABASE_PUBLISHABLE_KEYS")!,
);

// ── Helpers ─────────────────────────────────────────────────────────

function jsonResponse(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

/**
 * Calls Gemini 2.5 Flash with structured JSON output to generate tags
 * for a video based on its title and platform.
 */
async function generateTags(
  title: string,
  platform: string,
): Promise<string[]> {
  const apiKey = Deno.env.get("GEMINI_API_KEY");

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const url = `${GEMINI_API_BASE}/${GEMINI_MODEL}:generateContent`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are tagging a saved video for a personal library app.
Video title: "${title}"
Platform: ${platform || "unknown"}

Return ${MIN_TAGS}-${MAX_TAGS} short lowercase tags that describe this video.
Mix of: topic, subtopic, mood or style, and useful search keywords. Do not include any platform names like TikTok, Instagram, YouTube.
Example: ["fitness", "upper body", "no equipment", "beginner", "home workout"]`,
            },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "ARRAY",
          items: { type: "STRING" },
        },
        temperature: 0.3,
      },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();

    console.error("Gemini API error:", response.status, errorBody);
    throw new Error(`Gemini API returned ${response.status}`);
  }

  const data = await response.json();

  // Gemini returns { candidates: [{ content: { parts: [{ text }] } }] }
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    console.error("Unexpected Gemini response shape:", JSON.stringify(data));
    throw new Error("No content in Gemini response");
  }

  const parsed: unknown = JSON.parse(text);

  if (!Array.isArray(parsed)) {
    throw new Error("Gemini response is not an array");
  }

  // Sanitise: lowercase, trim, deduplicate, enforce limits
  const tags = [
    ...new Set(
      (parsed as string[])
        .map((t) => String(t).trim().toLowerCase())
        .filter((t) => t.length > 0 && t.length <= 50),
    ),
  ].slice(0, MAX_TAGS);

  if (tags.length < 1) {
    throw new Error("Gemini returned no valid tags");
  }

  return tags;
}

// ── Handler ─────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Only accept POST
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  try {
    // ── Parse & validate input ────────────────────────────────────
    let body: Record<string, unknown>;

    try {
      body = await req.json();
    } catch {
      return jsonResponse({ error: "Invalid JSON body" }, 400);
    }

    const video_id = body.video_id as string | undefined;
    const title = body.title as string | undefined;
    const platform = body.platform as string | undefined;

    if (!video_id || typeof video_id !== "string") {
      return jsonResponse({ error: "Missing or invalid video_id" }, 400);
    }
    if (!title || typeof title !== "string") {
      return jsonResponse({ error: "Missing or invalid title" }, 400);
    }

    // ── Generate tags via Gemini ──────────────────────────────────
    const tags = await generateTags(title, platform || "unknown");

    // ── Persist tags in database ─────────────────────────────────
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const publishableKey = SUPABASE_PUBLISHABLE_KEYS?.default;

    if (!supabaseUrl || !publishableKey) {
      console.error("Missing Supabase environment variables");
      throw new Error("Server misconfiguration");
    }

    const supabase = createClient(supabaseUrl, publishableKey, {
      global: {
        headers: { Authorization: req.headers.get("Authorization")! },
      },
    });

    const tagRows = tags.map((label) => ({ video_id, label }));
    const { error: insertError } = await supabase.from("tags").insert(tagRows);

    if (insertError) {
      console.error("Supabase insert error:", JSON.stringify(insertError));
      throw new Error(insertError.message);
    }

    return jsonResponse({ tags });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Internal server error";

    console.error("auto-tag error:", message);
    return jsonResponse({ error: message }, 500);
  }
});

tsimport { serve } from '[https://deno.land/std/http/server.ts](https://deno.land/std/http/server.ts)'

serve(async (req) => {
  const { video_id, title } = await req.json()

  const response = await fetch('[https://api.anthropic.com/v1/messages](https://api.anthropic.com/v1/messages)', {
    method: 'POST',
    headers: {
      'x-api-key': Deno.env.get('CLAUDE_API_KEY'),
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 200,
      messages: [{
        role: 'user',
        content: `A user saved a video titled: "${title}".
Return a JSON object only with:

- category: one word (fitness/travel/cooking/comedy/learning/music/other)
- mood: one or two words (e.g. "motivating", "relaxing")
- tags: array of 3-5 short searchable keywords
No explanation, JSON only.`
}]
})
})
const data = await response.json()
const parsed = JSON.parse(data.content[0].text)
// Insert tags
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)
const tagRows = [parsed.category, parsed.mood, ...parsed.tags]
  .map(label => ({ video_id, label }))
await supabase.from('tags').insert(tagRows)
return new Response('ok', { status: 200 })
})

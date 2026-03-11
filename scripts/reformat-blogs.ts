/**
 * reformat-blogs.ts
 * Uses Claude AI to intelligently reformat blog posts from flat wall-of-text
 * (imported from Webflow) into proper Portable Text structure.
 *
 * Requires ANTHROPIC_API_KEY in .env.local
 *
 * Usage:
 *   npx tsx scripts/reformat-blogs.ts --dry-run         # preview, no saves
 *   npx tsx scripts/reformat-blogs.ts --id blog-xxxxx   # one post (verbose)
 *   npx tsx scripts/reformat-blogs.ts                   # process all posts
 */

import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@sanity/client'
import { jsonrepair } from 'jsonrepair'
import * as dotenv from 'dotenv'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '../.env.local') })

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_API_TOKEN!,
  apiVersion: '2024-07-11',
  useCdn: false,
})

// ─── Types ──────────────────────────────────────────────────────────────────

type PTSpan = { _type: 'span'; _key: string; text: string; marks: string[] }
type PTBlock = {
  _type: 'block'
  _key: string
  style: 'normal' | 'h2' | 'h3' | 'h4' | 'blockquote'
  children: PTSpan[]
  markDefs: []
  listItem?: 'bullet' | 'number'
  level?: number
}

// ─── Key generator ───────────────────────────────────────────────────────────

let _ki = 0
const nk = () => `rk${(++_ki).toString(36)}`

function makeBlock(
  style: PTBlock['style'],
  text: string,
  listItem?: 'bullet' | 'number',
  level = 1,
): PTBlock {
  const b: PTBlock = {
    _type: 'block',
    _key: nk(),
    style,
    children: [{ _type: 'span', _key: nk(), text: text.trim(), marks: [] }],
    markDefs: [],
  }
  if (listItem) { b.listItem = listItem; b.level = level }
  return b
}

// ─── AI reformatter ──────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are a content formatter. You receive raw blog post text that was exported from Webflow where all HTML structure (headings, paragraphs, lists, tables) was stripped and concatenated into a single wall of text.

Your job is to reconstruct the original document structure and return it as a JSON array of Portable Text blocks.

## Output format

Return ONLY a valid JSON array. No markdown, no explanation, just the JSON.

Each element must be one of:

**Paragraph:**
{"style":"normal","text":"paragraph text here"}

**H2 section heading:**
{"style":"h2","text":"Heading Text"}

**H3 sub-heading:**
{"style":"h3","text":"Sub-heading Text"}

**H4 minor heading:**
{"style":"h4","text":"Minor heading"}

**Bullet list item:**
{"style":"normal","listItem":"bullet","text":"bullet item text"}

**Numbered list item:**
{"style":"normal","listItem":"number","text":"numbered item text"}

**Blockquote:**
{"style":"blockquote","text":"quote text"}

**Table** (use for any comparison/feature matrix data — the first row is always the header):
{"_type":"table","rows":[{"cells":["Header 1","Header 2","Header 3"]},{"cells":["Row 1 Col 1","Row 1 Col 2","Row 1 Col 3"]},{"cells":["Row 2 Col 1","Row 2 Col 2","Row 2 Col 3"]}]}

## Rules

1. Remove the "Estimated reading time: X minutes" prefix if present — it's auto-calculated on the site.
2. Identify section headings — they are typically short phrases (2–8 words) that appear without a period, embedded directly before longer paragraph text. H2 for major sections, H3 for sub-sections.
3. Identify bullet/numbered lists — patterns like "Label: Description" repeated multiple times, or items clearly in sequence.
4. For "Key Takeaways" sections: make "Key Takeaways" an H2 and each takeaway a bullet item.
5. For "Frequently Asked Questions" sections: make "Frequently Asked Questions" an H2, each question an H3, and each answer a normal paragraph.
6. IMPORTANT — Tables: Any content that lists features/comparisons across multiple options with emoji indicators (✅ ❌ ⚠️) or structured rows like "Feature | Option A | Option B" MUST be converted to a table block. Common patterns that were originally tables:
   - "Feature ✅ Option A description ❌ Option B description" repeated for multiple features
   - Comparison matrices with columns like "Feature | Apple Watch | Medical Alert"
   - Cost/pricing breakdowns with multiple columns
   - Pro/con comparisons across multiple products
   The first row of every table must be a header row with column names. Include the emoji (✅ ❌ ⚠️) in the cell text where relevant.
7. Keep paragraph text intact — do not summarise or rewrite content. Only re-structure it.
8. "Why Holo Alert" / CTA paragraphs near the end should remain as normal paragraphs.
9. Each paragraph should be a reasonable length (2–5 sentences). Split very long paragraphs at natural sentence boundaries.
10. Do NOT include the blog post title as an H1 or H2 — it is already shown as the page title.`

async function reformatWithAI(rawText: string, postTitle: string): Promise<PTBlock[]> {
  const userMessage = `Blog post title: "${postTitle}"

Raw text to reformat:
---
${rawText.slice(0, 12000)}${rawText.length > 12000 ? '\n[text truncated for length]' : ''}
---

Return the JSON array of Portable Text blocks.`

  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 16000,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMessage }],
  })

  const content = response.content[0]
  if (content.type !== 'text') throw new Error('Unexpected response type')

  // Extract JSON from the response (in case Claude wraps it in markdown)
  let jsonText = content.text
    .replace(/^```(?:json)?\n?/, '')
    .replace(/\n?```$/, '')
    .trim()

  // If the JSON array was truncated, close it off so it's parseable
  if (!jsonText.endsWith(']')) {
    // Remove any incomplete trailing object and close the array
    const lastComplete = jsonText.lastIndexOf('},')
    if (lastComplete !== -1) jsonText = jsonText.slice(0, lastComplete + 1) + ']'
    else jsonText = jsonText + ']'
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let parsed: Array<any>
  try {
    parsed = JSON.parse(jsonText)
  } catch {
    try {
      // jsonrepair handles unescaped quotes, truncated arrays, trailing commas, etc.
      parsed = JSON.parse(jsonrepair(jsonText))
    } catch {
      throw new Error(`Failed to parse AI response as JSON: ${jsonText.slice(0, 200)}`)
    }
  }

  if (!Array.isArray(parsed)) throw new Error('AI response is not an array')

  // Convert to Portable Text blocks with proper keys
  return parsed.map((item) => {
    // Table block
    if (item._type === 'table' && Array.isArray(item.rows)) {
      return {
        _type: 'table',
        _key: nk(),
        rows: item.rows.map((row: { cells: string[] }) => ({
          _type: 'row',
          _key: nk(),
          cells: Array.isArray(row.cells) ? row.cells : [],
        })),
      }
    }
    // Regular Portable Text block
    const style = (['normal', 'h2', 'h3', 'h4', 'blockquote'].includes(item.style)
      ? item.style
      : 'normal') as PTBlock['style']
    return makeBlock(
      style,
      item.text ?? '',
      item.listItem === 'bullet' ? 'bullet' : item.listItem === 'number' ? 'number' : undefined,
    )
  })
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2)
  const isDryRun = args.includes('--dry-run')
  const singleId =
    args.find((a) => a.startsWith('--id='))?.split('=')[1] ??
    (args.includes('--id') ? args[args.indexOf('--id') + 1] : null)
  const verbose = Boolean(singleId) || args.includes('--verbose')

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('❌  ANTHROPIC_API_KEY not set in .env.local')
    process.exit(1)
  }

  console.log(`\n🤖  AI Blog Reformatter`)
  console.log(`    Project : ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}`)
  console.log(`    Dataset : ${process.env.NEXT_PUBLIC_SANITY_DATASET}`)
  console.log(`    Model   : claude-sonnet-4-6`)
  console.log(`    Mode    : ${isDryRun ? 'DRY RUN (no changes saved)' : 'LIVE'}`)
  if (singleId) console.log(`    Post    : ${singleId}`)
  console.log()

  type SanityPost = { _id: string; title: string; body: { children: { text: string }[] }[] }
  let posts: SanityPost[] = []

  if (singleId) {
    const post = await sanity.fetch<SanityPost>(
      `*[_type == "blogPost" && _id == $id][0]{ _id, title, body }`,
      { id: singleId },
    )
    if (!post) { console.error(`❌ Not found: ${singleId}`); process.exit(1) }
    posts = [post]
  } else {
    let offset = 0
    while (true) {
      const batch = await sanity.fetch<SanityPost[]>(
        `*[_type == "blogPost"] | order(_createdAt asc) [$s...$e]{ _id, title, body }`,
        { s: offset, e: offset + 50 },
      )
      if (!batch?.length) break
      posts.push(...batch)
      if (batch.length < 50) break
      offset += 50
    }
  }

  console.log(`📚  Found ${posts.length} post(s)\n`)

  let ok = 0, skip = 0, fail = 0

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i]
    const rawText = post.body?.[0]?.children?.[0]?.text
    if (!rawText) {
      console.log(`⚠️  [${i + 1}/${posts.length}] SKIP  "${post.title}" — no raw text`)
      skip++; continue
    }
    // Skip posts already structured (> 1 block) unless targeting a specific post
    if (!singleId && post.body?.length > 1) {
      console.log(`✓   [${i + 1}/${posts.length}] SKIP  "${post.title}" — already ${post.body.length} blocks`)
      skip++; continue
    }

    console.log(`📝  [${i + 1}/${posts.length}] "${post.title}"`)

    try {
      const newBody = await reformatWithAI(rawText, post.title)
      const anyBody = newBody as any[]
      const h2s = anyBody.filter((b) => b.style === 'h2').length
      const h3s = anyBody.filter((b) => b.style === 'h3').length
      const bullets = anyBody.filter((b) => b.listItem).length
      const tables = anyBody.filter((b) => b._type === 'table').length
      console.log(`    → ${newBody.length} blocks  (${h2s} H2, ${h3s} H3, ${bullets} list items, ${tables} tables)`)

      if (verbose) {
        for (const b of newBody as any[]) {
          if (b._type === 'table') {
            console.log(`      [table]   ${b.rows?.length ?? 0} rows × ${b.rows?.[0]?.cells?.length ?? 0} cols`)
            continue
          }
          const tag = b.listItem ? `[${b.listItem}]` : `[${b.style}]`
          const snippet = (b.children?.[0]?.text ?? '').slice(0, 95)
          console.log(`      ${tag.padEnd(9)} ${snippet}${snippet.length === 95 ? '…' : ''}`)
        }
      }

      if (!isDryRun) {
        await sanity.patch(post._id).set({ body: newBody }).commit()
        console.log(`    ✅ Saved`)
      }
      ok++
    } catch (err) {
      console.error(`    ❌ ERROR: ${err}`)
      fail++
    }

    console.log()

    // Small delay between posts to avoid rate limits
    if (i < posts.length - 1 && !isDryRun) {
      await new Promise((r) => setTimeout(r, 500))
    }
  }

  console.log('─'.repeat(55))
  console.log(`✅  Done — ${ok} processed, ${skip} skipped, ${fail} failed`)
  if (isDryRun) console.log('\n⚠️  DRY RUN — no changes saved. Drop --dry-run to apply.')
}

main().catch((err) => { console.error(err); process.exit(1) })

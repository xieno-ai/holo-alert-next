/**
 * Webflow → Sanity Migration Script
 * Phase 3 Plan 03 — One-time import of all CMS content
 *
 * Covers: blogPost (341), device (3 published), testimonial (27),
 *         faq (24), promo (12), siteSettings (1 seed)
 *
 * Run: npm run migrate
 * Uses: createOrReplace (idempotent — safe to re-run)
 */

import fs from 'fs'
import path from 'path'
// Load .env.local (Next.js convention — dotenv/config only loads .env)
import dotenv from 'dotenv'
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
import { createClient } from '@sanity/client'
import { parse as csvParse } from 'csv-parse/sync'
import { htmlToBlocks } from '@portabletext/block-tools'
import { JSDOM } from 'jsdom'

// ---------------------------------------------------------------------------
// Config & client
// ---------------------------------------------------------------------------

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2024-07-11',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

// Paths relative to project root (holo-alert-next/)
const DELIVERABLES = path.resolve(
  __dirname,
  '../../.planning/phases/01-migration-audit/deliverables',
)
const ERROR_LOG = path.resolve(__dirname, '../migration-errors.log')
const RUN_LOG = path.resolve(__dirname, '../migration-run.log')

// Type for Sanity documents passed to createOrReplace
type SanityDoc = { _id: string; _type: string; [key: string]: unknown }

// Counters
let totalDocs = 0
let totalImages = 0
let totalErrors = 0

// ---------------------------------------------------------------------------
// Logging helpers
// ---------------------------------------------------------------------------

function log(msg: string) {
  console.log(msg)
  fs.appendFileSync(RUN_LOG, msg + '\n')
}

function logError(id: string, detail: string) {
  const line = `[${id}] ${detail}\n`
  fs.appendFileSync(ERROR_LOG, line)
  totalErrors++
}

// ---------------------------------------------------------------------------
// Semaphore for concurrent image uploads (max 5 at a time)
// ---------------------------------------------------------------------------

class Semaphore {
  private current = 0
  private queue: Array<() => void> = []

  constructor(private max: number) {}

  async acquire(): Promise<void> {
    if (this.current < this.max) {
      this.current++
      return
    }
    return new Promise((resolve) => {
      this.queue.push(() => {
        this.current++
        resolve()
      })
    })
  }

  release() {
    this.current--
    const next = this.queue.shift()
    if (next) next()
  }
}

const imgSemaphore = new Semaphore(5)

// ---------------------------------------------------------------------------
// Image upload helper
// ---------------------------------------------------------------------------

interface SanityAsset {
  _id: string
}

async function uploadImage(url: string, filename: string): Promise<SanityAsset> {
  await imgSemaphore.acquire()
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 30000) // 30s timeout
    let response: Response
    try {
      response = await fetch(url, {
        headers: { 'User-Agent': 'HoloAlert-Migration/1.0' },
        signal: controller.signal,
      })
    } finally {
      clearTimeout(timeout)
    }
    if (!response!.ok) {
      throw new Error(`HTTP ${response!.status} for ${url}`)
    }
    const buffer = Buffer.from(await response!.arrayBuffer())
    const asset = await client.assets.upload('image', buffer, {
      filename,
      contentType: response.headers.get('content-type') ?? 'image/jpeg',
    })
    totalImages++
    return asset
  } finally {
    imgSemaphore.release()
  }
}

// Build a Sanity image reference from an asset
function imageRef(asset: SanityAsset, alt?: string) {
  const ref: Record<string, unknown> = {
    _type: 'image',
    asset: { _type: 'reference', _ref: asset._id },
  }
  if (alt) ref.alt = alt
  return ref
}

// Try to upload, log on failure, return undefined
async function tryUploadImage(
  url: string,
  filename: string,
  docId: string,
  label: string,
): Promise<SanityAsset | undefined> {
  if (!url || !url.trim()) return undefined
  try {
    const asset = await uploadImage(url.trim(), filename)
    return asset
  } catch (err) {
    logError(docId, `image fail [${label}]: ${err}`)
    return undefined
  }
}

// ---------------------------------------------------------------------------
// HTML → Portable Text helper
// ---------------------------------------------------------------------------

let _keyCounter = 0
function uniqueKey(prefix = 'k'): string {
  return `${prefix}${(++_keyCounter).toString(36)}`
}

// Ensure every block and span in a Portable Text array has a _key
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function addKeys(blocks: any[]): any[] {
  return blocks.map((block) => {
    if (!block._key) block._key = uniqueKey('b')
    if (Array.isArray(block.children)) {
      block.children = block.children.map((child: Record<string, unknown>) => {
        if (!child._key) child._key = uniqueKey('s')
        return child
      })
    }
    return block
  })
}

function htmlToPortableText(html: string): unknown[] {
  if (!html || !html.trim()) return []

  // Pre-process: strip zero-width joiners, empty id="" attributes, style="" attributes
  let cleaned = html
    .replace(/\u200d/g, '') // zero-width joiner
    .replace(/\u200b/g, '') // zero-width space
    .replace(/\s+id=""/g, '') // empty id attributes
    .replace(/\s+style="[^"]*"/g, '') // style attributes

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const blocks = htmlToBlocks(cleaned, {} as any, {
      parseHtml: (html: string) => new JSDOM(html).window.document,
    })
    return addKeys(blocks)
  } catch (err) {
    // Return a simple paragraph if conversion fails
    const stripped = cleaned.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
    return [
      {
        _key: uniqueKey('b'),
        _type: 'block',
        style: 'normal',
        children: [{ _key: uniqueKey('s'), _type: 'span', text: stripped }],
        markDefs: [],
      },
    ]
  }
}

// Strip HTML tags to plain text
function stripHtml(html: string): string {
  if (!html) return ''
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

// Parse price string like "64.95" or "$64.95" to number
function parsePrice(val: string): number | undefined {
  if (!val || !val.trim()) return undefined
  const num = parseFloat(val.replace(/[^0-9.]/g, ''))
  return isNaN(num) ? undefined : num
}

// Read CSV file and return parsed rows
function readCsv(filename: string): Record<string, string>[] {
  const fullPath = path.join(DELIVERABLES, filename)
  const content = fs.readFileSync(fullPath, 'utf-8')
  return csvParse(content, {
    columns: true,
    skip_empty_lines: true,
    relax_quotes: true,
    relax_column_count: true,
  }) as Record<string, string>[]
}

// ---------------------------------------------------------------------------
// 1. siteSettings seed
// ---------------------------------------------------------------------------

async function migrateSiteSettings() {
  log('\n=== [1/6] siteSettings seed ===')

  await client.createOrReplace({
    _id: 'siteSettings',
    _type: 'siteSettings',
    siteTitle: 'Holo Alert',
    phoneNumber: '1-844-465-6888',
  })

  totalDocs++
  log('  Created siteSettings document')
}

// ---------------------------------------------------------------------------
// 2. FAQs (from JSON)
// ---------------------------------------------------------------------------

interface FaqEntry {
  question: string
  answer: string
  pages: string[]
  category: string
  sortOrder: number
}

async function migrateFaqs() {
  log('\n=== [2/6] FAQs ===')

  const fullPath = path.join(DELIVERABLES, '02-faqs-extracted.json')
  const raw = JSON.parse(fs.readFileSync(fullPath, 'utf-8'))
  const faqs: FaqEntry[] = raw.faqs

  for (let i = 0; i < faqs.length; i++) {
    const faq = faqs[i]
    const _id = `faq-${i}`

    await client.createOrReplace({
      _id,
      _type: 'faq',
      question: faq.question,
      answer: faq.answer,
      pages: faq.pages ?? [],
      category: faq.category ?? 'general',
      sortOrder: faq.sortOrder ?? i + 1,
    })

    totalDocs++
  }

  log(`  Imported ${faqs.length} FAQ documents`)
}

// ---------------------------------------------------------------------------
// 3. Testimonials (from CSV)
// ---------------------------------------------------------------------------

async function migrateTestimonials() {
  log('\n=== [3/6] Testimonials ===')

  const rows = readCsv('02-cms-export-testimonials.csv')
  let count = 0

  for (const row of rows) {
    const webflowId = row['Item ID']?.trim()
    if (!webflowId) continue

    const _id = `testimonial-${webflowId}`

    // Parse date (format: "Mon Dec 09 2024 00:00:00 GMT+0000 ...")
    let dateVal: string | undefined
    if (row['Date'] && row['Date'].trim()) {
      try {
        const d = new Date(row['Date'])
        if (!isNaN(d.getTime())) {
          dateVal = d.toISOString().split('T')[0] // YYYY-MM-DD
        }
      } catch {
        // skip
      }
    }

    const rating = parseInt(row['Rating'] ?? '5', 10)

    await client.createOrReplace({
      _id,
      _type: 'testimonial',
      name: row['Name']?.trim() ?? '',
      slug: { _type: 'slug', current: row['Slug']?.trim() ?? '' },
      body: row['Review']?.trim() ?? '',
      location: row['Location']?.trim() ?? '',
      productSlug: row['Purchased product']?.trim() ?? '',
      rating: isNaN(rating) ? 5 : rating,
      date: dateVal,
      isApproved: true,
      webflowId,
    })

    totalDocs++
    count++
  }

  log(`  Imported ${count} testimonial documents`)
}

// ---------------------------------------------------------------------------
// 4. Promotions (from CSV)
// ---------------------------------------------------------------------------

async function migratePromos() {
  log('\n=== [4/6] Promotions ===')

  const rows = readCsv('02-cms-export-promotions.csv')
  let count = 0

  for (const row of rows) {
    const webflowId = row['Item ID']?.trim()
    if (!webflowId) continue

    const _id = `promo-${webflowId}`

    // Webflow "Active" field maps to isActive — treat all migrated promos as inactive by default
    // (promo.isActive defaults false per schema design decision [03-02])
    const isActiveRaw = row['Active']?.trim().toLowerCase()
    const isActive = isActiveRaw === 'true'

    await client.createOrReplace({
      _id,
      _type: 'promo',
      title: row['Month Name']?.trim() ?? row['Name']?.trim() ?? '',
      body: row['Promo Description']?.trim() ?? '',
      ctaText: row['Ending Button']?.trim() ?? '',
      ctaUrl: undefined,
      isActive: false, // Always false on import — editors activate manually
      targetPages: ['homepage'],
    })

    totalDocs++
    count++
  }

  log(`  Imported ${count} promo documents`)
}

// ---------------------------------------------------------------------------
// 5. Devices (from CSV — only published)
// ---------------------------------------------------------------------------

async function migrateDevices() {
  log('\n=== [5/6] Devices ===')

  const rows = readCsv('02-cms-export-devices.csv')

  // Filter: only published (Draft=false, Archived=false)
  const published = rows.filter(
    (r) => r['Draft']?.trim() === 'false' && r['Archived']?.trim() === 'false',
  )

  log(`  Total rows: ${rows.length}, published: ${published.length}`)

  for (const row of published) {
    const webflowId = row['Item ID']?.trim()
    if (!webflowId) continue

    const _id = `device-${webflowId}`
    const name = row['Name']?.trim() ?? ''

    // Fix slug: strip leading "the-" for consistency
    let slugCurrent = row['Slug']?.trim() ?? ''
    if (slugCurrent === 'the-holo-mini') slugCurrent = 'holo-mini'

    log(`  Processing device: ${name} (slug: ${slugCurrent})`)

    // --- Main image ---
    let mainImageDoc: Record<string, unknown> | undefined
    if (row['Hero Product Image']?.trim()) {
      const asset = await tryUploadImage(
        row['Hero Product Image'],
        `${slugCurrent}-hero.jpg`,
        _id,
        'Hero Product Image',
      )
      if (asset) mainImageDoc = imageRef(asset, `${name} hero image`)
    }

    // --- Features image ---
    let featuresImageDoc: Record<string, unknown> | undefined
    if (row['Device Features Image']?.trim()) {
      const asset = await tryUploadImage(
        row['Device Features Image'],
        `${slugCurrent}-features.jpg`,
        _id,
        'Device Features Image',
      )
      if (asset) featuresImageDoc = imageRef(asset, `${name} features image`)
    }

    // --- Pricing card image ---
    let pricingCardImageDoc: Record<string, unknown> | undefined
    if (row['Product Image - Pricing Card']?.trim()) {
      const asset = await tryUploadImage(
        row['Product Image - Pricing Card'],
        `${slugCurrent}-pricing-card.jpg`,
        _id,
        'Pricing Card Image',
      )
      if (asset) pricingCardImageDoc = imageRef(asset, `${name} pricing card image`)
    }

    // --- Video thumbnail ---
    let videoThumbnailDoc: Record<string, unknown> | undefined
    if (row['Video Thumbnail Image']?.trim()) {
      const asset = await tryUploadImage(
        row['Video Thumbnail Image'],
        `${slugCurrent}-video-thumb.jpg`,
        _id,
        'Video Thumbnail',
      )
      if (asset) videoThumbnailDoc = imageRef(asset, `${name} video thumbnail`)
    }

    // --- How it Works: upload step images ---
    const howItWorksSteps: Record<string, unknown>[] = []
    for (let i = 1; i <= 3; i++) {
      const content = row[`How it Works Content Step ${i}`]?.trim()
      const imageUrl = row[`How it Works Image Step ${i}`]?.trim()

      if (content || imageUrl) {
        let stepImageDoc: Record<string, unknown> | undefined
        if (imageUrl) {
          const asset = await tryUploadImage(
            imageUrl,
            `${slugCurrent}-how-${i}.jpg`,
            _id,
            `How it Works Step ${i}`,
          )
          if (asset) stepImageDoc = imageRef(asset, `${name} how it works step ${i}`)
        }
        const step: Record<string, unknown> = {
          _type: 'step',
          _key: `step-${i}`,
          content: content ?? '',
        }
        if (stepImageDoc) step.image = stepImageDoc
        howItWorksSteps.push(step)
      }
    }

    // --- Accessories ---
    const accessories: Record<string, unknown>[] = []
    for (let i = 1; i <= 5; i++) {
      const accName = row[`Accessory Name ${i}`]?.trim()
      const accImageUrl = row[`Accessory Image ${i}`]?.trim()

      if (accName) {
        let accImageDoc: Record<string, unknown> | undefined
        if (accImageUrl) {
          const asset = await tryUploadImage(
            accImageUrl,
            `${slugCurrent}-accessory-${i}.jpg`,
            _id,
            `Accessory ${i} Image`,
          )
          if (asset) accImageDoc = imageRef(asset, accName)
        }
        const acc: Record<string, unknown> = {
          _type: 'accessory',
          _key: `acc-${i}`,
          name: accName,
        }
        if (accImageDoc) acc.image = accImageDoc
        accessories.push(acc)
      }
    }

    // --- Specs ---
    const specLabels = ['Height', 'Width', 'Weight', 'Connectivity', 'Emergency Mode']
    const specs = specLabels
      .map((label, idx) => ({
        _type: 'spec',
        _key: `spec-${idx + 1}`,
        label,
        value: row[`Product Specs #${idx + 1}`]?.trim() ?? '',
      }))
      .filter((s) => s.value)

    // --- Features (4 title+content pairs) ---
    const features: Record<string, unknown>[] = []
    for (let i = 1; i <= 4; i++) {
      const title = row[`Devices Features Title ${i}`]?.trim()
      const content = row[`Devices Features Content ${i}`]?.trim()
      if (title || content) {
        features.push({
          _type: 'feature',
          _key: `feat-${i}`,
          title: title ?? '',
          content: content ?? '',
        })
      }
    }

    // --- Pricing card benefits (5 separate columns, strip HTML) ---
    const pricingCardBenefits: string[] = []
    for (let i = 1; i <= 5; i++) {
      const val = row[`Benefit ${i} - Pricing Card`]?.trim()
      if (val) {
        const stripped = stripHtml(val)
        if (stripped) pricingCardBenefits.push(stripped)
      }
    }

    // --- Description → Portable Text ---
    const descriptionHtml = row['Description']?.trim() ?? ''
    const description = descriptionHtml ? htmlToPortableText(descriptionHtml) : []

    // --- Parse prices ---
    const devicePrice = parsePrice(row['Device Price'])
    const reducedDevicePrice = parsePrice(row['Reduced Device Price'])

    // --- Video URL ---
    const videoUrl = row['Video Lightbox Link']?.trim() ?? undefined

    // --- Pricing card order ---
    const pricingCardOrderRaw = parseInt(row['(pricing card) order'] ?? '', 10)
    const pricingCardOrder = isNaN(pricingCardOrderRaw) ? undefined : pricingCardOrderRaw

    // --- Compose document (stripePriceId fields intentionally omitted) ---
    const doc: SanityDoc = {
      _id,
      _type: 'device',
      name,
      slug: { _type: 'slug', current: slugCurrent },
      description,
      devicePrice,
      reducedDevicePrice,
      monthlyPriceDisplay: row['Monthly Price Display']?.trim() ?? undefined,
      annualPriceDisplay: row['Annual Price Display']?.trim() ?? undefined,
      specs,
      features,
      howItWorksSteps,
      accessories,
      pricingCardSubhead: row['Subhead - Pricing Card']?.trim() ?? undefined,
      pricingCardSubscription: row['(pricing card) subscription']?.trim() ?? undefined,
      pricingCardOrder,
      pricingCardBenefits,
      fallAlertDisclaimer: row['Fall Alert Disclaimer']?.trim() ?? undefined,
      videoUrl: videoUrl || undefined,
      isActive: true,
      webflowId,
    }

    if (mainImageDoc) doc.mainImage = mainImageDoc
    if (featuresImageDoc) doc.featuresImage = featuresImageDoc
    if (pricingCardImageDoc) doc.pricingCardImage = pricingCardImageDoc
    if (videoThumbnailDoc) doc.videoThumbnail = videoThumbnailDoc

    await client.createOrReplace(doc)
    totalDocs++
    log(`  Device "${name}" imported (${_id})`)
  }

  log(`  Imported ${published.length} device documents`)
}

// ---------------------------------------------------------------------------
// 6. Blog posts (from CSV — batched in transactions of 50)
// ---------------------------------------------------------------------------

const BATCH_SIZE = 50

async function migrateBlogPosts() {
  log('\n=== [6/6] Blog posts ===')

  const rows = readCsv('02-cms-export-blog.csv')
  log(`  Total blog post rows: ${rows.length}`)

  const totalBatches = Math.ceil(rows.length / BATCH_SIZE)

  for (let batchIdx = 0; batchIdx < totalBatches; batchIdx++) {
    const batchRows = rows.slice(batchIdx * BATCH_SIZE, (batchIdx + 1) * BATCH_SIZE)

    // Upload images concurrently within a batch
    const docs = await Promise.all(
      batchRows.map(async (row) => {
        const webflowId = row['Item ID']?.trim()
        if (!webflowId) return null

        const _id = `blog-${webflowId}`
        const title = row['Name']?.trim() ?? ''
        const slugCurrent = row['Slug']?.trim() ?? ''

        // mainImage
        let mainImageDoc: Record<string, unknown> | undefined
        const mainImageUrl = row['Main image']?.trim()
        if (mainImageUrl) {
          const asset = await tryUploadImage(
            mainImageUrl,
            `blog-${slugCurrent}-main.jpg`,
            _id,
            'Main image',
          )
          if (asset) mainImageDoc = imageRef(asset, title)
        }

        // heroImage
        let heroImageDoc: Record<string, unknown> | undefined
        const heroImageUrl = row['Hero Image']?.trim()
        if (heroImageUrl) {
          const asset = await tryUploadImage(
            heroImageUrl,
            `blog-${slugCurrent}-hero.jpg`,
            _id,
            'Hero Image',
          )
          if (asset) heroImageDoc = imageRef(asset, title)
        }

        // body — HTML → Portable Text
        const bodyHtml = row['Main text']?.trim() ?? ''
        const body = bodyHtml ? htmlToPortableText(bodyHtml) : []

        // Published date
        let publishedAt: string | undefined
        if (row['Published On']?.trim()) {
          try {
            const d = new Date(row['Published On'])
            if (!isNaN(d.getTime())) publishedAt = d.toISOString()
          } catch {
            // skip
          }
        }

        // isFeatured
        const isFeatured = row['Featured Blog']?.trim().toLowerCase() === 'true'

        const doc: SanityDoc = {
          _id,
          _type: 'blogPost',
          title,
          slug: { _type: 'slug', current: slugCurrent },
          publishedAt,
          author: row['Author']?.trim() ?? undefined,
          category: row['Category']?.trim() ?? undefined,
          excerpt: row['Meta Description / Summary']?.trim() ?? undefined,
          body,
          isFeatured,
          webflowId,
        }

        if (mainImageDoc) doc.mainImage = mainImageDoc
        if (heroImageDoc) doc.heroImage = heroImageDoc

        return doc
      }),
    )

    // Filter nulls, commit as transaction
    const validDocs = docs.filter(Boolean) as SanityDoc[]
    if (validDocs.length === 0) continue

    const transaction = client.transaction()
    for (const doc of validDocs) {
      transaction.createOrReplace(doc)
    }
    await transaction.commit()

    totalDocs += validDocs.length
    log(`  Batch ${batchIdx + 1}/${totalBatches} complete (${validDocs.length} posts)`)
  }

  log(`  Imported ${rows.length} blog post documents`)
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  // Clear log files from previous runs
  if (fs.existsSync(ERROR_LOG)) fs.unlinkSync(ERROR_LOG)
  if (fs.existsSync(RUN_LOG)) fs.unlinkSync(RUN_LOG)

  log('=== Holo Alert: Webflow → Sanity Migration ===')
  log(`Started: ${new Date().toISOString()}`)
  log(`Project: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}`)
  log(`Dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET}`)

  await migrateSiteSettings()
  await migrateFaqs()
  await migrateTestimonials()
  await migratePromos()
  await migrateDevices()
  await migrateBlogPosts()

  log('\n=== Migration complete ===')
  log(`Total documents: ${totalDocs}`)
  log(`Total images uploaded: ${totalImages}`)
  log(`Total errors: ${totalErrors}`)
  log(`Finished: ${new Date().toISOString()}`)

  if (totalErrors > 0) {
    log(`\nErrors logged to: migration-errors.log`)
    log('Review the log — image failures are acceptable; document-level failures require investigation.')
  }
}

main().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})

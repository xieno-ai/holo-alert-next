/**
 * One-time patch: add missing _key to Portable Text blocks and spans
 * in existing blogPost.body and device.description documents.
 *
 * Run: npm run patch-keys
 */

import path from 'path'
import dotenv from 'dotenv'
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2024-07-11',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

let counter = 0
function key(prefix = 'k'): string {
  return `${prefix}${(++counter).toString(36)}`
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fixBlocks(blocks: any[]): { changed: boolean; blocks: any[] } {
  let changed = false
  const fixed = blocks.map((block) => {
    const b = { ...block }
    if (!b._key) { b._key = key('b'); changed = true }
    if (Array.isArray(b.children)) {
      b.children = b.children.map((child: Record<string, unknown>) => {
        if (!child._key) { changed = true; return { ...child, _key: key('s') } }
        return child
      })
    }
    return b
  })
  return { changed, fixed }
}

async function patchField(docId: string, fieldPath: string, blocks: unknown[]) {
  const { changed, fixed } = fixBlocks(blocks as Record<string, unknown>[])
  if (!changed) return false
  await client.patch(docId).set({ [fieldPath]: fixed }).commit()
  return true
}

async function main() {
  let patched = 0

  // Blog posts
  const posts = await client.fetch<{ _id: string; body: unknown[] }[]>(
    `*[_type == "blogPost" && defined(body)]{ _id, body }`
  )
  console.log(`Found ${posts.length} blog posts`)
  for (const post of posts) {
    const did = await patchField(post._id, 'body', post.body ?? [])
    if (did) { patched++; process.stdout.write('.') }
  }

  // Devices (description field)
  const devices = await client.fetch<{ _id: string; description: unknown[] }[]>(
    `*[_type == "device" && defined(description)]{ _id, description }`
  )
  console.log(`\nFound ${devices.length} devices with description`)
  for (const device of devices) {
    const did = await patchField(device._id, 'description', device.description ?? [])
    if (did) { patched++; process.stdout.write('.') }
  }

  console.log(`\nDone — patched ${patched} documents`)
}

main().catch((err) => { console.error(err); process.exit(1) })

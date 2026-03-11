/**
 * Migration script: Upload homepage images to Sanity and create the homePage document.
 *
 * Usage:
 *   node scripts/migrate-homepage-images.mjs
 *
 * Requires SANITY_API_TOKEN, NEXT_PUBLIC_SANITY_PROJECT_ID, and
 * NEXT_PUBLIC_SANITY_DATASET in .env.local
 */

import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { resolve, extname } from 'path'
import dotenv from 'dotenv'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2026-03-04',
  useCdn: false,
})

const MIME_MAP = {
  '.avif': 'image/avif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
}

async function uploadImage(filePath, altText) {
  const ext = extname(filePath).toLowerCase()
  const contentType = MIME_MAP[ext] || 'application/octet-stream'
  const buffer = readFileSync(filePath)
  console.log(`  Uploading ${filePath} (${contentType})...`)
  const asset = await client.assets.upload('image', buffer, { contentType, filename: filePath.split(/[\\/]/).pop() })
  return {
    _type: 'image',
    alt: altText,
    asset: { _type: 'reference', _ref: asset._id },
  }
}

async function run() {
  const publicDir = resolve(process.cwd(), 'public/images')
  const imageV2Dir = resolve(process.cwd(), 'image.v2')

  console.log('=== Uploading Hero Section image ===')
  const heroImage = await uploadImage(resolve(publicDir, 'hero-device.avif'), 'Holo medical alert device')

  console.log('\n=== Uploading How It Works step images ===')
  const step1 = await uploadImage(resolve(publicDir, 'step-1.avif'), 'Stay Safe and Connected')
  const step2 = await uploadImage(resolve(publicDir, 'step-2.avif'), 'Get the Support You Need')
  const step3 = await uploadImage(resolve(publicDir, 'step-3.avif'), 'Stay Safe and Independent')

  console.log('\n=== Uploading Why Choose lifestyle image ===')
  // Prefer image.v2 version if available, fall back to public
  let whyChooseImage
  try {
    whyChooseImage = await uploadImage(resolve(imageV2Dir, 'with-grandchildren.webp'), 'Canadian senior with family')
  } catch {
    whyChooseImage = await uploadImage(resolve(publicDir, 'with-grandchildren.webp'), 'Canadian senior with family')
  }

  console.log('\n=== Uploading Certification logos ===')
  const cert1 = await uploadImage(resolve(publicDir, 'Frame-292.avif'), 'TMA Five Diamond Monitoring Center')
  const cert2 = await uploadImage(resolve(publicDir, 'Frame-293.avif'), 'Electronic Security Association')
  const cert3 = await uploadImage(resolve(publicDir, 'Frame-299.avif'), 'UL Listed')

  console.log('\n=== Uploading Trust Bar partner logos ===')
  const trustLogos = []
  const logoFiles = [
    'Frame-560.svg', 'Frame-561.avif', 'Frame-562.svg',
    'Frame-563.svg', 'Frame-564.svg', 'Frame-565.avif',
    'Frame-566.svg', 'Frame-567.svg', 'Frame-568.avif',
  ]
  for (const file of logoFiles) {
    const logo = await uploadImage(resolve(publicDir, file), 'Partner logo')
    trustLogos.push(logo)
  }

  console.log('\n=== Uploading Feature Diagram watermark ===')
  const watermark = await uploadImage(resolve(publicDir, 'Frame-244.svg'), '')

  console.log('\n=== Uploading image.v2 lifestyle image (seniorwoman) ===')
  // Upload seniorwoman.webp as a standalone asset for future use
  try {
    await uploadImage(resolve(imageV2Dir, 'seniorwoman.webp'), 'Senior woman lifestyle photo')
    console.log('  (uploaded as standalone asset — not tied to homepage doc)')
  } catch (err) {
    console.log('  Skipped seniorwoman.webp:', err.message)
  }

  console.log('\n=== Creating homePage document ===')
  const doc = {
    _id: 'homePage',
    _type: 'homePage',
    heroImage,
    howItWorksSteps: [
      {
        _type: 'howItWorksStep',
        _key: 'step1',
        title: 'Stay Safe and Connected',
        description: 'One press of your button connects you with our 24/7 monitoring team, who will get you the help you need.',
        href: '/devices',
        image: step1,
      },
      {
        _type: 'howItWorksStep',
        _key: 'step2',
        title: 'Get the Support You Need, When You Need It',
        description: "Our dedicated care team is here for you 24/7. We'll contact your loved ones or emergency services at the touch of a button.",
        href: '/devices',
        image: step2,
      },
      {
        _type: 'howItWorksStep',
        _key: 'step3',
        title: 'Stay Safe and Independent, Knowing Help is Always There',
        description: "Enjoy peace of mind knowing our team is ready to assist you day and night. We'll alert your contacts or 911 if necessary.",
        href: '/devices',
        image: step3,
      },
    ],
    whyChooseImage,
    certifications: [
      {
        _type: 'certification',
        _key: 'tma',
        name: 'TMA Five Diamond',
        description: 'certification signifies that our operators have received intensive training',
        image: cert1,
        scaleUp: true,
      },
      {
        _type: 'certification',
        _key: 'esa',
        name: 'ESA Security',
        description: 'certification ensures our commitment to providing excellent emergency services.',
        image: cert2,
        scaleUp: false,
      },
      {
        _type: 'certification',
        _key: 'ul',
        name: 'UL Listed',
        description: 'certification recognizes our continual dedication to safety and reliability.',
        image: cert3,
        scaleUp: false,
      },
    ],
    trustBarLogos: trustLogos.map((logo, i) => ({ ...logo, _key: `trustlogo-${i}` })),
    featureDiagramWatermark: watermark,
  }

  await client.createOrReplace(doc)
  console.log('\nDone! homePage document created with ID "homePage".')
  console.log('Publish it in Sanity Studio to make it live.')
}

run().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})

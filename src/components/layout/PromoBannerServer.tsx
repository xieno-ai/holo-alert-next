import { sanityFetch } from '@/sanity/lib/client'
import { ACTIVE_PROMO_QUERY } from '@/sanity/lib/queries'
import PromoBanner from './PromoBanner'

interface Promo {
  _id: string
  body?: string
  ctaText?: string
  ctaUrl?: string
}

export default async function PromoBannerServer() {
  let promo: Promo | null = null
  try {
    promo = await sanityFetch<Promo | null>({ query: ACTIVE_PROMO_QUERY, tags: ['promo'] })
  } catch {
    // Sanity unreachable — silently hide banner
  }

  if (!promo?.body) return null

  return (
    <PromoBanner
      body={promo.body}
      ctaText={promo.ctaText}
      ctaUrl={promo.ctaUrl}
    />
  )
}

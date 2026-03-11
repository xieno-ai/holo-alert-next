import { sanityFetch } from '@/sanity/lib/client'
import { TESTIMONIALS_QUERY } from '@/sanity/lib/queries'
import TestimonialsMarquee from '@/components/home/TestimonialsMarquee'

interface Testimonial {
  _id: string
  name: string
  body: string
  location?: string
  rating?: number
  productSlug?: string
}

interface Props {
  productName?: string
  productSlug?: string
}

export default async function ProductTestimonialsSection({ productName = 'Holo Pro', productSlug }: Props) {
  let testimonials: Testimonial[] = []
  try {
    const all = await sanityFetch<Testimonial[]>({ query: TESTIMONIALS_QUERY, tags: ['testimonial'] })
    // Filter to product-specific if slug present; fall back to all
    if (productSlug) {
      const filtered = all.filter((t) => t.productSlug === productSlug)
      testimonials = filtered.length >= 4 ? filtered : all
    } else {
      testimonials = all
    }
  } catch {
    // marquee uses built-in fallbacks
  }

  return (
    <section style={{ background: '#171717', padding: '100px 0' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#4294d8', display: 'block', marginBottom: '12px' }}>
            Customer Reviews
          </span>
          <h2 style={{ fontSize: 'clamp(28px, 3vw, 48px)', fontWeight: 700, color: '#fff', lineHeight: 1.15, margin: 0 }}>
            Our Customers <span style={{ color: '#787878', fontWeight: 700 }}>Trust {productName}</span>
          </h2>
        </div>
      </div>
      <TestimonialsMarquee testimonials={testimonials} />
    </section>
  )
}

import { sanityFetch } from '@/sanity/lib/client'
import { TESTIMONIALS_QUERY } from '@/sanity/lib/queries'
import TestimonialsMarquee from './TestimonialsMarquee'

interface Testimonial {
  _id: string
  name: string
  body: string
  location?: string
  rating?: number
}

export default async function TestimonialsSection() {
  let testimonials: Testimonial[] = []
  try {
    testimonials = await sanityFetch<Testimonial[]>({ query: TESTIMONIALS_QUERY, tags: ['testimonial'] })
  } catch {
    // fall through to empty array — marquee uses built-in fallbacks
  }

  return (
    <section style={{ background: '#171717', padding: '100px 0' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#4294d8', display: 'block', marginBottom: '12px' }}>
            Customer Reviews
          </span>
          <h2 style={{ fontSize: 'clamp(28px, 3vw, 48px)', fontWeight: 700, color: '#fff', lineHeight: 1.15, margin: 0 }}>
            <span style={{ color: '#787878', fontWeight: 700 }}>Don&apos;t Just </span>Take Our Word For It
          </h2>
        </div>
      </div>
      <TestimonialsMarquee testimonials={testimonials} />
    </section>
  )
}

import type { Metadata } from 'next'
import { sanityFetch } from '@/sanity/lib/client'
import { TESTIMONIALS_QUERY } from '@/sanity/lib/queries'
import TestimonialsPageClient from './TestimonialsPageClient'

export const metadata: Metadata = {
  title: 'Customer Reviews | Holo Alert',
  description:
    'Read real reviews from Canadian families who trust Holo Alert for their loved ones\' safety every day.',
}

interface Testimonial {
  _id: string
  name: string
  body: string
  location?: string
  rating?: number
}

export default async function TestimonialsPage() {
  let testimonials: Testimonial[] = []
  try {
    testimonials = await sanityFetch<Testimonial[]>({
      query: TESTIMONIALS_QUERY,
      tags: ['testimonial'],
    })
  } catch {
    // fall through to fallback
  }

  return <TestimonialsPageClient testimonials={testimonials} />
}

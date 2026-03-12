import { sanityFetch } from '@/sanity/lib/client'
import { FAQS_QUERY } from '@/sanity/lib/queries'
import FAQAccordion from './FAQAccordion'

interface FAQ {
  _id: string
  question: string
  answer: string
  category?: string
  sortOrder?: number
}

export default async function FAQSection() {
  let faqs: FAQ[] = []
  try {
    faqs = await sanityFetch<FAQ[]>({
      query: FAQS_QUERY,
      params: { page: 'homepage' },
      tags: ['faq'],
    })
  } catch {
    // fall through to empty
  }

  return (
    <section className="px-4 sm:px-6 lg:px-10" style={{ background: '#fff', paddingTop: '100px', paddingBottom: '100px' }}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20" style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Left */}
        <div>
          <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#4294d8', marginBottom: '12px' }}>
            FAQ
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 3vw, 48px)', fontWeight: 700, color: '#171717', lineHeight: 1.15, margin: 0 }}>
            Answers to your questions
          </h2>
        </div>

        {/* Right: accordion */}
        <div>
          {faqs.length > 0 ? (
            <FAQAccordion faqs={faqs} />
          ) : (
            <FAQAccordion faqs={FALLBACK_FAQS} />
          )}
        </div>

      </div>
    </section>
  )
}

const FALLBACK_FAQS: FAQ[] = [
  {
    _id: 'f1',
    question: 'How does the Holo Alert medical alert system work?',
    answer: 'Simply press the SOS button on your device to connect directly with our 24/7 monitoring center. Our trained operators will assess the situation and dispatch help—whether that\'s contacting your emergency contacts or sending emergency services.',
  },
  {
    _id: 'f2',
    question: 'Do I need a landline or smartphone?',
    answer: 'No. Holo Alert devices use cellular technology and work independently. No landline, Wi-Fi, or smartphone is required.',
  },
  {
    _id: 'f3',
    question: 'Does Holo Alert work across all of Canada?',
    answer: 'Yes. Our devices work coast-to-coast across Canada on reliable Canadian cellular networks, from British Columbia to Newfoundland.',
  },
  {
    _id: 'f4',
    question: 'Is fall detection automatic?',
    answer: 'Yes. Select Holo Alert devices include automatic fall detection. If a fall is detected and you don\'t respond within a few seconds, our monitoring center is automatically alerted.',
  },
  {
    _id: 'f5',
    question: 'How much does Holo Alert cost?',
    answer: 'Plans start at $29.99/month. Device pricing and plan details vary by model. Contact us or explore our devices page for current pricing.',
  },
]

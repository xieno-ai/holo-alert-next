import { sanityFetch } from '@/sanity/lib/client'
import { FAQS_QUERY } from '@/sanity/lib/queries'
import FAQAccordion from '@/components/home/FAQAccordion'

interface FAQ {
  _id: string
  question: string
  answer: string
  category?: string
  sortOrder?: number
}

interface Props {
  productName?: string
}

const FALLBACK_FAQS: FAQ[] = [
  {
    _id: 'pf1',
    question: 'How do I use the Holo Pro?',
    answer: 'Simply press the SOS button to connect with our 24/7 monitoring centre. Our trained operators will assess your situation and coordinate the appropriate help — whether contacting your emergency contacts or dispatching emergency services.',
  },
  {
    _id: 'pf2',
    question: 'Is a pacemaker compatible? Can I still call if I have one?',
    answer: 'Yes. The Holo Pro is compatible with pacemakers. The device uses standard cellular and GPS technology that does not interfere with cardiac devices. However, we always recommend consulting your physician with any specific concerns.',
  },
  {
    _id: 'pf3',
    question: 'Does Holo Alert work in my area?',
    answer: 'Yes. Holo Alert works coast-to-coast across Canada on major LTE networks, including remote and rural areas. Coverage is available from British Columbia to Newfoundland.',
  },
  {
    _id: 'pf4',
    question: 'Sounds great, but is it expensive?',
    answer: 'Plans start from $64.95/month with no long-term contract required. Considering the 24/7 monitoring, GPS tracking, fall detection, and peace of mind provided — most customers consider it excellent value. Annual plans offer significant savings.',
  },
]

export default async function ProductFAQSection({ productName = 'Holo Pro' }: Props) {
  let faqs: FAQ[] = []
  try {
    faqs = await sanityFetch<FAQ[]>({
      query: FAQS_QUERY,
      params: { page: 'product' },
      tags: ['faq'],
    })
  } catch {
    // fall through
  }

  const displayFaqs = faqs.length > 0 ? faqs : FALLBACK_FAQS

  return (
    <section className="faq-section" style={{ background: '#fff', padding: '100px 40px' }}>
      <style>{`
        @media (max-width: 768px) {
          .faq-section { padding: 60px 16px !important; }
          .faq-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          .faq-sticky { position: relative !important; top: auto !important; }
        }
      `}</style>
      <div className="faq-grid" style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'start' }}>

        {/* Left */}
        <div className="faq-sticky" style={{ position: 'sticky', top: '120px' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#4294d8', marginBottom: '12px' }}>
            FAQ
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 3vw, 48px)', fontWeight: 700, color: '#171717', lineHeight: 1.15, margin: '0 0 20px' }}>
            Questions About {productName}
          </h2>
          <p style={{ fontSize: '16px', color: '#787878', lineHeight: 1.65, margin: 0 }}>
            Still have questions? Our Canadian customer support team is here to help.
          </p>
        </div>

        {/* Right */}
        <div>
          <FAQAccordion faqs={displayFaqs} />
        </div>

      </div>
    </section>
  )
}

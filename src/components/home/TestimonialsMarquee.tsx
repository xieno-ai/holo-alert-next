'use client'

const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
    <path d="M8.99584 12.9523L12.1083 14.8348C12.6783 15.1798 13.3758 14.6698 13.2258 14.0248L12.4008 10.4848L15.1533 8.09982C15.6558 7.66482 15.3858 6.83982 14.7258 6.78732L11.1033 6.47982L9.68584 3.13482C9.43084 2.52732 8.56084 2.52732 8.30584 3.13482L6.88834 6.47232L3.26584 6.77982C2.60584 6.83232 2.33584 7.65732 2.83834 8.09232L5.59084 10.4773L4.76584 14.0173C4.61584 14.6623 5.31334 15.1723 5.88334 14.8273L8.99584 12.9523Z" fill="#EDB423" />
  </svg>
)

const LocationIcon = () => (
  <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
    <path d="M6 0C3.24 0 1 2.24 1 5c0 3.75 5 9 5 9s5-5.25 5-9c0-2.76-2.24-5-5-5zm0 6.5C5.17 6.5 4.5 5.83 4.5 5S5.17 3.5 6 3.5 7.5 4.17 7.5 5 6.83 6.5 6 6.5z" fill="#4294d8" />
  </svg>
)

interface Testimonial {
  _id: string
  name: string
  body: string
  location?: string
  rating?: number
}

interface Props {
  testimonials: Testimonial[]
}

function ReviewCard({ t }: { t: Testimonial }) {
  const stars = t.rating ?? 5
  return (
    <div
      style={{
        background: '#1e1e1e',
        borderRadius: '12px',
        padding: '24px 28px',
        flexShrink: 0,
        width: '340px',
        cursor: 'pointer',
        transition: 'background 0.2s',
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = '#252525' }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = '#1e1e1e' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ fontSize: '15px', fontWeight: 600, color: '#fff' }}>{t.name}</div>
          <div style={{ display: 'flex', gap: '2px' }}>
            {Array.from({ length: stars }).map((_, i) => <StarIcon key={i} />)}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0 }}>
          <LocationIcon />
          <span style={{ fontSize: '13px', color: '#4294d8', fontWeight: 500 }}>{t.location ?? 'Canada'}</span>
        </div>
      </div>
      <div style={{ fontSize: '15px', color: '#fff', lineHeight: 1.55 }}>{t.body}</div>
    </div>
  )
}

export default function TestimonialsMarquee({ testimonials }: Props) {
  // Use hard-coded fallback reviews if Sanity has none
  const cards = testimonials.length > 0 ? testimonials : FALLBACK_TESTIMONIALS
  const doubled = [...cards, ...cards]

  return (
    <div style={{ overflow: 'hidden' }}>
      <div
        style={{
          display: 'flex',
          gap: '20px',
          width: 'max-content',
          animation: 'reviewsScroll 120s linear infinite',
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.animationPlayState = 'paused' }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.animationPlayState = 'running' }}
      >
        {doubled.map((t, i) => (
          <ReviewCard key={`${t._id}-${i}`} t={t} />
        ))}
      </div>
      <style>{`
        @keyframes reviewsScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .reviews-marquee { animation: none !important; }
        }
      `}</style>
    </div>
  )
}

const FALLBACK_TESTIMONIALS: Testimonial[] = [
  { _id: 'f1', name: 'Diann Coughlan', body: 'It was so easy to set up my Holo alert system. I am very happy with my Holo alert system. Thank you.', location: 'Canada', rating: 5 },
  { _id: 'f2', name: 'Bev Blayney', body: 'Easy to receive the device and set up. Holo called a couple of times to follow up with a short information session. Thanks', location: 'Canada', rating: 5 },
  { _id: 'f3', name: 'Brenda Beaubien', body: 'I just called in and they set it quickly, then called back to be sure everything was working. Very happy with it.', location: 'Canada', rating: 5 },
  { _id: 'f4', name: 'Jennifer Stannard', body: 'My Holo Alert watch gives me & my family security knowing that should I need immediate medical assistance it\'s THERE.', location: 'Canada', rating: 5 },
  { _id: 'f5', name: 'Janet Sinclair', body: 'Good instructions and easy to use. Living alone and being nearly 80, I worried about falling and being unable to reach the phone.', location: 'Canada', rating: 5 },
  { _id: 'f6', name: 'Jim Webster', body: 'Very knowledgeable and pleasant. Excellent customer service.', location: 'Canada', rating: 5 },
  { _id: 'f7', name: 'Darlene Howard', body: 'Really nice medical pendant. Easy to use. Fast delivery to me. Good monthly value for monitoring. Very friendly customer service.', location: 'Canada', rating: 5 },
  { _id: 'f8', name: 'Bonnie Day', body: 'Very easy setup. Mom is 93 and she\'s so happy to have this for her safety.', location: 'Canada', rating: 5 },
]

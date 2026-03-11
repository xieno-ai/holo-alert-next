'use client'

import React from 'react'

const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path d="M8.99584 12.9523L12.1083 14.8348C12.6783 15.1798 13.3758 14.6698 13.2258 14.0248L12.4008 10.4848L15.1533 8.09982C15.6558 7.66482 15.3858 6.83982 14.7258 6.78732L11.1033 6.47982L9.68584 3.13482C9.43084 2.52732 8.56084 2.52732 8.30584 3.13482L6.88834 6.47232L3.26584 6.77982C2.60584 6.83232 2.33584 7.65732 2.83834 8.09232L5.59084 10.4773L4.76584 14.0173C4.61584 14.6623 5.31334 15.1723 5.88334 14.8273L8.99584 12.9523Z" fill="#EDB423" />
  </svg>
)

interface Testimonial {
  _id: string
  name: string
  body: string
  location?: string
  rating?: number
}

function ReviewCard({ t }: { t: Testimonial }) {
  const stars = t.rating ?? 5
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e8e8e8',
      borderRadius: '16px',
      padding: '24px',
      marginBottom: '16px',
    }}>
      <div style={{ display: 'flex', gap: '3px', marginBottom: '14px' }}>
        {Array.from({ length: stars }).map((_, i) => <StarIcon key={i} />)}
      </div>
      <p style={{
        fontSize: '14px',
        color: '#444',
        lineHeight: 1.65,
        margin: '0 0 18px 0',
        fontFamily: 'inherit',
      }}>
        {t.body}
      </p>
      <div>
        <div style={{ fontSize: '13px', fontWeight: 600, color: '#171717', lineHeight: 1.2 }}>{t.name}</div>
        <div style={{ fontSize: '12px', color: '#4294d8', marginTop: '2px' }}>{t.location ?? 'Canada'}</div>
      </div>
    </div>
  )
}

interface ColumnProps {
  testimonials: Testimonial[]
  direction?: 'up' | 'down'
  duration?: number
}

function Column({ testimonials, direction = 'up', duration = 28 }: ColumnProps) {
  const doubled = [...testimonials, ...testimonials]
  const animName = direction === 'up' ? 'scrollUp' : 'scrollDown'

  return (
    <div style={{ overflow: 'hidden', flex: 1, minWidth: 0 }}>
      <div
        data-scroll-col
        style={{
          animation: `${animName} ${duration}s linear infinite`,
          willChange: 'transform',
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.animationPlayState = 'paused' }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.animationPlayState = 'running' }}
      >
        {doubled.map((t, i) => (
          <ReviewCard key={`${t._id}-${i}`} t={t} />
        ))}
      </div>
    </div>
  )
}

interface Props {
  testimonials?: Testimonial[]
}

const FALLBACK: Testimonial[] = [
  { _id: 'f1', name: 'Diann Coughlan', body: 'It was so easy to set up my Holo alert system. I am very happy with it. Thank you so much for the peace of mind it gives me.', location: 'Ontario', rating: 5 },
  { _id: 'f2', name: 'Bev Blayney', body: 'Easy to receive the device and set up. Holo called a couple of times to follow up with a short information session. Very impressed.', location: 'British Columbia', rating: 5 },
  { _id: 'f3', name: 'Brenda Beaubien', body: 'I just called in and they set it quickly, then called back to be sure everything was working. Very happy with it.', location: 'Alberta', rating: 5 },
  { _id: 'f4', name: 'Jennifer Stannard', body: 'My Holo Alert watch gives me and my family security knowing that should I need immediate medical assistance it\'s right there on my wrist.', location: 'Quebec', rating: 5 },
  { _id: 'f5', name: 'Janet Sinclair', body: 'Good instructions and easy to use. Living alone and being nearly 80, I worried about falling and being unable to reach the phone. Not anymore.', location: 'Manitoba', rating: 5 },
  { _id: 'f6', name: 'Jim Webster', body: 'Very knowledgeable and pleasant staff. Excellent customer service from start to finish.', location: 'Nova Scotia', rating: 5 },
  { _id: 'f7', name: 'Darlene Howard', body: 'Really nice medical pendant. Easy to use. Fast delivery. Good monthly value for monitoring. Very friendly customer service.', location: 'Saskatchewan', rating: 5 },
  { _id: 'f8', name: 'Bonnie Day', body: 'Very easy setup. Mom is 93 and she\'s so happy to have this for her safety. The fall detection is a game changer for our family.', location: 'Ontario', rating: 5 },
  { _id: 'f9', name: 'Margaret Collins', body: 'After my husband passed I was nervous living alone. Holo Alert has given me back my independence and confidence. Wonderful product.', location: 'British Columbia', rating: 5 },
  { _id: 'f10', name: 'Robert Tremblay', body: 'My daughter set this up for me. Super simple and now she stops worrying. The GPS tracking means she always knows I\'m safe.', location: 'Quebec', rating: 5 },
  { _id: 'f11', name: 'Shirley MacPherson', body: 'The response time when I accidentally triggered it was impressive. Someone was on the line within seconds. Really reassuring.', location: 'Alberta', rating: 5 },
  { _id: 'f12', name: 'Gordon Fitzpatrick', body: 'I was skeptical but my doctor recommended it after my fall last year. Now I wear it every day and feel so much more confident.', location: 'Ontario', rating: 5 },
]

export default function TestimonialsColumnsSection({ testimonials }: Props) {
  const cards = (testimonials && testimonials.length >= 6) ? testimonials : FALLBACK

  // Split into 3 columns
  const col1 = cards.filter((_, i) => i % 3 === 0)
  const col2 = cards.filter((_, i) => i % 3 === 1)
  const col3 = cards.filter((_, i) => i % 3 === 2)

  return (
    <section style={{ background: '#fff', padding: '100px 0' }}>
      <style>{`
        @keyframes scrollUp {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        @keyframes scrollDown {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          [data-scroll-col] { animation: none !important; }
        }
      `}</style>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <span style={{
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#4294d8',
            display: 'block',
            marginBottom: '12px',
          }}>
            Customer Reviews
          </span>
          <h2 style={{
            fontSize: 'clamp(28px, 3vw, 46px)',
            fontWeight: 700,
            color: '#171717',
            lineHeight: 1.15,
            margin: '0 0 16px 0',
          }}>
            What Our Customers Say
          </h2>
          <p style={{
            fontSize: '17px',
            color: '#888',
            margin: 0,
            maxWidth: '480px',
            marginLeft: 'auto',
            marginRight: 'auto',
            lineHeight: 1.6,
          }}>
            Real stories from Canadians who trust Holo Alert every day.
          </p>
        </div>

        {/* Columns */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '16px',
            height: '640px',
            overflow: 'hidden',
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)',
          }}
        >
          <Column testimonials={col1} direction="up" duration={32} />
          <Column testimonials={col2} direction="down" duration={38} />
          <Column testimonials={col3} direction="up" duration={26} />
        </div>
      </div>
    </section>
  )
}

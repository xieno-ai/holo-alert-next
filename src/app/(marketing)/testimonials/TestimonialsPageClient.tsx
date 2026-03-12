'use client'

import { useState } from 'react'

const PAGE_SIZE = 9
const WHITESPACE_RE = /\s+/g

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

const AVATAR_COLORS = [
  '#4294d8',
  '#2a7ab8',
  '#3a8fa3',
  '#f46036',
  '#d97a2e',
  '#45b864',
  '#5b8dd9',
]

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function getAvatarColor(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

const StarIcon = () => (
  <svg width="15" height="15" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path
      d="M8.99584 12.9523L12.1083 14.8348C12.6783 15.1798 13.3758 14.6698 13.2258 14.0248L12.4008 10.4848L15.1533 8.09982C15.6558 7.66482 15.3858 6.83982 14.7258 6.78732L11.1033 6.47982L9.68584 3.13482C9.43084 2.52732 8.56084 2.52732 8.30584 3.13482L6.88834 6.47232L3.26584 6.77982C2.60584 6.83232 2.33584 7.65732 2.83834 8.09232L5.59084 10.4773L4.76584 14.0173C4.61584 14.6623 5.31334 15.1723 5.88334 14.8273L8.99584 12.9523Z"
      fill="#EDB423"
    />
  </svg>
)

function ReviewCard({ t }: { t: Testimonial }) {
  const stars = t.rating ?? 5
  const initials = getInitials(t.name)
  const avatarColor = getAvatarColor(t.name)
  // Generate a handle-style string from name + location
  const handle = '@' + t.name.toLowerCase().replace(WHITESPACE_RE, '').slice(0, 12)

  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #e8e8e8',
        borderRadius: '16px',
        padding: '22px 24px',
        marginBottom: '16px',
        transition: 'box-shadow 0.2s, border-color 0.2s',
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement
        el.style.boxShadow = '0 4px 24px rgba(66, 148, 216, 0.1)'
        el.style.borderColor = '#c4dff4'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement
        el.style.boxShadow = 'none'
        el.style.borderColor = '#e8e8e8'
      }}
    >
      {/* Header row: avatar + name/handle | stars */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '14px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Avatar circle */}
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: avatarColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '15px',
              fontWeight: 700,
              color: '#fff',
              flexShrink: 0,
              letterSpacing: '0.01em',
            }}
          >
            {initials}
          </div>
          {/* Name + handle */}
          <div>
            <div
              style={{
                fontSize: '15px',
                fontWeight: 600,
                color: '#171717',
                lineHeight: 1.25,
                marginBottom: '3px',
              }}
            >
              {t.name}
            </div>
            <div style={{ fontSize: '13px', color: '#787878' }}>{handle}</div>
          </div>
        </div>

        {/* Star + score */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0 }}>
          <StarIcon />
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#171717' }}>
            {stars}.0
          </span>
        </div>
      </div>

      {/* Review body */}
      <p style={{ fontSize: '14px', color: '#3a3a3a', lineHeight: 1.7, margin: 0 }}>{t.body}</p>

      {/* Location tag */}
      {t.location && (
        <div style={{ marginTop: '12px' }}>
          <span
            style={{
              fontSize: '12px',
              color: '#4294d8',
              fontWeight: 500,
              background: '#eef5fc',
              padding: '3px 10px',
              borderRadius: '999px',
            }}
          >
            {t.location}
          </span>
        </div>
      )}
    </div>
  )
}

export default function TestimonialsPageClient({ testimonials }: Props) {
  const allCards = testimonials.length > 0 ? testimonials : FALLBACK_TESTIMONIALS
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const cards = allCards.slice(0, visibleCount)
  const hasMore = visibleCount < allCards.length

  // Split into 3 columns for masonry (single pass)
  const col1: Testimonial[] = []
  const col2: Testimonial[] = []
  const col3: Testimonial[] = []
  for (let i = 0; i < cards.length; i++) {
    const dest = i % 3 === 0 ? col1 : i % 3 === 1 ? col2 : col3
    dest.push(cards[i])
  }

  return (
    <>
      {/* Page wrapper — pushes below fixed header */}
      <div style={{ paddingTop: '12px', background: '#f5f6f7', minHeight: '100vh' }}>

        {/* ── Section header ── */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 40px 56px' }}>
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto' }}>

            {/* Eyebrow */}
            <div
              style={{
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#4294d8',
                marginBottom: '16px',
              }}
            >
              Customer Reviews
            </div>

            <h1
              style={{
                fontSize: 'clamp(28px, 3vw, 48px)',
                fontWeight: 700,
                color: '#171717',
                lineHeight: 1.15,
                margin: '0 0 16px',
              }}
            >
              What Our{' '}
              <span style={{ color: '#787878', fontWeight: 700 }}>Customers Say</span>
            </h1>

            <p
              style={{
                fontSize: '16px',
                color: '#787878',
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Trusted by Canadian families from coast to coast.
            </p>
          </div>
        </div>

        {/* ── Masonry grid ── */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px 100px' }}>

          {/* Desktop: 3 columns */}
          <div
            className="tgrid-desktop"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '16px',
              alignItems: 'start',
            }}
          >
            <div>{col1.map((t) => <ReviewCard key={t._id} t={t} />)}</div>
            <div>{col2.map((t) => <ReviewCard key={t._id} t={t} />)}</div>
            <div>{col3.map((t) => <ReviewCard key={t._id} t={t} />)}</div>
          </div>

          {/* Mobile: single column (same slice) */}
          <div className="tgrid-mobile">
            {cards.map((t) => <ReviewCard key={t._id} t={t} />)}
          </div>

          {/* Load More */}
          {hasMore && (
            <div style={{ textAlign: 'center', marginTop: '48px' }}>
              <button
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                className="focus-visible:ring-2 focus-visible:ring-[#4294d8]/50 focus-visible:outline-none"
                style={{
                  background: '#fff',
                  border: '1.5px solid #d0d0d0',
                  borderRadius: '999px',
                  padding: '13px 40px',
                  fontSize: '15px',
                  fontWeight: 600,
                  color: '#171717',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget
                  el.style.borderColor = '#4294d8'
                  el.style.boxShadow = '0 0 0 3px rgba(66,148,216,0.12)'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget
                  el.style.borderColor = '#d0d0d0'
                  el.style.boxShadow = 'none'
                }}
              >
                Load More Reviews
              </button>
              <p style={{ marginTop: '12px', fontSize: '13px', color: '#a0a0a0' }}>
                Showing {visibleCount} of {allCards.length} reviews
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .tgrid-mobile { display: none; }
        @media (max-width: 900px) {
          .tgrid-desktop { display: none !important; }
          .tgrid-mobile { display: block; }
        }
        @media (max-width: 640px) {
          div[style*="padding: '0 40px 100px'"] { padding-left: 20px !important; padding-right: 20px !important; }
        }
      `}</style>
    </>
  )
}

const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    _id: 'f1',
    name: 'Diann Coughlan',
    body: 'It was so easy to set up my Holo Alert system. I feel much safer knowing help is always just a button press away. Very happy with it. Thank you.',
    location: 'Ontario',
    rating: 5,
  },
  {
    _id: 'f2',
    name: 'Bev Blayney',
    body: 'Easy to receive the device and set up. Holo called a couple of times to follow up with a short information session. The team was so kind and patient. Thanks.',
    location: 'British Columbia',
    rating: 5,
  },
  {
    _id: 'f3',
    name: 'Brenda Beaubien',
    body: 'I just called in and they set it up quickly, then called back to make sure everything was working. Very happy with it.',
    location: 'Alberta',
    rating: 5,
  },
  {
    _id: 'f4',
    name: 'Jennifer Stannard',
    body: 'My Holo Alert watch gives me and my family security knowing that should I need immediate medical assistance it\'s always there. I wear it every day without even thinking about it.',
    location: 'Ontario',
    rating: 5,
  },
  {
    _id: 'f5',
    name: 'Janet Sinclair',
    body: 'Good instructions and easy to use. Living alone and being nearly 80, I worried about falling and being unable to reach the phone. Now I have total peace of mind.',
    location: 'Manitoba',
    rating: 5,
  },
  {
    _id: 'f6',
    name: 'Jim Webster',
    body: 'Very knowledgeable and pleasant staff. Excellent customer service from start to finish. The device works exactly as described.',
    location: 'Saskatchewan',
    rating: 5,
  },
  {
    _id: 'f7',
    name: 'Darlene Howard',
    body: 'Really nice medical pendant. Easy to use. Fast delivery. Good monthly value for monitoring. Very friendly customer service. My children are so relieved knowing I have it.',
    location: 'Nova Scotia',
    rating: 5,
  },
  {
    _id: 'f8',
    name: 'Bonnie Day',
    body: 'Very easy setup. Mom is 93 and she\'s so happy to have this for her safety. It gives our whole family peace of mind knowing she\'s protected.',
    location: 'Quebec',
    rating: 5,
  },
  {
    _id: 'f9',
    name: 'Carol Fitzgerald',
    body: 'Outstanding service and a truly life-changing device. After my husband passed, my kids insisted I get one. Best decision we ever made as a family.',
    location: 'New Brunswick',
    rating: 5,
  },
  {
    _id: 'f10',
    name: 'Margaret Thompson',
    body: 'The fall detection is impressive. It went off once when I stumbled in the garden and help was on the way before I even pressed the button. Incredible technology.',
    location: 'Ontario',
    rating: 5,
  },
  {
    _id: 'f11',
    name: 'Robert MacLeod',
    body: 'Got this for my father after his stroke. The GPS tracking means we always know where he is when he goes for his walks. Worth every penny.',
    location: 'Prince Edward Island',
    rating: 5,
  },
  {
    _id: 'f12',
    name: 'Susan Kowalski',
    body: 'Setup was simple and the customer support team walked me through everything. My mother wears it comfortably every day. Highly recommend to any family with an aging parent.',
    location: 'Alberta',
    rating: 5,
  },
]

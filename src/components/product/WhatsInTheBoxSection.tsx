import Image from 'next/image'

interface Accessory {
  name?: string
  image?: { asset?: { url?: string }; alt?: string }
}

interface Props {
  accessories?: Accessory[]
  productName?: string
}

const FALLBACK_4: { name: string; imageSrc: string | null }[] = [
  { name: 'Holo Pro Device',    imageSrc: '/images/holoactive_fronthero.webp' },
  { name: 'Charging Base',      imageSrc: null },
  { name: 'Power Adapter',      imageSrc: null },
  { name: 'Quick Start Guide',  imageSrc: null },
]

const FALLBACK_3: { name: string; imageSrc: string | null }[] = [
  { name: 'Holo Mini Device',   imageSrc: '/images/holoactive_fronthero.webp' },
  { name: 'Charging Cable',     imageSrc: null },
  { name: 'Quick Start Guide',  imageSrc: null },
]

// ── Box icon placeholder ──────────────────────────────────────────────────────
const BoxIcon = ({ size = 48 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <rect x="9" y="14" width="30" height="26" rx="4" stroke="#d0d0d0" strokeWidth="1.5" />
    <path d="M17 14V11C17 9.34 18.34 8 20 8H28C29.66 8 31 9.34 31 11V14" stroke="#d0d0d0" strokeWidth="1.5" />
    <path d="M9 22H39" stroke="#d0d0d0" strokeWidth="1.5" />
    <path d="M24 22V32" stroke="#d0d0d0" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

// ── Single bento card ─────────────────────────────────────────────────────────
interface CardProps {
  name: string
  imgUrl: string | null
  isHero?: boolean
  gridArea?: string
}

function BentoCard({ name, imgUrl, isHero, gridArea }: CardProps) {
  return (
    <div style={{
      gridArea,
      background: '#f7f7f7',
      border: '1px solid rgba(0,0,0,0.06)',
      borderRadius: isHero ? '24px' : '20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: isHero ? '24px 28px 20px' : '28px 20px 20px',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: isHero
        ? '0 1px 2px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.06)'
        : '0 1px 2px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04)',
    }}>
      {/* Subtle top-left light streak on hero */}
      {isHero && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
        }} />
      )}

      {/* Image or placeholder */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        overflow: 'hidden',
      }}>
        {imgUrl ? (
          <Image
            src={imgUrl}
            alt={name}
            width={isHero ? 500 : 200}
            height={isHero ? 500 : 200}
            priority={isHero}
            loading="eager"
            style={{
              objectFit: 'contain',
              width: isHero ? '85%' : '100%',
              height: isHero ? '100%' : 'auto',
              maxHeight: isHero ? 'none' : '120px',
              filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.12))',
            }}
          />
        ) : (
          <BoxIcon size={isHero ? 56 : 40} />
        )}
      </div>

      {/* Label */}
      <div style={{ width: '100%', marginTop: isHero ? '20px' : '14px' }}>
        {/* Fading divider */}
        <div style={{
          height: '1px',
          width: '60%',
          margin: '0 auto 12px',
          background: 'linear-gradient(to right, transparent, rgba(0,0,0,0.12) 25%, rgba(0,0,0,0.12) 75%, transparent)',
        }} />
        <div style={{ textAlign: 'center' }}>
          <span style={{
            fontSize: isHero ? '14px' : '13px',
            fontWeight: 600,
            color: '#171717',
            letterSpacing: '-0.01em',
          }}>
            {name}
          </span>
        </div>
      </div>
    </div>
  )
}

// ── Bento grids ───────────────────────────────────────────────────────────────

interface GridItem { name: string; imgUrl: string | null }

function BentoGrid4({ items }: { items: GridItem[] }) {
  // Layout:  col1 (hero, tall)   col2 (3 stacked: sq / rect / sq)
  //  row1  [ hero              ] [ item1 (square)    ]
  //  row2  [ hero              ] [ item2 (rectangle) ]
  //  row3  [ hero              ] [ item3 (square)    ]
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1.4fr 1fr',
      gridTemplateRows: '210px 210px 210px',
      gridTemplateAreas: `"hero side1" "hero side2" "hero side3"`,
      gap: '12px',
    }}>
      <BentoCard name={items[0].name} imgUrl={items[0].imgUrl} isHero gridArea="hero" />
      <BentoCard name={items[1].name} imgUrl={items[1].imgUrl} gridArea="side1" />
      <BentoCard name={items[2].name} imgUrl={items[2].imgUrl} gridArea="side2" />
      <BentoCard name={items[3].name} imgUrl={items[3].imgUrl} gridArea="side3" />
    </div>
  )
}

function BentoGrid3({ items }: { items: GridItem[] }) {
  // Layout:  col1      col2
  //  row1  [ hero    side1 ]
  //  row2  [ hero    side2 ]
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gridTemplateRows: '230px 230px',
      gridTemplateAreas: `"hero side1" "hero side2"`,
      gap: '12px',
    }}>
      <BentoCard name={items[0].name} imgUrl={items[0].imgUrl} isHero gridArea="hero" />
      <BentoCard name={items[1].name} imgUrl={items[1].imgUrl} gridArea="side1" />
      <BentoCard name={items[2].name} imgUrl={items[2].imgUrl} gridArea="side2" />
    </div>
  )
}

// Fallback for any other count — simple equal grid
function BentoGridAny({ items }: { items: GridItem[] }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${Math.min(items.length, 4)}, 1fr)`,
      gap: '12px',
    }}>
      {items.map((item, i) => (
        <BentoCard key={i} name={item.name} imgUrl={item.imgUrl} isHero={i === 0} />
      ))}
    </div>
  )
}

// ── Section ───────────────────────────────────────────────────────────────────

export default function WhatsInTheBoxSection({ accessories, productName = 'Holo Pro' }: Props) {
  // Resolve items list
  let items: GridItem[]

  if (accessories && accessories.length > 0) {
    items = accessories.map((acc) => ({
      name: acc.name ?? 'Included Item',
      imgUrl: acc.image?.asset?.url ?? null,
    }))
  } else {
    const fallback = productName.toLowerCase().includes('pro') ? FALLBACK_4 : FALLBACK_3
    items = fallback.map((f) => ({ name: f.name, imgUrl: f.imageSrc }))
  }

  return (
    <section style={{ background: '#fff', padding: '100px 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <span style={{
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase' as const,
            color: '#4294d8',
            display: 'block',
            marginBottom: '12px',
          }}>
            Everything You Need
          </span>
          <h2 style={{
            fontSize: 'clamp(28px, 3vw, 48px)',
            fontWeight: 700,
            color: '#171717',
            lineHeight: 1.15,
            margin: 0,
            letterSpacing: '-0.02em',
          }}>
            What&apos;s In The Box
          </h2>
        </div>

        {/* Bento grid — adapts by item count */}
        {items.length === 4 && <BentoGrid4 items={items} />}
        {items.length === 3 && <BentoGrid3 items={items} />}
        {items.length !== 3 && items.length !== 4 && <BentoGridAny items={items} />}

        {/* Order chip + shipping note */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', marginTop: '40px' }}>
          <a
            href="#order"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              background: '#171717',
              color: '#fff',
              fontSize: '12px',
              fontWeight: 600,
              padding: '9px 18px',
              borderRadius: '100px',
              textDecoration: 'none',
              whiteSpace: 'nowrap' as const,
              boxShadow: '0 2px 12px rgba(0,0,0,0.18)',
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M16 10a4 4 0 01-8 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Order {productName}
          </a>

        {/* Shipping note */}
        <p style={{
          textAlign: 'center',
          fontSize: '13px',
          color: '#aaa',
          marginTop: '0',
          maxWidth: '500px',
          marginLeft: 'auto',
          marginRight: 'auto',
          lineHeight: 1.6,
        }}>
          All {productName} orders include free shipping across Canada. Orders typically ship within 3–5 business days.
        </p>
        </div>

      </div>
    </section>
  )
}

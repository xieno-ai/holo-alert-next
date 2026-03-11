import Image from 'next/image'
import Link from 'next/link'
import { sanityFetch } from '@/sanity/lib/client'
import { DEVICES_QUERY } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'

function normalizeMonthly(val: string | undefined | null): string {
  if (!val) return '—'
  let s = val
  if (!s.includes('$')) s = s.replace(/(\d)/, '$$$1')
  if (!/\/mo(nth)?/i.test(s)) s = s.trim() + '/mo'
  return s
}

const CheckIcon = () => (
  <div style={{ width: '20px', height: '20px', flexShrink: 0, background: '#111', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <svg width="10" height="10" viewBox="0 0 10 10" fill="white">
      <path d="M3.75 8.51L1.16 5.92l1.18-1.18L3.75 6.15l4.12-4.12 1.18 1.18L3.75 8.51z" />
    </svg>
  </div>
)

interface Device {
  _id: string
  name: string
  slug: { current: string }
  tagline?: string
  monthlyPriceDisplay?: string
  pricingCardImage?: object
  pricingCardSubhead?: string
  pricingCardBenefits?: string[]
  pricingCardOrder?: number
}

export default async function DeviceCardsSection() {
  let devices: Device[] = []
  try {
    devices = await sanityFetch<Device[]>({ query: DEVICES_QUERY, tags: ['device'] })
  } catch {
    // If Sanity is unreachable, render empty
  }

  const featuredIndex = devices.findIndex((d) =>
    d.name?.toLowerCase().includes('pro')
  )

  return (
    <section id="products" style={{ background: '#f0f0f0', padding: '80px 40px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#4294d8', display: 'block', marginBottom: '12px' }}>
            Canadian-Made Protection
          </span>
          <h2 style={{ fontSize: 'clamp(28px, 3vw, 48px)', fontWeight: 700, color: '#171717', lineHeight: 1.15, margin: 0 }}>
            Choose Your Device
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          {devices.map((device, i) => {
            const isFeatured = i === featuredIndex
            const cardStyle: React.CSSProperties = {
              background: '#fff',
              borderRadius: '20px',
              padding: '28px 24px 24px',
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              boxShadow: isFeatured
                ? '0 8px 32px rgba(0,0,0,0.13), 0 24px 64px rgba(0,0,0,0.1)'
                : '0 1px 3px rgba(0,0,0,0.06), 0 6px 24px rgba(0,0,0,0.07)',
              transform: isFeatured ? 'scale(1.05)' : 'none',
              zIndex: isFeatured ? 2 : 1,
              position: 'relative',
              borderTop: isFeatured ? '3px solid #4294d8' : 'none',
            }

            const imgSrc = device.pricingCardImage
              ? urlFor(device.pricingCardImage).width(400).height(400).url()
              : null

            return (
              <div key={device._id} style={cardStyle}>
                {isFeatured && (
                  <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                    <span style={{ display: 'inline-block', background: '#4294d8', color: '#fff', fontSize: '11px', fontWeight: 700, padding: '4px 12px', borderRadius: '100px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                      Most Popular
                    </span>
                  </div>
                )}

                <h3 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '0.2em', textAlign: 'center', color: '#111', textTransform: 'uppercase', margin: '0 0 10px' }}>
                  {device.name}
                </h3>
                {device.pricingCardSubhead && (
                  <p style={{ fontSize: '15px', fontWeight: 400, color: '#666', textAlign: 'center', lineHeight: 1.55, margin: '0 0 4px' }}>
                    {device.pricingCardSubhead}
                  </p>
                )}

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '240px', overflow: 'hidden', margin: '16px 0 0' }}>
                  {imgSrc ? (
                    <Image
                      src={imgSrc}
                      alt={device.name}
                      width={400}
                      height={400}
                      style={{ maxHeight: '210px', objectFit: 'contain', width: 'auto', height: 'auto' }}
                      loading="lazy"
                    />
                  ) : (
                    <div style={{ width: '180px', height: '210px', background: '#f5f5f5', borderRadius: '8px' }} />
                  )}
                </div>

                <div style={{ textAlign: 'center', fontSize: '14px', fontWeight: 600, color: '#222', padding: '14px 0 12px' }}>
                  {device.monthlyPriceDisplay && (
                    <>Available at <strong>{normalizeMonthly(device.monthlyPriceDisplay)}</strong></>
                  )}
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid #ebebeb', margin: '0 0 16px' }} />

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
                  {(device.pricingCardBenefits || []).map((benefit, bi) => (
                    <div key={bi} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', color: '#333', lineHeight: 1.4, marginBottom: '9px' }}>
                      <CheckIcon />
                      {benefit}
                    </div>
                  ))}
                </div>

                <Link
                  href={`/devices/${device.slug?.current}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#171717',
                    color: '#fff',
                    fontSize: '13px',
                    fontWeight: 700,
                    padding: '12px 28px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    marginBottom: '10px',
                    width: '100%',
                    boxSizing: 'border-box',
                  }}
                >
                  Explore {device.name}
                </Link>
              </div>
            )
          })}

          {devices.length === 0 && (
            <p style={{ color: '#666', textAlign: 'center', width: '100%' }}>Loading devices…</p>
          )}
        </div>
      </div>
    </section>
  )
}

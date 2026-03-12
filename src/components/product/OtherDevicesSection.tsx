'use client'

import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/sanity/lib/image'

interface DeviceCard {
  _id: string
  name: string
  slug: { current: string }
  tagline?: string
  pricingCardImage?: object
  pricingCardSubhead?: string
  pricingCardSubscription?: string
  monthlyPriceDisplay?: string
  pricingCardBenefits?: string[]
}

interface Props {
  devices: DeviceCard[]
  currentSlug: string
}

export default function OtherDevicesSection({ devices, currentSlug }: Props) {
  const others = devices.filter((d) => d.slug?.current !== currentSlug)
  if (others.length === 0) return null

  return (
    <section
      className="other-devices-section"
      style={{
        background: '#ffffff',
        padding: '80px 40px',
        borderTop: '1px solid #d9d9d9',
      }}
    >
      <style>{`
        .other-devices-card {
          border: 1px solid #d9d9d9;
          border-radius: 14px;
          padding: 28px;
          display: flex;
          align-items: center;
          gap: 24px;
          background: #ffffff;
          text-decoration: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .other-devices-card:hover {
          border-color: #4294d8;
          box-shadow: 0 6px 24px rgba(66,148,216,0.08);
        }
        .other-devices-card:hover .other-devices-arrow {
          transform: translateX(3px);
        }
        .other-devices-arrow {
          transition: transform 0.2s ease;
        }
        @media (max-width: 768px) {
          .other-devices-section { padding: 56px 16px !important; }
          .other-devices-grid { grid-template-columns: 1fr !important; }
          .other-devices-card { padding: 20px !important; gap: 16px !important; }
          .other-devices-img-wrap { width: 64px !important; height: 64px !important; }
          .other-devices-img-wrap img { width: 52px !important; height: 52px !important; }
        }
      `}</style>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#4294d8',
              display: 'block',
              marginBottom: '16px',
            }}
          >
            Also Consider
          </span>
          <div
            style={{
              height: '1px',
              maxWidth: '280px',
              margin: '0 auto',
              background: 'linear-gradient(90deg, transparent 0%, #d9d9d9 30%, #d9d9d9 70%, transparent 100%)',
            }}
          />
        </div>

        {/* Cards */}
        <div
          className="other-devices-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${Math.min(others.length, 2)}, 1fr)`,
            gap: '16px',
          }}
        >
          {others.slice(0, 2).map((device) => {
            const imgSrc = device.pricingCardImage
              ? urlFor(device.pricingCardImage).width(200).height(200).url()
              : null

            return (
              <Link
                key={device._id}
                href={`/devices/${device.slug.current}`}
                className="other-devices-card"
              >
                {imgSrc && (
                  <div
                    className="other-devices-img-wrap"
                    style={{
                      flex: '0 0 auto',
                      width: '80px',
                      height: '80px',
                      background: '#f2f2f2',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Image
                      src={imgSrc}
                      alt={device.name}
                      width={64}
                      height={64}
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: '16px',
                      fontWeight: 700,
                      color: '#171717',
                      lineHeight: 1.2,
                      marginBottom: device.pricingCardSubhead ? '6px' : 0,
                    }}
                  >
                    {device.name}
                  </div>
                  {device.pricingCardSubhead && (
                    <div
                      style={{
                        fontSize: '13.5px',
                        color: '#787878',
                        lineHeight: 1.45,
                      }}
                    >
                      {device.pricingCardSubhead}
                    </div>
                  )}
                </div>
                {/* Arrow */}
                <div
                  className="other-devices-arrow"
                  style={{ color: '#4294d8', flexShrink: 0 }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M5 12h14M12 5l7 7-7 7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

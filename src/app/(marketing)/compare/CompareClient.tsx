'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/sanity/lib/image'

interface Spec {
  label: string
  value: string
}

export interface Device {
  _id: string
  name: string
  slug: { current: string }
  tagline?: string
  monthlyPriceDisplay?: string
  annualPriceDisplay?: string
  devicePrice?: number
  reducedDevicePrice?: number
  pricingCardImage?: object
  pricingCardSubhead?: string
  pricingCardSubscription?: string
  pricingCardBenefits?: string[]
  pricingCardOrder?: number
  specs?: Spec[]
  shippingTimeline?: string
}

// ─── Spec comparison categories ────────────────────────────────────────────

type SpecRow = {
  label: string
  getValue: (d: Device) => string
}

const specCategories: Array<{ id: string; title: string; rows: SpecRow[] }> = [
  {
    id: 'pricing',
    title: 'PRICING',
    rows: [
      {
        label: 'Monthly Plan',
        getValue: (d) => normalizeMonthly(d.monthlyPriceDisplay || d.pricingCardSubscription),
      },
      {
        label: 'Annual Plan',
        getValue: (d) => normalizeAnnual(d.annualPriceDisplay),
      },
      {
        label: 'Device Fee (One-Time)',
        getValue: (d) => {
          if (d.reducedDevicePrice && d.devicePrice)
            return `$${d.reducedDevicePrice} (was $${d.devicePrice})`
          if (d.reducedDevicePrice) return `$${d.reducedDevicePrice}`
          if (d.devicePrice) return `$${d.devicePrice}`
          return '—'
        },
      },
      {
        label: 'Shipping',
        getValue: (d) => d.shippingTimeline || 'Free',
      },
    ],
  },
  {
    id: 'specs',
    title: 'DEVICE SPECS',
    rows: [
      {
        label: 'Height',
        getValue: (d) =>
          d.specs?.find((s) => s.label?.toLowerCase() === 'height')?.value || '—',
      },
      {
        label: 'Width',
        getValue: (d) =>
          d.specs?.find((s) => s.label?.toLowerCase() === 'width')?.value || '—',
      },
      {
        label: 'Weight',
        getValue: (d) =>
          d.specs?.find((s) => s.label?.toLowerCase() === 'weight')?.value || '—',
      },
      {
        label: 'Connectivity',
        getValue: (d) =>
          d.specs?.find((s) => s.label?.toLowerCase() === 'connectivity')?.value || '—',
      },
    ],
  },
  {
    id: 'features',
    title: 'INCLUDED FEATURES',
    rows: [],
  },
]

// ─── Feature matrix (hardcoded, matched via keyword) ────────────────────────

const FEATURE_MATRIX = [
  {
    label: 'Automatic Fall Detection',
    test: (d: Device) =>
      !!d.pricingCardBenefits?.some((b) => b.toLowerCase().includes('fall detection')),
  },
  {
    label: 'WiFi Location Services',
    test: () => true,
  },
  {
    label: 'Enhanced Location Services',
    test: (d: Device) =>
      !!d.pricingCardBenefits?.some((b) => b.toLowerCase().includes('gps')),
  },
  {
    label: 'Caregiver App',
    test: (d: Device) =>
      !!d.pricingCardBenefits?.some((b) => b.toLowerCase().includes('caregiver')),
  },
  {
    label: 'Activity Tracking (Steps + Heart Rate)',
    test: (d: Device) =>
      !!d.pricingCardBenefits?.some(
        (b) => b.toLowerCase().includes('steps') || b.toLowerCase().includes('heart rate'),
      ),
  },
  {
    label: 'Wrist-Worn',
    test: (d: Device) =>
      !!d.pricingCardBenefits?.some(
        (b) => b.toLowerCase().includes('wrist') || b.toLowerCase().includes('smartwatch'),
      ),
  },
  {
    label: 'Lightweight & Discreet',
    test: (d: Device) =>
      !!d.pricingCardBenefits?.some(
        (b) => b.toLowerCase().includes('lightweight') || b.toLowerCase().includes('discreet'),
      ),
  },
]

// ─── Price normalizers ────────────────────────────────────────────────────────
// Ensures $ symbol and correct interval suffix regardless of how data is stored in Sanity.
function normalizeMonthly(val: string | undefined | null): string {
  if (!val) return '—'
  let s = val
  if (!s.includes('$')) s = s.replace(/(\d)/, '$$$1')
  if (!/\/mo(nth)?/i.test(s)) s = s.trim() + '/mo'
  return s
}
function normalizeAnnual(val: string | undefined | null): string {
  if (!val) return '—'
  let s = val.replace(/^\$/, '').replace(/\/(yr|year|mo(nth)?)/i, '').trim()
  return `$${s}/yr`
}

// ─── Check icon ──────────────────────────────────────────────────────────────

const CheckBadge = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 22 22"
    fill="none"
    style={{ flexShrink: 0, display: 'block', margin: '0 auto 6px' }}
  >
    <circle cx="11" cy="11" r="11" fill="#171717" />
    <path
      d="M6.5 11.5L9.2 14.2L15.5 7.8"
      stroke="white"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

// ─── Device Selector Dropdown ────────────────────────────────────────────────

function DeviceSelector({
  devices,
  selected,
  onSelect,
}: {
  devices: Device[]
  selected: Device
  onSelect: (d: Device) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const imgSrc = selected.pricingCardImage
    ? urlFor(selected.pricingCardImage).width(120).height(80).url()
    : null

  return (
    <div
      ref={ref}
      style={{ position: 'relative', userSelect: 'none' }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          border: '1px solid #d9d9d9',
          borderRadius: '12px',
          padding: '14px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          cursor: 'pointer',
          background: '#fff',
          textAlign: 'left',
          transition: 'border-color 0.15s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#4294d8')}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#d9d9d9')}
      >
        {imgSrc && (
          <div style={{ width: '56px', height: '40px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Image
              src={imgSrc}
              alt={selected.name}
              width={56}
              height={40}
              style={{ objectFit: 'contain', width: '100%', height: '100%' }}
            />
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: '15px', color: '#171717', lineHeight: 1.2 }}>
            {selected.name}
          </div>
          {selected.tagline && (
            <div
              style={{
                fontSize: '11px',
                color: '#787878',
                marginTop: '2px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {selected.tagline}
            </div>
          )}
        </div>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          style={{
            flexShrink: 0,
            transform: open ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.15s',
          }}
        >
          <path
            d="M4 6l4 4 4-4"
            stroke="#787878"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            background: '#fff',
            border: '1px solid #d9d9d9',
            borderRadius: '10px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            zIndex: 100,
            overflow: 'hidden',
          }}
        >
          {devices.map((d) => (
            <button
              key={d._id}
              onClick={() => {
                onSelect(d)
                setOpen(false)
              }}
              style={{
                width: '100%',
                padding: '12px 16px',
                cursor: 'pointer',
                background: d._id === selected._id ? '#f2f2f2' : '#fff',
                fontSize: '14px',
                color: '#171717',
                fontWeight: d._id === selected._id ? 700 : 400,
                textAlign: 'left',
                border: 'none',
                display: 'block',
                transition: 'background 0.1s',
              }}
              onMouseEnter={(e) => {
                if (d._id !== selected._id) e.currentTarget.style.background = '#f8f8f8'
              }}
              onMouseLeave={(e) => {
                if (d._id !== selected._id) e.currentTarget.style.background = '#fff'
              }}
            >
              {d.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CompareClient({ devices }: { devices: Device[] }) {
  const safe = devices.length > 0 ? devices : []

  // Default: first 3 devices (or repeat if fewer than 3)
  const defaultIds = [0, 1, 2].map((i) => safe[i % Math.max(safe.length, 1)]?._id ?? '')

  const [col0Id, setCol0Id] = useState(defaultIds[0])
  const [col1Id, setCol1Id] = useState(defaultIds[1] || defaultIds[0])
  const [col2Id, setCol2Id] = useState(defaultIds[2] || defaultIds[0])
  const [stickyVisible, setStickyVisible] = useState(false)

  const imagesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = imagesRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setStickyVisible(!entry.isIntersecting),
      { threshold: 0, rootMargin: '-72px 0px 0px 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const getDevice = (id: string) => safe.find((d) => d._id === id) ?? safe[0]

  const cols = [
    { device: getDevice(col0Id), setId: setCol0Id },
    { device: getDevice(col1Id), setId: setCol1Id },
    { device: getDevice(col2Id), setId: setCol2Id },
  ].filter((c) => c.device) as Array<{ device: Device; setId: (id: string) => void }>


  if (safe.length === 0) {
    return (
      <div
        style={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: '120px',
          fontFamily: 'Instrument Sans, sans-serif',
          color: '#787878',
        }}
      >
        No devices found.
      </div>
    )
  }

  return (
    <div
      style={{
        fontFamily: 'Instrument Sans, sans-serif',
        background: '#fff',
        minHeight: '100vh',
        paddingTop: '120px',
        paddingBottom: '100px',
      }}
    >
      {/* ── Sticky device name bar ──────────────────────────────────────── */}
      <div
        style={{
          position: 'fixed',
          top: '72px',
          left: 0,
          right: 0,
          zIndex: 40,
          background: '#fff',
          borderBottom: '1px solid #e8e8e8',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          transform: stickyVisible ? 'translateY(0)' : 'translateY(-100%)',
          transition: 'transform 0.2s ease',
          pointerEvents: stickyVisible ? 'auto' : 'none',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 40px',
            display: 'grid',
            gridTemplateColumns: `1fr repeat(${cols.length}, 1fr)`,
          }}
        >
          {/* Empty spacer to match the label column in the table */}
          <div />

          {cols.map(({ device }, colIdx) => {
            const imgSrc = device.pricingCardImage
              ? urlFor(device.pricingCardImage).width(80).height(80).url()
              : null
            return (
              <div
                key={device._id + colIdx}
                style={{
                  padding: '10px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  borderRight: colIdx < cols.length - 1 ? '1px solid #f2f2f2' : 'none',
                }}
              >
                {imgSrc && (
                  <Image
                    src={imgSrc}
                    alt={device.name}
                    width={36}
                    height={36}
                    style={{ objectFit: 'contain', flexShrink: 0 }}
                  />
                )}
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: '#171717', lineHeight: 1.2 }}>
                    {device.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#45b864', fontWeight: 600 }}>
                    {normalizeMonthly(device.monthlyPriceDisplay || device.pricingCardSubscription)}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>

        {/* ── Page Header ────────────────────────────────────────────── */}
        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          <span
            style={{
              display: 'block',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#4294d8',
              marginBottom: '12px',
            }}
          >
            Canadian-Made Protection
          </span>
          <h1
            style={{
              fontSize: 'clamp(32px, 4vw, 52px)',
              fontWeight: 700,
              color: '#171717',
              margin: '0 0 14px',
              lineHeight: 1.1,
            }}
          >
            Compare Devices
          </h1>
          <p
            style={{
              fontSize: '18px',
              color: '#787878',
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            Explore the Holo Alert lineup to find the right device for your loved one.
          </p>
        </div>

        {/* ── Device Selector Row ─────────────────────────────────────── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${cols.length}, 1fr)`,
            gap: '20px',
            marginBottom: '32px',
          }}
        >
          {cols.map(({ device, setId }) => (
            <DeviceSelector
              key={device._id}
              devices={safe}
              selected={device}
              onSelect={(d) => setId(d._id)}
            />
          ))}
        </div>

        {/* ── Product Images + Price + CTA ────────────────────────────── */}
        <div
          ref={imagesRef}
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${cols.length}, 1fr)`,
            gap: '0',
            borderBottom: '2px solid #f2f2f2',
            paddingBottom: '40px',
            marginBottom: '0',
          }}
        >
          {cols.map(({ device }, colIdx) => {
            const imgSrc = device.pricingCardImage
              ? urlFor(device.pricingCardImage).width(480).height(480).url()
              : null

            return (
              <div
                key={device._id + colIdx}
                style={{
                  padding: '0 24px',
                  borderRight:
                    colIdx < cols.length - 1 ? '1px solid #f2f2f2' : 'none',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                {/* Device image */}
                <div
                  style={{
                    height: '300px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                  }}
                >
                  {imgSrc ? (
                    <Image
                      src={imgSrc}
                      alt={device.name}
                      width={480}
                      height={480}
                      style={{
                        maxHeight: '280px',
                        objectFit: 'contain',
                        width: 'auto',
                        height: 'auto',
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '200px',
                        height: '200px',
                        background: '#f5f5f5',
                        borderRadius: '16px',
                      }}
                    />
                  )}
                </div>

                {/* Price */}
                <div
                  style={{
                    fontSize: '13px',
                    color: '#787878',
                    marginBottom: '4px',
                    fontWeight: 500,
                  }}
                >
                  Purchase from
                </div>
                <div
                  style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    color: '#45b864',
                    marginBottom: '20px',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {normalizeMonthly(device.monthlyPriceDisplay || device.pricingCardSubscription)}
                </div>

                {/* CTA */}
                <Link
                  href={`/devices/${device.slug?.current}`}
                  style={{
                    display: 'inline-block',
                    background: '#4294d8',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '13px',
                    padding: '12px 28px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    transition: 'background 0.15s, transform 0.1s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#2f7abf'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#4294d8'
                  }}
                >
                  Choose {device.name}
                </Link>
              </div>
            )
          })}
        </div>

        {/* ── Spec Comparison Table ────────────────────────────────────── */}
        {specCategories.map((category) => (
          <div key={category.id}>

            {/* Category header bar */}
            <div
              style={{
                background: '#171717',
                padding: '16px 24px',
                borderRadius: '8px',
                margin: '48px 0 0',
              }}
            >
              <span
                style={{
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: '13px',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                }}
              >
                {category.title}
              </span>
            </div>

            {/* Static spec rows */}
            {category.id !== 'features' &&
              category.rows.map((row, rowIdx) => (
                <div
                  key={rowIdx}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: `1fr repeat(${cols.length}, 1fr)`,
                    borderBottom: '1px solid #f2f2f2',
                    alignItems: 'center',
                  }}
                >
                  {/* Row label column */}
                  <div
                    style={{
                      padding: '18px 24px',
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#171717',
                      borderRight: '1px solid #f2f2f2',
                    }}
                  >
                    {row.label}
                  </div>

                  {/* Device value columns */}
                  {cols.map(({ device }, colIdx) => (
                    <div
                      key={colIdx}
                      style={{
                        padding: '18px 24px',
                        borderRight:
                          colIdx < cols.length - 1 ? '1px solid #f2f2f2' : 'none',
                        textAlign: 'center',
                        fontSize: '15px',
                        fontWeight: 600,
                        color: '#171717',
                        lineHeight: 1.4,
                      }}
                    >
                      {row.getValue(device)}
                    </div>
                  ))}
                </div>
              ))}

            {/* Features matrix — one row per feature, ✓/✗ per device */}
            {category.id === 'features' &&
              FEATURE_MATRIX.map((feature, fi) => (
                <div
                  key={fi}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: `1fr repeat(${cols.length}, 1fr)`,
                    borderBottom: '1px solid #f2f2f2',
                    alignItems: 'center',
                  }}
                >
                  {/* Feature label column */}
                  <div
                    style={{
                      padding: '18px 24px',
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#171717',
                      borderRight: '1px solid #f2f2f2',
                    }}
                  >
                    {feature.label}
                  </div>

                  {/* Device columns */}
                  {cols.map(({ device }, colIdx) => {
                    const has = feature.test(device)
                    return (
                      <div
                        key={colIdx}
                        style={{
                          padding: '18px 24px',
                          borderRight:
                            colIdx < cols.length - 1 ? '1px solid #f2f2f2' : 'none',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        {has ? (
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="12" fill="#4294d8" />
                            <path
                              d="M7 12.5L10.2 15.8L17 8.5"
                              stroke="white"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        ) : (
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="12" fill="#f2f2f2" />
                            <path
                              d="M9 9L15 15M15 9L9 15"
                              stroke="#c0c0c0"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                            />
                          </svg>
                        )}
                      </div>
                    )
                  })}
                </div>
              ))}
          </div>
        ))}

        {/* ── Bottom CTA row ───────────────────────────────────────────── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `1fr repeat(${cols.length}, 1fr)`,
            gap: '0',
            marginTop: '48px',
            paddingTop: '40px',
            borderTop: '2px solid #171717',
          }}
        >
          {/* Empty label column — matches the spec table layout */}
          <div />

          {cols.map(({ device }, colIdx) => (
            <div
              key={device._id + colIdx}
              style={{
                padding: '0 24px',
                borderRight:
                  colIdx < cols.length - 1 ? '1px solid #f2f2f2' : 'none',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  color: '#45b864',
                  marginBottom: '16px',
                }}
              >
                {normalizeMonthly(device.monthlyPriceDisplay || device.pricingCardSubscription)}
              </div>
              <Link
                href={`/devices/${device.slug?.current}`}
                style={{
                  display: 'inline-block',
                  background: '#4294d8',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '13px',
                  padding: '12px 28px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                Choose {device.name}
              </Link>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

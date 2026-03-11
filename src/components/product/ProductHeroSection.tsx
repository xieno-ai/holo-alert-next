'use client'

import { useState } from 'react'

import Image from 'next/image'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { urlFor } from '@/sanity/lib/image'

interface Spec {
  label: string
  value: string
}

// Minimal Portable Text block type
type PortableTextBlock = {
  _type: string
  _key?: string
  [key: string]: unknown
}

interface Addon {
  _id: string
  name: string
  shortDescription?: string
  description?: string
  priceMonthly?: number
  priceAnnual?: number
  billingInterval?: string
  stripePriceIdMonthly?: string
  stripePriceIdAnnual?: string
}

interface Device {
  _id: string
  name?: string
  slug?: { current: string }
  tagline?: string
  description?: PortableTextBlock[]
  mainImage?: object
  gallery?: object[]
  specs?: Spec[]
  monthlyPriceDisplay?: string
  annualPriceDisplay?: string
  devicePrice?: number
  reducedDevicePrice?: number
  pricingCardBenefits?: string[]
  fallAlertDisclaimer?: string
}

interface Props {
  device: Device
  addons?: Addon[]
}

const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path d="M8.99584 12.9523L12.1083 14.8348C12.6783 15.1798 13.3758 14.6698 13.2258 14.0248L12.4008 10.4848L15.1533 8.09982C15.6558 7.66482 15.3858 6.83982 14.7258 6.78732L11.1033 6.47982L9.68584 3.13482C9.43084 2.52732 8.56084 2.52732 8.30584 3.13482L6.88834 6.47232L3.26584 6.77982C2.60584 6.83232 2.33584 7.65732 2.83834 8.09232L5.59084 10.4773L4.76584 14.0173C4.61584 14.6623 5.31334 15.1723 5.88334 14.8273L8.99584 12.9523Z" fill="#EDB423" />
  </svg>
)

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2.5 7L5.5 10L11.5 4" stroke="#45b864" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const FALLBACK_SPECS: Spec[] = [
  { label: 'Height', value: '65mm' },
  { label: 'Weight', value: '49g' },
  { label: 'Connectivity', value: 'LTE / GPS' },
]

const FALLBACK_PRICING = {
  monthly: 'from $64.95/month',
  annual: '$779.95/year',
  devicePrice: 399.95,
  reducedDevicePrice: 299.95,
}

export default function ProductHeroSection({ device, addons = [] }: Props) {
  const allImages: object[] = []
  if (device.mainImage) allImages.push(device.mainImage)
  if (device.gallery) allImages.push(...device.gallery)

  const [activeIdx, setActiveIdx] = useState(0)
  const [deliveryOpen, setDeliveryOpen] = useState(false)
  const [specsOpen, setSpecsOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<'annual' | 'monthly' | null>(null)
  const [selectedAddons, setSelectedAddons] = useState<Set<string>>(new Set())

  function toggleAddon(id: string) {
    setSelectedAddons((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }



  function buildCheckoutUrl(plan: 'annual' | 'monthly') {
    // Pass the correct Stripe Price ID for each selected addon based on the chosen plan
    const addonPriceIds = Array.from(selectedAddons)
      .map((id) => {
        const addon = addons.find((a) => a._id === id)
        if (!addon) return null
        if (addon.billingInterval === 'one-time') return addon.stripePriceIdMonthly ?? id
        return plan === 'annual' ? (addon.stripePriceIdAnnual ?? id) : (addon.stripePriceIdMonthly ?? id)
      })
      .filter(Boolean)
      .join(',')
    const base = `/checkout?product=${slug}&plan=${plan}`
    return addonPriceIds ? `${base}&addons=${addonPriceIds}` : base
  }

  const activeImage = allImages[activeIdx] ?? null
  const activeImgUrl = activeImage
    ? urlFor(activeImage).width(700).height(700).url()
    : null

  const monthlyRaw = device.monthlyPriceDisplay ?? FALLBACK_PRICING.monthly
  const monthly = (() => {
    let s = monthlyRaw
    if (!s.includes('$')) s = s.replace(/(\d)/, '$$$1')
    if (!/\/mo(nth)?/i.test(s)) s = s.trim() + '/mo'
    return s
  })()
  const annualRaw = device.annualPriceDisplay ?? FALLBACK_PRICING.annual
  const annual = (() => {
    const s = annualRaw.replace(/^\$/, '').replace(/\/(yr|year|mo(nth)?)/i, '').trim()
    return `$${s}/yr`
  })()
  const productName = device.name ?? 'Holo Pro'

  // Device pricing + current promo logic
  const baseDevicePrice = device.devicePrice ?? FALLBACK_PRICING.devicePrice
  const monthlyDevicePrice = Math.round(baseDevicePrice * 0.6 * 100) / 100 // 40% off
  const fmtPrice = (n: number) => `$${n.toFixed(2)}`
  const hasDescription = device.description && device.description.length > 0
  const fallbackTagline = 'Canada\'s most advanced medical alert device with real-time GPS, 24/7 monitoring, and fall detection built for active seniors.'

  const slug = device.slug?.current ?? 'holo-pro'

  return (
    <section style={{ background: '#fff', padding: '120px 40px 40px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'start' }}>

        {/* LEFT: Image gallery */}
        <div>
          {/* Main image */}
          <div style={{
            background: '#f7f7f7',
            borderRadius: '20px',
            overflow: 'hidden',
            aspectRatio: '1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
          }}>
            {activeImgUrl ? (
              <Image
                src={activeImgUrl}
                alt={productName}
                width={700}
                height={700}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: activeIdx === 0 ? 'contain' : 'cover',
                  padding: activeIdx === 0 ? '48px' : '0',
                }}
                priority
              />
            ) : (
              <div style={{ width: '280px', height: '280px', background: '#e8e8e8', borderRadius: '12px' }} />
            )}
          </div>

          {/* Thumbnails — always show 5 slots */}
          <div style={{ display: 'flex', gap: '10px' }}>
            {Array.from({ length: 5 }).map((_, i) => {
              const img = allImages[i]
              const isActive = i === activeIdx
              const hasSrc = !!img
              const thumbUrl = hasSrc ? urlFor(img).width(120).height(120).url() : null
              return (
                <button
                  key={i}
                  onClick={() => hasSrc && setActiveIdx(i)}
                  aria-label={hasSrc ? `View image ${i + 1}` : undefined}
                  disabled={!hasSrc}
                  style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    border: isActive && hasSrc ? '2px solid #4294d8' : '2px solid #e8e8e8',
                    background: '#f7f7f7',
                    cursor: hasSrc ? 'pointer' : 'default',
                    padding: 0,
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexGrow: 1,
                  }}
                >
                  {thumbUrl ? (
                    <Image
                      src={thumbUrl}
                      alt={`${productName} view ${i + 1}`}
                      width={120}
                      height={120}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <rect x="2" y="2" width="16" height="16" rx="3" stroke="#d0d0d0" strokeWidth="1.5" strokeDasharray="3 2"/>
                      <path d="M7 10h6M10 7v6" stroke="#d0d0d0" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* RIGHT: Product info + pricing */}
        <div style={{ paddingTop: '12px' }}>

          {/* Eyebrow */}
          <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#4294d8', display: 'block', marginBottom: '14px' }}>
            Medical Alert Device
          </span>

          {/* Name */}
          <h1 style={{ fontSize: 'clamp(36px, 4vw, 56px)', fontWeight: 800, color: '#171717', letterSpacing: '0.1em', textTransform: 'uppercase' as const, margin: '0 0 16px', lineHeight: 1.05 }}>
            {productName}
          </h1>

          {/* Stars + review count */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '2px' }}>
              {[1, 2, 3, 4, 5].map((i) => <StarIcon key={i} />)}
            </div>
            <span style={{ fontSize: '14px', color: '#555', fontWeight: 500 }}>4.8/5 · 100+ Reviews</span>
          </div>

          {/* Description */}
          <div style={{ fontSize: '16px', color: '#555', lineHeight: 1.65, margin: '0 0 28px' }}>
            {hasDescription ? (
              <PortableText
                value={device.description!}
                components={{
                  block: {
                    normal: ({ children }) => <p style={{ margin: '0 0 12px' }}>{children}</p>,
                  },
                  marks: {
                    strong: ({ children }) => <strong style={{ fontWeight: 600, color: '#171717' }}>{children}</strong>,
                    em: ({ children }) => <em>{children}</em>,
                  },
                }}
              />
            ) : (
              <p style={{ margin: 0 }}>{fallbackTagline}</p>
            )}
          </div>

          {/* Pricing options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>

            {/* Annual — highlighted */}
            <button
              type="button"
              role="radio"
              aria-checked={selectedPlan === 'annual'}
              onClick={() => setSelectedPlan(selectedPlan === 'annual' ? null : 'annual')}
              style={{
                border: selectedPlan === 'annual' ? '2px solid #4294d8' : '1.5px solid #4294d8',
                borderRadius: '12px',
                background: '#f5f9ff',
                position: 'relative',
                marginTop: '12px',
                cursor: 'pointer',
                boxShadow: selectedPlan === 'annual' ? '0 0 0 3px rgba(66,148,216,0.15)' : 'none',
                transition: 'box-shadow 0.15s ease',
                width: '100%',
                textAlign: 'left',
                padding: 0,
              }}
            >
              <div style={{
                position: 'absolute',
                top: '-11px',
                left: '20px',
                background: '#4294d8',
                color: '#fff',
                fontSize: '10px',
                fontWeight: 700,
                padding: '3px 10px',
                borderRadius: '100px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase' as const,
              }}>
                Best Value
              </div>
              {/* Subscription row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', padding: '18px 20px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {/* Radio indicator */}
                  <div style={{
                    width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0,
                    border: selectedPlan === 'annual' ? '5px solid #4294d8' : '2px solid #c0c0c0',
                    background: '#fff',
                    transition: 'border 0.15s ease',
                  }} />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#171717', marginBottom: '2px' }}>Annual Plan</div>
                    <div style={{ fontSize: '12px', color: '#4294d8', fontWeight: 500 }}>Save 2 months free · Monitoring included</div>
                  </div>
                </div>
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#171717', flexShrink: 0 }}>{annual}</span>
              </div>
              {/* Device fee row */}
              <div style={{ borderTop: '1px solid #deeaf8', padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: '#555' }}>One-time device fee</span>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#45b864' }}>Included free</span>
              </div>
            </button>

            {/* Monthly */}
            <button
              type="button"
              role="radio"
              aria-checked={selectedPlan === 'monthly'}
              onClick={() => setSelectedPlan(selectedPlan === 'monthly' ? null : 'monthly')}
              style={{
                border: selectedPlan === 'monthly' ? '2px solid #171717' : '1.5px solid #e0e0e0',
                borderRadius: '12px',
                overflow: 'hidden',
                cursor: 'pointer',
                boxShadow: selectedPlan === 'monthly' ? '0 0 0 3px rgba(23,23,23,0.08)' : 'none',
                transition: 'box-shadow 0.15s ease',
                width: '100%',
                textAlign: 'left',
                padding: 0,
                background: '#fff',
              }}
            >
              {/* Subscription row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', padding: '16px 20px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {/* Radio indicator */}
                  <div style={{
                    width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0,
                    border: selectedPlan === 'monthly' ? '5px solid #171717' : '2px solid #c0c0c0',
                    background: '#fff',
                    transition: 'border 0.15s ease',
                  }} />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#171717', marginBottom: '2px' }}>Monthly Plan</div>
                    <div style={{ fontSize: '12px', color: '#888' }}>Cancel anytime · Monitoring included</div>
                  </div>
                </div>
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#171717', flexShrink: 0 }}>{monthly}</span>
              </div>
              {/* Device fee row */}
              <div style={{ borderTop: '1px solid #ebebeb', padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fafafa' }}>
                <span style={{ fontSize: '12px', color: '#555' }}>One-time device fee</span>
                <span style={{ fontSize: '12px' }}>
                  <span style={{ color: '#bbb', textDecoration: 'line-through', marginRight: '6px' }}>{fmtPrice(baseDevicePrice)}</span>
                  <span style={{ color: '#555', fontWeight: 600 }}>{fmtPrice(monthlyDevicePrice)}</span>
                </span>
              </div>
            </button>

            {/* Add-ons panel — slides in when a plan is selected */}
            {selectedPlan && (
              <div
                data-addons-panel
                style={{
                  border: '1.5px solid #e8e8e8',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  animation: 'fadeSlideIn 0.2s ease',
                }}>
                <div style={{ padding: '14px 20px 10px', borderBottom: '1px solid #f0f0f0' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#171717', letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>
                    Customize your plan
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#888', marginTop: '2px' }}>Optional add-ons — remove anytime</div>
                </div>

                {addons.length === 0 ? (
                  <div style={{ padding: '16px 20px', fontSize: '13px', color: '#aaa' }}>No add-ons available for this product.</div>
                ) : (
                  addons.map((addon) => {
                    const checked = selectedAddons.has(addon._id)
                    const intervalLabel = addon.billingInterval === 'one-time'
                      ? ' one-time'
                      : selectedPlan === 'annual' ? '/yr' : '/mo'
                    return (
                      <button
                        key={addon._id}
                        type="button"
                        role="checkbox"
                        aria-checked={checked}
                        aria-label={addon.name}
                        onClick={(e) => { e.stopPropagation(); toggleAddon(addon._id) }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '14px',
                          padding: '14px 20px',
                          borderBottom: '1px solid #f5f5f5',
                          cursor: 'pointer',
                          background: checked ? '#f9fffe' : '#fff',
                          transition: 'background 0.12s ease',
                          width: '100%',
                          border: 'none',
                          borderTop: 'none',
                          borderLeft: 'none',
                          borderRight: 'none',
                          textAlign: 'left',
                        }}
                      >
                        {/* Checkbox */}
                        <div style={{
                          width: '20px', height: '20px', borderRadius: '5px', flexShrink: 0,
                          border: checked ? 'none' : '2px solid #d0d0d0',
                          background: checked ? '#4294d8' : '#fff',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'background 0.12s ease',
                        }}>
                          {checked && (
                            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                              <path d="M2 5.5L4.5 8L9 3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </div>
                        {/* Info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '13px', fontWeight: 600, color: '#171717' }}>{addon.name}</div>
                          {addon.shortDescription && (
                            <div style={{ fontSize: '11.5px', color: '#888', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{addon.shortDescription}</div>
                          )}
                        </div>
                        {/* Price */}
                        {(() => {
                          const displayPrice = addon.billingInterval === 'one-time'
                            ? (addon.priceMonthly ?? addon.priceAnnual)
                            : selectedPlan === 'annual' ? addon.priceAnnual : addon.priceMonthly
                          return displayPrice !== undefined ? (
                            <div style={{ flexShrink: 0, textAlign: 'right' as const }}>
                              <span style={{ fontSize: '12px', fontWeight: 500, color: '#888', marginRight: '1px' }}>+</span>
                              <span style={{ fontSize: '13px', fontWeight: 700, color: '#171717' }}>{fmtPrice(displayPrice)}</span>
                              <span style={{ fontSize: '11px', color: '#aaa' }}>{intervalLabel}</span>
                            </div>
                          ) : null
                        })()}
                      </button>
                    )
                  })
                )}

                {/* CTA */}
                <div style={{ padding: '14px 20px 16px' }}>
                  <Link
                    href={buildCheckoutUrl(selectedPlan)}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      display: 'block',
                      textAlign: 'center' as const,
                      background: selectedPlan === 'annual' ? '#4294d8' : '#171717',
                      color: '#fff',
                      fontSize: '13px',
                      fontWeight: 700,
                      padding: '13px 20px',
                      borderRadius: '9px',
                      textDecoration: 'none',
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase' as const,
                    }}
                  >
                    {selectedAddons.size > 0 ? `Continue with ${selectedAddons.size} add-on${selectedAddons.size > 1 ? 's' : ''}` : 'Continue to Checkout'}
                  </Link>
                  <Link
                    href={`/checkout?product=${slug}&plan=${selectedPlan}`}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      display: 'block',
                      textAlign: 'center' as const,
                      fontSize: '12px',
                      color: '#999',
                      marginTop: '10px',
                      textDecoration: 'none',
                    }}
                  >
                    {selectedAddons.size > 0 ? 'Continue without add-ons →' : 'No thanks, continue without add-ons →'}
                  </Link>
                </div>
              </div>
            )}

          </div>

          <style>{`
            @keyframes fadeSlideIn {
              from { opacity: 0; transform: translateY(-6px); }
              to   { opacity: 1; transform: translateY(0); }
            }
            @media (prefers-reduced-motion: reduce) {
              [data-addons-panel] { animation: none !important; }
            }
          `}</style>

          {/* Accordion drawers */}
          <div style={{ borderTop: '1px solid #e5e5e5' }}>

            {/* Delivery terms */}
            <div style={{ borderBottom: '1px solid #e5e5e5' }}>
              <button
                onClick={() => setDeliveryOpen((o) => !o)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', background: 'none', border: 'none', cursor: 'pointer', gap: '12px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M1 4h10v9H1V4zM11 7h3.5L16 9.5V13h-5V7z" stroke="#171717" strokeWidth="1.3" strokeLinejoin="round"/>
                    <circle cx="4" cy="13.5" r="1.5" fill="#171717"/>
                    <circle cx="13" cy="13.5" r="1.5" fill="#171717"/>
                  </svg>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#171717' }}>Delivery terms</span>
                </div>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#f0f6fd', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: '18px', color: '#4294d8', lineHeight: 1, marginTop: deliveryOpen ? '0' : '-1px' }}>{deliveryOpen ? '−' : '+'}</span>
                </div>
              </button>
              <div style={{ overflow: 'hidden', maxHeight: deliveryOpen ? '200px' : '0', transition: 'max-height 0.3s ease' }}>
                <div style={{ paddingBottom: '20px' }}>
                  <p style={{ fontSize: '13.5px', color: '#555', lineHeight: 1.65, margin: '0 0 10px' }}>
                    Orders ship quickly, with delivery in <strong style={{ color: '#171717' }}>3 to 6 business days</strong> after dispatch. You&apos;ll receive a tracking link as soon as your order is on its way.
                  </p>
                  <p style={{ fontSize: '13.5px', color: '#555', lineHeight: 1.65, margin: 0 }}>
                    Need assistance? <a href="mailto:support@holoalert.ca" style={{ color: '#4294d8', textDecoration: 'underline' }}>Our team is happy to help!</a>
                  </p>
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div style={{ borderBottom: '1px solid #e5e5e5' }}>
              <button
                onClick={() => setSpecsOpen((o) => !o)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', background: 'none', border: 'none', cursor: 'pointer', gap: '12px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <circle cx="9" cy="9" r="8" stroke="#171717" strokeWidth="1.3"/>
                    <path d="M9 8v5M9 6v.5" stroke="#171717" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#171717' }}>Specifications</span>
                </div>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#f0f6fd', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: '18px', color: '#4294d8', lineHeight: 1, marginTop: specsOpen ? '0' : '-1px' }}>{specsOpen ? '−' : '+'}</span>
                </div>
              </button>
              <div style={{ overflow: 'hidden', maxHeight: specsOpen ? '600px' : '0', transition: 'max-height 0.35s ease' }}>
                <div style={{ paddingBottom: '20px' }}>
                  {/* Sanity specs */}
                  {device.specs && device.specs.length > 0 && (
                    <div style={{ marginBottom: device.pricingCardBenefits?.length ? '16px' : '0' }}>
                      {device.specs.map((spec, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < device.specs!.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                          <span style={{ fontSize: '13.5px', color: '#444', fontWeight: 500 }}>{spec.label}</span>
                          <span style={{ fontSize: '13.5px', color: '#787878' }}>{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* pricingCardBenefits */}
                  {device.pricingCardBenefits && device.pricingCardBenefits.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: device.specs?.length ? '12px' : '0' }}>
                      {device.pricingCardBenefits.map((benefit) => (
                        <div key={benefit} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', color: '#444' }}>
                          <CheckIcon />
                          {benefit}
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Fall alert disclaimer */}
                  {device.fallAlertDisclaimer && (
                    <p style={{ fontSize: '11.5px', color: '#aaa', lineHeight: 1.5, margin: '16px 0 0' }}>
                      {device.fallAlertDisclaimer}
                    </p>
                  )}
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  )
}

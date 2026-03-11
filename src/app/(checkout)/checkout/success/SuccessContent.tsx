'use client'

import { useEffect, useState } from 'react'
import type { OrderItem } from './page'

interface Props {
  firstName: string
  email: string
  deviceName: string
  plan: string
  items: OrderItem[]
}

const TIMELINE_STEPS = [
  {
    title: 'Order Received',
    description: "We've got your order and our team is on it.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M6.5 10L9 12.5L13.5 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Device Programming',
    description: 'Your device gets personally configured — ready to go out of the box.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="3" y="4" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7 17h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M10 14v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Shipped to You',
    description: "We'll send tracking info so you know exactly when to expect it. Delivery typically takes 3–6 business days.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M2 5h10v9H2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M12 8h3.5l2.5 3v3h-6V8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="5.5" cy="14.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="14.5" cy="14.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    title: 'Personal Setup Call',
    description: "After delivery, we'll call to walk through setup and testing together — so everything works perfectly.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M4.5 3.5C4.5 3.5 5.5 3 6.5 3.5L8 5.5C8 5.5 8 7 7 7.5C6.5 7.75 6.5 8.5 8 10C9.5 11.5 10.25 11.5 10.5 11C11 10 12.5 10 12.5 10L14.5 11.5C15 12.5 14.5 13.5 14.5 13.5C13.5 15.5 10 16 7 13C4 10 4.5 6.5 4.5 3.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
  },
]

export default function SuccessContent({ firstName, email, deviceName, plan, items }: Props) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Clean up item names — remove redundant pricing info from Stripe descriptions
  const cleanItems = items.map(item => {
    let name = item.name
    name = name.replace(/\s*×\s*\d+/, '')
    return { ...item, name }
  })

  const serviceItems = cleanItems.filter(i => i.isRecurring)
  const oneTimeItems = cleanItems.filter(i => !i.isRecurring)
  const planLabel = plan === 'annual' ? 'Annual Plan' : plan === 'monthly' ? 'Monthly Plan' : ''

  return (
    <div className="font-sans" style={{ lineHeight: 1.3 }}>
      {/* Hero confirmation band */}
      <section style={{ background: '#f2f2f2' }}>
        <div
          className="mx-auto px-10 py-[100px] text-center"
          style={{
            maxWidth: '800px',
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}
        >
          {/* Checkmark */}
          <div
            className="mx-auto mb-6 flex items-center justify-center"
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: '#45b864',
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'scale(1)' : 'scale(0.6)',
              transition: 'opacity 0.5s ease 0.15s, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s',
            }}
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path
                d="M8 16L13.5 21.5L24 10"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h1
            className="text-3xl md:text-4xl font-bold tracking-tight text-brand-black mb-3"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(8px)',
              transition: 'opacity 0.5s ease 0.3s, transform 0.5s ease 0.3s',
            }}
          >
            {firstName ? `Thank you, ${firstName}!` : 'Thank you!'}
          </h1>
          <p
            className="text-brand-gray text-base md:text-lg"
            style={{
              lineHeight: 1.3,
              textWrap: 'pretty',
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(8px)',
              transition: 'opacity 0.5s ease 0.4s, transform 0.5s ease 0.4s',
            }}
          >
            Your subscription is confirmed.{' '}
            {email && (
              <>
                A confirmation email has been sent to{' '}
                <strong className="text-brand-black">{email}</strong>.
              </>
            )}
          </p>
        </div>
      </section>

      {/* Main content */}
      <section
        className="mx-auto"
        style={{ maxWidth: '800px', padding: '100px 40px' }}
      >
        <div className="grid gap-16">

          {/* Your Order */}
          <div
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(16px)',
              transition: 'opacity 0.5s ease 0.5s, transform 0.5s ease 0.5s',
            }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div
                className="flex items-center justify-center rounded-full"
                style={{
                  width: '32px',
                  height: '32px',
                  background: '#4294d8',
                  color: '#fff',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="3" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
                  <path d="M2 6.5h12" stroke="currentColor" strokeWidth="1.4" />
                  <path d="M5.5 1.5v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  <path d="M10.5 1.5v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-brand-black tracking-tight">Your Order</h2>
            </div>

            <div
              className="rounded-xl overflow-hidden"
              style={{
                border: '1px solid #d9d9d9',
                background: '#f2f2f2',
              }}
            >
              {/* Device */}
              <div className="px-6 py-5 flex items-center gap-4" style={{ borderBottom: '1px solid #d9d9d9' }}>
                <div
                  className="flex items-center justify-center rounded-lg shrink-0"
                  style={{
                    width: '48px',
                    height: '48px',
                    background: '#fff',
                    border: '1px solid #d9d9d9',
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect x="6" y="2" width="12" height="20" rx="3" stroke="#4294d8" strokeWidth="1.5" />
                    <circle cx="12" cy="18" r="1" fill="#4294d8" />
                    <path d="M9 6h6" stroke="#4294d8" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-brand-black text-[15px]">{deviceName}</p>
                  {planLabel && (
                    <p className="text-brand-gray text-[13px] mt-0.5">{planLabel}</p>
                  )}
                </div>
              </div>

              {/* Service items */}
              {serviceItems.length > 0 && (
                <div className="px-6 py-4" style={{ borderBottom: oneTimeItems.length > 0 ? '1px solid #d9d9d9' : 'none' }}>
                  <p className="text-[11px] font-semibold text-brand-gray uppercase tracking-widest mb-3">Included Services</p>
                  <div className="space-y-2.5">
                    {serviceItems.map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
                          <circle cx="8" cy="8" r="7" stroke="#45b864" strokeWidth="1.2" />
                          <path d="M5 8l2 2 4-4" stroke="#45b864" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="text-brand-black text-[14px]">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* One-time items */}
              {oneTimeItems.length > 0 && (
                <div className="px-6 py-4">
                  <p className="text-[11px] font-semibold text-brand-gray uppercase tracking-widest mb-3">One-Time</p>
                  <div className="space-y-2.5">
                    {oneTimeItems.map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
                          <circle cx="8" cy="8" r="7" stroke="#4294d8" strokeWidth="1.2" />
                          <path d="M5 8l2 2 4-4" stroke="#4294d8" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="text-brand-black text-[14px]">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Fallback if no items came through */}
              {items.length === 0 && (
                <div className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
                      <circle cx="8" cy="8" r="7" stroke="#45b864" strokeWidth="1.2" />
                      <path d="M5 8l2 2 4-4" stroke="#45b864" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-brand-black text-[14px]">24/7 Professional Monitoring Service</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* What to Expect timeline */}
          <div
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(16px)',
              transition: 'opacity 0.5s ease 0.65s, transform 0.5s ease 0.65s',
            }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div
                className="flex items-center justify-center rounded-full"
                style={{
                  width: '32px',
                  height: '32px',
                  background: '#171717',
                  color: '#fff',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4" />
                  <path d="M8 5v3.5l2.5 1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-brand-black tracking-tight">What to Expect</h2>
            </div>

            <div className="relative pl-2">
              {TIMELINE_STEPS.map((step, i) => (
                <div
                  key={i}
                  className="relative flex gap-5 pb-8 last:pb-0"
                  style={{
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? 'translateX(0)' : 'translateX(-8px)',
                    transition: `opacity 0.4s ease ${0.7 + i * 0.1}s, transform 0.4s ease ${0.7 + i * 0.1}s`,
                  }}
                >
                  {/* Vertical connector line */}
                  {i < TIMELINE_STEPS.length - 1 && (
                    <div
                      className="absolute left-[19px] top-[44px] w-[2px]"
                      style={{
                        height: 'calc(100% - 36px)',
                        background: '#d9d9d9',
                      }}
                    />
                  )}

                  {/* Step icon */}
                  <div
                    className="relative shrink-0 flex items-center justify-center rounded-full"
                    style={{
                      width: '40px',
                      height: '40px',
                      background: i === 0 ? '#45b864' : '#fff',
                      border: i === 0 ? 'none' : '2px solid #d9d9d9',
                      color: i === 0 ? '#fff' : '#787878',
                    }}
                  >
                    {step.icon}
                  </div>

                  <div className="pt-2">
                    <h3 className="font-medium text-brand-black text-[15px] mb-1">{step.title}</h3>
                    <p className="text-brand-gray text-[14px]" style={{ lineHeight: 1.3, textWrap: 'pretty' }}>{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Contact CTA */}
          <div
            className="rounded-xl overflow-hidden"
            style={{
              border: '1px solid #d9d9d9',
              background: '#f2f2f2',
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(16px)',
              transition: 'opacity 0.5s ease 1.1s, transform 0.5s ease 1.1s',
            }}
          >
            <div className="px-6 py-8 md:px-8 text-center">
              <div
                className="mx-auto mb-4 flex items-center justify-center rounded-full"
                style={{
                  width: '52px',
                  height: '52px',
                  background: '#f46036',
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 0v2" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="9" cy="7" r="4" stroke="white" strokeWidth="1.8" />
                  <line x1="19" y1="8" x2="19" y2="14" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                  <line x1="16" y1="11" x2="22" y2="11" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </div>

              <h3 className="font-medium text-brand-black text-lg mb-2">
                Add Your Emergency Contacts
              </h3>
              <p className="text-brand-gray text-[14px] max-w-sm mx-auto mb-6" style={{ lineHeight: 1.3, textWrap: 'pretty' }}>
                Help us keep you safe — let us know who we should reach in an emergency so your monitoring is ready from day one.
              </p>

              <a
                href="/emergency-contacts"
                className="inline-flex items-center justify-center gap-2 font-semibold text-white text-[14px] rounded-lg"
                style={{
                  background: '#f46036',
                  padding: '14px 36px',
                  letterSpacing: '0.03em',
                  transition: 'opacity 0.15s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9' }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
              >
                Add Emergency Contacts
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </div>

          {/* Support footer */}
          <div
            className="text-center pb-4"
            style={{
              opacity: mounted ? 1 : 0,
              transition: 'opacity 0.5s ease 1.2s',
            }}
          >
            <p className="text-brand-gray text-[13px]">
              Need help? Reach us at{' '}
              <a href="mailto:support@holoalert.ca" className="text-brand-blue font-semibold hover:underline">
                support@holoalert.ca
              </a>{' '}
              or call{' '}
              <a href="tel:18884114656" className="text-brand-blue font-semibold hover:underline">
                1.888.411.4656
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

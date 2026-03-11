'use client'

import { useState } from 'react'
import Image from 'next/image'

const ACCORDION_ITEMS = [
  {
    num: '01',
    title: 'Find Your Device with Ease',
    body: 'Misplaced your pendant? No problem. Use the app to quickly locate your device on a map, whether it\'s at home or somewhere else.',
  },
  {
    num: '02',
    title: 'Stay Informed with Real-Time Alerts',
    body: 'Get instant notifications on your phone about important events, like button presses, detected falls, low battery, and more. Stay connected and informed, even when you\'re away.',
  },
  {
    num: '03',
    title: 'View Activity and History with Ease',
    body: 'Monitor activity levels and health trends with the app. View a history of button presses and track daily steps to stay informed about your well-being.',
  },
  {
    num: '04',
    title: 'Your Privacy, Our Priority',
    body: 'Rest assured that your information is always protected. You control who sees your information, maintaining your privacy and peace of mind.',
  },
]

function PhoneMockup({ front }: { front: boolean }) {
  if (front) {
    // Main home screen phone
    return (
      <div style={{
        width: '200px',
        height: '420px',
        background: '#0f1923',
        borderRadius: '32px',
        border: '2px solid rgba(255,255,255,0.15)',
        overflow: 'hidden',
        boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)',
        position: 'relative',
        flexShrink: 0,
      }}>
        {/* Notch */}
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '80px', height: '22px', background: '#0f1923', borderRadius: '0 0 16px 16px', zIndex: 10 }} />
        <div style={{ padding: '28px 12px 12px', display: 'flex', flexDirection: 'column', gap: '8px', height: '100%' }}>
          {/* Status bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
            <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>9:16</span>
            <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
              <div style={{ width: '12px', height: '6px', border: '1px solid rgba(255,255,255,0.5)', borderRadius: '1.5px', position: 'relative' }}>
                <div style={{ position: 'absolute', inset: '1px', background: '#45b864', borderRadius: '0.5px' }} />
              </div>
            </div>
          </div>
          {/* App header */}
          <div style={{ background: '#4294d8', borderRadius: '10px', padding: '8px 10px', marginBottom: '2px' }}>
            <div style={{ fontSize: '11px', color: '#fff', fontWeight: 700 }}>Holo Alert</div>
          </div>
          {/* Steps card */}
          <div style={{ background: '#1a2535', borderRadius: '10px', padding: '8px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.5)', fontWeight: 600, letterSpacing: '0.05em' }}>STEPS</div>
              <div style={{ fontSize: '13px', color: '#fff', fontWeight: 700, marginTop: '2px' }}>0 / 4000</div>
            </div>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid #4294d8' }} />
            </div>
          </div>
          {/* First motion card */}
          <div style={{ background: '#1a2535', borderRadius: '10px', padding: '8px 10px' }}>
            <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.5)', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '3px' }}>FIRST MOTION</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>No data for today</div>
            <div style={{ display: 'flex', gap: '2px', alignItems: 'flex-end', height: '20px', marginTop: '4px' }}>
              {[2, 5, 3, 7, 4, 6, 2].map((h, i) => (
                <div key={i} style={{ flex: 1, background: i === 4 ? '#4294d8' : 'rgba(66,148,216,0.25)', borderRadius: '2px', height: `${h * 3}px` }} />
              ))}
            </div>
          </div>
          {/* SOS card */}
          <div style={{ background: '#1a2535', borderRadius: '10px', padding: '8px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.5)', fontWeight: 600, letterSpacing: '0.05em' }}>SOS</div>
              <div style={{ fontSize: '11px', color: '#4294d8', marginTop: '1px' }}>Dec 12</div>
              <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>3 times in last 7 days</div>
            </div>
            <div style={{ display: 'flex', gap: '2px', alignItems: 'flex-end', height: '24px' }}>
              {[1, 2, 0, 3, 1, 0, 2].map((h, i) => (
                <div key={i} style={{ width: '4px', background: i === 3 ? '#4294d8' : 'rgba(66,148,216,0.3)', borderRadius: '1px', height: `${(h + 1) * 5}px` }} />
              ))}
            </div>
          </div>
          {/* Battery card */}
          <div style={{ background: '#1a2535', borderRadius: '10px', padding: '8px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.5)', fontWeight: 600, letterSpacing: '0.05em' }}>BATTERY</div>
              <div style={{ fontSize: '13px', color: '#fff', fontWeight: 700, marginTop: '2px' }}>50%</div>
              <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)' }}>1–2 Days Remaining</div>
            </div>
            <div style={{ width: '20px', height: '34px', border: '2px solid rgba(255,255,255,0.3)', borderRadius: '4px', position: 'relative' }}>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%', background: '#45b864', borderRadius: '1px' }} />
              <div style={{ position: 'absolute', top: '-5px', left: '50%', transform: 'translateX(-50%)', width: '6px', height: '3px', background: 'rgba(255,255,255,0.3)', borderRadius: '1px' }} />
            </div>
          </div>
          {/* Bottom nav */}
          <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-around', padding: '6px 0', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            {['Home', 'Location', 'Device', 'Settings'].map((tab, i) => (
              <div key={tab} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                <div style={{ width: '14px', height: '14px', borderRadius: '3px', background: i === 0 ? '#4294d8' : 'rgba(255,255,255,0.15)' }} />
                <span style={{ fontSize: '6px', color: i === 0 ? '#4294d8' : 'rgba(255,255,255,0.4)' }}>{tab}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Back phone — map view
  return (
    <div style={{
      width: '180px',
      height: '380px',
      background: '#0f1923',
      borderRadius: '28px',
      border: '2px solid rgba(255,255,255,0.1)',
      overflow: 'hidden',
      boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
      flexShrink: 0,
    }}>
      <div style={{ position: 'relative', top: 0, left: '50%', transform: 'translateX(-50%)', width: '70px', height: '18px', background: '#0f1923', borderRadius: '0 0 12px 12px', zIndex: 10 }} />
      <div style={{ padding: '8px 10px', display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Map area */}
        <div style={{ flex: 1, background: '#1b2d3e', borderRadius: '10px', overflow: 'hidden', position: 'relative', marginBottom: '8px' }}>
          {/* Fake map grid */}
          <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(66,148,216,0.12)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            {/* Roads */}
            <line x1="0" y1="60%" x2="100%" y2="55%" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
            <line x1="30%" y1="0" x2="35%" y2="100%" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
            <line x1="65%" y1="0" x2="60%" y2="100%" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
            {/* Location pin */}
            <circle cx="50%" cy="50%" r="6" fill="#4294d8" />
            <circle cx="50%" cy="50%" r="12" fill="rgba(66,148,216,0.2)" />
          </svg>
          {/* Location label */}
          <div style={{ position: 'absolute', bottom: '8px', left: '8px', right: '8px', background: 'rgba(15,25,35,0.85)', borderRadius: '6px', padding: '5px 7px' }}>
            <div style={{ fontSize: '8px', color: '#4294d8', fontWeight: 600 }}>CURRENT LOCATION</div>
            <div style={{ fontSize: '7px', color: 'rgba(255,255,255,0.6)', marginTop: '1px' }}>Toronto, Ontario</div>
          </div>
        </div>
        {/* App header */}
        <div style={{ background: '#4294d8', borderRadius: '8px', padding: '6px 8px', marginBottom: '6px' }}>
          <div style={{ fontSize: '10px', color: '#fff', fontWeight: 700 }}>Holo Alert</div>
        </div>
        {/* Nav */}
        <div style={{ display: 'flex', justifyContent: 'space-around', padding: '4px 0', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          {['Home', 'Location', 'Device', 'Settings'].map((tab, i) => (
            <div key={tab} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: i === 1 ? '#4294d8' : 'rgba(255,255,255,0.15)' }} />
              <span style={{ fontSize: '5px', color: i === 1 ? '#4294d8' : 'rgba(255,255,255,0.4)' }}>{tab}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

interface Props {
  backgroundImage?: string
  foregroundImage?: string
  foregroundImageAlt?: string
}

export default function CaregiverConnectedSection({ backgroundImage, foregroundImage, foregroundImageAlt }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section style={{ background: '#fff', overflow: 'hidden' }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        minHeight: '680px',
      }}>

        {/* ── Left: app imagery ── */}
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          minHeight: '560px',
        }}>
          {/* Background layer */}
          {backgroundImage ? (
            <Image
              src={backgroundImage}
              alt=""
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          ) : (
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(160deg, #0d1f2d 0%, #1a3a52 40%, #0f2538 100%)',
            }} />
          )}
          {/* Overlay to darken background behind foreground image */}
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.25)', zIndex: 1 }} />
          {/* Foreground layer */}
          <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', width: '100%', height: '100%' }}>
            {foregroundImage ? (
              <Image
                src={foregroundImage}
                alt={foregroundImageAlt ?? 'Holo Alert caregiver app'}
                width={420}
                height={520}
                style={{ objectFit: 'contain', maxHeight: '520px', filter: 'drop-shadow(0 32px 64px rgba(0,0,0,0.5))' }}
              />
            ) : (
              <>
                {/* CSS phone mockup fallback */}
                <div style={{ position: 'absolute', top: '30px', left: '110px', zIndex: 1, opacity: 0.9 }}>
                  <PhoneMockup front={false} />
                </div>
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <PhoneMockup front={true} />
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── Right: content ── */}
        <div style={{
          background: '#fff',
          padding: '72px 64px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>

          <h2 style={{
            fontSize: 'clamp(36px, 4vw, 56px)',
            fontWeight: 800,
            color: '#171717',
            lineHeight: 1.05,
            letterSpacing: '-0.025em',
            margin: '0 0 24px',
          }}>
            Caregiver<br />Connected
          </h2>

          <p style={{ fontSize: '15px', color: '#787878', lineHeight: 1.7, margin: '0 0 14px' }}>
            The Holo Alert Caregiver App provides an extra layer of support and connection. With this easy-to-use app, family members can stay informed and involved in your well-being.
          </p>
          <p style={{ fontSize: '15px', color: '#787878', lineHeight: 1.7, margin: '0 0 32px' }}>
            They can locate your device on demand, receive notifications for button presses and falls, and even track your daily steps. You&apos;ll have peace of mind knowing your loved ones are always connected and ready to assist.
          </p>

          <div style={{ marginBottom: '40px' }}>
            <a
              href="#"
              style={{
                display: 'inline-block',
                background: '#171717',
                color: '#fff',
                fontSize: '14px',
                fontWeight: 600,
                padding: '12px 24px',
                borderRadius: '100px',
                textDecoration: 'none',
                letterSpacing: '0.01em',
              }}
            >
              Learn More
            </a>
          </div>

          {/* Accordion */}
          <div>
            {ACCORDION_ITEMS.map((item, i) => (
              <div key={i}>
                <div style={{ height: '1px', background: '#e2e2e2' }} />
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '18px 0',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span style={{ fontSize: '11px', color: '#4294d8', fontWeight: 700, letterSpacing: '0.05em', minWidth: '20px' }}>{item.num}</span>
                  <span style={{ flex: 1, fontSize: '15px', fontWeight: 600, color: '#171717', lineHeight: 1.3 }}>{item.title}</span>
                  <span style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    border: '1.5px solid #4294d8',
                    color: '#4294d8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    fontWeight: 300,
                    flexShrink: 0,
                    transition: 'transform 0.2s',
                    transform: openIndex === i ? 'rotate(45deg)' : 'rotate(0deg)',
                  }}>+</span>
                </button>
                {openIndex === i && (
                  <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.7, margin: '0 0 16px', paddingLeft: '36px' }}>
                    {item.body}
                  </p>
                )}
              </div>
            ))}
            <div style={{ height: '1px', background: '#e2e2e2' }} />
          </div>

        </div>

      </div>
    </section>
  )
}

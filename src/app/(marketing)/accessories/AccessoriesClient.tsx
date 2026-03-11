'use client'

import { useState } from 'react'
import Image from 'next/image'

const accessoryImages = [
  {
    src: '/images/beltclip-accs.avif',
    alt: 'Belt clip accessory',
  },
  {
    src: '/images/lanyard-accs.webp',
    alt: 'Lanyard accessory',
  },
  {
    src: '/images/chargingcradle-accs.avif',
    alt: 'Charging cradle',
  },
  {
    src: '/images/wallplug-accss.webp',
    alt: 'Wall plug adapter',
  },
]

export default function AccessoriesClient() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) setSubmitted(true)
  }

  return (
    <>
      {/* Page shell — white bg, full height */}
      <div style={{ background: '#fff', minHeight: '100vh', paddingTop: '108px' }}>
        {/* Max-width container */}
        <div
          className="acc-wrap"
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '0 40px',
            display: 'flex',
            minHeight: 'calc(100vh - 108px)',
          }}
        >
        {/* ── Left: copy + form ── */}
        <div
          className="acc-left"
          style={{
            flex: '0 0 50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px 40px 80px 0',
          }}
        >
          <div style={{ maxWidth: '460px', width: '100%' }}>
            <h1
              style={{
                fontFamily: 'var(--font-instrument-sans), sans-serif',
                fontSize: 'clamp(40px, 4.5vw, 68px)',
                fontWeight: 700,
                color: '#171717',
                lineHeight: 1.1,
                margin: '0 0 20px',
                letterSpacing: '-0.02em',
                whiteSpace: 'nowrap',
              }}
            >
              Coming Soon
            </h1>

            <p
              style={{
                fontFamily: 'var(--font-instrument-sans), sans-serif',
                fontSize: '15px',
                color: '#555',
                lineHeight: 1.7,
                margin: '0 0 32px',
                textAlign: 'center',
              }}
            >
              Exciting updates are coming! Leave your email to stay informed about our latest
              innovations for senior safety and independent living.
            </p>

            {submitted ? (
              <div
                style={{
                  background: '#eef5fc',
                  border: '1px solid #c4dff4',
                  borderRadius: '8px',
                  padding: '16px 20px',
                  fontFamily: 'var(--font-instrument-sans), sans-serif',
                  fontSize: '14px',
                  color: '#2a6090',
                  fontWeight: 500,
                }}
              >
                Thanks! We&apos;ll be in touch when accessories launch.
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <label
                  htmlFor="acc-email"
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-instrument-sans), sans-serif',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: '#333',
                    marginBottom: '6px',
                  }}
                >
                  Email
                </label>
                <input
                  id="acc-email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    display: 'block',
                    width: '100%',
                    fontFamily: 'var(--font-instrument-sans), sans-serif',
                    fontSize: '14px',
                    color: '#171717',
                    background: '#fff',
                    border: '1px solid #d9d9d9',
                    borderRadius: '6px',
                    padding: '10px 12px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    marginBottom: '12px',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#4294d8'
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(66,148,216,0.12)'
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#d9d9d9'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: '#4294d8',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '10px 28px',
                    fontFamily: 'var(--font-instrument-sans), sans-serif',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#3280c4')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#4294d8')}
                >
                  Submit
                </button>
              </form>
            )}
          </div>
        </div>

        {/* ── Right: 2×2 image grid ── */}
        <div
          className="acc-right"
          style={{
            flex: '0 0 50%',
            padding: '120px 0',
            display: 'flex',
            alignItems: 'stretch',
          }}
        >
          <div
            style={{
              background: '#f0f0f0',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gridTemplateRows: '1fr 1fr',
              width: '100%',
            }}
          >
            {accessoryImages.map((img, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRight: i % 2 === 0 ? '1px solid #e0e0e0' : 'none',
                  borderBottom: i < 2 ? '1px solid #e0e0e0' : 'none',
                  padding: '40px',
                }}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={420}
                  height={380}
                  style={{
                    width: '100%',
                    height: 'auto',
                    objectFit: 'contain',
                    maxHeight: '220px',
                  }}
                />
              </div>
            ))}
          </div>
        </div>
        </div>{/* end max-width container */}
      </div>{/* end page shell */}

      <style>{`
        @media (max-width: 768px) {
          .acc-wrap { flex-direction: column; padding: 0 20px !important; }
          .acc-left { flex: none !important; padding: 60px 0 !important; }
          .acc-right { flex: none !important; padding: 0 0 60px !important; }
        }
      `}</style>
    </>
  )
}

'use client'

import { useRef, useEffect } from 'react'

interface Props {
  videoUrl?: string
}

export default function ProductAmbientVideoSection({ videoUrl }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    videoRef.current?.play().catch(() => {})
  }, [videoUrl])

  if (!videoUrl) return null

  return (
    <section style={{ background: '#ffffff', padding: '60px 40px 80px' }}>
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          borderRadius: '20px',
          overflow: 'hidden',
          position: 'relative',
          aspectRatio: '16 / 7',
          background: '#111',
        }}
      >
        <video
          ref={videoRef}
          src={videoUrl}
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />

        {/* Scrim */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.32)',
          pointerEvents: 'none',
        }} />

        {/* Text overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '0 40px',
          gap: '4px',
          pointerEvents: 'none',
        }}>
          <p style={{
            fontSize: 'clamp(24px, 3.5vw, 52px)',
            fontWeight: 700,
            color: '#ffffff',
            margin: 0,
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
            textShadow: '0 2px 24px rgba(0,0,0,0.3)',
          }}>
            Keep living your life.
          </p>
          <p style={{
            fontSize: 'clamp(24px, 3.5vw, 52px)',
            fontWeight: 700,
            color: '#ffffff',
            margin: 0,
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
            textShadow: '0 2px 24px rgba(0,0,0,0.3)',
          }}>
            We&apos;re here when you need us.
          </p>
        </div>
      </div>
    </section>
  )
}

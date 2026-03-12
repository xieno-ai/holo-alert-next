'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'

interface Feature {
  _key?: string
  title?: string
  content?: string
  image?: {
    asset?: { _ref?: string; url?: string }
    alt?: string
    [key: string]: unknown
  }
  video?: {
    asset?: { url?: string }
  }
}

interface Props {
  features?: Feature[]
  productName?: string
  eyebrow?: string
  heading?: string
}

const ICONS = [
  (active: boolean) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M12 2l8 3v5c0 5-3.5 9.5-8 11C7.5 19.5 4 15 4 10V5l8-3z" stroke={active ? '#4294d8' : '#a0a0a0'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 12l2 2 4-4" stroke={active ? '#4294d8' : '#a0a0a0'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  (active: boolean) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke={active ? '#4294d8' : '#a0a0a0'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="9" r="2.5" stroke={active ? '#4294d8' : '#a0a0a0'} strokeWidth="1.5"/>
    </svg>
  ),
  (active: boolean) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke={active ? '#4294d8' : '#a0a0a0'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  (active: boolean) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke={active ? '#4294d8' : '#a0a0a0'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  (active: boolean) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.87 9.87a19.79 19.79 0 01-3.07-8.67A2 2 0 012.81 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.09 9.91a16 16 0 006 6l.97-.97a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke={active ? '#4294d8' : '#a0a0a0'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  (active: boolean) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="7" width="18" height="10" rx="2" stroke={active ? '#4294d8' : '#a0a0a0'} strokeWidth="1.5"/>
      <path d="M20 11h2v2h-2v-2z" fill={active ? '#4294d8' : '#a0a0a0'}/>
      <path d="M6 12h6" stroke={active ? '#4294d8' : '#a0a0a0'} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
]

export default function ProductFeaturesSection({ features, productName = 'Holo Pro', eyebrow, heading }: Props) {
  const [activeIndex, setActiveIndex] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)
  const count = features?.length ?? 0

  useEffect(() => {
    if (!count) return

    const handleScroll = () => {
      if (!trackRef.current) return
      const rect = trackRef.current.getBoundingClientRect()
      const totalScroll = rect.height - window.innerHeight
      const scrolled = -rect.top
      const progress = scrolled / totalScroll
      const index = Math.min(Math.max(Math.floor(progress * count), 0), count - 1)
      setActiveIndex(index)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [count])

  if (!features || features.length === 0) return null

  const activeFeature = features[activeIndex]
  const hasVideo = activeFeature?.video?.asset?.url
  const hasImage = activeFeature?.image?.asset

  return (
    // Scroll track — N viewport heights tall; the sticky child "captures" each one
    <div ref={trackRef} className="features-scroll-track" style={{ height: `${(count + 1) * 100}vh` }}>
      <style>{`
        @media (max-width: 768px) {
          .features-scroll-track { height: auto !important; }
          .features-sticky-section {
            position: relative !important;
            height: auto !important;
            padding: 60px 0 40px !important;
          }
          .features-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
            padding: 0 16px !important;
          }
          .features-image-panel {
            height: 300px !important;
            order: -1;
          }
          .features-header { margin-bottom: 28px !important; }
        }
        @media (max-width: 480px) {
          .features-grid { padding: 0 12px !important; }
          .features-image-panel { height: 240px !important; }
        }
      `}</style>
      <section
        className="features-sticky-section"
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
          background: '#ffffff',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          className="features-grid"
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            width: '100%',
            padding: '0 40px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '80px',
            alignItems: 'center',
          }}
        >
          {/* ── LEFT: Feature list ── */}
          <div>
            {/* Header */}
            <div className="features-header" style={{ marginBottom: '48px' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase' as const,
                  color: '#4294d8',
                  display: 'block',
                  marginBottom: '12px',
                }}
              >
                {eyebrow ?? 'Built For Real Life'}
              </span>
              <h2
                style={{
                  fontSize: 'clamp(26px, 2.5vw, 42px)',
                  fontWeight: 700,
                  color: '#171717',
                  lineHeight: 1.1,
                  margin: 0,
                  letterSpacing: '-0.02em',
                }}
              >
                {heading ?? `Why ${productName}?`}
              </h2>
            </div>

            {/* Feature rows */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {features.map((feature, i) => {
                const isActive = i === activeIndex
                return (
                  <div
                    key={feature._key ?? i}
                    style={{
                      padding: '20px 20px 20px 24px',
                      borderLeft: `2px solid ${isActive ? '#4294d8' : '#e0e0e0'}`,
                      cursor: 'default',
                      transition: 'border-color 0.3s ease',
                      marginBottom: '2px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: isActive ? '8px' : '0',
                      }}
                    >
                      <div
                        style={{
                          width: '28px',
                          height: '28px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          transition: 'opacity 0.3s ease',
                          opacity: isActive ? 1 : 0.55,
                        }}
                      >
                        {ICONS[i % ICONS.length](isActive)}
                      </div>
                      <span
                        style={{
                          fontSize: '17px',
                          fontWeight: isActive ? 700 : 500,
                          color: isActive ? '#171717' : '#a0a0a0',
                          transition: 'color 0.3s ease',
                          lineHeight: 1.2,
                        }}
                      >
                        {feature.title}
                      </span>
                    </div>

                    {/* Description — expands when active */}
                    <div
                      style={{
                        overflow: 'hidden',
                        maxHeight: isActive ? '100px' : '0',
                        opacity: isActive ? 1 : 0,
                        transition: 'max-height 0.4s ease, opacity 0.3s ease',
                        paddingLeft: '40px',
                      }}
                    >
                      <p
                        style={{
                          fontSize: '14px',
                          color: '#787878',
                          lineHeight: 1.65,
                          margin: 0,
                        }}
                      >
                        {feature.content}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Step dots */}
            <div
              style={{
                display: 'flex',
                gap: '6px',
                paddingLeft: '24px',
                marginTop: '28px',
              }}
            >
              {features.map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: i === activeIndex ? '20px' : '6px',
                    height: '6px',
                    borderRadius: '3px',
                    background: i === activeIndex ? '#4294d8' : '#d0d0d0',
                    transition: 'width 0.3s ease, background 0.3s ease',
                  }}
                />
              ))}
            </div>
          </div>

          {/* ── RIGHT: Image panel ── */}
          <div
            className="features-image-panel"
            style={{
              height: '520px',
              borderRadius: '20px',
              overflow: 'hidden',
              position: 'relative',
              background: '#1a1a1a',
              cursor: hasVideo ? 'pointer' : undefined,
            }}
            onMouseEnter={hasVideo ? () => {
              const vid = trackRef.current?.querySelector<HTMLVideoElement>('.features-image-panel video')
              if (vid?.ended) {
                vid.currentTime = 0
                vid.play()
                vid.dataset.hoverReplay = 'true'
              }
            } : undefined}
            onMouseLeave={hasVideo ? () => {
              const vid = trackRef.current?.querySelector<HTMLVideoElement>('.features-image-panel video')
              if (vid && vid.dataset.hoverReplay === 'true') {
                const onEnd = () => {
                  vid.removeEventListener('ended', onEnd)
                  vid.dataset.hoverReplay = ''
                }
                vid.addEventListener('ended', onEnd)
              }
            } : undefined}
          >
            {hasVideo ? (
              <video
                key={`video-${activeFeature._key ?? activeIndex}`}
                src={activeFeature.video!.asset!.url!}
                autoPlay
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
            ) : hasImage ? (
              <Image
                key={activeFeature._key ?? activeIndex}
                src={urlFor(activeFeature.image!).width(1200).auto('format').quality(85).url()}
                alt={(activeFeature.image?.alt as string) ?? activeFeature.title ?? ''}
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={activeIndex === 0}
              />
            ) : (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(135deg, #1a2a3a 0%, #0d1a2a 50%, #171717 100%)',
                }}
              />
            )}

            {/* Overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0.05) 40%, rgba(0,0,0,0.65) 100%)',
              }}
            />

            {/* Top bar */}
            <div
              style={{
                position: 'absolute',
                top: '22px',
                left: '22px',
                right: '22px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>
                {activeFeature?.title}
              </span>
              <a
                href="#order"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  background: 'rgba(255,255,255,0.95)',
                  color: '#171717',
                  fontSize: '12px',
                  fontWeight: 600,
                  padding: '7px 14px',
                  borderRadius: '100px',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M16 10a4 4 0 01-8 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Order {productName}
              </a>
            </div>

            {/* Bottom caption */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '24px 26px 26px',
                background: 'linear-gradient(to top, rgba(10,15,25,0.96) 60%, transparent 100%)',
              }}
            >
              <h3
                style={{
                  fontSize: '19px',
                  fontWeight: 700,
                  color: '#fff',
                  margin: '0 0 7px',
                  lineHeight: 1.2,
                  letterSpacing: '-0.01em',
                }}
              >
                {activeFeature?.title}
              </h3>
              {activeFeature?.content && (
                <p
                  style={{
                    fontSize: '13px',
                    color: 'rgba(255,255,255,0.7)',
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {activeFeature.content}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

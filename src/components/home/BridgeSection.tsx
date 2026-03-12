'use client'

import { useEffect, useRef, Fragment } from 'react'

function WordSpans({ text }: { text: string }) {
  const words = text.trim().split(/\s+/)
  return (
    <>
      {words.map((word, i) => (
        <Fragment key={i}>
          {i > 0 && ' '}
          <span
            data-bword=""
            style={{ display: 'inline-block', opacity: 0.2, transition: 'opacity 0.2s ease' }}
          >
            {word}
          </span>
        </Fragment>
      ))}
    </>
  )
}

export default function BridgeSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const section = sectionRef.current
    if (!section) return

    function update() {
      const fillY = window.innerHeight * 0.62
      const zone = 120
      section!.querySelectorAll<HTMLSpanElement>('[data-bword]').forEach((w) => {
        const rect = w.getBoundingClientRect()
        const mid = rect.top + rect.height / 2
        const dist = fillY - mid
        const progress = Math.min(1, Math.max(0, (dist + zone * 0.5) / zone))
        w.style.opacity = String(0.2 + 0.8 * progress)
      })
    }

    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <section
      ref={sectionRef}
      id="bridge-section"
      className="px-4 sm:px-6 lg:px-10"
      style={{ background: '#fff', paddingTop: '100px', paddingBottom: '100px', borderTop: '1px solid #f0f0f0' }}
    >
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#4294d8' }}>
            Seniors Care
          </span>
        </div>
        <h2 style={{ fontSize: 'clamp(28px, 3vw, 48px)', fontWeight: 700, color: '#171717', textAlign: 'center', marginBottom: '48px', lineHeight: 1.15 }}>
          Bridging The Gap<br /><span style={{ color: '#787878', fontWeight: 700 }}>In Senior Safety</span>
        </h2>

        {/* Line */}
        <div style={{ width: '1px', background: '#e0e0e0', height: '60px', margin: '0 auto' }} />

        <div style={{ padding: '48px 0', textAlign: 'center' }}>
          <p style={{ fontSize: 'clamp(18px, 2vw, 24px)', lineHeight: 1.6, maxWidth: '640px', margin: '0 auto', color: '#171717' }}>
            <WordSpans text="Every year, millions of seniors face the risk of falls. Holo Alert offers a simple solution: 24/7 access to help at the touch of a button. Get the support you need to live life on your terms." />
          </p>
        </div>

        {/* Line */}
        <div style={{ width: '1px', background: '#e0e0e0', height: '60px', margin: '0 auto' }} />

        <div style={{ padding: '48px 0', textAlign: 'center' }}>
          <div style={{ fontSize: '64px', fontWeight: 700, color: '#4294d8', textAlign: 'center', lineHeight: 1 }}>
            <WordSpans text="36%" />
          </div>
          <p style={{ fontSize: 'clamp(18px, 2vw, 24px)', lineHeight: 1.6, maxWidth: '640px', margin: '12px auto 0', color: '#171717' }}>
            <WordSpans text="of seniors experience at least one fall annually" />
          </p>
        </div>

        {/* Line */}
        <div style={{ width: '1px', background: '#e0e0e0', height: '60px', margin: '0 auto' }} />

        <div style={{ padding: '48px 0', textAlign: 'center' }}>
          <div style={{ fontSize: '64px', fontWeight: 700, color: '#4294d8', textAlign: 'center', lineHeight: 1 }}>
            <WordSpans text="20%" />
          </div>
          <p style={{ fontSize: 'clamp(18px, 2vw, 24px)', lineHeight: 1.6, maxWidth: '640px', margin: '12px auto 0', color: '#171717' }}>
            <WordSpans text="of falls in seniors lead to serious injuries like broken bones or head trauma" />
          </p>
        </div>
      </div>
    </section>
  )
}

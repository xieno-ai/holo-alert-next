'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'

export default function FeatureDiagramSection() {
  const bgRef = useRef<HTMLDivElement>(null)
  const productRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (bgRef.current) {
              bgRef.current.style.transform = 'translate(-50%, -50%) translateX(0)'
              bgRef.current.style.opacity = '1'
            }
            if (productRef.current) {
              productRef.current.style.transform = 'translateY(0)'
              productRef.current.style.opacity = '1'
            }
            observer.unobserve(section)
          }
        })
      },
      { threshold: 0.2 }
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{ background: '#fff', padding: '80px 60px 140px', borderTop: '1px solid #f0f0f0', overflow: 'hidden', position: 'relative' }}
    >
      {/* Background watermark */}
      <div
        ref={bgRef}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) translateX(160px)',
          opacity: 0,
          width: '90%',
          maxWidth: '1400px',
          pointerEvents: 'none',
          willChange: 'transform, opacity',
          transition: 'transform 1.3s cubic-bezier(0.16,1,0.3,1), opacity 1s ease',
        }}
      >
        <Image src="/images/Frame-244.svg" alt="" width={1400} height={200} style={{ width: '100%', opacity: 0.85 }} />
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 520px 1fr', alignItems: 'stretch', minHeight: '820px' }}>

          {/* Left column */}
          <div style={{ display: 'flex', flexDirection: 'column', alignSelf: 'stretch', padding: '40px 8px 40px 0', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', justifyContent: 'flex-end' }}>
              <div style={{ maxWidth: '220px', textAlign: 'right' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#171717', marginBottom: '8px', lineHeight: 1.4 }}>Fall Detection<br />That Works</h3>
                <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.65 }}>With automatic fall detection, you can have peace of mind knowing that help is always on the way, even if you can&apos;t call for it yourself</p>
              </div>
              <div style={{ width: '9px', height: '9px', background: '#4294d8', flexShrink: 0, marginTop: '4px' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', justifyContent: 'flex-end' }}>
              <div style={{ maxWidth: '220px', textAlign: 'right' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#171717', marginBottom: '8px', lineHeight: 1.4 }}>Coast-to-Coast<br />Canadian Coverage</h3>
                <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.65 }}>Stay protected wherever you go across Canada. From British Columbia to Newfoundland, Holo Alert works on reliable Canadian cellular networks, ensuring you&apos;re never alone—at home or visiting family anywhere in the country.</p>
              </div>
              <div style={{ width: '9px', height: '9px', background: '#4294d8', flexShrink: 0, marginTop: '4px' }} />
            </div>
          </div>

          {/* Center device */}
          <div
            ref={productRef}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              willChange: 'transform, opacity',
              transform: 'translateY(-80px)',
              opacity: 0,
              transition: 'transform 1.05s cubic-bezier(0.16,1,0.3,1) 0.05s, opacity 0.8s ease 0.05s',
            }}
          >
            <Image
              src="/images/holoactive_fronthero.webp"
              alt="Holo Mini"
              width={520}
              height={520}
              style={{ width: '100%', height: 'auto', objectFit: 'contain', display: 'block' }}
            />
          </div>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', alignSelf: 'stretch', padding: '100px 0 120px 8px', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{ width: '9px', height: '9px', background: '#4294d8', flexShrink: 0, marginTop: '4px' }} />
              <div style={{ maxWidth: '220px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#171717', marginBottom: '8px', lineHeight: 1.4 }}>Talk to a Live Person,<br />Anytime, Anywhere</h3>
                <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.65 }}>With our easy-to-use device, you can speak directly to a Care Team Associate 24/7, ensuring you get the help you need, no matter where you are</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{ width: '9px', height: '9px', background: '#4294d8', flexShrink: 0, marginTop: '4px' }} />
              <div style={{ maxWidth: '220px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#171717', marginBottom: '8px', lineHeight: 1.4 }}>Stay Safe and<br />Connected, On the Go</h3>
                <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.65 }}>Our GPS Assistance feature ensures that you can get help no matter where you are, whether you&apos;re at home or out and about</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

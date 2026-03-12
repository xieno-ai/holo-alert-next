'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'

interface Props {
  featuredImageUrl?: string | null
  featuredDeviceName?: string
  watermarkUrl?: string | null
}

export default function FeatureDiagramSection({ featuredImageUrl, featuredDeviceName = 'Holo Device', watermarkUrl }: Props) {
  const bgRef = useRef<HTMLDivElement>(null)
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
            section.querySelectorAll<HTMLElement>('[data-product-image]').forEach((el) => {
              el.style.transform = 'translateY(0)'
              el.style.opacity = '1'
            })
            observer.unobserve(section)
          }
        })
      },
      { threshold: 0.2 }
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  const features = [
    {
      title: 'Fall Detection That Works',
      text: "With automatic fall detection, you can have peace of mind knowing that help is always on the way, even if you can\u2019t call for it yourself",
    },
    {
      title: 'Coast-to-Coast Canadian Coverage',
      text: "Stay protected wherever you go across Canada. From British Columbia to Newfoundland, Holo Alert works on reliable Canadian cellular networks, ensuring you\u2019re never alone\u2014at home or visiting family anywhere in the country.",
    },
    {
      title: 'Talk to a Live Person, Anytime, Anywhere',
      text: "With our easy-to-use device, you can speak directly to a Care Team Associate 24/7, ensuring you get the help you need, no matter where you are",
    },
    {
      title: 'Stay Safe and Connected, On the Go',
      text: "Our GPS Assistance feature ensures that you can get help no matter where you are, whether you\u2019re at home or out and about",
    },
  ]

  return (
    <section
      ref={sectionRef}
      style={{ background: '#fff', borderTop: '1px solid #f0f0f0', overflow: 'hidden', position: 'relative' }}
    >
      <style>{`
        .feat-section { padding: 64px 16px; }
        .feat-watermark { display: none; }
        .feat-grid {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 40px;
          max-width: 1400px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }
        .feat-device {
          max-width: 280px;
          width: 100%;
          will-change: transform, opacity;
          transform: translateY(-80px);
          opacity: 0;
          transition: transform 1.05s cubic-bezier(0.16,1,0.3,1) 0.05s, opacity 0.8s ease 0.05s;
        }
        .feat-cards {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
          width: 100%;
        }
        .feat-card {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }
        .feat-dot {
          width: 9px;
          height: 9px;
          background: #4294d8;
          flex-shrink: 0;
          margin-top: 4px;
          border-radius: 1px;
        }
        .feat-card h3 { font-size: 15px; font-weight: 700; color: #171717; margin-bottom: 8px; line-height: 1.4; }
        .feat-card p { font-size: 13px; color: #666; line-height: 1.65; margin: 0; }
        /* Left-column cards: right-aligned text with dot on right (desktop only) */
        .feat-card-left { flex-direction: row; }
        .feat-card-left .feat-card-text { text-align: left; }
        .feat-card-right { flex-direction: row; }

        @media (min-width: 640px) {
          .feat-section { padding: 80px 24px; }
          .feat-cards { grid-template-columns: 1fr 1fr; gap: 40px; }
          .feat-device { max-width: 320px; }
        }

        @media (min-width: 1024px) {
          .feat-section { padding: 80px 40px 140px; }
          .feat-watermark { display: block; }
          .feat-device { max-width: 520px; order: 2; }
          .feat-grid {
            display: grid;
            grid-template-columns: 1fr 520px 1fr;
            align-items: stretch;
            min-height: 820px;
            gap: 0;
          }
          .feat-cards { display: none; }
          .feat-col { display: flex !important; flex-direction: column; justify-content: space-between; }
          .feat-col-left { order: 1; padding: 40px 8px 40px 0; }
          .feat-col-right { order: 3; padding: 100px 0 120px 8px; }
          .feat-card-left { flex-direction: row-reverse; }
          .feat-card-left .feat-card-text { text-align: right; max-width: 220px; }
          .feat-card-right .feat-card-text { max-width: 220px; }
        }

        @media (min-width: 1280px) {
          .feat-section { padding: 80px 60px 140px; }
        }
      `}</style>

      <div className="feat-section">
        {/* Background watermark */}
        <div
          ref={bgRef}
          className="feat-watermark"
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
          <Image src={watermarkUrl ?? '/images/Frame-244.svg'} alt="" width={1400} height={200} style={{ width: '100%', opacity: 0.85 }} />
        </div>

        <div className="feat-grid">
          {/* Device image — center on all screens, order 2 on desktop */}
          <div data-product-image className="feat-device">
            <Image
              src={featuredImageUrl ?? '/images/holoactive_fronthero.webp'}
              alt={featuredDeviceName}
              width={520}
              height={520}
              sizes="(max-width: 640px) 80vw, (max-width: 1024px) 320px, 520px"
              style={{ width: '100%', height: 'auto', objectFit: 'contain', display: 'block' }}
            />
          </div>

          {/* Mobile/Tablet: all 4 features in a grid */}
          <div className="feat-cards">
            {features.map((f, i) => (
              <div key={i} className="feat-card">
                <div className="feat-dot" />
                <div>
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: left column (features 0-1) */}
          <div className="feat-col feat-col-left" style={{ display: 'none' }}>
            {features.slice(0, 2).map((f, i) => (
              <div key={i} className="feat-card feat-card-left">
                <div className="feat-card-text">
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                </div>
                <div className="feat-dot" />
              </div>
            ))}
          </div>

          {/* Desktop: right column (features 2-3) */}
          <div className="feat-col feat-col-right" style={{ display: 'none' }}>
            {features.slice(2, 4).map((f, i) => (
              <div key={i} className="feat-card feat-card-right">
                <div className="feat-dot" />
                <div className="feat-card-text">
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

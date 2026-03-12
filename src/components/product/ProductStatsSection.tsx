'use client'

// ── Icons ─────────────────────────────────────────────────────────────────────


const ArrowUpRightIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 17L17 7M17 7H7M17 7v10" />
  </svg>
)

const StarIcon = () => (
  <svg width="13" height="13" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path d="M8.99584 12.9523L12.1083 14.8348C12.6783 15.1798 13.3758 14.6698 13.2258 14.0248L12.4008 10.4848L15.1533 8.09982C15.6558 7.66482 15.3858 6.83982 14.7258 6.78732L11.1033 6.47982L9.68584 3.13482C9.43084 2.52732 8.56084 2.52732 8.30584 3.13482L6.88834 6.47232L3.26584 6.77982C2.60584 6.83232 2.33584 7.65732 2.83834 8.09232L5.59084 10.4773L4.76584 14.0173C4.61584 14.6623 5.31334 15.1723 5.88334 14.8273L8.99584 12.9523Z" fill="#EDB423" />
  </svg>
)

// ── Data ──────────────────────────────────────────────────────────────────────

const QUOTE = {
  text: 'I was skeptical at first, but the setup took less than 10 minutes. Now I don\'t worry every time I leave my mom alone at home.',
  name: 'Sandra M.',
  role: 'Daughter of a Holo Alert customer',
}

const STATS = [
  {
    value: '350,000+',
    label: 'Canadians injured in falls each year',
    iconColor: '#4294d8',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 100-16 8 8 0 000 16zm1-8h3l-4 4-4-4h3V8h2v4z" fill="#4294d8" />
      </svg>
    ),
    description: 'Falls are the leading cause of injury-related hospitalizations among adults 65 and older in Canada.',
    descriptionBold: '',
    footnote: true,
  },
  {
    value: '70%',
    label: 'Seek emergency care after a fall',
    iconColor: '#f59e0b',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path d="M12 2a10 10 0 100 20A10 10 0 0012 2zm1 14H11v-2h2v2zm0-4H11V7h2v5z" fill="#f59e0b" />
      </svg>
    ),
    description: 'Of older adults injured in a fall, the majority required',
    descriptionBold: 'hospital emergency department treatment.',
    footnote: true,
  },
  {
    value: '24/7',
    label: 'Monitoring, every single day',
    iconColor: '#45b864',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.35C16.5 22.15 20 17.25 20 12V6l-8-4z" fill="#45b864" />
      </svg>
    ),
    description: 'Our Canadian monitoring team is always on —',
    descriptionBold: 'ready to respond the moment your loved one needs help.',
    footnote: false,
  },
]

// ── Component ─────────────────────────────────────────────────────────────────

export default function ProductStatsSection() {
  return (
    <section className="stats-section" style={{ background: '#fff', padding: '100px 0' }}>
      <style>{`
        @media (max-width: 768px) {
          .stats-section { padding: 60px 0 !important; }
          .stats-grid {
            grid-template-columns: 1fr !important;
            padding: 0 16px !important;
          }
          .stats-left {
            padding-right: 0 !important;
            border-right: none !important;
            border-bottom: 1px solid #e0e0e0;
            padding-bottom: 40px !important;
          }
          .stats-right {
            padding-left: 0 !important;
            padding-top: 40px !important;
          }
        }
      `}</style>
      <div className="stats-grid" style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 40px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '0',
        alignItems: 'stretch',
      }}>

        {/* ── Left column ── */}
        <div className="stats-left" style={{
          paddingRight: '72px',
          borderRight: '1px solid #e0e0e0',
          display: 'flex',
          flexDirection: 'column',
          gap: '32px',
        }}>

          {/* Eyebrow */}
          <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#4294d8' }}>
            Built for Canadian families
          </span>

          {/* Headline + body */}
          <div>
            <div style={{ borderLeft: '3px solid #4294d8', paddingLeft: '20px', marginBottom: '20px' }}>
              <h2 style={{
                fontSize: 'clamp(26px, 2.8vw, 42px)',
                fontWeight: 800,
                color: '#171717',
                lineHeight: 1.1,
                margin: 0,
                letterSpacing: '-0.025em',
              }}>
                Peace of mind isn&apos;t just for the person wearing it — it&apos;s for everyone who loves them
              </h2>
            </div>
            <p style={{ fontSize: '16px', color: '#666', lineHeight: 1.7, margin: '0 0 20px 0' }}>
              Know that help is always within reach. Whether it&apos;s a fall at home or an emergency on the go, Holo Alert connects your loved one to real support — day or night.
            </p>
            <a
              href="#how-it-works"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: '#4294d8',
                fontSize: '15px',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              See how it works
              <ArrowUpRightIcon />
            </a>
          </div>

          {/* Quote card */}
          <div style={{
            background: '#fff',
            border: '1px solid #e8e8e8',
            borderRadius: '16px',
            padding: '28px',
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '24px',
          }}>
            <p style={{
              fontSize: '16px',
              color: '#444',
              lineHeight: 1.7,
              margin: 0,
            }}>
              &ldquo;{QUOTE.text}&rdquo;
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#171717', lineHeight: 1.3 }}>
                  — {QUOTE.name}
                </div>
                <div style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>
                  {QUOTE.role}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '2px' }}>
                {Array.from({ length: 5 }).map((_, i) => <StarIcon key={i} />)}
              </div>
            </div>
          </div>

        </div>

        {/* ── Right column ── */}
        <div className="stats-right" style={{
          paddingLeft: '72px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
          {STATS.map((stat, i) => (
            <div key={i}>
              {i > 0 && (
                <div style={{ height: '1px', background: '#e8e8e8', margin: '36px 0' }} />
              )}
              <div>
                <div style={{
                  fontSize: 'clamp(48px, 5.5vw, 72px)',
                  fontWeight: 800,
                  color: '#171717',
                  lineHeight: 1,
                  letterSpacing: '-0.03em',
                  marginBottom: '12px',
                }}>
                  {stat.value}
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '10px',
                }}>
                  <span style={{ fontSize: '15px', color: '#444', fontWeight: 500 }}>{stat.label}</span>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '22px',
                    height: '22px',
                    borderRadius: '6px',
                    background: `${stat.iconColor}1a`,
                  }}>
                    {stat.icon}
                  </span>
                </div>
                <p style={{ fontSize: '14px', color: '#888', lineHeight: 1.65, margin: 0 }}>
                  {stat.description}{stat.descriptionBold && (
                    <>{' '}<strong style={{ color: '#555', fontWeight: 600 }}>{stat.descriptionBold}</strong></>
                  )}{stat.footnote && <sup style={{ fontSize: '10px', color: '#aaa', marginLeft: '1px' }}>*</sup>}
                </p>
              </div>
            </div>
          ))}

          {/* Footnote */}
          <p style={{ fontSize: '11px', color: '#bbb', lineHeight: 1.5, marginTop: '36px' }}>
            * Source: Public Health Agency of Canada
          </p>
        </div>

      </div>
    </section>
  )
}

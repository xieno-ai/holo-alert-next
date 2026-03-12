import React from 'react'

interface Props {
  steps?: unknown[]   // kept for signature compat — content is now hardcoded
  productName?: string
}

const STEPS = [
  {
    label: 'Step One',
    title: 'Order Online',
    body: 'Pick your device and order in minutes — we handle the rest.',
    tag: 'Quick & Easy',
    illustration: (
      <svg style={{ width: '100%', height: '100%' }} viewBox="6 4 148 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Browser chrome */}
        <rect x="10" y="8" width="140" height="94" rx="8" fill="#f7f8fa" stroke="#e4e6ea" strokeWidth="1"/>
        <rect x="10" y="8" width="140" height="22" rx="8" fill="#edeef1" stroke="#e4e6ea" strokeWidth="1"/>
        <rect x="10" y="22" width="140" height="8" fill="#edeef1"/>
        <circle cx="25" cy="19" r="4" fill="#f87171" opacity="0.7"/>
        <circle cx="37" cy="19" r="4" fill="#fbbf24" opacity="0.7"/>
        <circle cx="49" cy="19" r="4" fill="#34d399" opacity="0.7"/>
        {/* URL bar */}
        <rect x="60" y="13" width="70" height="12" rx="6" fill="#fff" stroke="#dde0e5" strokeWidth="1"/>
        {/* Product card */}
        <rect x="22" y="40" width="52" height="52" rx="6" fill="#fff" stroke="#e4e6ea" strokeWidth="1"/>
        <rect x="28" y="46" width="40" height="28" rx="4" fill="#f0f6fd"/>
        {/* Device silhouette */}
        <rect x="37" y="50" width="22" height="16" rx="3" fill="#4294d8" opacity="0.25"/>
        <rect x="41" y="54" width="14" height="8" rx="2" fill="#4294d8" opacity="0.5"/>
        <circle cx="48" cy="58" r="2" fill="#4294d8" opacity="0.8"/>
        {/* Price + label */}
        <rect x="28" y="78" width="24" height="5" rx="2.5" fill="#d0d5dd"/>
        <rect x="28" y="86" width="16" height="4" rx="2" fill="#e8eaed"/>
        {/* Right panel */}
        <rect x="84" y="40" width="64" height="20" rx="4" fill="#fff" stroke="#e4e6ea" strokeWidth="1"/>
        <rect x="90" y="46" width="32" height="4" rx="2" fill="#d0d5dd"/>
        <rect x="90" y="53" width="22" height="3" rx="1.5" fill="#e8eaed"/>
        <rect x="84" y="64" width="64" height="14" rx="4" fill="#4294d8"/>
        <rect x="100" y="68" width="32" height="5" rx="2.5" fill="#fff" opacity="0.85"/>
        <rect x="84" y="82" width="64" height="10" rx="4" fill="#fff" stroke="#e4e6ea" strokeWidth="1"/>
        <rect x="90" y="85" width="42" height="4" rx="2" fill="#e8eaed"/>
      </svg>
    ),
  },
  {
    label: 'Step Two',
    title: 'We Set Everything Up',
    body: 'Your device arrives pre-programmed — open the box and it just works.',
    tag: 'Ready to Use',
    illustration: (
      <svg style={{ width: '100%', height: '100%' }} viewBox="34 18 98 82" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Box body */}
        <rect x="40" y="38" width="80" height="58" rx="6" fill="#fff" stroke="#e4e6ea" strokeWidth="1.5"/>
        {/* Box lid left flap */}
        <path d="M40 38 L40 24 L80 24 L80 38" fill="#edeef1" stroke="#e4e6ea" strokeWidth="1.5" strokeLinejoin="round"/>
        {/* Box lid right flap */}
        <path d="M80 24 L120 24 L120 38 L80 38" fill="#e4e6eb" stroke="#e4e6ea" strokeWidth="1.5" strokeLinejoin="round"/>
        {/* Box tape strip */}
        <rect x="68" y="22" width="24" height="18" rx="2" fill="#fde68a" opacity="0.7"/>
        <rect x="73" y="37" width="14" height="22" rx="2" fill="#fde68a" opacity="0.6"/>
        {/* Device inside box */}
        <rect x="56" y="52" width="48" height="32" rx="5" fill="#f0f6fd" stroke="#4294d8" strokeWidth="1" opacity="0.8"/>
        <rect x="63" y="59" width="34" height="18" rx="3" fill="#4294d8" opacity="0.15"/>
        <circle cx="80" cy="68" r="6" fill="#4294d8" opacity="0.3"/>
        {/* Checkmark badge */}
        <circle cx="112" cy="42" r="14" fill="#fff" stroke="#e4e6ea" strokeWidth="1"/>
        <circle cx="112" cy="42" r="11" fill="#4294d8"/>
        <path d="M106 42 L110 46 L118 37" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: 'Step Three',
    title: 'A Personal Welcome Call',
    body: 'Our team walks you through setup, runs a quick test, and answers your questions.',
    tag: 'Personal Touch',
    illustration: (
      <svg style={{ width: '100%', height: '100%' }} viewBox="14 8 132 94" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Phone body */}
        <rect x="52" y="12" width="56" height="86" rx="10" fill="#fff" stroke="#e4e6ea" strokeWidth="1.5"/>
        <rect x="52" y="12" width="56" height="86" rx="10" fill="url(#phoneGrad)" opacity="0.4"/>
        <rect x="57" y="22" width="46" height="62" rx="4" fill="#f0f6fd"/>
        {/* Screen content - call UI */}
        <circle cx="80" cy="38" r="10" fill="#4294d8" opacity="0.2"/>
        <circle cx="80" cy="38" r="7" fill="#4294d8" opacity="0.5"/>
        {/* Person silhouette */}
        <circle cx="80" cy="35" r="3" fill="#4294d8"/>
        <path d="M74 44 Q80 40 86 44" stroke="#4294d8" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        {/* Name label */}
        <rect x="62" y="51" width="36" height="5" rx="2.5" fill="#d0d5dd"/>
        <rect x="67" y="59" width="26" height="4" rx="2" fill="#e8eaed"/>
        {/* Answer button */}
        <circle cx="80" cy="76" r="8" fill="#4294d8"/>
        <path d="M76.5 74.5 C76.5 74.5 78 74 79 75.5 C80 77 79.5 78.5 79.5 78.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        <path d="M79.5 78.5 L81.5 76.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
        {/* Sound waves */}
        <path d="M28 40 Q34 55 28 70" stroke="#4294d8" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.4"/>
        <path d="M20 34 Q30 55 20 76" stroke="#4294d8" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.25"/>
        <path d="M132 40 Q126 55 132 70" stroke="#4294d8" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.4"/>
        <path d="M140 34 Q130 55 140 76" stroke="#4294d8" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.25"/>
        <defs>
          <linearGradient id="phoneGrad" x1="52" y1="12" x2="108" y2="98" gradientUnits="userSpaceOnUse">
            <stop stopColor="#4294d8" stopOpacity="0.1"/>
            <stop offset="1" stopColor="#4294d8" stopOpacity="0"/>
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    label: 'Step Four',
    title: 'Stay Protected, Every Day',
    body: '24/7 monitoring means your loved one can get help anytime, anywhere.',
    tag: '24/7 Coverage',
    illustration: (
      <svg style={{ width: '100%', height: '100%' }} viewBox="10 4 140 98" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Shield */}
        <path d="M80 10 L116 24 L116 52 C116 74 80 98 80 98 C80 98 44 74 44 52 L44 24 Z" fill="#f0f6fd" stroke="#4294d8" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M80 18 L108 29 L108 52 C108 70 80 90 80 90 C80 90 52 70 52 52 L52 29 Z" fill="#4294d8" opacity="0.12"/>
        {/* Heartbeat line */}
        <polyline points="56,58 64,58 68,44 72,70 76,52 80,58 84,58 88,48 92,64 96,58 104,58" stroke="#4294d8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        {/* Floating badges */}
        <rect x="100" y="8" width="46" height="18" rx="9" fill="#171717"/>
        <rect x="104" y="13" width="6" height="6" rx="3" fill="#4294d8"/>
        <rect x="114" y="14" width="28" height="4" rx="2" fill="#fff" opacity="0.8"/>
        <rect x="114" y="18" width="20" height="3" rx="1.5" fill="#fff" opacity="0.45"/>
        <rect x="14" y="62" width="42" height="18" rx="9" fill="#fff" stroke="#e4e6ea" strokeWidth="1"/>
        <rect x="19" y="67" width="6" height="6" rx="3" fill="#34d399" opacity="0.8"/>
        <rect x="29" y="68" width="22" height="4" rx="2" fill="#d0d5dd"/>
        <rect x="29" y="72" width="16" height="3" rx="1.5" fill="#e8eaed"/>
      </svg>
    ),
  },
]

export default function ProductHowItWorksSection({ productName = 'Holo Pro' }: Props) {
  return (
    <section className="hiw-section" style={{ background: '#fff', padding: '100px 40px' }}>
      <style>{`
        @media (max-width: 768px) {
          .hiw-section { padding: 60px 16px !important; }
          .hiw-header { margin-bottom: 36px !important; }
          .hiw-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
          .hiw-arrow { display: none !important; }
          .hiw-card { min-height: auto !important; }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .hiw-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 16px !important;
          }
          .hiw-arrow { display: none !important; }
        }
      `}</style>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <div className="hiw-header" style={{ textAlign: 'center', marginBottom: '64px' }}>
          <span style={{
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase' as const,
            color: '#4294d8',
            display: 'block',
            marginBottom: '12px',
          }}>
            How It Works
          </span>
          <h2 style={{
            fontSize: 'clamp(28px, 3vw, 44px)',
            fontWeight: 700,
            color: '#171717',
            lineHeight: 1.1,
            margin: 0,
            letterSpacing: '-0.02em',
          }}>
            Setup? We Handle That.
          </h2>
        </div>

        {/* Cards row */}
        <div className="hiw-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 32px 1fr 32px 1fr 32px 1fr',
          gap: '0',
          alignItems: 'stretch',
        }}>
          {STEPS.map((step, i) => (
            <React.Fragment key={step.label}>
              {/* Card */}
              <div
                className="hiw-card"
                style={{
                  background: '#f5f6f7',
                  borderRadius: '16px',
                  padding: '28px 24px 22px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0',
                  height: '100%',
                  minHeight: '380px',
                }}
              >
                {/* Step label + title */}
                <div style={{ marginBottom: '20px' }}>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase' as const,
                    color: '#a0a0a0',
                    display: 'block',
                    marginBottom: '6px',
                  }}>
                    {step.label}
                  </span>
                  <h3 style={{
                    fontSize: 'clamp(15px, 1.3vw, 18px)',
                    fontWeight: 700,
                    color: '#171717',
                    margin: 0,
                    lineHeight: 1.2,
                    letterSpacing: '-0.01em',
                  }}>
                    {step.title}
                  </h3>
                </div>

                {/* Illustration panel — fixed height for uniformity */}
                <div style={{
                  background: '#fff',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '160px',
                  marginBottom: '16px',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                  overflow: 'hidden',
                  flexShrink: 0,
                  padding: '20px',
                }}>
                  <div style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {step.illustration}
                  </div>
                </div>

                {/* Body text */}
                <p style={{
                  fontSize: '13px',
                  color: '#787878',
                  lineHeight: 1.6,
                  margin: '0 0 auto',
                  paddingBottom: '16px',
                }}>
                  {step.body}
                </p>

                {/* Tag pill */}
                <div style={{ display: 'flex' }}>
                  <span style={{
                    display: 'inline-block',
                    background: '#fff',
                    border: '1px solid #e4e6ea',
                    borderRadius: '100px',
                    padding: '5px 12px',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#444',
                    letterSpacing: '0.01em',
                  }}>
                    {step.tag}
                  </span>
                </div>
              </div>

              {/* Arrow connector — rendered between cards only */}
              {i < STEPS.length - 1 && (
                <div
                  key={`arrow-${i}`}
                  className="hiw-arrow"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'center',
                  }}
                >
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: '#f0f6fd',
                    border: '1px solid #d0e4f5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6h8M7 3l3 3-3 3" stroke="#4294d8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

      </div>
    </section>
  )
}

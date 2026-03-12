interface Props {
  productName?: string
}

export default function ProductContactCTA({ productName }: Props) {
  const subject = productName
    ? `Question about ${productName} — Product Page`
    : 'Product Enquiry — Holo Alert'
  return (
    <section className="contact-cta-section" style={{ background: '#f7f7f7', padding: '80px 40px', borderTop: '1px solid #ebebeb' }}>
      <style>{`
        @media (max-width: 768px) {
          .contact-cta-section { padding: 48px 16px !important; }
          .contact-cta-buttons { flex-direction: column !important; align-items: stretch !important; }
          .contact-cta-buttons a { justify-content: center !important; }
        }
      `}</style>
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>

        <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#4294d8', display: 'block', marginBottom: '12px' }}>
          We&apos;re Here To Help
        </span>
        <h2 style={{ fontSize: 'clamp(24px, 2.5vw, 40px)', fontWeight: 700, color: '#171717', lineHeight: 1.2, margin: '0 0 14px' }}>
          Prefer To Talk Directly?
        </h2>
        <p style={{ fontSize: '16px', color: '#787878', lineHeight: 1.65, margin: '0 0 40px' }}>
          Our friendly Canadian team is available to answer any questions and help you choose the right device.
        </p>

        <div className="contact-cta-buttons" style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href="tel:18884450192"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              background: '#171717',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 700,
              padding: '14px 28px',
              borderRadius: '10px',
              textDecoration: 'none',
              letterSpacing: '0.03em',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M14.49 10.97l-2.19-.25a1.49 1.49 0 00-1.23.42l-1.59 1.59a11.32 11.32 0 01-4.94-4.94l1.6-1.6c.33-.33.49-.79.42-1.23l-.25-2.18A1.5 1.5 0 004.83 1.5H2.5C1.67 1.5 1 2.17 1 3c0 7.18 5.82 13 13 13 .83 0 1.5-.67 1.5-1.5v-2.32c.01-.78-.6-1.44-1.01-1.21z" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Call 1&#8209;888&#8209;445&#8209;0192
          </a>
          <a
            href={`mailto:sales@holoalert.ca?subject=${encodeURIComponent(subject)}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              background: '#fff',
              color: '#171717',
              fontSize: '14px',
              fontWeight: 700,
              padding: '14px 28px',
              borderRadius: '10px',
              textDecoration: 'none',
              letterSpacing: '0.03em',
              border: '1.5px solid #e0e0e0',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M2 3h12a1 1 0 011 1v8a1 1 0 01-1 1H2a1 1 0 01-1-1V4a1 1 0 011-1z" stroke="#171717" strokeWidth="1.3" />
              <path d="M1 4l7 5 7-5" stroke="#171717" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            Chat With Us
          </a>
        </div>

      </div>
    </section>
  )
}

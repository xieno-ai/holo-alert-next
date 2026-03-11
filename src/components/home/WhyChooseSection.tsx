import Image from 'next/image'

interface Props {
  imageUrl?: string | null
}

export default function WhyChooseSection({ imageUrl }: Props) {
  return (
    <section style={{ background: '#fff', padding: '0 40px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>

          {/* Top-left: tag + heading */}
          <div style={{ padding: '72px 56px 56px 0', borderRight: '1px solid #e0e0e0', borderBottom: '1px solid #e0e0e0' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#4294d8', marginBottom: '18px' }}>
              Seniors Care
            </div>
            <h2 style={{ fontSize: 'clamp(28px, 3vw, 48px)', fontWeight: 700, color: '#171717', lineHeight: 1.15, margin: 0 }}>
              Why Choose Canada&apos;s <span style={{ color: '#787878' }}>Medical Alert System</span>
            </h2>
          </div>

          {/* Top-right: image */}
          <div style={{ borderBottom: '1px solid #e0e0e0', padding: '40px 0 40px 48px' }}>
            <Image
              src={imageUrl ?? '/images/with-grandchildren.webp'}
              alt="Canadian senior with family"
              width={600}
              height={400}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', minHeight: '260px' }}
            />
          </div>

          {/* Bottom-left: stat */}
          <div style={{ padding: '56px 56px 72px 0', borderRight: '1px solid #e0e0e0' }}>
            <div style={{ fontSize: 'clamp(72px, 8vw, 120px)', fontWeight: 700, color: '#4294d8', lineHeight: 1, marginBottom: '14px' }}>
              1000+
            </div>
            <p style={{ fontSize: '16px', fontWeight: 500, color: '#787878', lineHeight: 1.5, margin: 0, maxWidth: '300px' }}>
              Canadians have already gained access to life-saving devices.
            </p>
          </div>

          {/* Bottom-right: body text */}
          <div style={{ padding: '56px 0 72px 56px' }}>
            <p style={{ fontSize: '15px', color: '#555', lineHeight: 1.75, margin: '0 0 16px' }}>
              Medical alert systems designed specifically for Canadian seniors provide coast-to-coast coverage across all Canadian provinces. Our cellular medical alert technology requires no landline, giving you freedom to stay protected at home or anywhere you go,
            </p>
            <p style={{ fontSize: '15px', color: '#555', lineHeight: 1.75, margin: '0 0 20px' }}>
              With North American-based 24/7 monitoring centers, Holo Alert ensures reliable emergency support regardless of age or ability. Our programs help Canadian seniors stay safe and independent at home, offering peace of mind for individuals and their families.
            </p>
            <p style={{ fontSize: '15px', color: '#555', lineHeight: 1.75, margin: 0, fontStyle: 'italic' }}>
              💡 <em>Interested in learning more? Our team is here to help—reach out today to explore your options.</em>
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}

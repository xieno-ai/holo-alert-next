import Image from 'next/image'

interface Props {
  imageUrl?: string | null
}

export default function WhyChooseSection({ imageUrl }: Props) {
  return (
    <section className="px-4 sm:px-6 lg:px-10" style={{ background: '#fff' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2">

          {/* Top-left: tag + heading */}
          <div className="py-12 lg:py-[72px] lg:pr-14 lg:border-r lg:border-b" style={{ borderColor: '#e0e0e0' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#4294d8', marginBottom: '18px' }}>
              Seniors Care
            </div>
            <h2 style={{ fontSize: 'clamp(28px, 3vw, 48px)', fontWeight: 700, color: '#171717', lineHeight: 1.15, margin: 0 }}>
              Why Choose Canada&apos;s <span style={{ color: '#787878' }}>Medical Alert System</span>
            </h2>
          </div>

          {/* Top-right: image */}
          <div className="pb-10 lg:py-10 lg:pl-12 lg:border-b" style={{ borderColor: '#e0e0e0' }}>
            <Image
              src={imageUrl ?? '/images/with-grandchildren.webp'}
              alt="Canadian senior with family"
              width={600}
              height={400}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', minHeight: '260px' }}
            />
          </div>

          {/* Bottom-left: stat */}
          <div className="py-12 lg:py-14 lg:pr-14 lg:border-r" style={{ borderColor: '#e0e0e0' }}>
            <div style={{ fontSize: 'clamp(72px, 8vw, 120px)', fontWeight: 700, color: '#4294d8', lineHeight: 1, marginBottom: '14px' }}>
              1000+
            </div>
            <p style={{ fontSize: '16px', fontWeight: 500, color: '#787878', lineHeight: 1.5, margin: 0, maxWidth: '300px' }}>
              Canadians have already gained access to life-saving devices.
            </p>
          </div>

          {/* Bottom-right: body text */}
          <div className="pb-12 lg:py-14 lg:pl-14">
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

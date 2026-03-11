import Image from 'next/image'

export default function ProductStatsBridge() {
  return (
    <section style={{ background: '#fff', padding: '100px 40px', borderTop: '1px solid #f0f0f0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>

        {/* Left: stat */}
        <div>
          <div style={{ fontSize: 'clamp(72px, 10vw, 120px)', fontWeight: 800, color: '#171717', lineHeight: 1, marginBottom: '20px' }}>
            36<span style={{ color: '#4294d8' }}>%</span>
          </div>
          <h2 style={{ fontSize: 'clamp(22px, 2.5vw, 36px)', fontWeight: 700, color: '#171717', lineHeight: 1.25, margin: '0 0 16px' }}>
            Every Year, 36% of Canadian Seniors Experience a Fall
          </h2>
          <p style={{ fontSize: '16px', color: '#787878', lineHeight: 1.65, margin: 0 }}>
            A medical alert device means help is always one button press away — whether you&apos;re at home or on the go.
          </p>
        </div>

        {/* Right: lifestyle photo */}
        <div style={{
          borderRadius: '20px',
          overflow: 'hidden',
          background: '#f0f0f0',
        }}>
          <Image
            src="/images/with-grandchildren.webp"
            alt="Senior with family"
            width={600}
            height={450}
            loading="eager"
            style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
          />
        </div>

      </div>
    </section>
  )
}

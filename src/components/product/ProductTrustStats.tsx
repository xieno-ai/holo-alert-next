const stats = [
  { value: '1000+', label: 'Customers' },
  { value: '4.8/5', label: 'Google Rating' },
  { value: '98%', label: 'Customer Satisfaction' },
]

export default function ProductTrustStats() {
  return (
    <section style={{ background: '#f7f7f7', padding: '80px 40px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          <h2 style={{ fontSize: 'clamp(24px, 2.5vw, 40px)', fontWeight: 700, color: '#171717', lineHeight: 1.15, margin: 0 }}>
            Trusted Across Canada
          </h2>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px' }}>
          {stats.map((stat, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'clamp(42px, 5vw, 64px)', fontWeight: 800, color: '#171717', lineHeight: 1, marginBottom: '8px' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '16px', color: '#787878', fontWeight: 500 }}>{stat.label}</div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

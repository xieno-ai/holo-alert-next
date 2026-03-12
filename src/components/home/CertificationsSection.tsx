import Image from 'next/image'

const fallbackCerts = [
  {
    src: '/images/Frame-292.avif',
    alt: 'TMA Five Diamond Monitoring Center',
    name: 'TMA Five Diamond',
    desc: 'certification signifies that our operators have received intensive training',
    scale: true,
  },
  {
    src: '/images/Frame-293.avif',
    alt: 'Electronic Security Association',
    name: 'ESA Security',
    desc: 'certification ensures our commitment to providing excellent emergency services.',
    scale: false,
  },
  {
    src: '/images/Frame-299.avif',
    alt: 'UL Listed',
    name: 'UL Listed',
    desc: 'certification recognizes our continual dedication to safety and reliability.',
    scale: false,
  },
]

interface SanityCert {
  name: string
  description: string
  imageUrl: string | null
  scaleUp: boolean
}

interface Props {
  certifications?: SanityCert[] | null
}

export default function CertificationsSection({ certifications }: Props) {
  const certs = certifications
    ? certifications.map((c, i) => ({
        src: c.imageUrl ?? fallbackCerts[i]?.src ?? '',
        alt: c.name,
        name: c.name,
        desc: c.description,
        scale: c.scaleUp,
      }))
    : fallbackCerts
  return (
    <section className="px-4 sm:px-6 lg:px-10" style={{ background: '#fff', paddingTop: '80px', paddingBottom: '80px' }}>
      <div style={{ textAlign: 'center', marginBottom: '56px' }}>
        <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#4294d8', marginBottom: '12px' }}>
          seniors care
        </div>
        <h2 style={{ fontSize: 'clamp(28px, 3vw, 48px)', fontWeight: 700, color: '#171717', lineHeight: 1.15, marginTop: '12px' }}>
          Bridging The Gap <br /><span style={{ color: '#787878', fontWeight: 700 }}>In Senior Safety</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {certs.map((cert) => (
          <div key={cert.name} className="flex flex-col gap-4">
            <div style={{
              border: '1px solid #e2e6ea',
              background: '#fff',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '32px 24px',
            }}>
              <Image
                src={cert.src}
                alt={cert.alt}
                width={300}
                height={200}
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  transform: cert.scale ? 'scale(2)' : 'none',
                  transformOrigin: 'center center',
                }}
              />
            </div>
            <p style={{ fontSize: '14px', color: '#444', lineHeight: 1.65, margin: 0 }}>
              <strong style={{ fontWeight: 700, color: '#171717' }}>{cert.name} </strong>
              {cert.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

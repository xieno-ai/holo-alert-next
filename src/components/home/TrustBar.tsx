'use client'
import Image from 'next/image'

const logos = [
  { src: '/images/Frame-560.svg',  alt: 'Partner logo', w: 220, h: 110 },
  { src: '/images/Frame-561.avif', alt: 'Partner logo', w: 220, h: 110 },
  { src: '/images/Frame-562.svg',  alt: 'Partner logo', w: 220, h: 110 },
  { src: '/images/Frame-563.svg',  alt: 'Partner logo', w: 220, h: 110 },
  { src: '/images/Frame-564.svg',  alt: 'Partner logo', w: 220, h: 110 },
  { src: '/images/Frame-565.avif', alt: 'Partner logo', w: 220, h: 110 },
  { src: '/images/Frame-566.svg',  alt: 'Partner logo', w: 220, h: 110 },
  { src: '/images/Frame-567.svg',  alt: 'Partner logo', w: 220, h: 110 },
  { src: '/images/Frame-568.avif', alt: 'Partner logo', w: 220, h: 110 },
]

export default function TrustBar() {
  return (
    <section className="py-10 overflow-hidden relative bg-white border-b border-gray-100">
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>

      {/* Left gradient fade */}
      <div className="absolute left-0 top-0 h-full w-48 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      {/* Right gradient fade */}
      <div className="absolute right-0 top-0 h-full w-48 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

      <div className="flex">
        {/* First logo row */}
        <div className="flex items-center animate-marquee shrink-0">
          {logos.map((logo, i) => (
            <div key={i} style={{ width: '240px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Image
                src={logo.src}
                alt={logo.alt}
                width={logo.w}
                height={logo.h}
                style={{ maxHeight: '100px', maxWidth: '220px', width: 'auto', height: 'auto', objectFit: 'contain', filter: 'grayscale(0.3)' }}
              />
            </div>
          ))}
        </div>
        {/* Duplicate row for seamless loop */}
        <div className="flex items-center animate-marquee shrink-0" aria-hidden="true">
          {logos.map((logo, i) => (
            <div key={i} style={{ width: '240px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Image
                src={logo.src}
                alt={logo.alt}
                width={logo.w}
                height={logo.h}
                style={{ maxHeight: '100px', maxWidth: '220px', width: 'auto', height: 'auto', objectFit: 'contain', filter: 'grayscale(0.3)' }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

import Image from 'next/image'
import Link from 'next/link'
import { AuroraBackground } from '@/components/ui/aurora-background'

interface Props {
  heroImageUrl?: string | null
  deviceImageUrl?: string | null
  slot1Url?: string | null
  slot2Url?: string | null
  slot3Url?: string | null
}

export default function HeroSection({
  heroImageUrl,
  deviceImageUrl,
  slot1Url,
  slot2Url,
  slot3Url,
}: Props) {
  return (
    <AuroraBackground
      className="!h-auto bg-white pt-[108px] overflow-hidden"
      showRadialGradient={true}
    >
      {/* Decorative curved diagonal line — behind cards, fades at both ends */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none hidden lg:block z-[1]"
        viewBox="0 0 1440 900"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="lineFade" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#b0b0b0" stopOpacity="0" />
            <stop offset="15%" stopColor="#b0b0b0" stopOpacity="0.5" />
            <stop offset="40%" stopColor="#999" stopOpacity="0.7" />
            <stop offset="60%" stopColor="#999" stopOpacity="0.7" />
            <stop offset="85%" stopColor="#b0b0b0" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#b0b0b0" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M-60 820 C200 650, 400 750, 620 520 S900 300, 1100 200 S1350 50, 1520 -20"
          stroke="url(#lineFade)"
          strokeWidth="2.5"
          fill="none"
        />
      </svg>

      <div
        className="mx-auto px-4 sm:px-6 lg:px-10 w-full relative"
        style={{ maxWidth: '1280px' }}
      >
        {/* === Main composition container === */}
        <div className="relative min-h-[600px] lg:h-[700px] xl:h-[750px] flex flex-col lg:block py-10 lg:py-16">
          {/* ── TOP-LEFT: Eyebrow + Heading (overlaps center card) ── */}
          <div className="relative z-30 lg:absolute lg:top-[72px] lg:left-0 mb-8 lg:mb-0">
            <p
              className="text-[11px] font-semibold tracking-[0.16em] uppercase mb-5"
              style={{ color: 'var(--gray, #787878)' }}
            >
              24/7 Professional Monitoring &nbsp;|&nbsp; Fall Detection
            </p>
            <h1
              className="font-heading text-[2.4rem] sm:text-5xl lg:text-[3.2rem] xl:text-[3.6rem] font-bold leading-[1.25] tracking-[-0.025em]"
              style={{ color: 'var(--black, #171717)' }}
            >
              Canada&apos;s Best
              <br />
              Medical Alert{' '}
              <br className="hidden lg:block" />
              <span className="font-extrabold" style={{ color: 'var(--blue, #4294d8)' }}>
                Systems.
              </span>
            </h1>
            <p
              className="mt-5 text-base lg:text-[15px] xl:text-lg leading-relaxed max-w-[280px] xl:max-w-[380px]"
              style={{ color: 'var(--gray, #787878)' }}
            >
              Trusted medical alert systems with fall detection for seniors across Canada.
            </p>
          </div>

          {/* ── CENTER: Large gradient product card ── */}
          <div className="relative z-[5] lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-[48%] w-full max-w-[420px] lg:max-w-[370px] xl:max-w-[460px] mx-auto lg:mx-0">
            <div
              className="rounded-[2rem] overflow-hidden aspect-[4/5]"
              style={{
                background:
                  'linear-gradient(145deg, rgba(66,148,216,0.12) 0%, rgba(66,148,216,0.08) 40%, rgba(242,242,242,0.5) 70%, rgba(66,148,216,0.06) 100%)',
              }}
            >
              <div className="relative w-full h-full flex items-center justify-center p-8">
                <Image
                  src={deviceImageUrl ?? heroImageUrl ?? '/images/hero-device.avif'}
                  alt="Holo Active Slim medical alert device"
                  width={520}
                  height={520}
                  className="w-full max-w-[340px] h-auto object-contain relative z-10"
                  style={{ filter: 'drop-shadow(0 24px 48px rgba(0,0,0,0.20))' }}
                  priority
                />
              </div>
            </div>
          </div>

          {/* ── BOTTOM-LEFT: Lifestyle card + customer badge (tilted) ── */}
          <div className="relative z-20 lg:absolute lg:bottom-[40px] lg:left-[60px] xl:left-[80px] hidden lg:block" style={{ transform: 'rotate(-4deg)' }}>
            <div
              className="relative w-[240px] h-[290px] rounded-2xl overflow-hidden shadow-md"
              style={{ backgroundColor: 'var(--black-05, #f2f2f2)' }}
            >
              {slot1Url ? (
                <Image
                  src={slot1Url}
                  alt="Senior using Holo Alert device"
                  fill
                  className="object-cover object-center"
                />
              ) : (
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(66,148,216,0.15) 0%, rgba(242,242,242,0.5) 50%, rgba(66,148,216,0.08) 100%)',
                  }}
                />
              )}

            </div>
          </div>

          {/* ── TOP-RIGHT: Lifestyle card with play button (tilted) ── */}
          <div className="relative z-20 lg:absolute lg:top-[140px] lg:right-[30px] xl:right-[40px] hidden lg:block" style={{ transform: 'rotate(3deg)' }}>
            <div
              className="relative w-[270px] h-[320px] rounded-2xl overflow-hidden shadow-md"
              style={{ backgroundColor: 'var(--black-05, #f2f2f2)' }}
            >
              {slot2Url ? (
                <Image
                  src={slot2Url}
                  alt="Senior with family"
                  fill
                  className="object-cover object-center"
                />
              ) : (
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(244,96,54,0.08) 0%, rgba(242,242,242,0.5) 50%, rgba(66,148,216,0.06) 100%)',
                  }}
                />
              )}

            </div>
          </div>

          {/* ── BOTTOM-CENTER: "View All Devices" CTA ── */}
          <div className="relative z-30 lg:absolute lg:bottom-[130px] lg:left-1/2 lg:-translate-x-1/2 mt-6 lg:mt-0 flex justify-center">
            <Link
              href="#products"
              className="inline-flex items-center gap-3 rounded-full pl-6 pr-2 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-100 backdrop-blur-sm"
              style={{ backgroundColor: 'rgba(23,23,23,0.75)' }}
            >
              View All Devices
              <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <svg width="11" height="11" viewBox="0 0 10 10" fill="none">
                  <path d="M1 9L9 1M9 1H2M9 1v7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
          </div>

          {/* ── BOTTOM-RIGHT: Trust text ── */}
          <div className="relative z-20 lg:absolute lg:bottom-[80px] lg:right-[30px] xl:right-[40px] mt-6 lg:mt-0 flex flex-col gap-3 lg:items-center lg:w-[270px]">
            {/* Google badge */}
            <div className="flex items-center gap-3 rounded-2xl bg-white/90 backdrop-blur-sm px-5 py-3 shadow-md">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A11.96 11.96 0 001 12c0 1.94.46 3.77 1.18 5.43l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-[15px] font-bold" style={{ color: '#171717' }}>4.9</span>
                  <div className="flex gap-[2px]">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} width="14" height="14" viewBox="0 0 20 20" fill="#FBBC05">
                        <path d="M10 1l2.39 6.34H19l-5.3 3.87 1.9 6.42L10 13.49l-5.6 4.14 1.9-6.42L1 7.34h6.61z"/>
                      </svg>
                    ))}
                  </div>
                </div>
                <span className="text-[11px]" style={{ color: '#787878' }}>Google Reviews</span>
              </div>
            </div>
            {/* Trustpilot badge */}
            <div className="flex items-center gap-3 rounded-2xl bg-white/90 backdrop-blur-sm px-5 py-3 shadow-md">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z" fill="#00B67A"/>
              </svg>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-[15px] font-bold" style={{ color: '#171717' }}>4.9</span>
                  <div className="flex gap-[2px]">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} width="14" height="14" viewBox="0 0 20 20" fill="#00B67A">
                        <path d="M10 1l2.39 6.34H19l-5.3 3.87 1.9 6.42L10 13.49l-5.6 4.14 1.9-6.42L1 7.34h6.61z"/>
                      </svg>
                    ))}
                  </div>
                </div>
                <span className="text-[11px]" style={{ color: '#787878' }}>Trustpilot</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </AuroraBackground>
  )
}

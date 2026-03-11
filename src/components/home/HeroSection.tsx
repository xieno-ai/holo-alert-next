import Image from 'next/image'
import Link from 'next/link'

export default function HeroSection() {
  return (
    <section
      className="min-h-screen max-h-[70rem] flex flex-col pt-[108px]"
      style={{ background: 'linear-gradient(169deg, #111, #292929)' }}
    >
      <div
        className="mx-auto px-4 sm:px-6 lg:px-8 w-full h-full flex-1 flex flex-col"
        style={{ maxWidth: 'var(--max-w-container)' }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 flex-1 h-full">
          {/* Left column — copy */}
          <div className="pt-24 pb-8 flex flex-col gap-8 justify-center">
            <div>
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Canada&apos;s Best Medical Alert Systems.
              </h1>
              <p className="text-white/25 text-lg leading-relaxed mt-2">
                Trusted medical alert systems with fall detection for seniors across Canada.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/devices"
                className="inline-flex items-center justify-center rounded-full px-8 py-3 bg-brand-blue text-white font-semibold text-sm hover:bg-brand-blue/90 transition-colors"
              >
                Learn more
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex items-center justify-center rounded-full px-8 py-3 bg-white text-brand-black font-semibold text-sm hover:bg-white/90 transition-colors"
              >
                Explore
              </Link>
            </div>
          </div>

          {/* Right column — device image, bottom-aligned */}
          <div className="flex items-end justify-center lg:justify-end h-full">
            <Image
              src="/images/hero-device.avif"
              alt="Holo medical alert device"
              width={560}
              height={700}
              className="w-full max-w-[28rem] lg:max-w-[32rem] h-auto object-contain object-bottom"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}

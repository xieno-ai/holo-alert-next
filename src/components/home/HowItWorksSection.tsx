import Image from 'next/image'
import Link from 'next/link'

const steps = [
  {
    number: '1',
    photo: '/images/step-1.avif',
    title: 'Stay Safe and Connected',
    description: 'One press of your button connects you with our 24/7 monitoring team, who will get you the help you need.',
    href: '/devices',
  },
  {
    number: '2',
    photo: '/images/step-2.avif',
    title: 'Get the Support You Need, When You Need It',
    description: "Our dedicated care team is here for you 24/7. We'll contact your loved ones or emergency services at the touch of a button.",
    href: '/devices',
  },
  {
    number: '3',
    photo: '/images/step-3.avif',
    title: 'Stay Safe and Independent, Knowing Help is Always There',
    description: "Enjoy peace of mind knowing our team is ready to assist you day and night. We'll alert your contacts or 911 if necessary.",
    href: '/devices',
  },
]

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-white pt-[9.25rem] pb-20">
      <div
        className="mx-auto px-4 sm:px-6 lg:px-8"
        style={{ maxWidth: 'var(--max-w-container)' }}
      >
        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#4294d8', display: 'block', marginBottom: '12px' }}>
            How Canada&apos;s Best Medical Alert Systems Work
          </span>
          <h2 style={{ fontSize: 'clamp(28px, 3vw, 48px)', fontWeight: 700, color: '#171717', lineHeight: 1.15, margin: 0 }}>
            3 Steps to <span style={{ color: '#787878', fontWeight: 700 }}>24/7 Protection</span>
          </h2>
        </div>

        {/* 3-column photo card grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[1.125rem]">
          {steps.map((step) => (
            <div
              key={step.number}
              className="relative rounded-2xl overflow-hidden group cursor-pointer border border-transparent hover:border-black/25 transition-colors"
            >
              <Image
                src={step.photo}
                alt={step.title}
                width={600}
                height={900}
                className="w-full object-cover"
                style={{ aspectRatio: '1/1.5' }}
              />
              {/* Overlay content */}
              <div className="absolute inset-0 m-5 flex flex-col justify-between">
                {/* Step number — top left */}
                <p className="text-white font-semibold text-sm">{step.number}</p>
                {/* Title + button — bottom */}
                <div className="flex flex-col gap-3">
                  <h3 className="text-white font-heading text-xl font-semibold leading-snug">
                    {step.title}
                  </h3>
                  <Link
                    href={step.href}
                    className="inline-flex items-center self-start px-5 py-2 bg-white text-brand-black text-sm font-semibold rounded-full hover:bg-white/90 transition-colors"
                  >
                    Explore
                  </Link>
                </div>
              </div>
              {/* Arrow icon — bottom right */}
              <div className="absolute bottom-5 right-5 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

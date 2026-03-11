'use client'

import Image from 'next/image'
import { useState } from 'react'

const fallbackSteps = [
  {
    number: '1',
    photo: '/images/step-1.avif',
    title: 'Stay Safe and Connected',
    description: 'One press of your button connects you with our 24/7 monitoring team, who will get you the help you need. See How It Works.',
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

interface SanityStep {
  title: string
  description: string
  href: string
  imageUrl: string | null
}

interface Props {
  steps?: SanityStep[] | null
}

export default function HowItWorksSection({ steps: sanitySteps }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const steps = sanitySteps
    ? sanitySteps.map((s, i) => ({
        number: String(i + 1),
        photo: s.imageUrl ?? fallbackSteps[i]?.photo ?? '/images/step-1.avif',
        title: s.title,
        description: s.description,
        href: s.href,
      }))
    : fallbackSteps

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

        {/* 3-column card grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[1.125rem]">
          {steps.map((step, index) => {
            const isActive = activeIndex === index
            const paddedNumber = String(index + 1).padStart(2, '0')

            return (
              <div
                key={step.number}
                className="relative rounded-2xl overflow-hidden cursor-pointer"
                style={{
                  aspectRatio: '1/1.5',
                  transition: 'background-color 0.4s ease, border-color 0.4s ease',
                  backgroundColor: isActive ? '#ffffff' : 'transparent',
                  border: isActive ? '1px solid #e5e5e5' : '1px solid transparent',
                }}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {/* Photo — hidden when active */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: isActive ? 0 : 1,
                    transition: 'opacity 0.4s ease',
                  }}
                >
                  <Image
                    src={step.photo}
                    alt={step.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Photo overlay content (inactive state) */}
                <div
                  className="absolute inset-0 m-5 flex flex-col justify-between"
                  style={{
                    opacity: isActive ? 0 : 1,
                    transition: 'opacity 0.4s ease',
                    pointerEvents: isActive ? 'none' : 'auto',
                  }}
                >
                  <p className="text-white font-semibold text-sm">{paddedNumber}</p>
                  <h3 className="text-white font-heading text-xl font-semibold leading-snug">
                    {step.title}
                  </h3>
                </div>

                {/* Active state content (white card) */}
                <div
                  className="absolute inset-0 flex flex-col justify-between"
                  style={{
                    padding: '28px',
                    opacity: isActive ? 1 : 0,
                    transition: 'opacity 0.4s ease',
                    pointerEvents: isActive ? 'auto' : 'none',
                  }}
                >
                  {/* Step number top-left */}
                  <p style={{ fontSize: '15px', fontWeight: 500, color: '#171717', margin: 0 }}>
                    {paddedNumber}
                  </p>

                  {/* Bottom content */}
                  <div>
                    <h3
                      style={{
                        fontSize: 'clamp(24px, 2.5vw, 32px)',
                        fontWeight: 700,
                        color: '#171717',
                        lineHeight: 1.15,
                        margin: '0 0 16px 0',
                      }}
                    >
                      {step.title}
                    </h3>
                    <p
                      style={{
                        fontSize: '14px',
                        lineHeight: 1.6,
                        color: '#787878',
                        margin: '0 0 24px 0',
                      }}
                    >
                      {step.description}
                    </p>

                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

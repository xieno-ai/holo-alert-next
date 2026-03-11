'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/sanity/lib/image'

// ─── Types ───────────────────────────────────────────────────────────────────

interface Spec {
  label: string
  value: string
}

export interface Device {
  _id: string
  name: string
  slug: { current: string }
  tagline?: string
  monthlyPriceDisplay?: string
  annualPriceDisplay?: string
  devicePrice?: number
  reducedDevicePrice?: number
  pricingCardImage?: object
  pricingCardSubhead?: string
  pricingCardSubscription?: string
  pricingCardBenefits?: string[]
  pricingCardOrder?: number
  specs?: Spec[]
  shippingTimeline?: string
}

// ─── Quiz Data ───────────────────────────────────────────────────────────────

type Scores = { [slug: string]: number }

interface Option {
  label: string
  id: string
  scores: Scores
}

interface Question {
  id: string
  text: string
  textSelf?: string
  options: Option[]
}

const QUESTIONS: Question[] = [
  {
    id: 'who',
    text: 'Who are you looking for a device for?',
    options: [
      { label: 'Myself', id: 'myself', scores: { 'holo-pro': 1, 'holo-mini': 1, 'holo-active': 2 } },
      { label: 'A parent or loved one', id: 'parent', scores: { 'holo-pro': 2, 'holo-mini': 1, 'holo-active': 1 } },
      { label: 'Someone in my care', id: 'care', scores: { 'holo-pro': 2, 'holo-mini': 1, 'holo-active': 1 } },
    ],
  },
  {
    id: 'lifestyle',
    text: 'What does their typical day look like?',
    textSelf: 'What does your typical day look like?',
    options: [
      { label: 'Mostly at home, enjoying a quiet routine', id: 'home', scores: { 'holo-pro': 3, 'holo-mini': 1, 'holo-active': 0 } },
      { label: 'A mix of outings, errands, and socializing', id: 'mix', scores: { 'holo-pro': 2, 'holo-mini': 2, 'holo-active': 1 } },
      { label: 'Very active with walks, exercises, and time outdoors', id: 'active', scores: { 'holo-pro': 0, 'holo-mini': 1, 'holo-active': 3 } },
    ],
  },
  {
    id: 'techcomfort',
    text: 'How comfortable are they with technology?',
    textSelf: 'How comfortable are you with technology?',
    options: [
      { label: 'Prefers simple devices with minimal setup', id: 'simple', scores: { 'holo-pro': 4, 'holo-mini': 2, 'holo-active': 0 } },
      { label: 'Can handle the basics like a cell phone', id: 'moderate', scores: { 'holo-pro': 1, 'holo-mini': 3, 'holo-active': 1 } },
      { label: 'Tech-savvy and enjoys using smart devices', id: 'techy', scores: { 'holo-pro': 0, 'holo-mini': 1, 'holo-active': 4 } },
    ],
  },
  {
    id: 'feature',
    text: 'Which feature matters most to you?',
    options: [
      { label: 'Long battery life and simple charging', id: 'battery', scores: { 'holo-pro': 4, 'holo-mini': 1, 'holo-active': 0 } },
      { label: 'GPS tracking when away from home', id: 'gps', scores: { 'holo-pro': 0, 'holo-mini': 4, 'holo-active': 1 } },
      { label: 'Health monitoring (steps, heart rate)', id: 'health', scores: { 'holo-pro': 0, 'holo-mini': 0, 'holo-active': 4 } },
      { label: 'Small and discreet so nobody notices it', id: 'discreet', scores: { 'holo-pro': 1, 'holo-mini': 4, 'holo-active': 1 } },
    ],
  },
  {
    id: 'wearstyle',
    text: 'How would they prefer to wear the device?',
    textSelf: 'How would you prefer to wear the device?',
    options: [
      { label: 'Around the neck as a pendant', id: 'pendant', scores: { 'holo-pro': 4, 'holo-mini': 0, 'holo-active': 0 } },
      { label: 'On the wrist, like a watch or band', id: 'wrist', scores: { 'holo-pro': 0, 'holo-mini': 3, 'holo-active': 3 } },
      { label: 'No preference, comfort is what matters', id: 'nopref', scores: { 'holo-pro': 2, 'holo-mini': 1, 'holo-active': 1 } },
    ],
  },
  {
    id: 'plan',
    text: "What's most important when choosing a plan?",
    options: [
      { label: 'Keeping monthly costs low', id: 'affordable', scores: { 'holo-pro': 1, 'holo-mini': 3, 'holo-active': 0 } },
      { label: 'Good value for the features included', id: 'value', scores: { 'holo-pro': 3, 'holo-mini': 1, 'holo-active': 1 } },
      { label: 'Premium features, even at a higher price', id: 'premium', scores: { 'holo-pro': 1, 'holo-mini': 0, 'holo-active': 3 } },
    ],
  },
]

// ─── Reason templates ────────────────────────────────────────────────────────

interface ReasonRule {
  slug: string
  answerId?: string
  reason: string
}

const REASON_RULES: ReasonRule[] = [
  { slug: 'holo-pro', answerId: 'home', reason: 'Designed for comfortable, everyday use at home with long-lasting battery life' },
  { slug: 'holo-pro', answerId: 'pendant', reason: 'A discreet pendant you can wear comfortably all day' },
  { slug: 'holo-pro', answerId: 'battery', reason: 'Industry-leading battery life means less time charging' },
  { slug: 'holo-pro', answerId: 'value', reason: 'The best value for comprehensive safety features' },
  { slug: 'holo-pro', answerId: 'simple', reason: 'Simple to use with no complicated setup required' },
  { slug: 'holo-mini', answerId: 'gps', reason: 'GPS tracking keeps you connected when you\'re out and about' },
  { slug: 'holo-mini', answerId: 'discreet', reason: 'Lightweight and discreet, barely noticeable on your wrist' },
  { slug: 'holo-mini', answerId: 'affordable', reason: 'Our most affordable plan without compromising on safety' },
  { slug: 'holo-active', answerId: 'techy', reason: 'A full smartwatch experience for those who love technology' },
  { slug: 'holo-active', answerId: 'active', reason: 'Built for your active lifestyle with step and heart rate tracking' },
  { slug: 'holo-active', answerId: 'health', reason: 'Real-time health insights right on your wrist' },
  { slug: 'holo-active', answerId: 'premium', reason: 'Our most feature-rich device with a modern smartwatch design' },
]

const FALLBACK_REASON = '24/7 professional monitoring and automatic fall detection included'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function pushDataLayer(event: string, data?: Record<string, unknown>) {
  if (typeof window !== 'undefined') {
    ;(window as unknown as { dataLayer: Record<string, unknown>[] }).dataLayer =
      (window as unknown as { dataLayer: Record<string, unknown>[] }).dataLayer || []
    ;(window as unknown as { dataLayer: Record<string, unknown>[] }).dataLayer.push({
      event,
      ...data,
    })
  }
}

function normalizeMonthly(val: string | undefined | null): string {
  if (!val) return '—'
  let s = val
  if (!s.includes('$')) s = s.replace(/(\d)/, '$$$1')
  if (!/\/mo(nth)?/i.test(s)) s = s.trim() + '/mo'
  return s
}

// ─── Icons ───────────────────────────────────────────────────────────────────

const CheckIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" style={{ flexShrink: 0 }}>
    <circle cx="11" cy="11" r="11" fill="#4294d8" />
    <path d="M6.5 11.5L9.2 14.2L15.5 7.8" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const ChevronLeft = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
    <path d="M11 4L6 9l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const ArrowRight = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
    <path d="M7 4l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

// Radio dot for answer options
const RadioDot = ({ selected }: { selected: boolean }) => (
  <div
    style={{
      width: '22px',
      height: '22px',
      borderRadius: '50%',
      border: selected ? '2px solid #4294d8' : '2px solid #d0d5dd',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      transition: 'border-color 0.15s',
    }}
  >
    <div
      style={{
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        background: selected ? '#4294d8' : 'transparent',
        transition: 'background 0.15s',
      }}
    />
  </div>
)

// ─── Main Component ──────────────────────────────────────────────────────────

type Screen = 'intro' | 'quiz' | 'results'

export default function QuizClient({ devices }: { devices: Device[] }) {
  const [screen, setScreen] = useState<Screen>('intro')
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<(string | null)[]>(Array(QUESTIONS.length).fill(null))
  const [slideDir, setSlideDir] = useState<'forward' | 'back'>('forward')
  const [animating, setAnimating] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [resultsVisible, setResultsVisible] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Trigger results fade-in
  useEffect(() => {
    if (screen === 'results') {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setResultsVisible(true))
      })
    } else {
      setResultsVisible(false)
    }
  }, [screen])

  // ── Scoring ──────────────────────────────────────────────────────────────

  const computeResults = useCallback(() => {
    const totals: Scores = {}
    const selectedIds: string[] = []

    answers.forEach((answerId, qi) => {
      if (!answerId) return
      selectedIds.push(answerId)
      const option = QUESTIONS[qi].options.find((o) => o.id === answerId)
      if (!option) return
      for (const [slug, pts] of Object.entries(option.scores)) {
        totals[slug] = (totals[slug] || 0) + pts
      }
    })

    const priority = ['holo-pro', 'holo-mini', 'holo-active']
    const ranked = Object.entries(totals).sort((a, b) => {
      if (b[1] !== a[1]) return b[1] - a[1]
      return priority.indexOf(a[0]) - priority.indexOf(b[0])
    })

    const winnerSlug = ranked[0]?.[0] || 'holo-pro'

    const reasons: string[] = []
    for (const rule of REASON_RULES) {
      if (rule.slug === winnerSlug && rule.answerId && selectedIds.includes(rule.answerId)) {
        reasons.push(rule.reason)
      }
      if (reasons.length >= 3) break
    }
    if (reasons.length === 0) reasons.push(FALLBACK_REASON)
    if (reasons.length < 2) reasons.push(FALLBACK_REASON)

    return { winnerSlug, reasons, ranked }
  }, [answers])

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleStart = () => {
    pushDataLayer('quiz_start')
    setScreen('quiz')
  }

  const handleAnswer = (optionId: string) => {
    if (animating) return
    const newAnswers = [...answers]
    newAnswers[step] = optionId

    pushDataLayer('quiz_answer', {
      question_id: QUESTIONS[step].id,
      answer_id: optionId,
      step: step + 1,
    })

    setAnswers(newAnswers)

    if (step < QUESTIONS.length - 1) {
      setSlideDir('forward')
      setAnimating(true)
      setTimeout(() => {
        setStep(step + 1)
        setAnimating(false)
      }, 350)
    } else {
      setTimeout(() => {
        const totals: Scores = {}
        newAnswers.forEach((answerId, qi) => {
          if (!answerId) return
          const option = QUESTIONS[qi].options.find((o) => o.id === answerId)
          if (!option) return
          for (const [slug, pts] of Object.entries(option.scores)) {
            totals[slug] = (totals[slug] || 0) + pts
          }
        })
        const priority = ['holo-pro', 'holo-mini', 'holo-active']
        const ranked = Object.entries(totals).sort((a, b) => {
          if (b[1] !== a[1]) return b[1] - a[1]
          return priority.indexOf(a[0]) - priority.indexOf(b[0])
        })
        const winnerSlug = ranked[0]?.[0] || 'holo-pro'
        const winnerDevice = devices.find((d) => d.slug?.current === winnerSlug)

        pushDataLayer('quiz_complete', {
          recommended_device: winnerDevice?.name || winnerSlug,
          recommended_slug: winnerSlug,
        })
        setScreen('results')
      }, 350)
    }
  }

  const handleBack = () => {
    if (step > 0 && !animating) {
      setSlideDir('back')
      setAnimating(true)
      setTimeout(() => {
        setStep(step - 1)
        setAnimating(false)
      }, 350)
    }
  }

  const handleRetake = () => {
    setScreen('intro')
    setStep(0)
    setAnswers(Array(QUESTIONS.length).fill(null))
    setSlideDir('forward')
  }

  const handleCtaClick = (deviceName: string, ctaText: string) => {
    pushDataLayer('quiz_cta_click', {
      device_name: deviceName,
      cta_text: ctaText,
      cta_location: 'quiz_result',
    })
  }

  // ── Empty state ──────────────────────────────────────────────────────────

  if (devices.length === 0) {
    return (
      <div
        style={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: '120px',
          fontFamily: 'var(--font-instrument-sans), sans-serif',
          color: '#787878',
        }}
      >
        No devices found.
      </div>
    )
  }

  // ── Results data ─────────────────────────────────────────────────────────

  const { winnerSlug, reasons, ranked } = computeResults()
  const winner = devices.find((d) => d.slug?.current === winnerSlug) || devices[0]
  const alternates = ranked
    .filter(([slug]) => slug !== winnerSlug)
    .map(([slug]) => devices.find((d) => d.slug?.current === slug))
    .filter(Boolean) as Device[]

  // ── Shared styles ────────────────────────────────────────────────────────

  const font = 'var(--font-instrument-sans), sans-serif'

  // ── INTRO SCREEN ─────────────────────────────────────────────────────────

  if (screen === 'intro') {
    return (
      <div
        style={{
          fontFamily: font,
          minHeight: '100vh',
          background: 'linear-gradient(169deg, #111, #292929)',
          paddingTop: '120px',
          paddingBottom: '100px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle radial accent */}
        <div
          style={{
            position: 'absolute',
            top: '20%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '800px',
            height: '600px',
            background: 'radial-gradient(ellipse, rgba(66,148,216,0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            maxWidth: '680px',
            margin: '0 auto',
            padding: isMobile ? '60px 24px 40px' : '100px 40px 60px',
            textAlign: 'center',
            position: 'relative',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#4294d8',
              marginBottom: '20px',
              background: 'rgba(66,148,216,0.1)',
              padding: '6px 16px',
              borderRadius: '100px',
            }}
          >
            Product Quiz
          </span>

          <h1
            style={{
              fontSize: isMobile ? '34px' : 'clamp(40px, 5vw, 56px)',
              fontWeight: 700,
              color: '#fff',
              margin: '0 0 20px',
              lineHeight: 1.08,
              letterSpacing: '-0.025em',
            }}
          >
            Find the Right{isMobile ? ' ' : <br />}
            Device for You
          </h1>

          <p
            style={{
              fontSize: isMobile ? '16px' : '18px',
              color: 'rgba(255,255,255,0.45)',
              margin: '0 auto 48px',
              lineHeight: 1.6,
              maxWidth: '460px',
            }}
          >
            Answer a few quick questions and we&apos;ll match you with the
            Holo Alert device that fits your lifestyle.
          </p>

          <button
            onClick={handleStart}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: '#4294d8',
              color: '#fff',
              fontWeight: 600,
              fontSize: '16px',
              padding: '16px 36px',
              borderRadius: '100px',
              border: 'none',
              cursor: 'pointer',
              letterSpacing: '0.01em',
              transition: 'background 0.15s, transform 0.1s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#3580c0'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#4294d8'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            Start Quiz
            <ArrowRight />
          </button>

          <p
            style={{
              fontSize: '13px',
              color: 'rgba(255,255,255,0.3)',
              marginTop: '20px',
              letterSpacing: '0.01em',
            }}
          >
            Takes less than a minute
          </p>

          {/* Device preview thumbnails */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '24px',
              marginTop: isMobile ? '48px' : '72px',
            }}
          >
            {devices.slice(0, 3).map((device) => {
              const imgSrc = device.pricingCardImage
                ? urlFor(device.pricingCardImage).width(200).height(200).url()
                : null
              return (
                <div
                  key={device._id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <div
                    style={{
                      width: isMobile ? '72px' : '96px',
                      height: isMobile ? '72px' : '96px',
                      background: 'rgba(255,255,255,0.06)',
                      borderRadius: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    {imgSrc && (
                      <Image
                        src={imgSrc}
                        alt={device.name}
                        width={isMobile ? 56 : 72}
                        height={isMobile ? 56 : 72}
                        style={{ objectFit: 'contain', opacity: 0.85 }}
                      />
                    )}
                  </div>
                  <span
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255,255,255,0.35)',
                      fontWeight: 500,
                    }}
                  >
                    {device.name}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // ── QUIZ SCREEN ──────────────────────────────────────────────────────────

  if (screen === 'quiz') {
    const question = QUESTIONS[step]
    const progress = ((step + 1) / QUESTIONS.length) * 100

    return (
      <div
        style={{
          fontFamily: font,
          background: '#fff',
          minHeight: '100vh',
          paddingTop: '120px',
          paddingBottom: '100px',
        }}
      >
        <div
          style={{
            maxWidth: '640px',
            margin: '0 auto',
            padding: isMobile ? '0 20px' : '0 40px',
          }}
        >
          {/* Progress area */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '10px',
            }}
          >
            <span
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: '#4294d8',
                letterSpacing: '0.01em',
              }}
            >
              Question {step + 1} of {QUESTIONS.length}
            </span>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 500,
                color: '#787878',
              }}
            >
              {Math.round(progress)}%
            </span>
          </div>

          {/* Progress bar */}
          <div
            style={{
              height: '4px',
              background: '#f2f2f2',
              borderRadius: '100px',
              marginBottom: '48px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${progress}%`,
                background: '#4294d8',
                borderRadius: '100px',
                transition: 'width 0.35s ease',
              }}
            />
          </div>

          {/* Back button */}
          {step > 0 && (
            <button
              onClick={handleBack}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                color: '#787878',
                padding: '0',
                marginBottom: '28px',
                fontWeight: 500,
                transition: 'color 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#171717')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#787878')}
            >
              <ChevronLeft />
              Back
            </button>
          )}

          {/* Question content — animated */}
          <div
            key={step}
            style={{
              opacity: animating ? 0 : 1,
              transform: animating
                ? slideDir === 'forward'
                  ? 'translateX(30px)'
                  : 'translateX(-30px)'
                : 'translateX(0)',
              transition: 'opacity 0.25s ease, transform 0.25s ease',
            }}
          >
            <h2
              style={{
                fontSize: isMobile ? '24px' : '30px',
                fontWeight: 700,
                color: '#171717',
                margin: '0 0 36px',
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
              }}
            >
              {answers[0] === 'myself' && question.textSelf ? question.textSelf : question.text}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {question.options.map((option) => {
                const isSelected = answers[step] === option.id
                return (
                  <button
                    key={option.id}
                    onClick={() => handleAnswer(option.id)}
                    style={{
                      width: '100%',
                      padding: isMobile ? '18px 18px' : '20px 24px',
                      background: isSelected ? '#eef6fc' : '#fff',
                      border: isSelected ? '2px solid #4294d8' : '1px solid #d9d9d9',
                      borderRadius: '14px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontSize: isMobile ? '15px' : '16px',
                      fontWeight: 500,
                      color: '#171717',
                      lineHeight: 1.4,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      transition: 'border-color 0.15s, background 0.15s, box-shadow 0.15s',
                      boxShadow: isSelected
                        ? '0 0 0 3px rgba(66,148,216,0.12)'
                        : '0 1px 3px rgba(0,0,0,0.04)',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = '#4294d8'
                        e.currentTarget.style.boxShadow = '0 1px 6px rgba(66,148,216,0.12)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = '#d9d9d9'
                        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'
                      }
                    }}
                  >
                    <RadioDot selected={isSelected} />
                    {option.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Step dots */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '52px',
            }}
          >
            {QUESTIONS.map((_, i) => (
              <div
                key={i}
                style={{
                  width: i === step ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '100px',
                  background: i === step ? '#4294d8' : i < step ? '#4294d8' : '#e0e0e0',
                  opacity: i < step ? 0.4 : 1,
                  transition: 'width 0.25s ease, background 0.25s ease, opacity 0.25s ease',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ── RESULTS SCREEN ───────────────────────────────────────────────────────

  const winnerImg = winner.pricingCardImage
    ? urlFor(winner.pricingCardImage).width(480).height(480).url()
    : null

  const winnerMonthly = normalizeMonthly(winner.monthlyPriceDisplay || winner.pricingCardSubscription)
  const devicePrice = winner.reducedDevicePrice || winner.devicePrice

  return (
    <div
      style={{
        fontFamily: font,
        background: '#fff',
        minHeight: '100vh',
        paddingTop: '120px',
        paddingBottom: '100px',
      }}
    >
      <div
        style={{
          maxWidth: '960px',
          margin: '0 auto',
          padding: isMobile ? '0 20px' : '0 40px',
          opacity: resultsVisible ? 1 : 0,
          transform: resultsVisible ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span
            style={{
              display: 'inline-block',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#4294d8',
              marginBottom: '16px',
              background: 'rgba(66,148,216,0.08)',
              padding: '6px 16px',
              borderRadius: '100px',
            }}
          >
            Your Perfect Match
          </span>
          <h1
            style={{
              fontSize: isMobile ? '28px' : 'clamp(34px, 4vw, 46px)',
              fontWeight: 700,
              color: '#171717',
              margin: '0',
              lineHeight: 1.1,
              letterSpacing: '-0.025em',
            }}
          >
            We Recommend the {winner.name}
          </h1>
        </div>

        {/* Recommended device card */}
        <div
          style={{
            background: '#fafafa',
            borderRadius: '24px',
            padding: isMobile ? '32px 24px' : '48px 56px',
            marginBottom: '48px',
            border: '1px solid #f0f0f0',
          }}
        >
          <div
            style={{
              display: isMobile ? 'block' : 'flex',
              gap: '52px',
              alignItems: 'center',
            }}
          >
            {/* Device image */}
            <div
              style={{
                flex: '0 0 auto',
                width: isMobile ? '100%' : '260px',
                display: 'flex',
                justifyContent: 'center',
                marginBottom: isMobile ? '32px' : '0',
              }}
            >
              <div
                style={{
                  width: '260px',
                  height: '260px',
                  background: '#fff',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
                }}
              >
                {winnerImg ? (
                  <Image
                    src={winnerImg}
                    alt={winner.name}
                    width={220}
                    height={220}
                    style={{ objectFit: 'contain', maxHeight: '220px', width: 'auto', height: 'auto' }}
                  />
                ) : (
                  <div
                    style={{
                      width: '160px',
                      height: '160px',
                      background: '#f2f2f2',
                      borderRadius: '16px',
                    }}
                  />
                )}
              </div>
            </div>

            {/* Device info */}
            <div style={{ flex: 1 }}>
              <h2
                style={{
                  fontSize: isMobile ? '26px' : '30px',
                  fontWeight: 700,
                  color: '#171717',
                  margin: '0 0 6px',
                  lineHeight: 1.15,
                  letterSpacing: '-0.02em',
                }}
              >
                {winner.name}
              </h2>

              {winner.tagline && (
                <p
                  style={{
                    fontSize: '15px',
                    color: '#787878',
                    margin: '0 0 24px',
                    lineHeight: 1.5,
                  }}
                >
                  {winner.tagline}
                </p>
              )}

              {/* Reasons */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  marginBottom: '28px',
                }}
              >
                {reasons.map((reason, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                    }}
                  >
                    <div style={{ marginTop: '1px' }}>
                      <CheckIcon />
                    </div>
                    <span
                      style={{
                        fontSize: '15px',
                        color: '#344054',
                        lineHeight: 1.5,
                      }}
                    >
                      {reason}
                    </span>
                  </div>
                ))}
              </div>

              {/* Pricing */}
              <div
                style={{
                  background: '#fff',
                  borderRadius: '14px',
                  padding: '16px 20px',
                  marginBottom: '28px',
                  border: '1px solid #f0f0f0',
                  display: 'inline-flex',
                  alignItems: 'baseline',
                  gap: '8px',
                }}
              >
                <span
                  style={{
                    fontSize: '28px',
                    fontWeight: 700,
                    color: '#45b864',
                    lineHeight: 1,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {winnerMonthly}
                </span>
                {devicePrice != null && (
                  <span
                    style={{
                      fontSize: '13px',
                      color: '#787878',
                    }}
                  >
                    + ${devicePrice} device fee
                  </span>
                )}
              </div>

              {/* CTAs */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: '16px',
                }}
              >
                <Link
                  href={`/devices/${winner.slug?.current}`}
                  onClick={() => handleCtaClick(winner.name, `Choose ${winner.name}`)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: '#4294d8',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '15px',
                    padding: '14px 32px',
                    borderRadius: '100px',
                    textDecoration: 'none',
                    transition: 'background 0.15s, transform 0.1s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#3580c0'
                    e.currentTarget.style.transform = 'translateY(-1px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#4294d8'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  Choose {winner.name}
                  <ArrowRight />
                </Link>

                <Link
                  href="/compare"
                  onClick={() => handleCtaClick(winner.name, 'Compare All Devices')}
                  style={{
                    fontSize: '14px',
                    color: '#4294d8',
                    textDecoration: 'none',
                    fontWeight: 600,
                    transition: 'color 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#2f7abf')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#4294d8')}
                >
                  Compare All Devices
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Also Consider */}
        {alternates.length > 0 && (
          <>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '20px',
              }}
            >
              <h3
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#787878',
                  margin: '0',
                }}
              >
                Also Consider
              </h3>
              <div
                style={{
                  flex: 1,
                  height: '1px',
                  background: '#e8e8e8',
                }}
              />
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                gap: '16px',
                marginBottom: '52px',
              }}
            >
              {alternates.slice(0, 2).map((device) => {
                const imgSrc = device.pricingCardImage
                  ? urlFor(device.pricingCardImage).width(200).height(200).url()
                  : null
                const monthly = normalizeMonthly(
                  device.monthlyPriceDisplay || device.pricingCardSubscription
                )

                return (
                  <Link
                    key={device._id}
                    href={`/devices/${device.slug?.current}`}
                    onClick={() => handleCtaClick(device.name, 'Learn More')}
                    style={{
                      border: '1px solid #e8e8e8',
                      borderRadius: '16px',
                      padding: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '20px',
                      background: '#fff',
                      textDecoration: 'none',
                      transition: 'border-color 0.15s, box-shadow 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#4294d8'
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(66,148,216,0.08)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e8e8e8'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    {imgSrc && (
                      <div
                        style={{
                          flex: '0 0 auto',
                          width: '80px',
                          height: '80px',
                          background: '#fafafa',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Image
                          src={imgSrc}
                          alt={device.name}
                          width={64}
                          height={64}
                          style={{ objectFit: 'contain' }}
                        />
                      </div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: '16px',
                          fontWeight: 700,
                          color: '#171717',
                          marginBottom: '2px',
                          lineHeight: 1.2,
                        }}
                      >
                        {device.name}
                      </div>
                      {device.pricingCardSubhead && (
                        <div
                          style={{
                            fontSize: '13px',
                            color: '#787878',
                            marginBottom: '8px',
                            lineHeight: 1.4,
                          }}
                        >
                          {device.pricingCardSubhead}
                        </div>
                      )}
                      <div
                        style={{
                          fontSize: '15px',
                          fontWeight: 700,
                          color: '#45b864',
                        }}
                      >
                        {monthly}
                      </div>
                    </div>
                    <div style={{ color: '#4294d8', flexShrink: 0 }}>
                      <ArrowRight />
                    </div>
                  </Link>
                )
              })}
            </div>
          </>
        )}

        {/* Retake */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={handleRetake}
            style={{
              background: 'none',
              border: '1px solid #d9d9d9',
              borderRadius: '100px',
              cursor: 'pointer',
              fontSize: '14px',
              color: '#787878',
              fontWeight: 500,
              padding: '10px 24px',
              transition: 'color 0.15s, border-color 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#171717'
              e.currentTarget.style.borderColor = '#171717'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#787878'
              e.currentTarget.style.borderColor = '#d9d9d9'
            }}
          >
            Retake Quiz
          </button>
        </div>
      </div>
    </div>
  )
}

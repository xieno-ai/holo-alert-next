'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

/* ─── Icons ─────────────────────────────────────────────────── */

const SharePersonIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="11" cy="11" r="4" stroke="#4294d8" strokeWidth="1.8" fill="none" />
    <path d="M3 26c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="#4294d8" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    <circle cx="23" cy="11" r="3" stroke="#4294d8" strokeWidth="1.6" fill="none" />
    <path d="M22 20c.32-.03.645-.046.974-.046 3.328 0 6.026 2.7 6.026 6.046" stroke="#4294d8" strokeWidth="1.6" strokeLinecap="round" fill="none" />
  </svg>
)

const NetworkIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="7" r="3.5" stroke="#4294d8" strokeWidth="1.8" fill="none" />
    <circle cx="6" cy="24" r="3.5" stroke="#4294d8" strokeWidth="1.8" fill="none" />
    <circle cx="26" cy="24" r="3.5" stroke="#4294d8" strokeWidth="1.8" fill="none" />
    <path d="M16 10.5v5M16 15.5l-7.5 5M16 15.5l7.5 5" stroke="#4294d8" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

const GiftIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="13" width="22" height="3" rx="1" stroke="#4294d8" strokeWidth="1.8" fill="none" />
    <rect x="7" y="16" width="18" height="11" rx="1" stroke="#4294d8" strokeWidth="1.8" fill="none" />
    <path d="M16 13v14M11 13c0 0-2-4 2-4s3 4 3 4M21 13c0 0 2-4-2-4s-3 4-3 4" stroke="#4294d8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 3v10M3 8h10" stroke="#4294d8" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

const MinusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3 8h10" stroke="#4294d8" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

const FacebookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
  </svg>
)

const LinkedInIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

/* ─── FAQ Accordion Item ─────────────────────────────────────── */

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      style={{
        borderBottom: '1px solid #e8e8e8',
        padding: '20px 0',
      }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="focus-visible:ring-2 focus-visible:ring-[#4294d8]/40 focus-visible:outline-none focus-visible:rounded"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          textAlign: 'left',
          gap: '16px',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-instrument-sans), sans-serif',
            fontSize: '18px',
            fontWeight: 600,
            color: '#171717',
            lineHeight: 1.35,
          }}
        >
          {question}
        </span>
        <span style={{ flexShrink: 0 }}>
          {open ? <MinusIcon /> : <PlusIcon />}
        </span>
      </button>
      {open && (
        <p
          style={{
            marginTop: '12px',
            fontFamily: 'var(--font-instrument-sans), sans-serif',
            fontSize: '15px',
            color: '#555',
            lineHeight: 1.7,
            margin: '12px 0 0',
          }}
        >
          {answer}
        </p>
      )}
    </div>
  )
}

/* ─── Main Page ──────────────────────────────────────────────── */

const steps = [
  {
    icon: <SharePersonIcon />,
    number: '01',
    title: 'Share Holo Alert with a Friend',
    body: 'Tell a friend, neighbour, or family member about Holo Alert — just send them their referral link or call us to register them.',
  },
  {
    icon: <NetworkIcon />,
    number: '02',
    title: "We'll Reach Out",
    body: 'A friendly Care Consultant will call your friend to explain how Holo Alert works and answer any questions.',
  },
  {
    icon: <GiftIcon />,
    number: '03',
    title: 'You Both Get a Free Month!',
    body: 'Once your friend activates their account, you BOTH receive a free month of service — no extra steps needed!',
  },
]

const faqs = [
  {
    question: 'How do I refer someone?',
    answer:
      'Simply fill out the referral form on this page with your friend\'s or family member\'s name and phone number. Our Care Consultant team will take care of the rest.',
  },
  {
    question: 'Will my friend be pressured to sign up?',
    answer:
      'Absolutely not. Our consultants are friendly and informative. They will explain how Holo Alert works and answer any questions — there is no pressure whatsoever.',
  },
  {
    question: 'Is there a limit to how many friends I can refer?',
    answer:
      'There is no limit! Every successful referral earns both you and your friend a free month of service. The more people you help stay safe, the more you both save.',
  },
]

export default function ReferralPageClient() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    referredBy: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────── */}
      <section
        style={{
          position: 'relative',
          minHeight: '480px',
          paddingTop: '0',
          display: 'flex',
          alignItems: 'flex-end',
          overflow: 'hidden',
        }}
      >
        {/* Background photo */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <Image
            src="/images/with-grandchildren.webp"
            alt="Seniors laughing together"
            fill
            style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
            priority
          />
          {/* Dark gradient overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to right, rgba(0,0,0,0.72) 40%, rgba(0,0,0,0.2) 100%)',
            }}
          />
        </div>

        {/* Hero content */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '60px 40px',
            width: '100%',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '40px',
          }}
        >
          {/* Left: headline */}
          <div style={{ maxWidth: '540px' }}>
            <h1
              style={{
                fontFamily: 'var(--font-instrument-sans), sans-serif',
                fontSize: 'clamp(32px, 4.5vw, 60px)',
                fontWeight: 700,
                color: '#fff',
                lineHeight: 1.12,
                margin: '0 0 16px',
              }}
            >
              <span style={{ color: 'rgba(255,255,255,0.55)', fontWeight: 400 }}>
                Refer a Friend
              </span>
              <br />
              &amp; Get a{' '}
              <span style={{ color: '#fff' }}>FREE<br />Month of Service!</span>
            </h1>
            <p
              style={{
                fontFamily: 'var(--font-instrument-sans), sans-serif',
                fontSize: '15px',
                color: 'rgba(255,255,255,0.7)',
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Help a loved one stay safe, and enjoy a free month of Holo Alert service for{' '}
              <em style={{ color: '#4294d8', fontStyle: 'normal', fontWeight: 600 }}>
                both of you!
              </em>
            </p>
          </div>

          {/* Right: share buttons */}
          <div
            style={{
              background: 'rgba(0,0,0,0.45)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '16px',
              padding: '20px 24px',
              flexShrink: 0,
              minWidth: '180px',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-instrument-sans), sans-serif',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.55)',
                marginBottom: '12px',
                margin: '0 0 12px',
              }}
            >
              Share via:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <a
                href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fwww.holoalert.ca%2Freferral-program"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: '#1877f2',
                  color: '#fff',
                  fontFamily: 'var(--font-instrument-sans), sans-serif',
                  fontSize: '13px',
                  fontWeight: 600,
                  padding: '8px 16px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
              >
                <FacebookIcon />
                Facebook
              </a>
              <a
                href="https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fwww.holoalert.ca%2Freferral-program"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: '#0a66c2',
                  color: '#fff',
                  fontFamily: 'var(--font-instrument-sans), sans-serif',
                  fontSize: '13px',
                  fontWeight: 600,
                  padding: '8px 16px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
              >
                <LinkedInIcon />
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Steps Section ─────────────────────────────────── */}
      <section style={{ background: '#fff', padding: '80px 40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

          {/* Section header */}
          <div style={{ marginBottom: '48px' }}>
            <p
              style={{
                fontFamily: 'var(--font-instrument-sans), sans-serif',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#4294d8',
                marginBottom: '12px',
                margin: '0 0 12px',
              }}
            >
              Share the peace of mind
            </p>
            <h2
              style={{
                fontFamily: 'var(--font-instrument-sans), sans-serif',
                fontSize: 'clamp(28px, 3vw, 42px)',
                fontWeight: 700,
                color: '#171717',
                lineHeight: 1.2,
                margin: '0 0 4px',
              }}
            >
              Our Referral Program
            </h2>
            <h2
              style={{
                fontFamily: 'var(--font-instrument-sans), sans-serif',
                fontSize: 'clamp(28px, 3vw, 42px)',
                fontWeight: 400,
                color: '#787878',
                lineHeight: 1.2,
                margin: 0,
              }}
            >
              Is Simple &amp; Rewarding
            </h2>
          </div>

          {/* Step cards */}
          <div
            className="referral-steps-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '20px',
            }}
          >
            {steps.map((step) => (
              <div
                key={step.number}
                style={{
                  border: '1px solid #e8e8e8',
                  borderRadius: '12px',
                  padding: '28px 28px 32px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '48px',
                }}
              >
                {/* Top row: icon + number */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                  }}
                >
                  {step.icon}
                  <span
                    style={{
                      fontFamily: 'var(--font-instrument-sans), sans-serif',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#4294d8',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {step.number}
                  </span>
                </div>

                {/* Bottom: title + body */}
                <div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-instrument-sans), sans-serif',
                      fontSize: '18px',
                      fontWeight: 700,
                      color: '#171717',
                      lineHeight: 1.3,
                      margin: '0 0 12px',
                    }}
                  >
                    {step.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: 'var(--font-instrument-sans), sans-serif',
                      fontSize: '14px',
                      color: '#555',
                      lineHeight: 1.7,
                      margin: 0,
                    }}
                  >
                    {step.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Referral Form + Photo ──────────────────────────── */}
      <section style={{ background: '#f5f6f7', padding: '80px 40px' }}>
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '48px',
            alignItems: 'center',
          }}
          className="referral-form-grid"
        >
          {/* Left: form */}
          <div>
            <h2
              style={{
                fontFamily: 'var(--font-instrument-sans), sans-serif',
                fontSize: 'clamp(24px, 2.5vw, 36px)',
                fontWeight: 700,
                color: '#171717',
                lineHeight: 1.25,
                margin: '0 0 16px',
              }}
            >
              A Special Offer For<br />Friends &amp; Family
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-instrument-sans), sans-serif',
                fontSize: '15px',
                color: '#555',
                lineHeight: 1.7,
                margin: '0 0 20px',
              }}
            >
              Were you referred to Holo Alert by a friend, neighbour or family member? If so,
              we&apos;d love to help! Getting started is simple:
            </p>

            {/* Steps list */}
            <ol
              style={{
                listStyle: 'none',
                margin: '0 0 20px',
                padding: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}
            >
              {[
                'Fill out the short form below',
                'A friendly Care Consultant will reach out to answer your questions',
                'Enjoy a complimentary quote — no obligation!',
              ].map((item, i) => (
                <li
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    fontFamily: 'var(--font-instrument-sans), sans-serif',
                    fontSize: '14px',
                    color: '#333',
                    lineHeight: 1.5,
                  }}
                >
                  <span
                    style={{
                      width: '18px',
                      height: '18px',
                      background: '#4294d8',
                      borderRadius: '3px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: '11px',
                      fontWeight: 700,
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  >
                    {i + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ol>

            <p
              style={{
                fontFamily: 'var(--font-instrument-sans), sans-serif',
                fontSize: '13px',
                color: '#787878',
                lineHeight: 1.6,
                margin: '0 0 24px',
                fontStyle: 'italic',
              }}
            >
              If you decide to join, both you and the person who referred you will receive a FREE
              month of service!
            </p>

            {/* Form */}
            {submitted ? (
              <div
                style={{
                  background: '#eef5fc',
                  border: '1px solid #c4dff4',
                  borderRadius: '12px',
                  padding: '28px 24px',
                  textAlign: 'center',
                }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-instrument-sans), sans-serif',
                    fontSize: '17px',
                    fontWeight: 600,
                    color: '#171717',
                    margin: '0 0 8px',
                  }}
                >
                  Thank you! We&apos;ll be in touch shortly.
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-instrument-sans), sans-serif',
                    fontSize: '14px',
                    color: '#555',
                    margin: 0,
                  }}
                >
                  A Care Consultant will contact you to answer your questions.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Privacy note */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    background: '#fff',
                    border: '1px solid #e8e8e8',
                    borderRadius: '8px',
                    padding: '12px 14px',
                    marginBottom: '20px',
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    style={{ flexShrink: 0, marginTop: '2px' }}
                  >
                    <path
                      d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7L12 2z"
                      stroke="#4294d8"
                      strokeWidth="1.8"
                      fill="none"
                    />
                    <path d="M9 12l2 2 4-4" stroke="#4294d8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p
                    style={{
                      fontFamily: 'var(--font-instrument-sans), sans-serif',
                      fontSize: '12px',
                      color: '#787878',
                      lineHeight: 1.5,
                      margin: 0,
                    }}
                  >
                    Please have your friend&apos;s first &amp; last name, and phone number so that
                    we can give them credit and provide a free month of service to you both!
                  </p>
                </div>

                {/* Name row */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                    marginBottom: '12px',
                  }}
                >
                  <div>
                    <label htmlFor="ref-firstName" style={labelStyle}>First Name</label>
                    <input
                      id="ref-firstName"
                      name="firstName"
                      type="text"
                      autoComplete="given-name"
                      placeholder="Enter your first name…"
                      value={formData.firstName}
                      onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                      required
                      style={inputStyle}
                      className="focus-visible:ring-2 focus-visible:ring-[#4294d8]/40 focus-visible:outline-none"
                      onFocus={(e) => { e.currentTarget.style.borderColor = '#4294d8'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(66,148,216,0.12)' }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = '#d9d9d9'; e.currentTarget.style.boxShadow = 'none' }}
                    />
                  </div>
                  <div>
                    <label htmlFor="ref-lastName" style={labelStyle}>Last Name</label>
                    <input
                      id="ref-lastName"
                      name="lastName"
                      type="text"
                      autoComplete="family-name"
                      placeholder="Enter your last name…"
                      value={formData.lastName}
                      onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                      required
                      style={inputStyle}
                      className="focus-visible:ring-2 focus-visible:ring-[#4294d8]/40 focus-visible:outline-none"
                      onFocus={(e) => { e.currentTarget.style.borderColor = '#4294d8'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(66,148,216,0.12)' }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = '#d9d9d9'; e.currentTarget.style.boxShadow = 'none' }}
                    />
                  </div>
                </div>

                {/* Email + Phone row */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                    marginBottom: '12px',
                  }}
                >
                  <div>
                    <label htmlFor="ref-email" style={labelStyle}>Email</label>
                    <input
                      id="ref-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      spellCheck={false}
                      placeholder="Enter your email…"
                      value={formData.email}
                      onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                      required
                      style={inputStyle}
                      className="focus-visible:ring-2 focus-visible:ring-[#4294d8]/40 focus-visible:outline-none"
                      onFocus={(e) => { e.currentTarget.style.borderColor = '#4294d8'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(66,148,216,0.12)' }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = '#d9d9d9'; e.currentTarget.style.boxShadow = 'none' }}
                    />
                  </div>
                  <div>
                    <label htmlFor="ref-phone" style={labelStyle}>Phone Number</label>
                    <input
                      id="ref-phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="Phone Number…"
                      value={formData.phone}
                      onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                      required
                      style={inputStyle}
                      className="focus-visible:ring-2 focus-visible:ring-[#4294d8]/40 focus-visible:outline-none"
                      onFocus={(e) => { e.currentTarget.style.borderColor = '#4294d8'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(66,148,216,0.12)' }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = '#d9d9d9'; e.currentTarget.style.boxShadow = 'none' }}
                    />
                  </div>
                </div>

                {/* Who referred you */}
                <div style={{ marginBottom: '20px' }}>
                  <label htmlFor="ref-referredBy" style={labelStyle}>Who were you referred by?</label>
                  <textarea
                    id="ref-referredBy"
                    name="referredBy"
                    autoComplete="off"
                    placeholder="Name of person who referred you…"
                    value={formData.referredBy}
                    onChange={(e) => setFormData((prev) => ({ ...prev, referredBy: e.target.value }))}
                    rows={3}
                    style={{
                      ...inputStyle,
                      resize: 'vertical',
                      minHeight: '72px',
                    }}
                    className="focus-visible:ring-2 focus-visible:ring-[#4294d8]/40 focus-visible:outline-none"
                    onFocus={(e) => { e.currentTarget.style.borderColor = '#4294d8'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(66,148,216,0.12)' }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = '#d9d9d9'; e.currentTarget.style.boxShadow = 'none' }}
                  />
                </div>

                <button
                  type="submit"
                  className="focus-visible:ring-2 focus-visible:ring-[#4294d8]/50 focus-visible:ring-offset-2 focus-visible:outline-none"
                  style={{
                    width: '100%',
                    background: '#4294d8',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '13px',
                    fontFamily: 'var(--font-instrument-sans), sans-serif',
                    fontSize: '15px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#3280c4')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#4294d8')}
                >
                  Submit
                </button>
              </form>
            )}
          </div>

          {/* Right: photo */}
          <div
            style={{
              borderRadius: '16px',
              overflow: 'hidden',
              aspectRatio: '4 / 5',
              position: 'relative',
            }}
          >
            <Image
              src="/images/seniorwoman.webp"
              alt="Senior woman at home"
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>
      </section>

      {/* ── FAQ Section ───────────────────────────────────── */}
      <section style={{ background: '#fff', padding: '80px 40px' }}>
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1fr 2fr',
            gap: '80px',
            alignItems: 'flex-start',
          }}
          className="referral-faq-grid"
        >
          {/* Left: heading */}
          <div>
            <p
              style={{
                fontFamily: 'var(--font-instrument-sans), sans-serif',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#4294d8',
                margin: '0 0 12px',
              }}
            >
              FAQ
            </p>
            <h2
              style={{
                fontFamily: 'var(--font-instrument-sans), sans-serif',
                fontSize: 'clamp(28px, 2.5vw, 40px)',
                fontWeight: 700,
                color: '#171717',
                lineHeight: 1.2,
                margin: '0 0 4px',
              }}
            >
              Frequently
            </h2>
            <h2
              style={{
                fontFamily: 'var(--font-instrument-sans), sans-serif',
                fontSize: 'clamp(28px, 2.5vw, 40px)',
                fontWeight: 400,
                color: '#787878',
                lineHeight: 1.2,
                margin: 0,
              }}
            >
              Asked Questions
            </h2>
          </div>

          {/* Right: accordion */}
          <div style={{ borderTop: '1px solid #e8e8e8' }}>
            {faqs.map((faq) => (
              <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Resources CTA ─────────────────────────────────── */}
      <section style={{ background: '#fff', padding: '0 40px 80px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div
            style={{
              background: '#171717',
              borderRadius: '16px',
              padding: '64px 64px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-instrument-sans), sans-serif',
                fontSize: 'clamp(28px, 3vw, 44px)',
                fontWeight: 400,
                color: 'rgba(255,255,255,0.55)',
                lineHeight: 1.2,
                margin: 0,
              }}
            >
              More Senior{' '}
              <span style={{ color: '#fff', fontWeight: 700 }}>Resources</span>
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-instrument-sans), sans-serif',
                fontSize: '15px',
                color: 'rgba(255,255,255,0.5)',
                lineHeight: 1.65,
                maxWidth: '440px',
                margin: 0,
              }}
            >
              Our team of experts have researched and gathered helpful senior resources. Everything
              from home safety products, the best walkers, and even trust &amp; will services can be
              found on our Senior Resource page.
            </p>
            <div style={{ marginTop: '8px' }}>
              <Link
                href="/resources"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#4294d8',
                  color: '#fff',
                  fontFamily: 'var(--font-instrument-sans), sans-serif',
                  fontSize: '14px',
                  fontWeight: 600,
                  padding: '11px 28px',
                  borderRadius: '100px',
                  textDecoration: 'none',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#3280c4')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#4294d8')}
              >
                Coming Soon
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Responsive styles ─────────────────────────────── */}
      <style>{`
        @media (max-width: 900px) {
          .referral-steps-grid {
            grid-template-columns: 1fr !important;
          }
          .referral-form-grid {
            grid-template-columns: 1fr !important;
          }
          .referral-faq-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
        }
        @media (max-width: 640px) {
          section {
            padding-left: 20px !important;
            padding-right: 20px !important;
          }
        }
      `}</style>
    </>
  )
}

/* ─── Shared input/label styles ─────────────────────────────── */

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-instrument-sans), sans-serif',
  fontSize: '13px',
  fontWeight: 500,
  color: '#333',
  marginBottom: '6px',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  fontFamily: 'var(--font-instrument-sans), sans-serif',
  fontSize: '14px',
  color: '#171717',
  background: '#fff',
  border: '1px solid #d9d9d9',
  borderRadius: '6px',
  padding: '10px 12px',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  boxSizing: 'border-box',
}

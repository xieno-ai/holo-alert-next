'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { PortableText, PortableTextComponents } from '@portabletext/react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Block = { _type: string; [key: string]: any }

interface LegalPageData {
  title: string
  effectiveDate?: string
  lastUpdatedDate?: string
  content: Block[]
}

interface Props {
  data: LegalPageData
  breadcrumb: string
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number)
  const d = new Date(year, month - 1, day)
  return d.toLocaleDateString('en-CA', { month: 'long', day: 'numeric', year: 'numeric' })
}

function extractToc(content: Block[]): { id: string; label: string }[] {
  return content
    .filter((b) => b._type === 'block' && b.style === 'h2')
    .map((b) => {
      const text = (b.children ?? []).map((c: Block) => c.text ?? '').join('')
      return { id: slugify(text), label: text }
    })
}

const portableTextComponents: PortableTextComponents = {
  block: {
    h2: ({ children, value }) => {
      const text = (value.children ?? []).map((c: Block) => c.text ?? '').join('')
      const id = slugify(text)
      return (
        <h2
          id={id}
          data-section
          className="terms-section-title"
        >
          {children}
        </h2>
      )
    },
    h3: ({ children }) => <h3 className="terms-sub-heading">{children}</h3>,
    normal: ({ children }) => <p className="terms-paragraph">{children}</p>,
    legalNote: ({ children }) => (
      <p className="terms-legal-note">{children}</p>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="terms-list">{children}</ul>,
  },
  listItem: {
    bullet: ({ children }) => <li className="terms-list-item">{children}</li>,
  },
  marks: {
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target={value?.href?.startsWith('http') ? '_blank' : undefined}
        rel={value?.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
        style={{ color: '#4294d8', textDecoration: 'underline' }}
      >
        {children}
      </a>
    ),
    strong: ({ children }) => <strong>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
  },
}

export default function LegalPageClient({ data, breadcrumb }: Props) {
  const { title, effectiveDate, lastUpdatedDate, content } = data
  const toc = extractToc(content)
  const [activeId, setActiveId] = useState<string>('')
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const headings = document.querySelectorAll('[data-section]')
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        })
      },
      { rootMargin: '-20% 0% -70% 0%', threshold: 0 }
    )
    headings.forEach((el) => observerRef.current?.observe(el))
    return () => observerRef.current?.disconnect()
  }, [])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY - 120
    window.scrollTo({ top, behavior: 'smooth' })
  }

  return (
    <div style={{ fontFamily: 'Instrument Sans, sans-serif', background: '#fff' }}>

      {/* Page header */}
      <div style={{ borderBottom: '1px solid #e8e8e8' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>

          {/* Breadcrumb */}
          <nav
            className="flex items-center gap-2 text-[13px] text-[#787878]"
            style={{ paddingTop: '88px', paddingBottom: '20px' }}
          >
            <Link href="/" className="hover:text-[#171717] transition-colors">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-label="Home">
                <path
                  d="M1.5 6.5L7 2l5.5 4.5V12.5a.5.5 0 0 1-.5.5H9.5V9.5h-5V13H2a.5.5 0 0 1-.5-.5V6.5z"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            <svg width="6" height="10" viewBox="0 0 6 10" fill="none" aria-hidden="true">
              <path d="M1 1l4 4-4 4" stroke="#d9d9d9" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>{breadcrumb}</span>
          </nav>

          {/* Title block */}
          <div style={{ paddingBottom: '40px', maxWidth: '680px' }}>
            <h1
              className="font-bold text-[#171717] leading-[1.05] tracking-tight"
              style={{ fontSize: 'clamp(32px, 5vw, 52px)', marginBottom: '16px' }}
            >
              {title}
            </h1>
            <div className="flex flex-wrap items-center gap-3" style={{ marginBottom: '12px' }}>
              {effectiveDate && (
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: '#4294d8',
                    background: '#eaf4fc',
                    padding: '4px 10px',
                    borderRadius: '4px',
                  }}
                >
                  Effective: {formatDate(effectiveDate)}
                </span>
              )}
              {lastUpdatedDate && (
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: '#787878',
                    background: '#f5f5f5',
                    padding: '4px 10px',
                    borderRadius: '4px',
                  }}
                >
                  Last Updated: {formatDate(lastUpdatedDate)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div
        style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}
        className="flex gap-16 items-start"
      >

        {/* Sticky TOC */}
        {toc.length > 0 && (
          <aside
            className="hidden lg:block flex-shrink-0"
            style={{
              width: '240px',
              position: 'sticky',
              top: '108px',
              paddingTop: '48px',
              paddingBottom: '48px',
              alignSelf: 'flex-start',
            }}
          >
            <p
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#787878',
                marginBottom: '16px',
              }}
            >
              On this page
            </p>
            <nav className="flex flex-col gap-0">
              {toc.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  style={{
                    display: 'block',
                    textAlign: 'left',
                    padding: '5px 10px',
                    borderLeft: `2px solid ${activeId === item.id ? '#4294d8' : '#e8e8e8'}`,
                    color: activeId === item.id ? '#4294d8' : '#787878',
                    fontWeight: activeId === item.id ? 600 : 400,
                    fontSize: '13px',
                    lineHeight: 1.4,
                    background: 'none',
                    cursor: 'pointer',
                    transition: 'color 0.15s, border-color 0.15s',
                    width: '100%',
                    border: 'none',
                  }}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </aside>
        )}

        {/* Content */}
        <article
          className="legal-content"
          style={{ flex: 1, minWidth: 0, paddingTop: '48px', paddingBottom: '96px' }}
        >
          <PortableText value={content} components={portableTextComponents} />
        </article>
      </div>

      <style>{`
        .legal-content .terms-section-title {
          font-size: 20px;
          font-weight: 700;
          color: #171717;
          margin-top: 48px;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 1px solid #f0f0f0;
          padding-left: 14px;
          border-left: 3px solid #4294d8;
          line-height: 1.3;
        }
        .legal-content .terms-section-title:first-child {
          margin-top: 0;
        }
        .legal-content .terms-sub-heading {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #4294d8;
          margin-top: 24px;
          margin-bottom: 8px;
        }
        .legal-content .terms-paragraph {
          color: #444;
          font-size: 15px;
          line-height: 1.7;
          margin-bottom: 12px;
        }
        .legal-content .terms-legal-note {
          font-size: 13px;
          font-weight: 600;
          line-height: 1.65;
          color: #171717;
          letter-spacing: 0.01em;
          text-transform: uppercase;
          margin-bottom: 12px;
          padding: 16px 20px;
          background: #f7f9fb;
          border-left: 3px solid #d0d5dd;
          border-radius: 0 4px 4px 0;
        }
        .legal-content .terms-list {
          list-style: none;
          padding: 0;
          margin: 0 0 16px 0;
        }
        .legal-content .terms-list-item {
          position: relative;
          padding-left: 18px;
          color: #444;
          font-size: 15px;
          line-height: 1.65;
          margin-bottom: 6px;
        }
        .legal-content .terms-list-item::before {
          content: '';
          position: absolute;
          left: 0;
          top: 10px;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #4294d8;
          flex-shrink: 0;
        }
      `}</style>
    </div>
  )
}

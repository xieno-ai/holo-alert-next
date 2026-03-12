'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, Phone, ChevronDown } from 'lucide-react'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import MobileNav from './MobileNav'

const exploreLinks = [
  { label: 'Holo Pro', href: '/devices/holo-pro' },
  { label: 'Holo Mini', href: '/devices/holo-mini' },
  { label: 'Holo Active', href: '/devices/holo-active' },
  { label: 'Accessories', href: '/accessories' },
]

const toolsLinks = [
  { label: 'Find Your Device', href: '/quiz' },
  { label: 'Compare Devices', href: '/compare' },
]

const DEFAULT_PRODUCT_CARDS = [
  { label: 'Holo Pro', href: '/devices/holo-pro', img: 'https://placehold.co/300x300/f5f5f5/999?text=Holo+Pro' },
  { label: 'Holo Mini', href: '/devices/holo-mini', img: 'https://placehold.co/300x300/f5f5f5/999?text=Holo+Mini' },
  { label: 'Holo Active', href: '/devices/holo-active', img: 'https://placehold.co/300x300/f5f5f5/999?text=Holo+Active' },
]

interface ProductCard {
  label: string
  href: string
  img: string
}

export default function Header({ productCards = DEFAULT_PRODUCT_CARDS, badgeLogoUrl }: { productCards?: ProductCard[]; badgeLogoUrl?: string }) {
  const [megaOpen, setMegaOpen] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const openMega = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setMegaOpen(true)
  }

  const closeMega = () => {
    closeTimer.current = setTimeout(() => setMegaOpen(false), 80)
  }

  return (
    <header
      className="w-full"
      style={{
        background: megaOpen ? '#fff' : '#141414',
        borderBottom: megaOpen ? '1px solid #ececec' : '1px solid rgba(255,255,255,0.08)',
        transition: 'background 0.2s ease, border-color 0.2s ease',
      }}
    >
      {/* Main nav row */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', height: '70px' }}>

          {/* Left: nav links (desktop only) */}
          <nav
            className="hidden lg:flex items-center"
            style={{ gap: '28px' }}
          >
            {/* Badge logo */}
            {badgeLogoUrl ? (
              <Link href="/" style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                <Image
                  src={badgeLogoUrl}
                  alt="Holo Alert"
                  width={36}
                  height={36}
                  style={{ objectFit: 'contain' }}
                />
              </Link>
            ) : null}

            {/* Solutions mega-menu trigger */}
            <div
              onMouseEnter={openMega}
              onMouseLeave={closeMega}
            >
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontFamily: 'var(--font-instrument-sans), sans-serif',
                  fontSize: '15px',
                  color: megaOpen ? '#171717' : '#fff',
                  transition: 'opacity 0.2s, color 0.2s',
                  padding: 0,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.75')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
              >
                Solutions
                <ChevronDown size={14} aria-hidden="true" />
              </button>
            </div>

            <Link
              href="/quiz"
              style={{
                fontFamily: 'var(--font-instrument-sans), sans-serif',
                fontSize: '15px',
                color: megaOpen ? '#171717' : '#fff',
                textDecoration: 'none',
                transition: 'opacity 0.2s, color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.75')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              Find Your Device
            </Link>

            <Link
              href="/blog"
              style={{
                fontFamily: 'var(--font-instrument-sans), sans-serif',
                fontSize: '15px',
                color: megaOpen ? '#171717' : '#fff',
                textDecoration: 'none',
                transition: 'opacity 0.2s, color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.75')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              Blog
            </Link>
          </nav>

          {/* Center: Logo wordmark */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}>
            <svg
              width="130"
              height="23"
              viewBox="0 0 161 29"
              fill={megaOpen ? '#171717' : '#fff'}
              xmlns="http://www.w3.org/2000/svg"
              style={{ transition: 'fill 0.2s' }}
            >
              <path d="M1.924 24V5.28H4.68V24H1.924ZM14.326 24V5.28H17.082V24H14.326ZM3.276 13.106H15.548V15.394H3.276V13.106ZM27.7276 24.26C26.3929 24.26 25.1709 24.026 24.0616 23.558C22.9522 23.0727 21.9902 22.3967 21.1756 21.53C20.3609 20.6633 19.7196 19.6407 19.2516 18.462C18.8009 17.2833 18.5756 15.9833 18.5756 14.562C18.5756 12.69 18.9656 11.0347 19.7456 9.596C20.5256 8.15733 21.6002 7.03933 22.9696 6.242C24.3562 5.42733 25.9336 5.02 27.7016 5.02C29.5042 5.02 31.0902 5.42733 32.4596 6.242C33.8289 7.03933 34.9036 8.15733 35.6836 9.596C36.4809 11.0347 36.8796 12.6987 36.8796 14.588C36.8796 15.992 36.6456 17.292 36.1776 18.488C35.7269 19.6667 35.0942 20.6893 34.2796 21.556C33.4649 22.4053 32.4942 23.0727 31.3676 23.558C30.2582 24.026 29.0449 24.26 27.7276 24.26ZM27.7016 21.92C28.9496 21.92 30.0502 21.608 31.0036 20.984C31.9569 20.3427 32.7022 19.4673 33.2396 18.358C33.7942 17.2487 34.0716 15.9747 34.0716 14.536C34.0716 13.1147 33.8029 11.8667 33.2656 10.792C32.7282 9.7 31.9829 8.85933 31.0296 8.27C30.0762 7.66333 28.9669 7.36 27.7016 7.36C26.4362 7.36 25.3269 7.66333 24.3736 8.27C23.4376 8.85933 22.7009 9.69133 22.1636 10.766C21.6436 11.8407 21.3836 13.0973 21.3836 14.536C21.3836 15.992 21.6522 17.2747 22.1896 18.384C22.7269 19.4933 23.4636 20.36 24.3996 20.984C25.3529 21.608 26.4536 21.92 27.7016 21.92ZM38.3626 24V5.28H41.1186V24H38.3626ZM39.7146 24V21.738H50.5306V24H39.7146ZM58.758 24.26C57.4233 24.26 56.2013 24.026 55.092 23.558C53.9826 23.0727 53.0206 22.3967 52.206 21.53C51.3913 20.6633 50.75 19.6407 50.282 18.462C49.8313 17.2833 49.606 15.9833 49.606 14.562C49.606 12.69 49.996 11.0347 50.776 9.596C51.556 8.15733 52.6306 7.03933 54 6.242C55.3866 5.42733 56.964 5.02 58.732 5.02C60.5346 5.02 62.1206 5.42733 63.49 6.242C64.8593 7.03933 65.934 8.15733 66.714 9.596C67.5113 11.0347 67.91 12.6987 67.91 14.588C67.91 15.992 67.676 17.292 67.208 18.488C66.7573 19.6667 66.1246 20.6893 65.31 21.556C64.4953 22.4053 63.5246 23.0727 62.398 23.558C61.2886 24.026 60.0753 24.26 58.758 24.26ZM58.732 21.92C59.98 21.92 61.0806 21.608 62.034 20.984C62.9873 20.3427 63.7326 19.4673 64.27 18.358C64.8246 17.2487 65.102 15.9747 65.102 14.536C65.102 13.1147 64.8333 11.8667 64.296 10.792C63.7586 9.7 63.0133 8.85933 62.06 8.27C61.1066 7.66333 59.9973 7.36 58.732 7.36C57.4666 7.36 56.3573 7.66333 55.404 8.27C54.468 8.85933 53.7313 9.69133 53.194 10.766C52.674 11.8407 52.414 13.0973 52.414 14.536C52.414 15.992 52.6826 17.2747 53.22 18.384C53.7573 19.4933 54.494 20.36 55.43 20.984C56.3833 21.608 57.484 21.92 58.732 21.92ZM71.8699 24L78.9159 5.28H81.3079L74.5739 24H71.8699ZM86.3519 24L79.6179 5.28H82.1399L89.2119 24H86.3519ZM75.4319 16.538H85.4679V18.826H75.4319V16.538ZM90.4195 24V5.28H93.1755V24H90.4195ZM91.7715 24V21.738H102.587V24H91.7715ZM104.17 24V5.28H106.926V24H104.17ZM105.522 24V21.738H117.17V24H105.522ZM105.522 15.446V13.184H116.234V15.446H105.522ZM105.522 7.542V5.28H116.936V7.542H105.522ZM118.453 24V5.28H125.837C127.189 5.28 128.342 5.50533 129.295 5.956C130.248 6.38933 130.985 7.00467 131.505 7.802C132.025 8.582 132.285 9.50933 132.285 10.584C132.285 11.6587 132.025 12.5947 131.505 13.392C130.985 14.1893 130.248 14.8133 129.295 15.264C128.342 15.7147 127.189 15.94 125.837 15.94H120.533V13.704H125.759C127.007 13.704 127.952 13.4353 128.593 12.898C129.252 12.3433 129.581 11.5807 129.581 10.61C129.581 9.63933 129.26 8.88533 128.619 8.348C127.978 7.81067 127.024 7.542 125.759 7.542H121.209V24H118.453ZM129.269 24L120.143 14.562H123.497L133.221 24H129.269ZM138.471 24V7.542H132.153V5.28H147.545V7.542H141.227V24H138.471Z" />
              <path d="M157 0C154.794 0 153 1.79349 153 3.99935C153 6.20434 154.794 7.99872 157 7.99872C159.205 7.99872 161 6.20434 161 3.99935C161 1.79349 159.205 0 157 0ZM157 7.10768C155.285 7.10768 153.891 5.71332 153.891 3.99937C153.891 2.28469 155.285 0.890344 157 0.890344C158.714 0.890344 160.108 2.28471 160.108 3.99937C160.108 5.71332 158.714 7.10768 157 7.10768Z" />
              <path d="M158.313 4.72382C158.057 5.16228 157.582 5.43426 157.073 5.43426C156.282 5.43426 155.638 4.79022 155.638 3.99934C155.638 3.2078 156.282 2.56354 157.073 2.56354C157.582 2.56354 158.057 2.83653 158.313 3.27411L158.346 3.3313H159.31L159.252 3.17611C159.084 2.73173 158.79 2.3539 158.4 2.08422C158.009 1.81385 157.551 1.67041 157.073 1.67041C155.789 1.67041 154.745 2.71547 154.745 3.99934C154.745 5.28329 155.789 6.32737 157.073 6.32737C157.551 6.32737 158.009 6.18441 158.4 5.91362C158.79 5.64388 159.084 5.26618 159.252 4.8218L159.31 4.66652H158.346L158.313 4.72382Z" />
            </svg>
          </Link>

          {/* Right: phone + CTA + mobile hamburger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', justifySelf: 'end' }}>
            {/* Phone — desktop only */}
            <a
              href="tel:18884114656"
              aria-label="Call 1-888-411-4656"
              className="hidden lg:flex items-center"
              style={{
                gap: '6px',
                textDecoration: 'none',
                color: megaOpen ? '#333' : 'rgba(255,255,255,0.85)',
                fontFamily: 'var(--font-instrument-sans), sans-serif',
                fontSize: '14px',
                transition: 'color 0.2s',
              }}
            >
              <Phone size={16} aria-hidden="true" />
              1.888.411.4656
            </a>

            {/* CTA button — desktop only */}
            <Link
              href="/#products"
              className="hidden lg:inline-flex items-center justify-center focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none"
              style={{
                background: megaOpen ? '#171717' : '#4294d8',
                color: '#fff',
                fontFamily: 'var(--font-instrument-sans), sans-serif',
                fontSize: '14px',
                fontWeight: 500,
                padding: '7px 32px',
                borderRadius: '100px',
                textDecoration: 'none',
                transition: 'background 0.2s, color 0.2s',
                whiteSpace: 'nowrap',
              }}
            >
              Shop Devices
            </Link>

            {/* Mobile hamburger */}
            <Sheet>
              <SheetTrigger asChild>
                <button
                  className="lg:hidden p-2 rounded-md transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                  style={{ color: megaOpen ? '#171717' : '#fff' }}
                  aria-label="Open navigation menu"
                >
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] p-0">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="flex items-center px-4 h-16 border-b border-border">
                  <Image
                    src="/images/HoloNavBarLogo.svg"
                    alt="Holo Alert"
                    width={40}
                    height={40}
                  />
                </div>
                <div className="flex-1 overflow-hidden h-[calc(100vh-4rem)]">
                  <MobileNav />
                </div>
              </SheetContent>
            </Sheet>
          </div>

        </div>
      </div>

      {/* Mega menu panel */}
      {megaOpen ? (
        <div
          onMouseEnter={openMega}
          onMouseLeave={closeMega}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            background: '#fff',
            borderTop: '1px solid #ececec',
            boxShadow: '0 20px 56px rgba(0,0,0,0.09)',
            padding: '32px 0 40px',
            zIndex: 99,
          }}
        >
          <div
            className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 flex items-start"
            style={{ gap: '64px' }}
          >
            {/* Left: text link columns */}
            <div style={{ display: 'flex', gap: '48px', flexShrink: 0, paddingTop: '4px' }}>
              <div>
                <p style={{ fontFamily: 'var(--font-instrument-sans), sans-serif', fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#a0a0a0', marginBottom: '14px' }}>
                  Explore
                </p>
                {exploreLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    style={{
                      display: 'block',
                      fontFamily: 'var(--font-instrument-sans), sans-serif',
                      fontSize: '14px',
                      color: '#222',
                      textDecoration: 'none',
                      padding: '5px 0',
                      transition: 'color 0.15s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#4294d8')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#222')}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <div>
                <p style={{ fontFamily: 'var(--font-instrument-sans), sans-serif', fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#a0a0a0', marginBottom: '14px' }}>
                  Tools
                </p>
                {toolsLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    style={{
                      display: 'block',
                      fontFamily: 'var(--font-instrument-sans), sans-serif',
                      fontSize: '14px',
                      color: '#222',
                      textDecoration: 'none',
                      padding: '5px 0',
                      transition: 'color 0.15s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#4294d8')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#222')}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right: product image cards */}
            <div style={{ display: 'flex', gap: '10px', flex: 1, maxWidth: '420px' }}>
              {productCards.map((card) => (
                <Link
                  key={card.href}
                  href={card.href}
                  style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', textDecoration: 'none', maxWidth: '130px' }}
                >
                  <div style={{ width: '100%', aspectRatio: '1 / 1', overflow: 'hidden', borderRadius: '4px', background: '#f5f5f5' }}>
                    <Image
                      src={card.img}
                      alt={card.label}
                      width={200}
                      height={200}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      unoptimized
                    />
                  </div>
                  <span style={{ fontFamily: 'var(--font-instrument-sans), sans-serif', fontSize: '12px', color: '#333', textAlign: 'center' }}>
                    {card.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}

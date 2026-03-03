'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import PromoBanner from './PromoBanner'
import MobileNav from './MobileNav'

const exploreLinks = [
  { label: 'Holo Pro', href: '/devices/holo-pro', desc: 'Full-featured home + away protection' },
  { label: 'Holo Mini', href: '/devices/holo-mini', desc: 'Compact pendant design' },
  { label: 'Holo Active', href: '/devices/holo-active', desc: 'GPS tracking for active seniors' },
  { label: 'Accessories', href: '/accessories', desc: 'Charging cradles, lanyards and more' },
]

const programLinks = [
  { label: 'Referral Program', href: '/referral-program', desc: 'Earn rewards by referring friends' },
  { label: 'Savings Program', href: '/savings-program', desc: 'Group rates for organizations' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Header starts transparent — becomes opaque after scrolling past 80px
  // Non-hero pages will scroll to > 80 immediately if content starts at page top,
  // but the marketing layout passes no prop — the scroll threshold handles it naturally.
  // Pages that want to force solid header can add a wrapper div with mt-[80px] or similar.
  const headerBg = scrolled
    ? 'bg-white shadow-sm'
    : 'bg-transparent'

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${headerBg}`}
    >
      {/* Promo banner — hidden by default, CMS activates in Phase 3 */}
      <PromoBanner visible={false} />

      {/* Main nav bar */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: 'var(--max-w-container)' }}>
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* Left: Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/images/HoloNavBarLogo.svg"
              alt="Holo Alert"
              width={44}
              height={44}
              priority
            />
          </Link>

          {/* Center: Desktop navigation */}
          <div className="hidden lg:flex items-center gap-1">
            <NavigationMenu>
              <NavigationMenuList>
                {/* Solutions mega-menu */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className={`text-sm font-medium transition-colors bg-transparent hover:bg-transparent focus:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-transparent ${
                      scrolled ? 'text-brand-black' : 'text-white'
                    }`}
                  >
                    Solutions
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid grid-cols-2 gap-6 p-6 w-[540px]">
                      {/* Explore column */}
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-brand-gray mb-3">
                          Explore
                        </p>
                        <ul className="space-y-2">
                          {exploreLinks.map((link) => (
                            <li key={link.href}>
                              <NavigationMenuLink asChild>
                                <Link
                                  href={link.href}
                                  className="block group rounded-md p-2 hover:bg-brand-light transition-colors"
                                >
                                  <span className="block font-medium text-brand-black text-sm">
                                    {link.label}
                                  </span>
                                  <span className="block text-xs text-brand-gray mt-0.5">
                                    {link.desc}
                                  </span>
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </div>
                      {/* Programs column */}
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-brand-gray mb-3">
                          Programs
                        </p>
                        <ul className="space-y-2">
                          {programLinks.map((link) => (
                            <li key={link.href}>
                              <NavigationMenuLink asChild>
                                <Link
                                  href={link.href}
                                  className="block group rounded-md p-2 hover:bg-brand-light transition-colors"
                                >
                                  <span className="block font-medium text-brand-black text-sm">
                                    {link.label}
                                  </span>
                                  <span className="block text-xs text-brand-gray mt-0.5">
                                    {link.desc}
                                  </span>
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Blog */}
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/blog"
                      className={`text-sm font-medium px-4 py-2 rounded-md transition-colors hover:bg-white/10 ${
                        scrolled ? 'text-brand-black' : 'text-white'
                      }`}
                    >
                      Blog
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right: Phone + CTA (desktop) and Phone + Hamburger (mobile) */}
          <div className="flex items-center gap-3">
            {/* Phone — always visible on all screen sizes (TRUST-01) */}
            <a
              href="tel:18884450192"
              className={`flex items-center gap-1.5 text-sm font-semibold transition-colors ${
                scrolled ? 'text-brand-black' : 'text-white'
              }`}
            >
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">1-888-445-0192</span>
            </a>

            {/* Get Started — desktop only */}
            <Button
              asChild
              className="hidden lg:inline-flex bg-brand-orange hover:bg-brand-orange/90 text-white font-semibold"
            >
              <Link href="/devices">Get Started</Link>
            </Button>

            {/* Hamburger — mobile/tablet only */}
            <Sheet>
              <SheetTrigger asChild>
                <button
                  className={`lg:hidden p-2 rounded-md transition-colors ${
                    scrolled
                      ? 'text-brand-black hover:bg-brand-light'
                      : 'text-white hover:bg-white/10'
                  }`}
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
    </header>
  )
}

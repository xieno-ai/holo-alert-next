import Link from 'next/link'
import { Phone } from 'lucide-react'
import { SheetClose } from '@/components/ui/sheet'

const exploreLinks = [
  { label: 'Holo Pro', href: '/devices/holo-pro' },
  { label: 'Holo Mini', href: '/devices/holo-mini' },
  { label: 'Holo Active', href: '/devices/holo-active' },
  { label: 'Accessories', href: '/accessories' },
]

const programLinks = [
  { label: 'Referral Program', href: '/referral-program' },
]

export default function MobileNav() {
  return (
    <div className="flex flex-col h-full">
      {/* Nav sections fill available space */}
      <nav className="flex-1 overflow-y-auto py-6 px-2">
        {/* Solutions section */}
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-gray px-2 mb-3">
            Explore Devices
          </p>
          <ul className="space-y-1">
            {exploreLinks.map((link) => (
              <li key={link.href}>
                <SheetClose asChild>
                  <Link
                    href={link.href}
                    className="block px-2 py-2 rounded-md text-brand-black hover:bg-brand-light font-medium transition-colors"
                  >
                    {link.label}
                  </Link>
                </SheetClose>
              </li>
            ))}
          </ul>
        </div>

        {/* Programs section */}
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-gray px-2 mb-3">
            Programs
          </p>
          <ul className="space-y-1">
            {programLinks.map((link) => (
              <li key={link.href}>
                <SheetClose asChild>
                  <Link
                    href={link.href}
                    className="block px-2 py-2 rounded-md text-brand-black hover:bg-brand-light font-medium transition-colors"
                  >
                    {link.label}
                  </Link>
                </SheetClose>
              </li>
            ))}
          </ul>
        </div>

        {/* Blog link */}
        <div>
          <SheetClose asChild>
            <Link
              href="/blog"
              className="block px-2 py-2 rounded-md text-brand-black hover:bg-brand-light font-medium transition-colors"
            >
              Blog
            </Link>
          </SheetClose>
        </div>
      </nav>

      {/* Phone + CTA anchored at bottom of drawer */}
      <div className="border-t border-border pt-4 pb-6 px-4 space-y-3">
        <a
          href="tel:18884450192"
          className="flex items-center gap-2 text-brand-black text-sm"
        >
          <Phone className="h-4 w-4 text-brand-blue" />
          <span><span className="font-semibold">Sales:</span> 1-888-445-0192</span>
        </a>
        <a
          href="tel:18884114656"
          className="flex items-center gap-2 text-brand-black text-sm"
        >
          <Phone className="h-4 w-4 text-brand-blue" />
          <span><span className="font-semibold">Customer Service:</span> 1-888-411-4656</span>
        </a>
      </div>
    </div>
  )
}

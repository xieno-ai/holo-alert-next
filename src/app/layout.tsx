import type { Metadata } from 'next'
import { GoogleTagManager } from '@next/third-parties/google'
import { preconnect, prefetchDNS } from 'react-dom'
import { instrumentSans } from '@/lib/fonts'
import './globals.css'
import { DeferredAnalytics } from '@/components/DeferredAnalytics'
import AnalyticsPageTracker from '@/components/AnalyticsPageTracker'

export const metadata: Metadata = {
  title: {
    template: '%s | Holo Alert',
    default: 'Holo Alert — Canadian Medical Alert Devices',
  },
  description:
    'Medical alert devices for seniors — trusted by Canadian caregivers. 24/7 professional monitoring across Canada.',
  icons: {
    icon: '/images/favicon.png',
    apple: '/images/webclip.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    siteName: 'Holo Alert',
    images: [{ url: '/images/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Resource hints: preconnect to Sanity CDN (images), prefetch GTM DNS
  preconnect('https://cdn.sanity.io')
  prefetchDNS('https://www.googletagmanager.com')

  return (
    <html
      lang="en"
      className={`${instrumentSans.variable}`}
    >
      <head>
        <meta name="theme-color" content="#ffffff" />
      </head>
      {process.env.NODE_ENV === 'production' ? <GoogleTagManager gtmId="GTM-N2J4XSL" /> : null}
      <body className="antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-brand-blue focus:text-white focus:rounded-md focus:text-sm focus:font-semibold"
        >
          Skip to main content
        </a>
        {children}
        <AnalyticsPageTracker />
        <DeferredAnalytics />
      </body>
    </html>
  )
}

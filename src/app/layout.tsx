import type { Metadata } from 'next'
import { GoogleTagManager } from '@next/third-parties/google'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/next'
import { instrumentSans } from '@/lib/fonts'
import './globals.css'

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
  return (
    <html
      lang="en"
      className={`${instrumentSans.variable}`}
    >
      {process.env.NODE_ENV === 'production' && <GoogleTagManager gtmId="GTM-N2J4XSL" />}
      <body className="antialiased">
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}

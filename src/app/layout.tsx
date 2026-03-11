import type { Metadata } from 'next'
import { GoogleTagManager } from '@next/third-parties/google'
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
      <body className="antialiased">{children}</body>
    </html>
  )
}

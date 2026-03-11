import { sanityFetch } from '@/sanity/lib/client'
import { LEGAL_PAGE_QUERY } from '@/sanity/lib/queries'
import LegalPageClient from '@/components/legal/LegalPageClient'

export const metadata = {
  title: 'Privacy Policy | Holo Alert',
  description:
    'Learn how Holo Alert collects, uses, and protects your personal information in compliance with Canadian privacy laws including PIPEDA.',
}

export default async function PrivacyPolicyPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = await sanityFetch<any>({
    query: LEGAL_PAGE_QUERY,
    params: { pageType: 'privacy' },
    tags: ['legalPage'],
  })

  if (!data || !data.content?.length) {
    return (
      <div style={{ fontFamily: 'Instrument Sans, sans-serif', padding: '160px 40px 96px', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '42px', fontWeight: 700, color: '#171717' }}>Privacy Policy</h1>
        <p style={{ color: '#787878', marginTop: '16px' }}>Content coming soon. Please check back later.</p>
      </div>
    )
  }

  return <LegalPageClient data={data} breadcrumb="Privacy Policy" />
}

import { sanityFetch } from '@/sanity/lib/client'
import { LEGAL_PAGE_QUERY } from '@/sanity/lib/queries'
import LegalPageClient from '@/components/legal/LegalPageClient'
import TermsClient from './TermsClient'

export const metadata = {
  title: 'Terms & Conditions | Holo Alert',
  description:
    'Read the full Terms and Conditions for Holo Alert emergency monitoring services, including SMS terms, billing, cancellation, and privacy policies.',
}

export default async function TermsPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = await sanityFetch<any>({
    query: LEGAL_PAGE_QUERY,
    params: { pageType: 'terms' },
    tags: ['legalPage'],
  })

  // Fallback to static content if Sanity document not yet created
  if (!data || !data.content?.length) {
    return <TermsClient />
  }

  return <LegalPageClient data={data} breadcrumb="Terms & Conditions" />
}

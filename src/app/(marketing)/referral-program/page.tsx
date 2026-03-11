import type { Metadata } from 'next'
import ReferralPageClient from './ReferralPageClient'

export const metadata: Metadata = {
  title: 'Referral Program | Holo Alert',
  description:
    'Refer a friend to Holo Alert and both of you get a FREE month of service. Help a loved one stay safe.',
}

export default function ReferralProgramPage() {
  return <ReferralPageClient />
}

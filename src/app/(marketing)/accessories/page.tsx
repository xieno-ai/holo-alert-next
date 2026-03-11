import type { Metadata } from 'next'
import AccessoriesClient from './AccessoriesClient'

export const metadata: Metadata = {
  title: 'Accessories | Holo Alert',
  description:
    'Holo Alert accessories coming soon. Leave your email to stay informed about our latest innovations for senior safety.',
}

export default function AccessoriesPage() {
  return <AccessoriesClient />
}

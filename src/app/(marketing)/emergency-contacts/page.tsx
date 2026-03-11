import type { Metadata } from 'next'
import EmergencyContactsForm from './EmergencyContactsForm'

export const metadata: Metadata = {
  title: 'Emergency Contacts | Holo Alert',
  description: 'Add your emergency contacts so your Holo Alert monitoring team knows who to reach.',
  robots: { index: false, follow: false },
}

export default function EmergencyContactsPage() {
  return <EmergencyContactsForm />
}

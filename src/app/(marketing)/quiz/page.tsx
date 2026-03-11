import type { Metadata } from 'next'
import { sanityFetch } from '@/sanity/lib/client'
import { DEVICES_COMPARE_QUERY } from '@/sanity/lib/queries'
import QuizClient, { type Device } from './QuizClient'

export const metadata: Metadata = {
  title: 'Find Your Device | Holo Alert',
  description:
    'Answer a few quick questions and we\'ll match you with the Holo Alert medical alert device that fits your lifestyle.',
}

export default async function QuizPage() {
  let devices: Device[] = []
  try {
    devices = await sanityFetch<Device[]>({ query: DEVICES_COMPARE_QUERY, tags: ['device'] })
  } catch {
    // fall through to empty state
  }

  return <QuizClient devices={devices} />
}

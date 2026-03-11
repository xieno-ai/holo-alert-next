import type { Metadata } from 'next'
import { sanityFetch } from '@/sanity/lib/client'
import { DEVICES_COMPARE_QUERY } from '@/sanity/lib/queries'
import CompareClient, { type Device } from './CompareClient'

export const metadata: Metadata = {
  title: 'Compare Devices | Holo Alert',
  description:
    'Compare the Holo Pro, Holo Mini, and Holo Active side by side — pricing, specs, and features — to find the right medical alert device for your loved one.',
}

export default async function ComparePage() {
  let devices: Device[] = []
  try {
    devices = await sanityFetch<Device[]>({ query: DEVICES_COMPARE_QUERY, tags: ['device'] })
  } catch {
    // fall through to empty state
  }

  return <CompareClient devices={devices} />
}

'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { trackPageView, checkAbandonedCart } from '@/lib/analytics'

/**
 * Fires page_data on every client-side navigation.
 * Also checks for abandoned carts on load.
 * Place once in the root layout.
 */
export default function AnalyticsPageTracker() {
  const pathname = usePathname()

  useEffect(() => {
    trackPageView()
  }, [pathname])

  // Check abandoned cart once on initial load
  useEffect(() => {
    checkAbandonedCart()
  }, [])

  return null
}

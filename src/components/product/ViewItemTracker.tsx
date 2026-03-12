'use client'

import { useEffect } from 'react'
import { trackViewItem } from '@/lib/analytics'

interface Props {
  deviceName: string
  deviceSlug: string
  monthlyPrice?: string
  annualPrice?: string
}

/**
 * Fires view_item once when a device product page loads.
 * Rendered as a server-component child in DevicePage.
 */
export default function ViewItemTracker({ deviceName, deviceSlug, monthlyPrice, annualPrice }: Props) {
  useEffect(() => {
    trackViewItem({
      device_name: deviceName,
      device_slug: deviceSlug,
      monthly_price: monthlyPrice,
      annual_price: annualPrice,
    })
  }, [deviceName, deviceSlug, monthlyPrice, annualPrice])

  return null
}

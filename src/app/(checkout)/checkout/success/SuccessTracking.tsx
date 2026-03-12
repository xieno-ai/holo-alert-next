'use client'

import { useEffect } from 'react'
import { trackPurchase } from '@/lib/analytics'

interface Props {
  sessionId: string
  deviceName: string
  total: number
  currency: string
  planType?: string
}

export default function SuccessTracking({
  sessionId,
  deviceName,
  total,
  currency,
  planType,
}: Props) {
  useEffect(() => {
    trackPurchase({
      transaction_id: sessionId,
      device_name: deviceName,
      value: total / 100,
      currency,
      plan_type: planType,
    })
  }, [sessionId, deviceName, total, currency, planType])

  return null
}

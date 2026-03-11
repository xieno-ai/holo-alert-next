'use client'

import { useEffect } from 'react'

interface Props {
  sessionId: string
  deviceName: string
  total: number
  currency: string
}

export default function SuccessTracking({
  sessionId,
  deviceName,
  total,
  currency,
}: Props) {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any
    w.dataLayer = w.dataLayer || []
    w.dataLayer.push({
      event: 'purchase',
      transaction_id: sessionId,
      device_name: deviceName,
      value: total / 100,
      currency: currency.toUpperCase(),
    })
  }, [sessionId, deviceName, total, currency])

  return null
}

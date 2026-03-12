'use client'

import { useEffect } from 'react'
import dynamic from 'next/dynamic'

const NextStudio = dynamic(
  () => import('next-sanity/studio').then((m) => m.NextStudio),
  { ssr: false }
)

import config from '../../../../sanity.config'

export default function StudioClient() {
  useEffect(() => {
    const originalError = console.error
    console.error = (...args: unknown[]) => {
      if (typeof args[0] === 'string' && args[0].includes('isSelected')) return
      originalError.apply(console, args)
    }
    return () => {
      console.error = originalError
    }
  }, [])

  return <NextStudio config={config} />
}

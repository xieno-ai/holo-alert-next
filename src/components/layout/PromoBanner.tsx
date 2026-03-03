'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface PromoBannerProps {
  visible?: boolean   // default false — CMS connects this in Phase 3
  message?: string
  href?: string
}

export default function PromoBanner({
  visible = false,
  message = '',
  href = '#',
}: PromoBannerProps) {
  const [dismissed, setDismissed] = useState(false)

  if (!visible || dismissed) return null

  return (
    <div className="bg-brand-blue text-white text-sm text-center py-2 px-4 relative">
      <a href={href} className="hover:underline font-medium">
        {message}
      </a>
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100 transition-opacity"
        aria-label="Dismiss banner"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

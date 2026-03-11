'use client'

import { useEffect, useState } from 'react'

export default function BlogShareButtons() {
  const [url, setUrl] = useState('')

  useEffect(() => {
    setUrl(window.location.href)
  }, [])

  const share = (platform: 'facebook' | 'x') => {
    const encoded = encodeURIComponent(url)
    const targets = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
      x: `https://twitter.com/intent/tweet?url=${encoded}`,
    }
    window.open(targets[platform], '_blank', 'width=600,height=400')
  }

  return (
    <div className="flex flex-col items-center gap-4 pt-1">
      <span className="text-[11px] font-semibold uppercase tracking-widest text-[#787878] rotate-0">Share</span>

      {/* Facebook */}
      <button
        onClick={() => share('facebook')}
        aria-label="Share on Facebook"
        className="w-8 h-8 rounded-full border border-[#d9d9d9] flex items-center justify-center text-[#787878] hover:border-[#4294d8] hover:text-[#4294d8] transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      </button>

      {/* X / Twitter */}
      <button
        onClick={() => share('x')}
        aria-label="Share on X"
        className="w-8 h-8 rounded-full border border-[#d9d9d9] flex items-center justify-center text-[#787878] hover:border-[#171717] hover:text-[#171717] transition-colors"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </button>

      {/* Copy link */}
      <CopyButton url={url} />
    </div>
  )
}

function CopyButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    if (!url) return
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={copy}
      aria-label="Copy link"
      className="w-8 h-8 rounded-full border border-[#d9d9d9] flex items-center justify-center text-[#787878] hover:border-[#4294d8] hover:text-[#4294d8] transition-colors"
    >
      {copied ? (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      ) : (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      )}
    </button>
  )
}

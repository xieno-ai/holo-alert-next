import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'

interface Props {
  videoUrl?: string
  videoThumbnail?: object
  productName?: string
}

function getVimeoEmbedUrl(url: string): string {
  // Extract Vimeo ID from various URL formats
  const match = url.match(/vimeo\.com\/(\d+)/)
  if (match) return `https://player.vimeo.com/video/${match[1]}?autoplay=1&title=0&byline=0&portrait=0`
  return url
}

export default function ProductVideoSection({ videoUrl, videoThumbnail, productName = 'Holo Pro' }: Props) {
  if (!videoUrl) return null

  const thumbUrl = videoThumbnail
    ? urlFor(videoThumbnail).width(1200).height(675).url()
    : null

  const embedUrl = getVimeoEmbedUrl(videoUrl)

  return (
    <section style={{ background: '#171717', padding: '100px 40px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#4294d8', display: 'block', marginBottom: '12px' }}>
            See It In Action
          </span>
          <h2 style={{ fontSize: 'clamp(24px, 3vw, 40px)', fontWeight: 700, color: '#fff', lineHeight: 1.15, margin: 0 }}>
            How {productName} Works
          </h2>
        </div>

        {/* Video container */}
        <div style={{
          position: 'relative',
          borderRadius: '20px',
          overflow: 'hidden',
          aspectRatio: '16/9',
          background: '#000',
          cursor: 'pointer',
        }}>
          {/* Thumbnail */}
          {thumbUrl && (
            <Image
              src={thumbUrl}
              alt={`${productName} video`}
              fill
              loading="eager"
              style={{ objectFit: 'cover', opacity: 0.85 }}
              sizes="(max-width: 900px) 100vw, 900px"
            />
          )}

          {/* Play button overlay */}
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none',
            }}
            aria-label={`Watch ${productName} video`}
          >
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.95)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              transition: 'transform 0.2s, background 0.2s',
            }}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M8 6l16 8-16 8V6z" fill="#171717" />
              </svg>
            </div>
          </a>
        </div>

      </div>
    </section>
  )
}

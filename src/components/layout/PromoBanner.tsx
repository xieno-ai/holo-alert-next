interface PromoBannerProps {
  body: string
  ctaText?: string
  ctaUrl?: string
}

export default function PromoBanner({ body, ctaText, ctaUrl }: PromoBannerProps) {
  return (
    <div
      style={{
        background: '#f25c2c',
        padding: '10px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
        flexWrap: 'wrap',
      }}
    >
      <p
        style={{
          margin: 0,
          color: '#fff',
          fontFamily: 'var(--font-instrument-sans), sans-serif',
          fontSize: '13px',
          fontWeight: 700,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          textAlign: 'center',
          lineHeight: 1.4,
        }}
      >
        {body}
      </p>
      {ctaText && ctaUrl ? (
        <a
          href={ctaUrl}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#111',
            color: '#fff',
            fontFamily: 'var(--font-instrument-sans), sans-serif',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            padding: '7px 18px',
            borderRadius: '100px',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          {ctaText}
        </a>
      ) : null}
    </div>
  )
}

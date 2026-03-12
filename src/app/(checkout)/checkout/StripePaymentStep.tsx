'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const STRIPE_APPEARANCE = {
  theme: 'stripe' as const,
  variables: {
    colorPrimary: '#4294d8',
    colorBackground: '#ffffff',
    colorText: '#171717',
    colorTextSecondary: '#787878',
    colorDanger: '#e53e3e',
    fontFamily: '"Instrument Sans", sans-serif',
    borderRadius: '8px',
    fontSizeBase: '14px',
  },
  rules: {
    '.Input': { border: '1.5px solid #d0d5dd', boxShadow: 'none', padding: '11px 14px' },
    '.Input:focus': { border: '1.5px solid #4294d8', boxShadow: '0 0 0 3px rgba(66,148,216,0.1)' },
    '.Label': { fontWeight: '600', color: '#344054' },
    '.Tab': { border: '1.5px solid #d0d5dd', borderRadius: '8px' },
    '.Tab--selected': { border: '1.5px solid #4294d8', boxShadow: '0 0 0 1px #4294d8' },
  },
}

interface Props {
  clientSecret: string
  totalDisplay: string | null
  onBack: () => void
}

function PaymentForm({ totalDisplay, onBack }: { totalDisplay: string | null; onBack: () => void }) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!stripe || !elements) return
    setLoading(true)
    setError(null)
    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/checkout/success` },
    })
    if (stripeError) setError(stripeError.message ?? 'Payment failed. Please try again.')
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement options={{ layout: 'tabs' }} />
      {error ? (
        <div style={{ color: '#e53e3e', fontSize: '13px', marginTop: '14px', padding: '10px 14px', background: '#fff5f5', borderRadius: '8px', border: '1px solid #fed7d7' }}>
          {error}
        </div>
      ) : null}
      <button type="submit" disabled={!stripe || loading}
        style={{ marginTop: '24px', width: '100%', background: loading || !stripe ? '#ccc' : '#4294d8', color: '#fff', fontSize: '14px', fontWeight: 700, padding: '15px 24px', borderRadius: '10px', border: 'none', cursor: loading || !stripe ? 'not-allowed' : 'pointer', letterSpacing: '0.04em', textTransform: 'uppercase', transition: 'background 0.15s ease' }}>
        {loading ? 'Processing...' : `Subscribe${totalDisplay ? ` — ${totalDisplay}` : ''}`}
      </button>
      <button type="button" onClick={onBack}
        style={{ marginTop: '12px', fontSize: '12px', color: '#aaa', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0' }}>
        &larr; Edit information
      </button>
    </form>
  )
}

export default function StripePaymentStep({ clientSecret, totalDisplay, onBack }: Props) {
  return (
    <Elements stripe={stripePromise} options={{ clientSecret, appearance: STRIPE_APPEARANCE }}>
      <PaymentForm totalDisplay={totalDisplay} onBack={onBack} />
    </Elements>
  )
}

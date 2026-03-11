import { redirect } from 'next/navigation'
import Link from 'next/link'
import Stripe from 'stripe'
import SuccessTracking from './SuccessTracking'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{
    session_id?: string
    payment_intent?: string
    redirect_status?: string
  }>
}) {
  const { session_id, payment_intent, redirect_status } = await searchParams

  if (!session_id && !payment_intent) redirect('/checkout')

  let isComplete = false
  let customerEmail = 'your email address'
  let deviceName = 'Holo Alert Device'
  let amountTotal = 0
  let currency = 'CAD'
  let trackingId = session_id ?? payment_intent ?? ''

  if (session_id) {
    // Legacy embedded checkout session flow
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['line_items'],
    })
    isComplete = session.status === 'complete'
    customerEmail = session.customer_details?.email ?? customerEmail
    deviceName = session.metadata?.deviceName ?? deviceName
    amountTotal = session.amount_total ?? 0
    currency = session.currency ?? 'cad'
  } else if (payment_intent) {
    // Subscription / PaymentIntent flow
    if (redirect_status !== 'succeeded') {
      // Payment failed or was cancelled
      redirect('/checkout')
    }
    const pi = await stripe.paymentIntents.retrieve(payment_intent)
    isComplete = pi.status === 'succeeded'
    amountTotal = pi.amount ?? 0
    currency = pi.currency ?? 'cad'

    // Get customer email + device name from subscription metadata via customer
    if (pi.customer) {
      try {
        const customer = await stripe.customers.retrieve(pi.customer as string)
        if (!('deleted' in customer)) {
          customerEmail = customer.email ?? customerEmail
          deviceName = customer.metadata?.device_name ?? deviceName
        }
      } catch { /* non-critical */ }
    }
    // Try to get device name from invoice metadata
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const piAny = pi as any
    if (piAny.invoice) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const invoice = await (stripe.invoices as any).retrieve(piAny.invoice, { expand: ['subscription'] })
        deviceName = invoice?.subscription?.metadata?.device_name ?? deviceName
      } catch { /* non-critical */ }
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', fontFamily: 'Instrument Sans, sans-serif' }}>
      {isComplete ? (
        <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #e8e8e8', padding: '56px 48px', maxWidth: '520px', width: '100%', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#f0faf3', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px' }}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M6 16L12 22L26 8" stroke="#45b864" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#171717', letterSpacing: '-0.01em', margin: '0 0 12px' }}>
            You&apos;re all set!
          </h1>
          <p style={{ fontSize: '15px', color: '#555', lineHeight: 1.6, margin: '0 0 32px' }}>
            Your Holo Alert subscription is confirmed. A receipt has been sent to{' '}
            <strong style={{ color: '#171717' }}>{customerEmail}</strong>.
          </p>
          <div style={{ background: '#f8f9fa', borderRadius: '12px', padding: '20px 24px', marginBottom: '32px', textAlign: 'left' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#aaa', marginBottom: '12px' }}>What happens next</div>
            {["We'll ship your device within 1–2 business days", "You'll receive a tracking number by email", 'Device arrives in 3–6 business days', 'Monitoring begins when you activate'].map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: i < 3 ? '10px' : 0 }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#4294d8', color: '#fff', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>{i + 1}</div>
                <span style={{ fontSize: '13px', color: '#444', lineHeight: 1.5 }}>{step}</span>
              </div>
            ))}
          </div>
          <Link href="/" style={{ display: 'block', background: '#171717', color: '#fff', fontSize: '13px', fontWeight: 700, padding: '14px 24px', borderRadius: '10px', textDecoration: 'none', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Return to Holo Alert
          </Link>
        </div>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '16px', color: '#555' }}>Your payment is being processed. Please check your email for confirmation.</p>
          <Link href="/" style={{ display: 'inline-block', marginTop: '24px', color: '#4294d8', fontSize: '14px', fontWeight: 500, textDecoration: 'none' }}>Return home →</Link>
        </div>
      )}
      {isComplete && (
        <SuccessTracking sessionId={trackingId} deviceName={deviceName} total={amountTotal} currency={currency} />
      )}
    </div>
  )
}

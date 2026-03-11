import Stripe from 'stripe'
import { NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

// Next.js App Router: disable body parsing so we can read raw bytes for Stripe signature verification
export const runtime = 'nodejs'

export async function POST(request: Request) {
  const rawBody = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Invalid signature'
    console.error('[webhook] Signature verification failed:', msg)
    return NextResponse.json({ error: `Webhook signature verification failed: ${msg}` }, { status: 400 })
  }

  if (event.type === 'invoice.payment_succeeded') {
    // Stripe SDK v20+ strips some fields from the Invoice type — use raw object
    const invoice = event.data.object as unknown as {
      billing_reason?: string
      subscription?: string | { id: string }
    }

    // Only apply on the very first payment for a new subscription
    if (invoice.billing_reason !== 'subscription_create') {
      return NextResponse.json({ received: true })
    }

    const subscriptionId = typeof invoice.subscription === 'string'
      ? invoice.subscription
      : invoice.subscription?.id

    if (!subscriptionId) {
      return NextResponse.json({ received: true })
    }

    // Retrieve the subscription to get metadata and current_period_end
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    const bonusMonths = parseInt(subscription.metadata?.bonus_months ?? '0', 10)

    if (bonusMonths > 0) {
      // current_period_end is a Unix timestamp (seconds) — cast to bypass SDK v20+ type gap
      const currentPeriodEnd = (subscription as unknown as { current_period_end: number }).current_period_end

      // Add bonus months: use 30.44 days per month (average)
      const bonusSeconds = Math.round(bonusMonths * 30.44 * 24 * 60 * 60)
      const newTrialEnd = currentPeriodEnd + bonusSeconds

      await stripe.subscriptions.update(subscriptionId, {
        trial_end: newTrialEnd,
        proration_behavior: 'none',
      })

      console.log(
        `[webhook] Extended subscription ${subscriptionId} by ${bonusMonths} month(s). ` +
        `Next renewal: ${new Date(newTrialEnd * 1000).toISOString()}`
      )
    }
  }

  return NextResponse.json({ received: true })
}

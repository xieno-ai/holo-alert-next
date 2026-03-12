import Stripe from 'stripe'
import { NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: Request) {
  try {
    const {
      plan,
      deviceServicePriceId,
      deviceFeePriceId,
      addonPriceIds,
      customerEmail,
      metadata,
    } = await request.json()

    if (!deviceServicePriceId) {
      return NextResponse.json(
        { error: 'No Stripe price ID configured for this device. Please add price IDs in Sanity.' },
        { status: 400 }
      )
    }

    // Find or create customer
    const existing = await stripe.customers.list({ email: customerEmail, limit: 1 })
    const customer =
      existing.data[0] ??
      (await stripe.customers.create({ email: customerEmail, metadata }))

    // Monthly plan: add device one-time fee to the first invoice
    if (plan === 'monthly' && deviceFeePriceId) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (stripe.invoiceItems as any).create({
        customer: customer.id,
        pricing: { price: deviceFeePriceId },
      })
    }

    // Build subscription line items
    const items: Stripe.SubscriptionCreateParams.Item[] = [
      { price: deviceServicePriceId },
      ...(addonPriceIds as string[])
        .filter(Boolean)
        .map((p: string) => ({ price: p })),
    ]

    // Create the subscription in incomplete state so we can confirm payment client-side
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items,
      payment_behavior: 'default_incomplete',
      payment_settings: {
        save_default_payment_method: 'on_subscription',
      },
      metadata: { ...metadata, plan },
    })

    // Stripe SDK v20+ (2025 API) removed payment_intent from Invoice.
    // Use raw API call to get the invoice with payment_intent field.
    const rawInvoice = subscription.latest_invoice
    const invoiceId = typeof rawInvoice === 'string'
      ? rawInvoice
      : (rawInvoice as Stripe.Invoice)?.id

    if (!invoiceId) {
      return NextResponse.json({ error: 'No invoice created for subscription.' }, { status: 500 })
    }

    // Stripe SDK v20+ strips payment_intent from Invoice objects.
    // Use direct fetch to bypass SDK field filtering.
    const invoiceRes = await fetch(`https://api.stripe.com/v1/invoices/${invoiceId}`, {
      headers: { 'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}` },
    })
    const invoiceData = await invoiceRes.json() as { payment_intent?: string; amount_due?: number; currency?: string }
    const piId = invoiceData.payment_intent

    if (!piId) {
      return NextResponse.json(
        { error: 'No payment intent on invoice. The invoice total may be $0.' },
        { status: 500 }
      )
    }

    const pi = await stripe.paymentIntents.retrieve(piId)

    if (!pi.client_secret) {
      return NextResponse.json(
        { error: 'Could not retrieve payment secret. Please try again.' },
        { status: 500 }
      )
    }

    // amount_due is in cents
    const amountDue = invoiceData.amount_due ?? pi.amount
    const currency = invoiceData.currency ?? 'cad'

    return NextResponse.json({
      clientSecret: pi.client_secret,
      subscriptionId: subscription.id,
      amountDue,
      currency,
    })
  } catch (err) {
    const raw = err instanceof Error ? err.message : 'Unknown error'
    console.error('[stripe/create-session]', raw)

    // Surface helpful messages for common Stripe errors
    let userMessage = raw
    if (raw.includes('No such price')) {
      const match = raw.match(/No such price: '([^']+)'/)
      userMessage = `Stripe price ID ${match ? `"${match[1]}" ` : ''}not found. Update the price IDs in your Sanity device/addon documents to match your Stripe dashboard.`
    } else if (raw.includes('No such customer')) {
      userMessage = 'Stripe customer error. Please try again with a different email.'
    } else if (raw.includes('api_key')) {
      userMessage = 'Stripe API key is invalid. Check your STRIPE_SECRET_KEY in .env.local.'
    }

    return NextResponse.json({ error: userMessage }, { status: 500 })
  }
}

import Stripe from 'stripe'
import { NextResponse } from 'next/server'
import { sendOrderConfirmationEmail, type OrderEmailData } from '@/lib/email'
import { createShipStationOrder, parseShippingAddress, getDeviceSku } from '@/lib/shipstation'

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

      // Stripe requires trial_end to be in the future
      const now = Math.floor(Date.now() / 1000)
      if (newTrialEnd > now) {
        await stripe.subscriptions.update(subscriptionId, {
          trial_end: newTrialEnd,
          proration_behavior: 'none',
        })

        console.log(
          `[webhook] Extended subscription ${subscriptionId} by ${bonusMonths} month(s). ` +
          `Next renewal: ${new Date(newTrialEnd * 1000).toISOString()}`
        )
      } else {
        console.warn(`[webhook] Skipping trial extension — computed trial_end ${newTrialEnd} is not in the future`)
      }
    }

    // --- Send order confirmation email ---
    try {
      console.log('[webhook] Preparing order confirmation email...')

      // Get customer email
      const customerId = typeof subscription.customer === 'string'
        ? subscription.customer
        : (subscription.customer as Stripe.Customer).id
      const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer
      console.log('[webhook] Customer:', customer.email)

      // Get the invoice ID directly from the event object
      const invoiceId = (event.data.object as unknown as { id?: string }).id
      console.log('[webhook] Invoice ID:', invoiceId)

      let invoiceTotal = '0.00'
      let invoiceSubtotal = '0.00'
      let invoiceTax = '0.00'
      let invoiceDiscount = '0.00'
      const items: OrderEmailData['items'] = []

      if (invoiceId) {
        const invoiceRes = await fetch(
          `https://api.stripe.com/v1/invoices/${invoiceId}?expand[]=lines.data`,
          { headers: { Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}` } }
        )
        const invoiceData = await invoiceRes.json() as {
          total?: number
          subtotal?: number
          tax?: number
          total_discount_amounts?: { amount: number }[]
          currency?: string
          lines?: { data: { description?: string; amount?: number; quantity?: number; price?: { recurring?: { interval?: string } } }[] }
        }

        const fmt = (cents: number) => (cents / 100).toFixed(2)
        invoiceTotal = fmt(invoiceData.total ?? 0)
        invoiceSubtotal = fmt(invoiceData.subtotal ?? 0)
        invoiceTax = fmt(invoiceData.tax ?? 0)

        const totalDiscount = (invoiceData.total_discount_amounts ?? [])
          .reduce((sum, d) => sum + d.amount, 0)
        invoiceDiscount = fmt(totalDiscount)

        for (const line of invoiceData.lines?.data ?? []) {
          const recurring = line.price?.recurring
          items.push({
            name: line.description ?? 'Item',
            price: `$${fmt(line.amount ?? 0)}`,
            quantity: line.quantity ?? 1,
            isRecurring: !!recurring,
            interval: recurring?.interval ?? '',
          })
        }
        console.log('[webhook] Invoice items:', items.length)
      }

      const meta = subscription.metadata ?? {}
      console.log('[webhook] Metadata keys:', Object.keys(meta))

      const emailData: OrderEmailData = {
        customerName: meta.purchaser_name ?? customer.name ?? 'Customer',
        customerEmail: customer.email ?? '',
        customerPhone: meta.phone ?? '',
        shippingAddress: meta.shipping ?? '',
        deviceName: meta.device_name ?? 'Holo Alert Device',
        plan: meta.plan ?? '',
        orderDate: new Date().toISOString(),
        subscriptionId,
        items,
        subtotal: invoiceSubtotal,
        discount: invoiceDiscount,
        tax: invoiceTax,
        total: invoiceTotal,
        currency: 'CAD',
      }

      console.log('[webhook] Sending email to:', emailData.customerEmail)
      await sendOrderConfirmationEmail(emailData)
      console.log(`[webhook] Order confirmation email sent to ${emailData.customerEmail}`)
    } catch (emailErr) {
      // Email failure should not break the webhook — log and continue
      console.error('[webhook] Failed to send order confirmation email:', emailErr)
    }

    // --- Create order in ShipStation for fulfillment ---
    try {
      console.log('[webhook] Creating ShipStation order...')

      const meta = subscription.metadata ?? {}
      const customerId = typeof subscription.customer === 'string'
        ? subscription.customer
        : (subscription.customer as Stripe.Customer).id
      const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer

      // Parse the flat shipping address string into structured fields
      const shipTo = parseShippingAddress(
        meta.shipping ?? '',
        meta.purchaser_name ?? customer.name ?? 'Customer',
        meta.phone,
      )

      // Always include the physical device as the primary ShipStation line item
      const deviceName = meta.device_name ?? 'Holo Alert Device'
      const deviceSku = getDeviceSku(deviceName)
      const ssItems: { name: string; quantity: number; unitPrice: number; sku?: string }[] = [
        { name: deviceName, quantity: 1, unitPrice: 0, sku: deviceSku },
      ]

      // Get invoice to extract total paid and check for a device fee line item
      const ssInvoiceId = (event.data.object as unknown as { id?: string }).id
      let amountPaid = 0
      let taxAmount = 0

      if (ssInvoiceId) {
        const ssInvoiceRes = await fetch(
          `https://api.stripe.com/v1/invoices/${ssInvoiceId}?expand[]=lines.data`,
          { headers: { Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}` } },
        )
        const ssInvoiceData = await ssInvoiceRes.json() as {
          total?: number
          tax?: number
          lines?: { data: { description?: string; amount?: number; quantity?: number; price?: { type?: string } }[] }
        }

        amountPaid = (ssInvoiceData.total ?? 0) / 100
        taxAmount = (ssInvoiceData.tax ?? 0) / 100

        // If there's a one-time device fee on the invoice (monthly plans),
        // update the device line item price
        for (const line of ssInvoiceData.lines?.data ?? []) {
          const isOneTime = !line.price?.type || line.price.type === 'one_time'
          if (isOneTime && (line.amount ?? 0) > 0) {
            ssItems[0].unitPrice = (line.amount ?? 0) / 100
          }
        }
      }

      const result = await createShipStationOrder({
        orderNumber: subscriptionId.slice(-12),
        customerEmail: customer.email ?? '',
        shipTo,
        items: ssItems,
        amountPaid,
        taxAmount,
      })

      console.log(`[webhook] ShipStation order created: #${result.orderNumber} (shipmentId: ${result.shipmentId})`)
    } catch (ssErr) {
      // ShipStation failure should not break the webhook — log and continue
      console.error('[webhook] Failed to create ShipStation order:', ssErr)
    }
  }

  return NextResponse.json({ received: true })
}

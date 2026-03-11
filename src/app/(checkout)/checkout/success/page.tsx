import { redirect } from 'next/navigation'
import Stripe from 'stripe'
import HeaderServer from '@/components/layout/HeaderServer'
import SuccessTracking from './SuccessTracking'
import SuccessContent from './SuccessContent'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export interface OrderItem {
  name: string
  isRecurring: boolean
  interval: string
}

export interface OrderData {
  customerName: string
  customerEmail: string
  deviceName: string
  plan: string
  items: OrderItem[]
  amountTotal: number
  currency: string
}

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
  let trackingId = session_id ?? payment_intent ?? ''
  let orderData: OrderData = {
    customerName: '',
    customerEmail: '',
    deviceName: 'Holo Alert Device',
    plan: '',
    items: [],
    amountTotal: 0,
    currency: 'CAD',
  }

  try {
    if (session_id) {
      const session = await stripe.checkout.sessions.retrieve(session_id, {
        expand: ['line_items'],
      })
      isComplete = session.status === 'complete'
      orderData.customerEmail = session.customer_details?.email ?? ''
      orderData.customerName = session.customer_details?.name ?? ''
      orderData.deviceName = session.metadata?.deviceName ?? orderData.deviceName
      orderData.amountTotal = session.amount_total ?? 0
      orderData.currency = session.currency ?? 'cad'
    } else if (payment_intent) {
      if (redirect_status !== 'succeeded') {
        redirect('/checkout')
      }
      const pi = await stripe.paymentIntents.retrieve(payment_intent)
      isComplete = pi.status === 'succeeded'
      orderData.amountTotal = pi.amount ?? 0
      orderData.currency = pi.currency ?? 'cad'

      // Get customer details
      if (pi.customer) {
        try {
          const customer = await stripe.customers.retrieve(pi.customer as string)
          if (!('deleted' in customer)) {
            orderData.customerEmail = customer.email ?? ''
            orderData.customerName = customer.name ?? ''
            orderData.deviceName = customer.metadata?.device_name ?? orderData.deviceName
          }
        } catch { /* non-critical */ }
      }

      // Get subscription details + line items from invoice
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const piAny = pi as any
      if (piAny.invoice) {
        try {
          const invoiceRes = await fetch(
            `https://api.stripe.com/v1/invoices/${piAny.invoice}?expand[]=subscription&expand[]=lines.data`,
            { headers: { Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}` } }
          )
          const invoiceData = await invoiceRes.json() as {
            subscription?: {
              metadata?: Record<string, string>
            }
            lines?: {
              data: {
                description?: string
                price?: { recurring?: { interval?: string } }
              }[]
            }
          }

          // Get metadata from subscription
          const meta = invoiceData.subscription?.metadata ?? {}
          orderData.deviceName = meta.device_name ?? orderData.deviceName
          orderData.customerName = meta.purchaser_name ?? orderData.customerName
          orderData.plan = meta.plan ?? ''

          // Get line items
          for (const line of invoiceData.lines?.data ?? []) {
            const recurring = line.price?.recurring
            orderData.items.push({
              name: line.description ?? 'Item',
              isRecurring: !!recurring,
              interval: recurring?.interval ?? '',
            })
          }
        } catch { /* non-critical */ }
      }
    }
  } catch {
    // Stripe retrieval failed — show the page with whatever data we have
    // In production, this would only happen with invalid/expired IDs
    console.warn('[success] Could not retrieve payment details from Stripe')
  }

  // If redirect_status says succeeded, trust it even if Stripe retrieval failed
  if (!isComplete && redirect_status === 'succeeded') {
    isComplete = true
  }

  // Extract first name for greeting
  const firstName = orderData.customerName
    ? orderData.customerName.split(' ')[0]
    : ''

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50">
        <HeaderServer />
      </div>
      <main className="min-h-screen bg-white" style={{ paddingTop: '70px' }}>
        {isComplete ? (
          <SuccessContent
            firstName={firstName}
            email={orderData.customerEmail}
            deviceName={orderData.deviceName}
            plan={orderData.plan}
            items={orderData.items}
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-32 px-6 text-center">
            <p className="text-brand-gray text-base">
              Your payment is being processed. Please check your email for confirmation.
            </p>
            <a
              href="/"
              className="mt-6 text-brand-blue text-sm font-medium hover:underline"
            >
              Return home &rarr;
            </a>
          </div>
        )}
        {isComplete && (
          <SuccessTracking
            sessionId={trackingId}
            deviceName={orderData.deviceName}
            total={orderData.amountTotal}
            currency={orderData.currency}
          />
        )}
      </main>
    </>
  )
}

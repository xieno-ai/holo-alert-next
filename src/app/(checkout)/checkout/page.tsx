import { redirect } from 'next/navigation'
import { sanityFetch } from '@/sanity/lib/client'
import { DEVICE_QUERY, DEVICE_ADDONS_QUERY } from '@/sanity/lib/queries'
import CheckoutClient from './CheckoutClient'

interface DeviceResult {
  _id: string
  name?: string
  slug?: { current: string }
  monthlyPriceDisplay?: string
  annualPriceDisplay?: string
  devicePrice?: number
  reducedDevicePrice?: number
  annualBonusMonths?: number
  stripePriceIdMonthly?: string
  stripePriceIdYearly?: string
  stripePriceIdDevice?: string
}

interface AddonResult {
  _id: string
  name: string
  priceMonthly?: number
  priceAnnual?: number
  billingInterval?: string
  stripePriceIdMonthly?: string
  stripePriceIdAnnual?: string
}

function fmt(n: number) {
  return `$${n.toFixed(2)}`
}

function normalizeMonthly(val: string | undefined | null): string {
  if (!val) return '—'
  let s = val
  if (!s.includes('$')) s = s.replace(/(\d)/, '$$$1')
  if (!/\/mo(nth)?/i.test(s)) s = s.trim() + '/mo'
  return s
}

function normalizeAnnual(val: string | undefined | null): string {
  if (!val) return '—'
  const s = (val).replace(/^\$/, '').replace(/\/(yr|year|mo(nth)?)/i, '').trim()
  return `$${s}/yr`
}

function parseDisplayPrice(display: string | undefined): number | null {
  if (!display) return null
  const match = display.match(/\$?([0-9,]+(?:\.[0-9]+)?)/)
  return match ? parseFloat(match[1].replace(',', '')) : null
}

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string; plan?: string; addons?: string }>
}) {
  const { product: slug, plan, addons: addonsParam } = await searchParams

  if (!slug || !plan || (plan !== 'annual' && plan !== 'monthly')) {
    redirect('/')
  }

  const device = await sanityFetch<DeviceResult>({
    query: DEVICE_QUERY,
    params: { slug },
    tags: ['device'],
  })

  if (!device) redirect('/')

  const allAddons = await sanityFetch<AddonResult[]>({
    query: DEVICE_ADDONS_QUERY,
    params: { deviceId: device._id },
    tags: ['addon'],
  })

  const addonPriceIds = addonsParam
    ? addonsParam.split(',').filter(Boolean)
    : []

  const selectedAddons = (allAddons ?? []).filter((a) => {
    const priceId =
      plan === 'annual' ? a.stripePriceIdAnnual : a.stripePriceIdMonthly
    return priceId && addonPriceIds.includes(priceId)
  })

  const deviceServicePriceId =
    plan === 'annual'
      ? (device.stripePriceIdYearly ?? '')
      : (device.stripePriceIdMonthly ?? '')

  const deviceFeePriceId =
    plan === 'monthly' ? (device.stripePriceIdDevice ?? null) : null

  // Build order summary line items
  const serviceLabel = plan === 'annual' ? 'Annual Monitoring' : 'Monthly Monitoring'
  const servicePrice = plan === 'annual'
    ? normalizeAnnual(device.annualPriceDisplay)
    : normalizeMonthly(device.monthlyPriceDisplay)
  const interval = plan === 'annual' ? '/yr' : '/mo'

  const deviceFeePrice = plan === 'monthly'
    ? (device.reducedDevicePrice ?? (device.devicePrice ? device.devicePrice * 0.6 : null))
    : null

  const addonItems = selectedAddons.map((a) => ({
    name: a.name,
    priceDisplay: plan === 'annual'
      ? (a.priceAnnual != null ? fmt(a.priceAnnual) : '—')
      : (a.priceMonthly != null ? fmt(a.priceMonthly) : '—'),
    interval: a.billingInterval === 'one-time' ? ' one-time' : interval,
  }))

  // Compute total for display
  const serviceAmount = parseDisplayPrice(servicePrice)
  const addonTotal = selectedAddons.reduce((sum, a) => {
    const price = plan === 'annual' ? (a.priceAnnual ?? 0) : (a.priceMonthly ?? 0)
    return sum + price
  }, 0)
  const totalDisplay = serviceAmount != null
    ? `${fmt(serviceAmount + addonTotal)}${interval}`
    : null


  const orderSummary = {
    deviceName: device.name ?? 'Holo Alert',
    deviceSlug: slug,
    plan: plan as 'annual' | 'monthly',
    serviceLabel,
    servicePrice,
    interval,
    deviceFeeDisplay: deviceFeePrice != null ? fmt(deviceFeePrice) : null,
    addons: addonItems,
    totalDisplay,
    bonusMonths: plan === 'annual' ? (device.annualBonusMonths ?? 0) : 0,
  }

  const pricePayload = {
    plan: plan as 'annual' | 'monthly',
    deviceServicePriceId,
    deviceFeePriceId,
    addonPriceIds,
    bonusMonths: plan === 'annual' ? (device.annualBonusMonths ?? 0) : 0,
  }

  return <CheckoutClient orderSummary={orderSummary} pricePayload={pricePayload} />
}

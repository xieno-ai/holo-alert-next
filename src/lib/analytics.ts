/**
 * Centralized dataLayer push utility for GTM/GA4 tracking.
 *
 * All custom events flow through here so naming and structure stay consistent.
 * GTM picks these up via Custom Event triggers (CE - event_name).
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface DataLayerEvent {
  event: string
  [key: string]: unknown
}

// ---------------------------------------------------------------------------
// Core helper
// ---------------------------------------------------------------------------

function push(payload: DataLayerEvent) {
  if (typeof window === 'undefined') return
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any
  w.dataLayer = w.dataLayer || []
  w.dataLayer.push(payload)
}

// ---------------------------------------------------------------------------
// UTM / attribution helpers
// ---------------------------------------------------------------------------

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const
const CLICK_ID_KEYS = ['gclid', 'fbclid', 'msclkid'] as const
const FIRST_TOUCH_STORAGE_KEY = 'ha_first_touch'
const SESSION_PAGES_KEY = 'ha_session_pages'

interface Attribution {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_content?: string
  utm_term?: string
  gclid?: string
  fbclid?: string
  msclkid?: string
}

interface FirstTouch extends Attribution {
  first_touch_source?: string
  first_touch_medium?: string
  first_touch_campaign?: string
  landing_page?: string
  referrer?: string
  timestamp?: string
}

/** Read UTM + click-ID params from the current URL. */
function getAttributionFromUrl(): Attribution {
  if (typeof window === 'undefined') return {}
  const params = new URLSearchParams(window.location.search)
  const data: Attribution = {}
  for (const k of UTM_KEYS) {
    const v = params.get(k)
    if (v) (data as Record<string, string>)[k] = v
  }
  for (const k of CLICK_ID_KEYS) {
    const v = params.get(k)
    if (v) (data as Record<string, string>)[k] = v
  }
  return data
}

/** Persist first-touch attribution once per visitor. */
function captureFirstTouch() {
  if (typeof window === 'undefined') return
  try {
    if (localStorage.getItem(FIRST_TOUCH_STORAGE_KEY)) return // already captured
    const attr = getAttributionFromUrl()
    const ft: FirstTouch = {
      ...attr,
      first_touch_source: attr.utm_source,
      first_touch_medium: attr.utm_medium,
      first_touch_campaign: attr.utm_campaign,
      landing_page: window.location.pathname + window.location.search,
      referrer: document.referrer || '(direct)',
      timestamp: new Date().toISOString(),
    }
    localStorage.setItem(FIRST_TOUCH_STORAGE_KEY, JSON.stringify(ft))
  } catch {
    // storage unavailable — non-critical
  }
}

function getFirstTouch(): FirstTouch {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(FIRST_TOUCH_STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

// ---------------------------------------------------------------------------
// Session page tracking (pages visited before conversion)
// ---------------------------------------------------------------------------

function trackPageInSession(path: string) {
  if (typeof window === 'undefined') return
  try {
    const raw = sessionStorage.getItem(SESSION_PAGES_KEY)
    const pages: string[] = raw ? JSON.parse(raw) : []
    // Avoid duplicates for same page on back/forward
    if (pages[pages.length - 1] !== path) {
      pages.push(path)
      sessionStorage.setItem(SESSION_PAGES_KEY, JSON.stringify(pages))
    }
  } catch {
    // storage unavailable
  }
}

function getSessionPages(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = sessionStorage.getItem(SESSION_PAGES_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

// ---------------------------------------------------------------------------
// Abandoned cart tracking
// ---------------------------------------------------------------------------

const CART_STORAGE_KEY = 'ha_pending_cart'

interface PendingCart {
  device_name: string
  device_slug: string
  plan_type: string
  value?: string
  timestamp: string
  checkout_step?: number
}

function savePendingCart(cart: Omit<PendingCart, 'timestamp'>) {
  if (typeof window === 'undefined') return
  try {
    const data: PendingCart = { ...cart, timestamp: new Date().toISOString() }
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(data))
  } catch {
    // non-critical
  }
}

function clearPendingCart() {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(CART_STORAGE_KEY)
  } catch {
    // non-critical
  }
}

function getPendingCart(): PendingCart | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

// ---------------------------------------------------------------------------
// Event functions
// ---------------------------------------------------------------------------

/** Fire once on every page load — captures attribution + session pages. */
export function trackPageView() {
  captureFirstTouch()
  trackPageInSession(
    typeof window !== 'undefined'
      ? window.location.pathname
      : ''
  )
  const attr = getAttributionFromUrl()
  const ft = getFirstTouch()

  push({
    event: 'page_data',
    ...attr,
    first_touch_source: ft.first_touch_source,
    first_touch_medium: ft.first_touch_medium,
    first_touch_campaign: ft.first_touch_campaign,
    landing_page: ft.landing_page,
    referrer: ft.referrer,
  })
}

/** Device product page viewed. */
export function trackViewItem(params: {
  device_name: string
  device_slug: string
  monthly_price?: string
  annual_price?: string
}) {
  push({
    event: 'view_item',
    device_name: params.device_name,
    device_slug: params.device_slug,
    monthly_price: params.monthly_price,
    annual_price: params.annual_price,
    currency: 'CAD',
  })
}

/** User selects a plan (annual/monthly) — treated as "add to cart". */
export function trackAddToCart(params: {
  device_name: string
  device_slug: string
  plan_type: 'annual' | 'monthly'
  price?: string
  addons?: string[]
}) {
  const sessionPages = getSessionPages()
  const attr = getAttributionFromUrl()
  const ft = getFirstTouch()

  push({
    event: 'add_to_cart',
    device_name: params.device_name,
    device_slug: params.device_slug,
    plan_type: params.plan_type,
    device_price: params.price,
    addons: params.addons?.join(', ') || '',
    currency: 'CAD',
    pages_before_cart: sessionPages.join(' > '),
    page_count_before_cart: sessionPages.length,
    // Attribution
    ...attr,
    first_touch_source: ft.first_touch_source,
    first_touch_medium: ft.first_touch_medium,
    first_touch_campaign: ft.first_touch_campaign,
    landing_page: ft.landing_page,
    referrer: ft.referrer,
  })

  // Save pending cart for abandoned cart tracking
  savePendingCart({
    device_name: params.device_name,
    device_slug: params.device_slug,
    plan_type: params.plan_type,
    value: params.price,
  })
}

/** Checkout form started (step 1 loaded). */
export function trackBeginCheckout(params: {
  device_name: string
  plan_type: 'annual' | 'monthly'
  value?: string
}) {
  const attr = getAttributionFromUrl()
  const ft = getFirstTouch()

  push({
    event: 'begin_checkout',
    device_name: params.device_name,
    plan_type: params.plan_type,
    value: params.value,
    currency: 'CAD',
    ...attr,
    first_touch_source: ft.first_touch_source,
    first_touch_medium: ft.first_touch_medium,
    first_touch_campaign: ft.first_touch_campaign,
  })

  // Update pending cart step
  savePendingCart({
    device_name: params.device_name,
    device_slug: '',
    plan_type: params.plan_type,
    value: params.value,
    checkout_step: 1,
  })
}

/** Checkout step progression. */
export function trackCheckoutStep(params: {
  step: number
  step_name: string
  device_name: string
  plan_type: string
}) {
  push({
    event: 'checkout_step',
    checkout_step: params.step,
    checkout_step_name: params.step_name,
    device_name: params.device_name,
    plan_type: params.plan_type,
  })

  // Update abandoned cart step
  const cart = getPendingCart()
  if (cart) {
    savePendingCart({ ...cart, checkout_step: params.step })
  }
}

/** Purchase completed — called from success page. */
export function trackPurchase(params: {
  transaction_id: string
  device_name: string
  value: number
  currency: string
  plan_type?: string
}) {
  const ft = getFirstTouch()
  const sessionPages = getSessionPages()

  push({
    event: 'purchase',
    transaction_id: params.transaction_id,
    device_name: params.device_name,
    value: params.value,
    currency: params.currency.toUpperCase(),
    plan_type: params.plan_type,
    // Attribution
    first_touch_source: ft.first_touch_source,
    first_touch_medium: ft.first_touch_medium,
    first_touch_campaign: ft.first_touch_campaign,
    landing_page: ft.landing_page,
    referrer: ft.referrer,
    // Journey
    pages_before_purchase: sessionPages.join(' > '),
    page_count_before_purchase: sessionPages.length,
  })

  // Clear pending cart — purchase completed
  clearPendingCart()
}

/** CTA button clicked anywhere on the site. */
export function trackCtaClick(params: {
  cta_text: string
  cta_location: string
  destination?: string
}) {
  push({
    event: 'cta_clicked',
    cta_text: params.cta_text,
    cta_location: params.cta_location,
    destination: params.destination,
  })
}

/** Phone number clicked. */
export function trackPhoneClick(params: { click_location: string }) {
  push({
    event: 'phone_click',
    click_location: params.click_location,
  })
}

/** FAQ question expanded. */
export function trackFaqClick(params: { faq_question: string }) {
  push({
    event: 'faq_click',
    faq_question: params.faq_question,
  })
}

/** Check for and fire abandoned cart event — called on page load. */
export function checkAbandonedCart() {
  const cart = getPendingCart()
  if (!cart) return

  // If the cart is older than 30 minutes, flag it as abandoned
  const cartTime = new Date(cart.timestamp).getTime()
  const now = Date.now()
  const thirtyMinutes = 30 * 60 * 1000

  if (now - cartTime > thirtyMinutes) {
    push({
      event: 'cart_abandoned',
      device_name: cart.device_name,
      device_slug: cart.device_slug,
      plan_type: cart.plan_type,
      value: cart.value,
      last_checkout_step: cart.checkout_step ?? 0,
      abandoned_minutes_ago: Math.round((now - cartTime) / 60000),
    })
    // Clear so we don't fire again
    clearPendingCart()
  }
}

'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import Link from 'next/link'

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

// ─── Types ────────────────────────────────────────────────────────────────────

interface AddonItem { name: string; priceDisplay: string; interval: string }

interface OrderSummary {
  deviceName: string; deviceSlug: string; plan: 'annual' | 'monthly'
  serviceLabel: string; servicePrice: string; interval: string
  deviceFeeDisplay: string | null; addons: AddonItem[]; totalDisplay: string | null; bonusMonths: number
}

interface PricePayload {
  plan: 'annual' | 'monthly'; deviceServicePriceId: string
  deviceFeePriceId: string | null; addonPriceIds: string[]; bonusMonths: number
}

interface Props { orderSummary: OrderSummary; pricePayload: PricePayload }

interface FormState {
  purchaserName: string; email: string; phone: string
  deviceUserName: string; deviceUserPhone: string; deviceUserSameAsPurchaser: boolean
  shippingLine1: string; shippingLine2: string; shippingCity: string
  shippingProvince: string; shippingPostal: string
  emergencySameAsShipping: boolean
  emergencyLine1: string; emergencyLine2: string; emergencyCity: string
  emergencyProvince: string; emergencyPostal: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CA_PROVINCES = [
  { code: 'AB', name: 'Alberta' }, { code: 'BC', name: 'British Columbia' },
  { code: 'MB', name: 'Manitoba' }, { code: 'NB', name: 'New Brunswick' },
  { code: 'NL', name: 'Newfoundland and Labrador' }, { code: 'NS', name: 'Nova Scotia' },
  { code: 'NT', name: 'Northwest Territories' }, { code: 'NU', name: 'Nunavut' },
  { code: 'ON', name: 'Ontario' }, { code: 'PE', name: 'Prince Edward Island' },
  { code: 'QC', name: 'Quebec' }, { code: 'SK', name: 'Saskatchewan' },
  { code: 'YT', name: 'Yukon' },
]

const INITIAL_FORM: FormState = {
  purchaserName: '', email: '', phone: '', deviceUserName: '', deviceUserPhone: '',
  deviceUserSameAsPurchaser: false, shippingLine1: '', shippingLine2: '',
  shippingCity: '', shippingProvince: 'ON', shippingPostal: '',
  emergencySameAsShipping: true, emergencyLine1: '', emergencyLine2: '',
  emergencyCity: '', emergencyProvince: 'ON', emergencyPostal: '',
}

// ─── Style tokens ─────────────────────────────────────────────────────────────

const INPUT: React.CSSProperties = {
  width: '100%', borderWidth: '1.5px', borderStyle: 'solid', borderColor: '#d0d5dd',
  borderRadius: '8px', padding: '11px 14px', fontSize: '14px', color: '#101828',
  fontFamily: 'inherit', outline: 'none', background: '#fff', boxSizing: 'border-box',
}
const INPUT_ERR: React.CSSProperties = { ...INPUT, borderColor: '#e53e3e' }
const LABEL: React.CSSProperties = { display: 'block', fontSize: '13px', fontWeight: 600, color: '#344054', marginBottom: '6px' }
const SECTION_HEAD: React.CSSProperties = {
  fontSize: '10px', fontWeight: 700, color: '#787878', letterSpacing: '0.1em',
  textTransform: 'uppercase', marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid #f0f0f0',
}

// ─── Field helpers ────────────────────────────────────────────────────────────

function Field({ label, error, required, hint, children }: {
  label: string; error?: string; required?: boolean; hint?: string; children: React.ReactNode
}) {
  return (
    <div>
      <label style={LABEL}>{label}{required && <span style={{ color: '#e53e3e', marginLeft: '3px' }}>*</span>}</label>
      {children}
      {hint && !error && <p style={{ fontSize: '11.5px', color: '#787878', marginTop: '4px' }}>{hint}</p>}
      {error && <p style={{ fontSize: '11.5px', color: '#e53e3e', marginTop: '4px' }}>{error}</p>}
    </div>
  )
}

function FInput({ value, onChange, error, ...rest }: React.InputHTMLAttributes<HTMLInputElement> & { error?: string }) {
  const [focused, setFocused] = useState(false)
  return (
    <input {...rest} value={value} onChange={onChange}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      style={{ ...(error ? INPUT_ERR : INPUT), ...(focused && !error ? { borderColor: '#4294d8', boxShadow: '0 0 0 3px rgba(66,148,216,0.1)' } : {}) }}
    />
  )
}

function FSelect({ value, onChange, children }: { value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ position: 'relative' }}>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{ ...INPUT, appearance: 'none', paddingRight: '36px', cursor: 'pointer', ...(focused ? { borderColor: '#4294d8', boxShadow: '0 0 0 3px rgba(66,148,216,0.1)' } : {}) }}>
        {children}
      </select>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
        style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
        <path d="M3 5l4 4 4-4" stroke="#787878" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

function AddressBlock({ prefix, form, errors, update }: {
  prefix: 'shipping' | 'emergency'; form: FormState
  errors: Partial<Record<keyof FormState, string>>; update: (f: keyof FormState, v: string | boolean) => void
}) {
  const k = (n: string) => `${prefix}${n.charAt(0).toUpperCase() + n.slice(1)}` as keyof FormState
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <Field label="Address line 1" required error={errors[k('line1')] as string}>
        <FInput placeholder="123 Main Street" value={form[k('line1')] as string}
          onChange={(e) => update(k('line1'), e.target.value)} error={errors[k('line1')] as string} />
      </Field>
      <Field label="Address line 2">
        <FInput placeholder="Apt, suite, unit (optional)" value={form[k('line2')] as string}
          onChange={(e) => update(k('line2'), e.target.value)} />
      </Field>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <Field label="City" required error={errors[k('city')] as string}>
          <FInput placeholder="Toronto" value={form[k('city')] as string}
            onChange={(e) => update(k('city'), e.target.value)} error={errors[k('city')] as string} />
        </Field>
        <Field label="Postal code" required error={errors[k('postal')] as string}>
          <FInput placeholder="M5V 1A1" value={form[k('postal')] as string}
            onChange={(e) => update(k('postal'), e.target.value)} error={errors[k('postal')] as string} />
        </Field>
      </div>
      <Field label="Province">
        <FSelect value={form[k('province')] as string} onChange={(v) => update(k('province'), v)}>
          {CA_PROVINCES.map((p) => <option key={p.code} value={p.code}>{p.name}</option>)}
        </FSelect>
      </Field>
    </div>
  )
}

function StepIndicator({ step }: { step: 1 | 2 | 3 }) {
  const steps = ['Billing & Shipping', 'Alert Info', 'Payment', 'Completed']
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '36px' }}>
      {steps.map((label, i) => {
        const num = i + 1; const done = num < step; const active = num === step
        return (
          <div key={label} style={{ display: 'flex', alignItems: 'center', flex: i < 3 ? 1 : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
              <div style={{
                width: '26px', height: '26px', borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: done ? '#45b864' : active ? '#171717' : '#fff',
                border: done || active ? 'none' : '1.5px solid #d0d5dd',
                fontSize: '11px', fontWeight: 700, color: done || active ? '#fff' : '#aaa',
              }}>
                {done ? <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6L5 9L10 3.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg> : num}
              </div>
              <span style={{ fontSize: '12px', fontWeight: active ? 700 : 500, color: active ? '#171717' : done ? '#45b864' : '#aaa', whiteSpace: 'nowrap' }}>
                {label}
              </span>
            </div>
            {i < 3 && <div style={{ flex: 1, height: '1.5px', margin: '0 10px', background: done ? '#45b864' : '#e8e8e8' }} />}
          </div>
        )
      })}
    </div>
  )
}

function ContinueButton({ onClick, label, loading }: { onClick: () => void; label: string; loading?: boolean }) {
  return (
    <button type="button" onClick={onClick} disabled={loading}
      style={{ marginTop: '36px', width: '100%', background: loading ? '#ccc' : '#f46036', color: '#fff', fontSize: '14px', fontWeight: 700, padding: '15px 24px', borderRadius: '10px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', letterSpacing: '0.04em', textTransform: 'uppercase', transition: 'opacity 0.15s ease' }}
      onMouseEnter={(e) => { if (!loading) e.currentTarget.style.opacity = '0.9' }}
      onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}>
      {loading ? 'Loading…' : label}
    </button>
  )
}

function OrderSidebar({ summary }: { summary: OrderSummary }) {
  return (
    <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #ebebeb', overflow: 'hidden' }}>
      <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ fontSize: '10px', fontWeight: 700, color: '#787878', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>Order Review</div>
      </div>
      <div style={{ padding: '16px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '14px', borderBottom: '1px solid #f5f5f5' }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#171717' }}>{summary.deviceName}</div>
            <div style={{ fontSize: '12px', color: '#787878', marginTop: '3px' }}>{summary.serviceLabel}</div>
          </div>
          <span style={{ fontSize: '14px', fontWeight: 700, color: '#171717', flexShrink: 0, marginLeft: '16px' }}>{summary.servicePrice}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f5f5f5' }}>
          <span style={{ fontSize: '12px', color: '#787878' }}>Device fee</span>
          {summary.deviceFeeDisplay
            ? <span style={{ fontSize: '12px', fontWeight: 600, color: '#171717' }}>{summary.deviceFeeDisplay} <span style={{ fontWeight: 400, color: '#aaa' }}>one-time</span></span>
            : <span style={{ fontSize: '12px', fontWeight: 600, color: '#45b864' }}>Included free</span>}
        </div>
        {summary.addons.length > 0 && (
          <div style={{ paddingTop: '12px', paddingBottom: '4px', borderBottom: '1px solid #f5f5f5' }}>
            <div style={{ fontSize: '10px', fontWeight: 700, color: '#aaa', letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginBottom: '10px' }}>Add-ons</div>
            {summary.addons.map((a, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '13px', color: '#444' }}>{a.name}</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#171717', flexShrink: 0, marginLeft: '12px' }}>+{a.priceDisplay}<span style={{ fontWeight: 400, color: '#aaa', fontSize: '11px' }}>{a.interval}</span></span>
              </div>
            ))}
          </div>
        )}
        {summary.bonusMonths > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f5f5f5' }}>
            <span style={{ fontSize: '12px', color: '#787878' }}>Bonus months</span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#45b864' }}>+{summary.bonusMonths} months free</span>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px' }}>
          <span style={{ fontSize: '14px', fontWeight: 700, color: '#171717' }}>Billed {summary.plan === 'annual' ? 'annually' : 'monthly'}</span>
          <span style={{ fontSize: '15px', fontWeight: 800, color: '#4294d8' }}>{summary.totalDisplay ?? summary.servicePrice}</span>
        </div>
      </div>
      <div style={{ padding: '16px 24px', background: '#f9fafb', borderTop: '1px solid #f0f0f0' }}>
        {['30-day satisfaction guarantee', 'Cancel or pause anytime', 'Secure checkout by Stripe'].map((text) => (
          <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 6.5L5 9.5L11 4" stroke="#45b864" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <span style={{ fontSize: '12px', color: '#555' }}>{text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── PaymentForm — must live inside <Elements> ────────────────────────────────

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
      {error && (
        <div style={{ color: '#e53e3e', fontSize: '13px', marginTop: '14px', padding: '10px 14px', background: '#fff5f5', borderRadius: '8px', border: '1px solid #fed7d7' }}>
          {error}
        </div>
      )}
      <button type="submit" disabled={!stripe || loading}
        style={{ marginTop: '24px', width: '100%', background: loading || !stripe ? '#ccc' : '#f46036', color: '#fff', fontSize: '14px', fontWeight: 700, padding: '15px 24px', borderRadius: '10px', border: 'none', cursor: loading || !stripe ? 'not-allowed' : 'pointer', letterSpacing: '0.04em', textTransform: 'uppercase', transition: 'background 0.15s ease' }}>
        {loading ? 'Processing…' : `Subscribe${totalDisplay ? ` — ${totalDisplay}` : ''}`}
      </button>
      <button type="button" onClick={onBack}
        style={{ marginTop: '12px', fontSize: '12px', color: '#aaa', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0' }}>
        ← Edit information
      </button>
    </form>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function CheckoutClient({ orderSummary, pricePayload }: Props) {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [form, setForm] = useState<FormState>(INITIAL_FORM)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [apiError, setApiError] = useState<string | null>(null)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [sessionLoading, setSessionLoading] = useState(false)

  function update(field: keyof FormState, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function validateStep1() {
    const e: Partial<Record<keyof FormState, string>> = {}
    if (!form.purchaserName.trim()) e.purchaserName = 'Required'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.shippingLine1.trim()) e.shippingLine1 = 'Required'
    if (!form.shippingCity.trim()) e.shippingCity = 'Required'
    if (!form.shippingPostal.trim()) e.shippingPostal = 'Required'
    setErrors(e); return Object.keys(e).length === 0
  }

  function validateStep2() {
    const e: Partial<Record<keyof FormState, string>> = {}
    if (!form.deviceUserName.trim()) e.deviceUserName = 'Required'
    if (!form.deviceUserPhone.trim()) e.deviceUserPhone = 'Required'
    if (!form.emergencySameAsShipping) {
      if (!form.emergencyLine1.trim()) e.emergencyLine1 = 'Required'
      if (!form.emergencyCity.trim()) e.emergencyCity = 'Required'
      if (!form.emergencyPostal.trim()) e.emergencyPostal = 'Required'
    }
    setErrors(e); return Object.keys(e).length === 0
  }

  async function startPayment() {
    setSessionLoading(true); setApiError(null)
    const emergencyAddr = form.emergencySameAsShipping
      ? `Same as shipping: ${form.shippingLine1}, ${form.shippingCity}, ${form.shippingProvince} ${form.shippingPostal}`
      : `${form.emergencyLine1}${form.emergencyLine2 ? ` ${form.emergencyLine2}` : ''}, ${form.emergencyCity}, ${form.emergencyProvince} ${form.emergencyPostal}`
    try {
      const res = await fetch('/api/stripe/create-session', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...pricePayload, customerEmail: form.email,
          metadata: {
            purchaser_name: form.purchaserName, device_user_name: form.deviceUserName,
            phone: form.phone, device_user_phone: form.deviceUserPhone,
            shipping: `${form.shippingLine1}${form.shippingLine2 ? ` ${form.shippingLine2}` : ''}, ${form.shippingCity}, ${form.shippingProvince} ${form.shippingPostal}, Canada`,
            emergency_address: emergencyAddr, device_name: orderSummary.deviceName,
            bonus_months: String(pricePayload.bonusMonths),
          },
        }),
      })
      const data = await res.json()
      if (!res.ok || data.error) throw new Error(data.error ?? 'Failed to start checkout.')
      setClientSecret(data.clientSecret)
      setStep(3)
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Failed to start checkout.')
    } finally { setSessionLoading(false) }
  }

  function handleContinue() {
    if (step === 1) { if (validateStep1()) setStep(2) }
    else if (step === 2) {
      if (!validateStep2()) return
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const w = window as any; w.dataLayer = w.dataLayer || []
      w.dataLayer.push({ event: 'begin_checkout', device_name: orderSummary.deviceName, plan_type: orderSummary.plan, currency: 'CAD' })
      startPayment()
    }
  }

  const checkboxStyle = { width: '16px', height: '16px', accentColor: '#4294d8', cursor: 'pointer' }

  return (
    <div style={{ minHeight: '100vh', background: '#f2f4f7', fontFamily: 'Instrument Sans, sans-serif' }}>
      {/* Nav */}
      <div style={{ background: '#fff', borderBottom: '1px solid #ebebeb', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px' }}>
        <Link href={`/devices/${orderSummary.deviceSlug}`} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 500, color: '#555', textDecoration: 'none' }}>
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M9.5 3L5 7.5L9.5 12" stroke="#555" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
          Back
        </Link>
        <span style={{ fontSize: '15px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#171717' }}>HOLO ALERT</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#aaa' }}>
          <svg width="11" height="13" viewBox="0 0 11 13" fill="none"><path d="M5.5 1L1 2.8v3.7c0 2.9 1.9 5.5 4.5 6.4 2.6-.9 4.5-3.5 4.5-6.4V2.8L5.5 1z" stroke="#aaa" strokeWidth="1.2" strokeLinejoin="round" /></svg>
          Secure checkout
        </div>
      </div>

      {/* Layout */}
      <div style={{ maxWidth: '1060px', margin: '0 auto', padding: '40px 24px 80px' }}>
        <div style={{ fontSize: '18px', fontWeight: 700, color: '#171717', marginBottom: '20px' }}>Checkout</div>
        <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '32px', alignItems: 'start' }}>

        {/* Left: order summary */}
        <div style={{ position: 'sticky', top: '24px' }}>
          <OrderSidebar summary={orderSummary} />
        </div>

        {/* Right: steps */}
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #ebebeb', padding: '36px 40px' }}>
          <StepIndicator step={step} />

          {/* Step 1: Billing & Shipping */}
          {step === 1 && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#171717', margin: '0 0 28px' }}>Billing &amp; Shipping</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                <div>
                  <div style={SECTION_HEAD}>Contact</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <Field label="Full name" required error={errors.purchaserName}>
                        <FInput placeholder="Jane Smith" value={form.purchaserName} onChange={(e) => update('purchaserName', e.target.value)} error={errors.purchaserName} />
                      </Field>
                      <Field label="Phone">
                        <FInput type="tel" placeholder="+1 (416) 555-0100" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
                      </Field>
                    </div>
                    <Field label="Email address" required error={errors.email}>
                      <FInput type="email" placeholder="jane@example.com" value={form.email} onChange={(e) => update('email', e.target.value)} error={errors.email} />
                    </Field>
                  </div>
                </div>
                <div>
                  <div style={SECTION_HEAD}>Shipping Address</div>
                  <AddressBlock prefix="shipping" form={form} errors={errors} update={update} />
                </div>
              </div>
              <ContinueButton onClick={handleContinue} label="Continue →" />
            </div>
          )}

          {/* Step 2: Alert Info */}
          {step === 2 && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#171717', margin: '0 0 8px' }}>Medical Alert Info</h2>
              <p style={{ fontSize: '13px', color: '#787878', margin: '0 0 28px', lineHeight: 1.55 }}>Used by our monitoring team and emergency responders.</p>
              {apiError && <div style={{ color: '#e53e3e', fontSize: '13px', padding: '10px 14px', background: '#fff5f5', borderRadius: '8px', border: '1px solid #fed7d7', marginBottom: '20px' }}>{apiError}</div>}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                <div>
                  <div style={SECTION_HEAD}>Device User</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <Field label="Device user's full name" required error={errors.deviceUserName} hint="The person who will wear the device — used for monitoring and emergency response.">
                      <FInput placeholder="Robert Smith" value={form.deviceUserName} onChange={(e) => update('deviceUserName', e.target.value)} error={errors.deviceUserName} />
                    </Field>
                    <Field label="Device user's phone number" required error={errors.deviceUserPhone} hint="Primary contact number for the device user.">
                      <FInput type="tel" placeholder="+1 (416) 555-0100" value={form.deviceUserPhone} onChange={(e) => update('deviceUserPhone', e.target.value)} error={errors.deviceUserPhone} />
                    </Field>
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '9px', marginTop: '12px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={form.deviceUserSameAsPurchaser} style={checkboxStyle}
                      onChange={(e) => { update('deviceUserSameAsPurchaser', e.target.checked); if (e.target.checked) update('deviceUserName', form.purchaserName) }} />
                    <span style={{ fontSize: '13px', color: '#555' }}>Same as account holder</span>
                  </label>
                </div>
                <div>
                  <div style={SECTION_HEAD}>Emergency / Monitoring Address</div>
                  <p style={{ fontSize: '13px', color: '#787878', lineHeight: 1.55, margin: '0 0 14px' }}>Where the device user lives — used by emergency responders if an alert is triggered.</p>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '16px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={form.emergencySameAsShipping} style={checkboxStyle} onChange={(e) => update('emergencySameAsShipping', e.target.checked)} />
                    <span style={{ fontSize: '13px', color: '#555' }}>Same as shipping address</span>
                  </label>
                  {!form.emergencySameAsShipping && <AddressBlock prefix="emergency" form={form} errors={errors} update={update} />}
                </div>
              </div>
              <ContinueButton onClick={handleContinue} label="Continue to Payment →" loading={sessionLoading} />
              <button onClick={() => setStep(1)} style={{ marginTop: '12px', fontSize: '12px', color: '#aaa', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0' }}>← Back</button>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#171717', margin: '0 0 8px' }}>Payment Details</h2>
              <p style={{ fontSize: '13px', color: '#787878', margin: '0 0 24px' }}>Your information is encrypted and secure.</p>
              {apiError ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <p style={{ fontSize: '14px', color: '#555', marginBottom: '16px' }}>{apiError}</p>
                  <button onClick={() => { setApiError(null); setStep(2) }} style={{ fontSize: '13px', color: '#4294d8', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}>← Go back</button>
                </div>
              ) : !clientSecret ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px', gap: '12px', color: '#aaa', fontSize: '14px' }}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
                    <circle cx="10" cy="10" r="8" stroke="#d0d5dd" strokeWidth="2" />
                    <path d="M10 2a8 8 0 0 1 8 8" stroke="#4294d8" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  Loading payment form…
                </div>
              ) : (
                <Elements stripe={stripePromise} options={{ clientSecret, appearance: STRIPE_APPEARANCE }}>
                  <PaymentForm totalDisplay={orderSummary.totalDisplay} onBack={() => setStep(2)} />
                </Elements>
              )}
            </div>
          )}
        </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

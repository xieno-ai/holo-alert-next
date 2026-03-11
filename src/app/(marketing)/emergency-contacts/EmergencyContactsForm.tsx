'use client'

import { useState, useRef, useEffect, type FormEvent } from 'react'

/* ─────────────────────────────────────────────
   HubSpot Configuration — reads from .env.local
   NEXT_PUBLIC_HUBSPOT_PORTAL_ID   (shared across all forms)
   NEXT_PUBLIC_HUBSPOT_EC_FORM_GUID (this form's GUID)
   ───────────────────────────────────────────── */
const HUBSPOT_PORTAL_ID = process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID ?? ''
const HUBSPOT_FORM_GUID = process.env.NEXT_PUBLIC_HUBSPOT_EC_FORM_GUID ?? ''

/* Map form field keys to HubSpot internal field names.
   Update these to match your HubSpot form's field names exactly. */
const HUBSPOT_FIELDS = {
  primaryContactName: 'emergency_contact_1',
  primaryContactPhone: 'emergency_contact_phone__1',
  secondaryContactName: 'emergency_contact_2',
  secondaryContactPhone: 'emergency_contact_phone__2',
  firstName: 'firstname',
  lastName: 'lastname',
  email: 'email',
  streetAddress: 'emergency_dispatch__street_address',
  unitNumber: 'emergency_dispatch__unit_number',
  postalCode: 'emergency_dispatch__postal_code',
  city: 'emergency_dispatch__city',
  country: 'emergency_dispatch__country',
  userPhone: 'medical_alert_users_phone_number',
} as const

/* ─────────────────────────────────────────────
   Country dial codes
   ───────────────────────────────────────────── */
const DIAL_CODES = [
  { code: 'CA', dial: '+1', label: 'CA +1' },
  { code: 'US', dial: '+1', label: 'US +1' },
  { code: 'GB', dial: '+44', label: 'GB +44' },
  { code: 'AU', dial: '+61', label: 'AU +61' },
] as const

/* ─────────────────────────────────────────────
   Types
   ───────────────────────────────────────────── */
interface FormData {
  primaryContactName: string
  primaryContactDialCode: string
  primaryContactPhone: string
  secondaryContactName: string
  secondaryContactDialCode: string
  secondaryContactPhone: string
  firstName: string
  lastName: string
  email: string
  streetAddress: string
  unitNumber: string
  postalCode: string
  city: string
  country: string
  userDialCode: string
  userPhone: string
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

const INITIAL_FORM: FormData = {
  primaryContactName: '',
  primaryContactDialCode: '+1',
  primaryContactPhone: '',
  secondaryContactName: '',
  secondaryContactDialCode: '+1',
  secondaryContactPhone: '',
  firstName: '',
  lastName: '',
  email: '',
  streetAddress: '',
  unitNumber: '',
  postalCode: '',
  city: '',
  country: '',
  userDialCode: '+1',
  userPhone: '',
}

/* ─────────────────────────────────────────────
   Component
   ───────────────────────────────────────────── */
export default function EmergencyContactsForm() {
  const [form, setForm] = useState<FormData>(INITIAL_FORM)
  const [status, setStatus] = useState<FormStatus>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [mounted, setMounted] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => { setMounted(true) }, [])

  function update(field: keyof FormData) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm(prev => ({ ...prev, [field]: e.target.value }))
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus('submitting')
    setErrorMsg('')

    // Validate required fields
    const required: (keyof FormData)[] = [
      'primaryContactName', 'primaryContactPhone',
      'firstName', 'lastName', 'email',
      'streetAddress', 'postalCode', 'city', 'country',
      'userPhone',
    ]
    for (const key of required) {
      if (!form[key].trim()) {
        setStatus('error')
        setErrorMsg('Please fill in all required fields.')
        formRef.current?.querySelector<HTMLInputElement>(`[name="${key}"]`)?.focus()
        return
      }
    }

    // Basic email check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setStatus('error')
      setErrorMsg('Please enter a valid email address.')
      return
    }

    // Build Sanity payload
    const sanityPayload = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      primaryContactName: form.primaryContactName,
      primaryContactPhone: `${form.primaryContactDialCode}${form.primaryContactPhone}`,
      secondaryContactName: form.secondaryContactName,
      secondaryContactPhone: form.secondaryContactPhone ? `${form.secondaryContactDialCode}${form.secondaryContactPhone}` : '',
      streetAddress: form.streetAddress,
      unitNumber: form.unitNumber,
      postalCode: form.postalCode,
      city: form.city,
      country: form.country,
      userPhone: `${form.userDialCode}${form.userPhone}`,
    }

    // Build HubSpot fields payload
    const hubspotFields = [
      { name: HUBSPOT_FIELDS.primaryContactName, value: sanityPayload.primaryContactName },
      { name: HUBSPOT_FIELDS.primaryContactPhone, value: sanityPayload.primaryContactPhone },
      { name: HUBSPOT_FIELDS.secondaryContactName, value: sanityPayload.secondaryContactName },
      { name: HUBSPOT_FIELDS.secondaryContactPhone, value: sanityPayload.secondaryContactPhone },
      { name: HUBSPOT_FIELDS.firstName, value: form.firstName },
      { name: HUBSPOT_FIELDS.lastName, value: form.lastName },
      { name: HUBSPOT_FIELDS.email, value: form.email },
      { name: HUBSPOT_FIELDS.streetAddress, value: form.streetAddress },
      { name: HUBSPOT_FIELDS.unitNumber, value: form.unitNumber },
      { name: HUBSPOT_FIELDS.postalCode, value: form.postalCode },
      { name: HUBSPOT_FIELDS.city, value: form.city },
      { name: HUBSPOT_FIELDS.country, value: form.country },
      { name: HUBSPOT_FIELDS.userPhone, value: sanityPayload.userPhone },
    ]

    try {
      // Submit to HubSpot and Sanity in parallel
      const [hubspotRes] = await Promise.all([
        // HubSpot — only if configured
        HUBSPOT_PORTAL_ID && HUBSPOT_FORM_GUID
          ? fetch(
              `https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_FORM_GUID}`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  fields: hubspotFields,
                  context: {
                    pageUri: window.location.href,
                    pageName: 'Emergency Contacts',
                  },
                }),
              }
            )
          : Promise.resolve({ ok: true } as Response),
        // Sanity — fire and forget, don't block success on it
        fetch('/api/emergency-contacts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sanityPayload),
        }).catch((err) => console.error('[Sanity] Save failed:', err)),
      ])

      if (hubspotRes.ok) {
        setStatus('success')
      } else {
        const body = await hubspotRes.json().catch(() => null)
        console.error('[HubSpot] Submission error:', JSON.stringify(body, null, 2))
        setStatus('error')
        setErrorMsg(body?.message || 'Something went wrong. Please try again or call us.')
      }
    } catch {
      setStatus('error')
      setErrorMsg('Connection error. Please check your internet and try again.')
    }
  }

  /* ─── Success state ─── */
  if (status === 'success') {
    return (
      <div className="min-h-screen bg-white" style={{ paddingTop: '140px' }}>
        <div
          className="mx-auto px-6 py-20 text-center"
          style={{
            maxWidth: '600px',
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}
        >
          {/* Checkmark */}
          <div
            className="mx-auto mb-6 flex items-center justify-center rounded-full"
            style={{ width: '72px', height: '72px', background: '#45b864' }}
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M8 16L13.5 21.5L24 10" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-brand-black mb-3">
            Emergency Contacts Saved
          </h1>
          <p className="text-brand-gray text-base" style={{ lineHeight: 1.5, textWrap: 'pretty' }}>
            Thank you! Your emergency contact information has been received. Our team will use this to set up your monitoring profile.
          </p>

          <a
            href="/"
            className="inline-flex items-center gap-2 mt-8 font-semibold text-brand-blue text-sm hover:underline"
          >
            Return to homepage
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    )
  }

  /* ─── Form state ─── */
  return (
    <div className="min-h-screen bg-white" style={{ paddingTop: '140px' }}>
      {/* Page header */}
      <section style={{ background: '#f2f2f2' }}>
        <div
          className="mx-auto px-6 md:px-10 py-16 md:py-20 text-center"
          style={{
            maxWidth: '720px',
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}
        >
          <div
            className="mx-auto mb-5 flex items-center justify-center rounded-full"
            style={{ width: '56px', height: '56px', background: '#f46036' }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 0v2" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="9" cy="7" r="4" stroke="white" strokeWidth="1.8" />
              <line x1="19" y1="8" x2="19" y2="14" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
              <line x1="16" y1="11" x2="22" y2="11" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-brand-black mb-2">
            Emergency Contact Information
          </h1>
          <p className="text-brand-gray text-sm md:text-base" style={{ lineHeight: 1.5, textWrap: 'pretty' }}>
            Help us keep you safe — provide your emergency contacts and dispatch address so your monitoring is ready from day one.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="mx-auto px-6 md:px-10" style={{ maxWidth: '720px', padding: '48px 24px 80px' }}>
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          noValidate
          className="space-y-12"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s',
          }}
        >
          {/* ── Section 1: Emergency Contacts ── */}
          <fieldset className="space-y-5">
            <SectionLabel icon={<ContactIcon />} title="Emergency Contacts" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField
                label="Primary Contact Name"
                name="primaryContactName"
                placeholder="Jane Smith"
                value={form.primaryContactName}
                onChange={update('primaryContactName')}
                required
              />
              <PhoneField
                label="Primary Contact Phone"
                name="primaryContactPhone"
                dialCode={form.primaryContactDialCode}
                phone={form.primaryContactPhone}
                onDialChange={update('primaryContactDialCode')}
                onPhoneChange={update('primaryContactPhone')}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField
                label="Secondary Contact Name"
                name="secondaryContactName"
                placeholder="Ron Apple"
                value={form.secondaryContactName}
                onChange={update('secondaryContactName')}
              />
              <PhoneField
                label="Secondary Contact Phone"
                name="secondaryContactPhone"
                dialCode={form.secondaryContactDialCode}
                phone={form.secondaryContactPhone}
                onDialChange={update('secondaryContactDialCode')}
                onPhoneChange={update('secondaryContactPhone')}
              />
            </div>
          </fieldset>

          {/* ── Section 2: Your Information ── */}
          <fieldset className="space-y-5">
            <SectionLabel icon={<PersonIcon />} title="Your Information" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField
                label="First Name"
                name="firstName"
                value={form.firstName}
                onChange={update('firstName')}
                required
              />
              <InputField
                label="Last Name"
                name="lastName"
                value={form.lastName}
                onChange={update('lastName')}
                required
              />
            </div>

            <InputField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={update('email')}
              required
            />
          </fieldset>

          {/* ── Section 3: Dispatch Address ── */}
          <fieldset className="space-y-5">
            <SectionLabel icon={<AddressIcon />} title="Emergency Dispatch Address" />

            <div className="grid grid-cols-1 md:grid-cols-[1fr_180px] gap-5">
              <InputField
                label="Street Address"
                name="streetAddress"
                value={form.streetAddress}
                onChange={update('streetAddress')}
                required
              />
              <InputField
                label="Unit Number"
                name="unitNumber"
                placeholder="Optional"
                value={form.unitNumber}
                onChange={update('unitNumber')}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <InputField
                label="Postal Code"
                name="postalCode"
                value={form.postalCode}
                onChange={update('postalCode')}
                required
              />
              <InputField
                label="City"
                name="city"
                value={form.city}
                onChange={update('city')}
                required
              />
              <InputField
                label="Country"
                name="country"
                value={form.country}
                onChange={update('country')}
                required
              />
            </div>
          </fieldset>

          {/* ── Section 4: User Phone ── */}
          <fieldset className="space-y-5">
            <SectionLabel icon={<PhoneIcon />} title="Medical Alert User's Phone" />

            <PhoneField
              label="Phone Number"
              name="userPhone"
              dialCode={form.userDialCode}
              phone={form.userPhone}
              onDialChange={update('userDialCode')}
              onPhoneChange={update('userPhone')}
              required
            />
          </fieldset>

          {/* ── Error message ── */}
          {status === 'error' && errorMsg && (
            <div
              className="flex items-start gap-3 rounded-lg px-5 py-4"
              style={{ background: '#fef2f2', border: '1px solid #fecaca' }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="shrink-0 mt-0.5">
                <circle cx="9" cy="9" r="8" stroke="#ef4444" strokeWidth="1.4" />
                <path d="M9 5.5v4" stroke="#ef4444" strokeWidth="1.4" strokeLinecap="round" />
                <circle cx="9" cy="12.5" r="0.8" fill="#ef4444" />
              </svg>
              <p className="text-[14px] text-red-700" style={{ lineHeight: 1.4 }}>{errorMsg}</p>
            </div>
          )}

          {/* ── Submit ── */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="inline-flex items-center justify-center gap-2 font-semibold text-white text-[15px] rounded-lg cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: '#f46036',
                padding: '15px 40px',
                letterSpacing: '0.02em',
                transition: 'opacity 0.15s ease, transform 0.1s ease',
              }}
              onMouseEnter={(e) => { if (status !== 'submitting') e.currentTarget.style.opacity = '0.9' }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
              onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.98)' }}
              onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
            >
              {status === 'submitting' ? (
                <>
                  <Spinner />
                  Submitting...
                </>
              ) : (
                <>
                  Submit
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Support footer */}
        <div className="text-center mt-12 pb-4">
          <p className="text-brand-gray text-[13px]">
            Need help? Reach us at{' '}
            <a href="mailto:support@holoalert.ca" className="text-brand-blue font-semibold hover:underline">
              support@holoalert.ca
            </a>{' '}
            or call{' '}
            <a href="tel:18884114656" className="text-brand-blue font-semibold hover:underline">
              1.888.411.4656
            </a>
          </p>
        </div>
      </section>
    </div>
  )
}


/* ═══════════════════════════════════════════════
   Sub-components
   ═══════════════════════════════════════════════ */

function SectionLabel({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-3 pb-1">
      <div
        className="flex items-center justify-center rounded-full shrink-0"
        style={{ width: '32px', height: '32px', background: '#4294d8', color: '#fff' }}
      >
        {icon}
      </div>
      <h2 className="text-lg font-semibold text-brand-black tracking-tight">{title}</h2>
    </div>
  )
}

function InputField({
  label, name, type = 'text', placeholder, value, onChange, required,
}: {
  label: string
  name: string
  type?: string
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-[13px] font-medium text-brand-black mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-lg bg-white text-brand-black text-[15px] placeholder:text-gray-400 outline-none"
        style={{
          padding: '12px 14px',
          border: '1px solid #d0d5dd',
          transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = '#4294d8'
          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(66,148,216,0.12)'
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = '#d0d5dd'
          e.currentTarget.style.boxShadow = 'none'
        }}
      />
    </div>
  )
}

function PhoneField({
  label, name, dialCode, phone, onDialChange, onPhoneChange, required,
}: {
  label: string
  name: string
  dialCode: string
  phone: string
  onDialChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  onPhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-[13px] font-medium text-brand-black mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className="flex">
        <select
          value={dialCode}
          onChange={onDialChange}
          className="rounded-l-lg bg-gray-50 text-brand-black text-[13px] font-medium outline-none cursor-pointer appearance-none"
          style={{
            padding: '12px 10px 12px 12px',
            border: '1px solid #d0d5dd',
            borderRight: 'none',
            minWidth: '72px',
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23787878' stroke-width='1.4' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 8px center',
            paddingRight: '24px',
          }}
        >
          {DIAL_CODES.map(dc => (
            <option key={dc.code} value={dc.dial}>{dc.label}</option>
          ))}
        </select>
        <input
          id={name}
          name={name}
          type="tel"
          placeholder="+1"
          value={phone}
          onChange={onPhoneChange}
          required={required}
          className="flex-1 rounded-r-lg bg-white text-brand-black text-[15px] placeholder:text-gray-400 outline-none min-w-0"
          style={{
            padding: '12px 14px',
            border: '1px solid #d0d5dd',
            transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#4294d8'
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(66,148,216,0.12)'
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '#d0d5dd'
            e.currentTarget.style.boxShadow = 'none'
          }}
        />
      </div>
    </div>
  )
}

function Spinner() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="animate-spin">
      <circle cx="9" cy="9" r="7" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
      <path d="M9 2a7 7 0 015.5 2.7" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}


/* ─── SVG Icons ─── */

function ContactIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M10.5 14v-1.5a3 3 0 00-3-3h-3a3 3 0 00-3 3V14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="7" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M13 6v4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M11 8h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

function PersonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.3" />
      <path d="M2.5 14v-1a5.5 5.5 0 0111 0v1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

function AddressIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2 6.5L8 2l6 4.5V14H2V6.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <rect x="6" y="9" width="4" height="5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3.5 2.5C3.5 2.5 4.3 2 5 2.5L6.5 4.5c0 0 0 1.2-.7 1.5-.3.2-.3.8.8 1.8 1 1 1.5 1 1.8.8.7-.5 1.5-.5 1.5-.5l2 1.5c.5.8 0 1.5 0 1.5-1 2-4 2.5-6.5 0S3.5 5.5 3.5 2.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  )
}

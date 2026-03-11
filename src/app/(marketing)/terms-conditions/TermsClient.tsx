'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

const sections = [
  { id: 'sms', label: '0. SMS Terms of Service' },
  { id: 'agreement', label: '1. Agreement to Terms' },
  { id: 'services', label: '2. Description of Services' },
  { id: 'eligibility', label: '3. Eligibility & User Responsibilities' },
  { id: 'system', label: '4. System Operation & Limitations' },
  { id: 'device', label: '5. Device Use & Maintenance' },
  { id: 'emergency', label: '6. Emergency Response Process' },
  { id: 'billing', label: '7. Billing & Payment Terms' },
  { id: 'cancellation', label: '8. Cancellation & Refunds' },
  { id: 'ownership', label: '9. Device Ownership & Return' },
  { id: 'warranties', label: '10. Disclaimer of Warranties' },
  { id: 'liability', label: '11. Limitation of Liability' },
  { id: 'privacy', label: '12. Privacy & Data Protection' },
  { id: 'false-alarms', label: '13. False Alarms' },
  { id: 'termination', label: '14. Termination of Service' },
  { id: 'force-majeure', label: '15. Force Majeure' },
  { id: 'assignment', label: '16. Assignment & Transfer' },
  { id: 'governing', label: '17. Governing Law & Disputes' },
  { id: 'contact', label: '18. Contact Information' },
  { id: 'final', label: '19. Final Provisions' },
]

export default function TermsClient() {
  const [activeId, setActiveId] = useState<string>('')
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const headings = document.querySelectorAll('[data-section]')

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-20% 0% -70% 0%', threshold: 0 }
    )

    headings.forEach((el) => observerRef.current?.observe(el))
    return () => observerRef.current?.disconnect()
  }, [])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      const offset = 120
      const top = el.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  return (
    <div style={{ fontFamily: 'Instrument Sans, sans-serif', background: '#fff' }}>

      {/* Page header strip */}
      <div style={{ borderBottom: '1px solid #e8e8e8' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>

          {/* Breadcrumb */}
          <nav
            className="flex items-center gap-2 text-[13px] text-[#787878]"
            style={{ paddingTop: '88px', paddingBottom: '20px' }}
          >
            <Link href="/" className="hover:text-[#171717] transition-colors">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-label="Home">
                <path
                  d="M1.5 6.5L7 2l5.5 4.5V12.5a.5.5 0 0 1-.5.5H9.5V9.5h-5V13H2a.5.5 0 0 1-.5-.5V6.5z"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            <svg width="6" height="10" viewBox="0 0 6 10" fill="none" aria-hidden="true">
              <path
                d="M1 1l4 4-4 4"
                stroke="#d9d9d9"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Terms &amp; Conditions</span>
          </nav>

          {/* Title block */}
          <div style={{ paddingBottom: '40px', maxWidth: '680px' }}>
            <h1
              className="font-bold text-[#171717] leading-[1.05] tracking-tight"
              style={{ fontSize: 'clamp(32px, 5vw, 52px)', marginBottom: '16px' }}
            >
              Terms &amp; Conditions
            </h1>
            <div className="flex flex-wrap items-center gap-3" style={{ marginBottom: '12px' }}>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: '#4294d8',
                  background: '#eaf4fc',
                  padding: '4px 10px',
                  borderRadius: '4px',
                }}
              >
                Effective: December 1, 2023
              </span>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: '#787878',
                  background: '#f5f5f5',
                  padding: '4px 10px',
                  borderRadius: '4px',
                }}
              >
                Last Updated: January 1, 2026
              </span>
            </div>
            <p style={{ color: '#787878', fontSize: '15px', lineHeight: 1.6 }}>
              This agreement governs your use of Holo Alert emergency monitoring services. Please read carefully before activating or using any Holo Alert product.
            </p>
          </div>
        </div>
      </div>

      {/* Body: sidebar TOC + content */}
      <div
        style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}
        className="flex gap-16 items-start"
      >

        {/* Sticky TOC — desktop only */}
        <aside
          className="hidden lg:block flex-shrink-0"
          style={{
            width: '240px',
            position: 'sticky',
            top: '108px',
            paddingTop: '48px',
            paddingBottom: '48px',
            alignSelf: 'flex-start',
          }}
        >
          <p
            style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#787878',
              marginBottom: '16px',
            }}
          >
            On this page
          </p>
          <nav className="flex flex-col gap-0">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                style={{
                  display: 'block',
                  textAlign: 'left',
                  padding: '5px 10px',
                  color: activeId === s.id ? '#4294d8' : '#787878',
                  fontWeight: activeId === s.id ? 600 : 400,
                  fontSize: '13px',
                  lineHeight: 1.4,
                  background: 'none',
                  border: 'none',
                  borderLeft: `2px solid ${activeId === s.id ? '#4294d8' : '#e8e8e8'}`,
                  cursor: 'pointer',
                  transition: 'color 0.15s, border-color 0.15s',
                  width: '100%',
                }}
              >
                {s.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <article style={{ flex: 1, minWidth: 0, paddingTop: '48px', paddingBottom: '96px' }}>

          <Section id="sms" title="0. SMS Terms of Service">
            <p>By opting in to SMS communications through a web form, support request, phone conversation, or other consent method, you agree to receive text messages from Holo Technologies Inc. (&ldquo;Holo Alert&rdquo;). Message frequency may vary based on communication preferences and service needs.</p>
            <p>Types of messages we may send:</p>
            <SubHeading>Service &amp; Transactional Messages (sent based on service use):</SubHeading>
            <ul>
              <li>appointment confirmations and reminders</li>
              <li>order and shipping notifications</li>
              <li>billing notices, payment reminders, past due notices</li>
              <li>device setup assistance, troubleshooting, service instructions</li>
              <li>emergency profile updates and device status alerts</li>
            </ul>
            <SubHeading>One-to-One Messages (human-initiated):</SubHeading>
            <ul>
              <li>responses to customer inquiries</li>
              <li>account support messages from customer service agents</li>
              <li>follow-up regarding an active request</li>
            </ul>
            <SubHeading>Promotional Messages (optional and require explicit consent):</SubHeading>
            <ul>
              <li>marketing offers, seasonal promotions, savings opportunities</li>
              <li>product announcements and upgrades</li>
              <li>program or campaign-related messaging</li>
            </ul>
            <p>Promotional SMS are only sent when you provide explicit opt-in consent and can be opted into or out of separately from service messages.</p>
            <InfoBox>
              <p><strong>Opt-out:</strong> Reply STOP at any time.</p>
              <p><strong>Help:</strong> Reply HELP or contact <a href="mailto:support@holoalert.ca" style={{ color: '#4294d8' }}>support@holoalert.ca</a>.</p>
              <p><strong>Charges:</strong> Standard message and data rates may apply.</p>
            </InfoBox>
            <p>SMS consent is not shared with third parties for their own marketing purposes. See our Privacy Policy and Terms of Service.</p>
          </Section>

          <Section id="agreement" title="1. Agreement to Terms & Acceptance">
            <p>This Service Terms and Conditions Agreement (the &ldquo;Agreement&rdquo;) is a legally binding contract between you (&ldquo;Customer,&rdquo; &ldquo;User,&rdquo; or &ldquo;You&rdquo;) and Holo Technologies Inc. (&ldquo;Company,&rdquo; &ldquo;Holo Alert,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;). By accessing or using our website (www.holoalert.ca), subscribing to, activating, using, or continuing to use any Holo Alert emergency monitoring system (&ldquo;Product&rdquo;) or services associated with it (collectively, the &ldquo;Services&rdquo;), you acknowledge that you have read, understood, and agreed to be bound by this Agreement and our Privacy Policy.</p>
            <p>The Customer acknowledges that the Service may be provided, in whole or in part, by Holo Technologies Inc., its affiliates, contractors, monitoring partners, or any successor entity.</p>
            <p>If you do not agree to the terms set forth herein, you must immediately discontinue use of the Product and Service, do not use our website, and notify Holo Technologies Inc. of your intent to cancel in accordance with the cancellation policies outlined in this Agreement (Section 8).</p>
            <p>We reserve the right to modify this Agreement at any time. Changes become effective upon posting on our website or upon notification to you. Your continued use of the Services after any updates signifies your acceptance of the revised terms. Customers are encouraged to periodically review these Terms.</p>
          </Section>

          <Section id="services" title="2. Description of Services">
            <p>Holo Alert provides personal emergency response systems (PERS), including wearable devices (&ldquo;Product&rdquo;) equipped with GPS tracking and automatic fall detection functionality, and associated 24/7 monitoring services (&ldquo;Service&rdquo;). The system operates on a cellular network. The Service enables Customers to connect with a central monitoring station of our choosing, which is responsible for attempting to dispatch emergency response personnel in case of medical distress or emergency situations reported via the Product.</p>
            <p>Our Services are designed to enhance safety and peace of mind. However, they do not replace 911, emergency medical services (EMS), or professional medical care. You should always seek immediate medical attention or call 911 directly when needed.</p>
            <p>Holo Technologies Inc. strives to provide a reliable Service but does not guarantee or warrant that emergency responders will always be reached or dispatched in a timely manner or at all. Response times and effectiveness depend on factors outside our control, including cellular network availability, proper Product use, and third-party responder protocols.</p>
          </Section>

          <Section id="eligibility" title="3. Eligibility & User Responsibilities">
            <p>To use our Services, you must:</p>
            <ul>
              <li>Be at least 18 years old (or have a legal guardian&apos;s consent).</li>
              <li>Provide accurate, complete, and up-to-date information during registration and maintain the accuracy of this information (including billing and emergency contacts).</li>
              <li>Use the Services only as intended and in compliance with applicable Canadian laws.</li>
            </ul>
            <p>You agree not to:</p>
            <ul>
              <li>Use our Services for fraudulent, illegal, or abusive purposes.</li>
              <li>Modify, reverse-engineer, or interfere with the Holo Alert website, Product, or Services.</li>
              <li>Submit false emergency alerts or misuse the 24/7 monitoring service.</li>
            </ul>
          </Section>

          <Section id="system" title="4. System Operation, Limitations & Network Coverage">
            <SubHeading>Location Services</SubHeading>
            <p>Holo Alert uses WiFi and cellular triangulation, as well as GPS satellite signals, to determine your location. Location accuracy is not guaranteed and can be impacted by factors such as network availability, signal strength, being indoors, tall buildings, tunnels, dense tree cover, poor weather, and other environmental conditions.</p>
            <SubHeading>Automatic Fall Detection</SubHeading>
            <p>This feature is designed to detect some sudden falls but is not guaranteed to detect 100% of falls. Gradual slides, slow collapses, or certain types of movements may not trigger an alert. Conversely, high-impact movements, sudden stops, or other non-fall movements may generate false alarms. Customers must always manually press the SOS/emergency button if able to do so in an emergency.</p>
            <SubHeading>Network Coverage</SubHeading>
            <p>The Service relies on cellular networks and is available nationwide in Canada, but coverage and signal strength vary. We are not liable for service disruptions due to network outages, weak signals, interference, equipment malfunctions, or other factors affecting cellular service.</p>
            <SubHeading>General Limitations</SubHeading>
            <p>The Customer acknowledges the inherent limitations of the Product and Service. The Company is not liable for any failure of GPS, automatic fall detection, network connectivity, or any other aspect of the Product or Service to operate as expected.</p>
          </Section>

          <Section id="device" title="5. Device Use & Maintenance">
            <p>To ensure reliable performance, you agree to:</p>
            <ul>
              <li>Charge your Product regularly as per the user manual.</li>
              <li>Wear your Product properly to maximize fall detection accuracy (if applicable).</li>
              <li>Test your Product periodically (e.g., monthly) to confirm functionality and connection to the monitoring center.</li>
              <li>Keep your emergency contact information accurate and updated with us.</li>
            </ul>
            <p>Holo Alert is not responsible for issues arising from:</p>
            <ul>
              <li>Failure to charge, wear, or test the Product correctly.</li>
              <li>User misuse, tampering, or unauthorized modifications.</li>
              <li>Damage due to water exposure beyond specified resistance levels (e.g., IP67).</li>
              <li>Failure to maintain accurate contact information.</li>
            </ul>
          </Section>

          <Section id="emergency" title="6. Emergency Response Process & Limitations">
            <p>Our 24/7 monitoring team will attempt to respond when the SOS button is pressed or an automatic fall detection alert is received (if enabled). However, Holo Alert:</p>
            <ul>
              <li><strong>Does not replace 911:</strong> Always call 911 directly if possible in an emergency.</li>
              <li><strong>Cannot guarantee response:</strong> We cannot guarantee connection or dispatch if network connectivity is disrupted or unavailable.</li>
              <li><strong>Relies on accurate information:</strong> We are not responsible for delays or failures caused by incorrect or outdated emergency contact or location information provided by you.</li>
              <li><strong>Is not liable for responder actions:</strong> We are not responsible for the timeliness or effectiveness of actions taken by third-party emergency responders (e.g., EMS, police, fire department).</li>
            </ul>
          </Section>

          <Section id="billing" title="7. Billing, Payment Terms, Service Term, and Financial Agreements">
            <SubHeading>Payment Obligation</SubHeading>
            <p>Customers must make all payments in full and on time according to their selected service plan. An active, paid subscription is required for the monitoring Service.</p>
            <SubHeading>Billing Commencement</SubHeading>
            <p>Charges for service begin immediately upon signing this Agreement, regardless of whether the Customer has activated or used the Product, unless Holo Technologies Inc. fails to deliver the Product within thirty (30) days of the agreed shipping date (in which case the Customer may cancel and receive a full refund of payments made).</p>
            <SubHeading>Billing Methods &amp; Assignment</SubHeading>
            <p>Payments may be processed, administered, or collected by Holo Technologies Inc., or by an affiliate, third-party financing company, billing administrator, or successor entity. The Customer acknowledges and agrees that Holo Technologies Inc. may assign or transfer billing rights, payment obligations, or account administration in connection with financing arrangements, affiliate relationships, mergers, acquisitions, portfolio or account sales, or the sale of all or substantially all of the Company&apos;s assets or business operations, without notice to or consent from the Customer.</p>
            <SubHeading>Third-Party Financing</SubHeading>
            <p>If payments are assigned to a third-party financing company, the Customer is fully responsible for fulfilling all financial obligations under that separate agreement. Holo Technologies Inc. bears no liability for the administration or enforcement of such obligations following the transfer. Payment structures, fees, and penalties from third-party financiers are separate from those of Holo Technologies Inc.</p>
            <SubHeading>Automatic Billing/Renewal</SubHeading>
            <ul>
              <li><strong>Direct Billing:</strong> If Holo Technologies Inc. bills you directly throughout your initial term, your service will automatically renew and be billed on a month-to-month basis after the term ends, unless you provide written cancellation notice at least thirty (30) days prior to the desired termination date.</li>
              <li><strong>Third-Party Financed Term:</strong> If your initial term was financed through a third party, you remain responsible for fulfilling payments to that company. Upon completion of that financing term, Holo Technologies Inc. will automatically begin billing you directly for continued service on a month-to-month basis to prevent service interruption, unless you provide written cancellation notice to Holo Technologies Inc. at least thirty (30) days prior to the end of your financing term.</li>
            </ul>
            <SubHeading>Payment Failure</SubHeading>
            <p>We reserve the right to suspend or terminate service if payments are not received on time. No claims shall be made against Holo Technologies Inc. for service interruptions due to non-payment.</p>
            <SubHeading>Pricing Adjustments</SubHeading>
            <p>We reserve the right to adjust pricing with prior notice.</p>
            <SubHeading>Late Fees</SubHeading>
            <p>While not currently imposed, Holo Technologies Inc. reserves the right to introduce late payment fees in the future with advance written notice.</p>
          </Section>

          <Section id="cancellation" title="8. Cancellation Policy, Returns & Refunds">
            <SubHeading>Initial Cancellation Window</SubHeading>
            <p>Customers may cancel their purchase, service, or contract without penalty within ten (10) days from the date of signing the agreement or from the date they receive the Product, whichever occurs later. Cancellation requests must be submitted in writing to Holo Technologies Inc. (contact details in Section 18). A full refund will be issued for payments made, provided any received Product is returned in its original condition per return instructions.</p>
            <SubHeading>Cancellation After Initial Window</SubHeading>
            <p>If a Customer cancels after the ten (10) day period but before the end of their agreed service term, an early cancellation fee will apply equal to CAD $20 multiplied by the number of full months remaining in the service agreement at the time written notice of cancellation is received.</p>
            <SubHeading>Third-Party Financing Obligations</SubHeading>
            <p>Cancellation of service with Holo Technologies Inc. does not automatically cancel obligations under a third-party financing agreement. The Customer remains bound by the policies and financial obligations set forth by the third-party finance company.</p>
            <SubHeading>Refunds</SubHeading>
            <p>Except for cancellations within the initial 10-day window, subscription and service fees are generally non-refundable, except where required by law. Except as required by law, no refunds shall be issued for amounts paid beyond the applicable cancellation period.</p>
          </Section>

          <Section id="ownership" title="9. Device Ownership (Rental Only) and Equipment Return">
            <SubHeading>Rental Basis</SubHeading>
            <p>All Products provided as part of the Service remain the property of Holo Technologies Inc. and are provided on a rental basis only. The Customer acquires no ownership interest in the equipment.</p>
            <SubHeading>Customer Responsibility</SubHeading>
            <p>The Customer must use the Product in accordance with manufacturer guidelines, regularly test the device to ensure proper operation, and is responsible for any loss, theft, or damage beyond reasonable wear and tear.</p>
            <SubHeading>Return of Equipment</SubHeading>
            <p>Upon cancellation or termination of the Service, all equipment must be returned in good working condition, subject to reasonable wear and tear, within the timeframe specified by Holo Technologies Inc. If equipment is not returned or is returned damaged, the Customer authorizes Holo Technologies Inc. or its assignee to charge the applicable replacement and reasonable administrative costs to the Customer&apos;s account. Failure to return may also result in the balance being referred to a collections agency.</p>
          </Section>

          <Section id="warranties" title="10. Disclaimer of Warranties">
            <SubHeading>As Is Basis</SubHeading>
            <p className="uppercase text-[13px] font-semibold leading-relaxed" style={{ color: '#171717', letterSpacing: '0.01em' }}>
              The Product and Service are provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis. Holo Technologies Inc. expressly disclaims any and all warranties, express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, and non-infringement.
            </p>
            <SubHeading>Service Guarantee</SubHeading>
            <p>We do not guarantee uninterrupted, error-free, or completely secure operation of the Product or Service. Customer acknowledges that reliability can be impacted by factors outside our control (network issues, interference, third-party services, etc.) and that such occurrences are outside of Holo Technologies Inc.&apos;s control.</p>
          </Section>

          <Section id="liability" title="11. Company is Not an Insurer & Limitation of Liability">
            <SubHeading>Not an Insurer</SubHeading>
            <p>Customer acknowledges and agrees that Holo Technologies Inc. is not an insurer and does not provide insurance coverage for personal injury, loss of life, or property damage. The monitoring service fee is based solely on the provision of emergency monitoring services and does not constitute an insurance premium. Customer assumes all risks associated with medical emergencies and the use (or inability to use) the Product and Service.</p>
            <SubHeading>Limitation of Liability</SubHeading>
            <p className="uppercase text-[13px] font-semibold leading-relaxed" style={{ color: '#171717', letterSpacing: '0.01em' }}>
              To the fullest extent permitted by applicable law, Holo Technologies Inc., its affiliates, officers, directors, employees, and agents shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages, including but not limited to death, personal injury, property loss, or damages arising from the use, inability to use, or failure of the Product or Service to perform as expected, even if advised of the possibility of such damages. This includes liability arising from service disruptions, network failures, inaccurate location information, failure of fall detection, delays in response, or actions/inactions of third-party responders.
            </p>
            <SubHeading>Maximum Liability</SubHeading>
            <p className="uppercase text-[13px] font-semibold leading-relaxed" style={{ color: '#171717', letterSpacing: '0.01em' }}>
              If Holo Technologies Inc. is found liable for any claims arising out of this Agreement or the use/failure of the Product or Service, its total aggregate liability shall not exceed one thousand Canadian dollars (CAD $1,000).
            </p>
            <SubHeading>Indemnification</SubHeading>
            <p>Customer agrees to indemnify and hold harmless Holo Technologies Inc., its affiliates, officers, directors, employees, agents, and monitoring center providers from any and all claims, damages, losses, liabilities, costs, and expenses (including reasonable attorney fees) arising from or related to the Customer&apos;s use or misuse of the Product or Service, breach of this Agreement, false alarms, or failure to provide accurate information.</p>
            <SubHeading>Jurisdictional Exceptions</SubHeading>
            <p>If you reside in Quebec or another jurisdiction where certain liability exclusions or limitations are not permitted, the limitations or exclusions may not apply to you. In such cases, our liability shall be limited to the greatest extent permitted by the applicable law of that jurisdiction.</p>
          </Section>

          <Section id="privacy" title="12. Privacy & Data Protection">
            <p>Holo Alert is committed to protecting your personal data. We collect, store, and process personal and potentially sensitive medical information necessary for providing the Service and facilitating emergency response. This may include name, contact details, location data, medical conditions, medications, and emergency contacts.</p>
            <SubHeading>Data Use &amp; Sharing</SubHeading>
            <p>Your data may be shared with the central monitoring station, emergency responders (like 911, EMS), monitoring partners, and essential third-party service providers as required to deliver the Service.</p>
            <SubHeading>Security</SubHeading>
            <p>We take reasonable measures to protect your information, but no data transmission or storage is 100% secure. You acknowledge this inherent risk.</p>
            <SubHeading>Consent</SubHeading>
            <p>By using the Service, you consent to the collection, use, storage, and sharing of your personal information as outlined here and in our full Privacy Policy, including processing or storage outside of Canada.</p>
            <SubHeading>No Sale for Marketing</SubHeading>
            <p>We do not sell your personal data to third parties for marketing purposes.</p>
            <SubHeading>Data Storage Location</SubHeading>
            <p>Your data may be stored and processed in Canada and/or other jurisdictions, including the United States. Data protection laws may differ in these locations. You consent to this potential cross-border transfer and processing. We retain records of SMS consent, including timestamp, source, and method of capture, for compliance purposes.</p>
            <SubHeading>Detailed Policy</SubHeading>
            <p>Our Privacy Policy provides more details on data handling practices and your rights regarding your personal information.</p>
            <SubHeading>Anti-Spam</SubHeading>
            <p>Holo Technologies Inc. complies with Canada&apos;s Anti-Spam Legislation (CASL). We do not send commercial electronic messages without valid consent and include clear unsubscribe options in all marketing communications.</p>
          </Section>

          <Section id="false-alarms" title="13. False Alarms & Customer Responsibility">
            <p>Customers acknowledge that emergency responders (e.g., police, fire departments) may impose fines, penalties, or fees for false alarms triggered by the Product. The Customer is solely responsible for paying any such fines or fees and agrees to indemnify and hold Holo Technologies Inc. harmless from any financial liability arising from false alarms. Customers agree to use the Product responsibly to minimize false alarms and to maintain accurate and up-to-date emergency contact information with us.</p>
          </Section>

          <Section id="termination" title="14. Termination of Service">
            <SubHeading>Termination by Company</SubHeading>
            <p>We may suspend or terminate your access to our Services if:</p>
            <ul>
              <li>You violate this Agreement.</li>
              <li>Payments are significantly overdue.</li>
              <li>You misuse the Service or Product.</li>
              <li>The Service is discontinued (we will provide reasonable notice if feasible).</li>
            </ul>
            <SubHeading>Termination by Customer</SubHeading>
            <p>You may cancel your subscription at any time by providing written notice as outlined in Section 7 and Section 8, subject to the applicable cancellation terms and potential fees.</p>
          </Section>

          <Section id="force-majeure" title="15. Force Majeure">
            <p>Holo Technologies Inc. shall not be liable for any failure or delay in providing the Service due to causes beyond its reasonable control. Such causes include, but are not limited to, acts of God, natural disasters, pandemics, epidemics, public health emergencies, war, terrorism, cyber-attacks, labour disputes, government actions or orders, power outages, telecommunications or network failures (including cellular network disruptions), equipment malfunctions affecting large areas, or failure of third-party providers essential to the Service. Such events do not typically entitle the Customer to a refund or credit.</p>
          </Section>

          <Section id="assignment" title="16. Assignment and Transfer">
            <p>Holo Technologies Inc. may assign or transfer this Agreement, in whole or in part, including the Customer account and service obligations, without notice to or consent from the Customer, to an affiliate, third-party service provider, financing partner, or any purchaser or successor in connection with a merger, acquisition, reorganization, portfolio or account sale, or sale of all or substantially all of the Company&apos;s assets or business. Any assignee or successor shall be entitled to all rights and protections under this Agreement and shall not be liable for any act or omission occurring prior to the effective date of the assignment. The Customer&apos;s obligations under this Agreement shall continue in full force and effect following any assignment or transfer.</p>
          </Section>

          <Section id="governing" title="17. Governing Law & Dispute Resolution">
            <p>This Agreement shall be governed by and construed in accordance with the laws of the Province of Alberta and the federal laws of Canada applicable therein, without regard to conflict of law principles.</p>
            <SubHeading>Negotiation</SubHeading>
            <p>We encourage you to contact us first to resolve any disputes informally.</p>
            <SubHeading>Arbitration</SubHeading>
            <p>Unless prohibited by applicable provincial consumer protection laws in your jurisdiction of residence, any dispute, claim, or controversy arising out of or relating to this Agreement, the Product, or the Service shall be resolved through final and binding arbitration administered under the rules of an established Canadian arbitration body, conducted in Alberta.</p>
            <SubHeading>Class Action Waiver</SubHeading>
            <p>Customers agree that any disputes shall be resolved on an individual basis. Customers expressly waive the right to participate in any class action lawsuit or class-wide arbitration against Holo Technologies Inc.</p>
            <SubHeading>Exceptions</SubHeading>
            <p>If arbitration is deemed unenforceable or is restricted by applicable consumer protection laws (e.g., potentially in Quebec), the parties agree that disputes shall be brought exclusively in the courts of competent jurisdiction in Alberta, Canada, unless the laws of your province of residence mandate jurisdiction elsewhere. You may retain rights granted under your specific provincial consumer protection laws.</p>
          </Section>

          <Section id="contact" title="18. Contact Information">
            <p>For questions, support, or required notices (including cancellation):</p>
            <ContactCard />
          </Section>

          <Section id="final" title="19. Final Provisions">
            <ul>
              <li><strong>Severability:</strong> If any part of this Agreement is deemed invalid or unenforceable, the remaining provisions shall remain in full force and effect.</li>
              <li><strong>Waiver:</strong> Our failure to enforce any right or provision of this Agreement will not be considered a waiver of those rights.</li>
              <li><strong>Headings:</strong> Headings are for convenience only and do not affect the interpretation of this Agreement.</li>
              <li><strong>Entire Agreement:</strong> This Agreement, along with the Privacy Policy and any specific purchase order or financing agreement (if applicable), constitutes the entire agreement between you and Holo Technologies Inc. regarding the Services and supersedes any prior agreements or understandings.</li>
            </ul>

            {/* Closing acknowledgement */}
            <div
              style={{
                marginTop: '40px',
                padding: '24px 28px',
                background: '#f7f9fb',
                borderRadius: '8px',
                borderLeft: '4px solid #4294d8',
              }}
            >
              <p style={{ margin: 0, color: '#171717', fontWeight: 500, fontSize: '14px', lineHeight: 1.65 }}>
                By using Holo Alert Services, you acknowledge that you have read, understood, and agree to be legally bound by these Terms and Conditions.
              </p>
            </div>
          </Section>

        </article>
      </div>

      <style>{`
        .terms-section {
          padding-bottom: 48px;
          margin-bottom: 48px;
          border-bottom: 1px solid #f0f0f0;
        }
        .terms-section:last-child {
          border-bottom: none;
        }
        .terms-section h2 {
          font-size: 20px;
          font-weight: 700;
          color: #171717;
          margin-bottom: 20px;
          padding-left: 14px;
          border-left: 3px solid #4294d8;
          line-height: 1.3;
        }
        .terms-section h3 {
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #4294d8;
          margin-top: 24px;
          margin-bottom: 8px;
        }
        .terms-section p {
          color: #444;
          font-size: 15px;
          line-height: 1.7;
          margin-bottom: 12px;
        }
        .terms-section ul {
          list-style: none;
          padding: 0;
          margin: 0 0 16px 0;
        }
        .terms-section ul li {
          position: relative;
          padding-left: 18px;
          color: #444;
          font-size: 15px;
          line-height: 1.65;
          margin-bottom: 6px;
        }
        .terms-section ul li::before {
          content: '';
          position: absolute;
          left: 0;
          top: 10px;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #4294d8;
        }
        .terms-info-box {
          background: #eaf4fc;
          border-radius: 8px;
          padding: 16px 20px;
          margin: 16px 0;
        }
        .terms-info-box p {
          margin-bottom: 4px !important;
          font-size: 14px !important;
          color: #2d6fa3 !important;
        }
        .terms-info-box p:last-child {
          margin-bottom: 0 !important;
        }
      `}</style>
    </div>
  )
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} data-section className="terms-section">
      <h2>{title}</h2>
      {children}
    </section>
  )
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return <h3>{children}</h3>
}

function InfoBox({ children }: { children: React.ReactNode }) {
  return <div className="terms-info-box">{children}</div>
}

function ContactCard() {
  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        gap: '6px',
        marginTop: '12px',
        padding: '20px 24px',
        background: '#f7f9fb',
        borderRadius: '8px',
        border: '1px solid #e8e8e8',
      }}
    >
      <p style={{ margin: 0, fontWeight: 700, color: '#171717', fontSize: '15px' }}>
        Holo Technologies Inc.
      </p>
      <p style={{ margin: 0, color: '#555', fontSize: '14px', lineHeight: 1.5 }}>
        Suite 3400, 10180 101 St NW<br />
        Edmonton, AB T5J 3S4
      </p>
      <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <a
          href="tel:18884114656"
          style={{ color: '#4294d8', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}
        >
          1-888-411-4656
        </a>
        <a
          href="mailto:support@holoalert.ca"
          style={{ color: '#4294d8', fontSize: '14px', textDecoration: 'none' }}
        >
          support@holoalert.ca
        </a>
        <a
          href="https://www.holoalert.ca"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#787878', fontSize: '14px', textDecoration: 'none' }}
        >
          www.holoalert.ca
        </a>
      </div>
    </div>
  )
}

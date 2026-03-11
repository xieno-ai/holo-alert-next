/**
 * One-time script to seed Terms & Conditions and Privacy Policy content into Sanity.
 * Run with: npx tsx scripts/seed-legal-pages.ts
 */
import { createClient } from '@sanity/client'
import 'dotenv/config'

const client = createClient({
  projectId: '1n5hrbnv',
  dataset: 'production',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-07-11',
  useCdn: false,
})

let keyCounter = 0
const k = () => `blk${++keyCounter}`

function h2(text: string) {
  const key = k()
  return { _type: 'block', _key: key, style: 'h2', markDefs: [], children: [{ _type: 'span', _key: `${key}a`, text, marks: [] }] }
}

function h3(text: string) {
  const key = k()
  return { _type: 'block', _key: key, style: 'h3', markDefs: [], children: [{ _type: 'span', _key: `${key}a`, text, marks: [] }] }
}

function p(text: string) {
  const key = k()
  return { _type: 'block', _key: key, style: 'normal', markDefs: [], children: [{ _type: 'span', _key: `${key}a`, text, marks: [] }] }
}

function bullet(text: string) {
  const key = k()
  return { _type: 'block', _key: key, style: 'normal', listItem: 'bullet', level: 1, markDefs: [], children: [{ _type: 'span', _key: `${key}a`, text, marks: [] }] }
}

// Paragraph with inline bold spans: [text, bold?, text, bold?, ...]
function pb(...parts: Array<string | [string]>) {
  const key = k()
  const children = parts.map((part, i) => {
    if (Array.isArray(part)) {
      return { _type: 'span', _key: `${key}c${i}`, text: part[0], marks: ['strong'] }
    }
    return { _type: 'span', _key: `${key}c${i}`, text: part, marks: [] }
  })
  return { _type: 'block', _key: key, style: 'normal', markDefs: [], children }
}

// Bullet with inline bold
function bb(...parts: Array<string | [string]>) {
  const key = k()
  const children = parts.map((part, i) => {
    if (Array.isArray(part)) {
      return { _type: 'span', _key: `${key}c${i}`, text: part[0], marks: ['strong'] }
    }
    return { _type: 'span', _key: `${key}c${i}`, text: part, marks: [] }
  })
  return { _type: 'block', _key: key, style: 'normal', listItem: 'bullet', level: 1, markDefs: [], children }
}

// ─── TERMS & CONDITIONS ──────────────────────────────────────────────────────

const termsContent = [
  h2('0. SMS Terms of Service'),
  p('By opting in to SMS communications through a web form, support request, phone conversation, or other consent method, you agree to receive text messages from Holo Technologies Inc. ("Holo Alert"). Message frequency may vary based on communication preferences and service needs.'),
  p('Types of messages we may send:'),
  h3('Service & Transactional Messages (sent based on service use):'),
  bullet('appointment confirmations and reminders'),
  bullet('order and shipping notifications'),
  bullet('billing notices, payment reminders, past due notices'),
  bullet('device setup assistance, troubleshooting, service instructions'),
  bullet('emergency profile updates and device status alerts'),
  h3('One-to-One Messages (human-initiated):'),
  bullet('responses to customer inquiries'),
  bullet('account support messages from customer service agents'),
  bullet('follow-up regarding an active request'),
  h3('Promotional Messages (optional and require explicit consent):'),
  bullet('marketing offers, seasonal promotions, savings opportunities'),
  bullet('product announcements and upgrades'),
  bullet('program or campaign-related messaging'),
  p('Promotional SMS are only sent when you provide explicit opt-in consent and can be opted into or out of separately from service messages.'),
  pb(['Opt-out:'], ' Reply STOP at any time. ', ['Help:'], ' Reply HELP or contact support@holoalert.ca. ', ['Charges:'], ' Standard message and data rates may apply.'),
  p('SMS consent is not shared with third parties for their own marketing purposes. See our Privacy Policy and Terms of Service.'),

  h2('1. Agreement to Terms & Acceptance'),
  p('This Service Terms and Conditions Agreement (the "Agreement") is a legally binding contract between you ("Customer," "User," or "You") and Holo Technologies Inc. ("Company," "Holo Alert," "we," "us," or "our"). By accessing or using our website (www.holoalert.ca), subscribing to, activating, using, or continuing to use any Holo Alert emergency monitoring system ("Product") or services associated with it (collectively, the "Services"), you acknowledge that you have read, understood, and agreed to be bound by this Agreement and our Privacy Policy.'),
  p('The Customer acknowledges that the Service may be provided, in whole or in part, by Holo Technologies Inc., its affiliates, contractors, monitoring partners, or any successor entity.'),
  p('If you do not agree to the terms set forth herein, you must immediately discontinue use of the Product and Service, do not use our website, and notify Holo Technologies Inc. of your intent to cancel in accordance with the cancellation policies outlined in this Agreement (Section 8).'),
  p('We reserve the right to modify this Agreement at any time. Changes become effective upon posting on our website or upon notification to you. Your continued use of the Services after any updates signifies your acceptance of the revised terms. Customers are encouraged to periodically review these Terms.'),

  h2('2. Description of Services'),
  p('Holo Alert provides personal emergency response systems (PERS), including wearable devices ("Product") equipped with GPS tracking and automatic fall detection functionality, and associated 24/7 monitoring services ("Service"). The system operates on a cellular network. The Service enables Customers to connect with a central monitoring station of our choosing, which is responsible for attempting to dispatch emergency response personnel in case of medical distress or emergency situations reported via the Product.'),
  p('Our Services are designed to enhance safety and peace of mind. However, they do not replace 911, emergency medical services (EMS), or professional medical care. You should always seek immediate medical attention or call 911 directly when needed.'),
  p('Holo Technologies Inc. strives to provide a reliable Service but does not guarantee or warrant that emergency responders will always be reached or dispatched in a timely manner or at all. Response times and effectiveness depend on factors outside our control, including cellular network availability, proper Product use, and third-party responder protocols.'),

  h2('3. Eligibility & User Responsibilities'),
  p('To use our Services, you must:'),
  bullet('Be at least 18 years old (or have a legal guardian\'s consent).'),
  bullet('Provide accurate, complete, and up-to-date information during registration and maintain the accuracy of this information (including billing and emergency contacts).'),
  bullet('Use the Services only as intended and in compliance with applicable Canadian laws.'),
  p('You agree not to:'),
  bullet('Use our Services for fraudulent, illegal, or abusive purposes.'),
  bullet('Modify, reverse-engineer, or interfere with the Holo Alert website, Product, or Services.'),
  bullet('Submit false emergency alerts or misuse the 24/7 monitoring service.'),

  h2('4. System Operation, Limitations & Network Coverage'),
  h3('Location Services'),
  p('Holo Alert uses WiFi and cellular triangulation, as well as GPS satellite signals, to determine your location. Location accuracy is not guaranteed and can be impacted by factors such as network availability, signal strength, being indoors, tall buildings, tunnels, dense tree cover, poor weather, and other environmental conditions.'),
  h3('Automatic Fall Detection'),
  p('This feature is designed to detect some sudden falls but is not guaranteed to detect 100% of falls. Gradual slides, slow collapses, or certain types of movements may not trigger an alert. Conversely, high-impact movements, sudden stops, or other non-fall movements may generate false alarms. Customers must always manually press the SOS/emergency button if able to do so in an emergency.'),
  h3('Network Coverage'),
  p('The Service relies on cellular networks and is available nationwide in Canada, but coverage and signal strength vary. We are not liable for service disruptions due to network outages, weak signals, interference, equipment malfunctions, or other factors affecting cellular service.'),
  h3('General Limitations'),
  p('The Customer acknowledges the inherent limitations of the Product and Service. The Company is not liable for any failure of GPS, automatic fall detection, network connectivity, or any other aspect of the Product or Service to operate as expected.'),

  h2('5. Device Use & Maintenance'),
  p('To ensure reliable performance, you agree to:'),
  bullet('Charge your Product regularly as per the user manual.'),
  bullet('Wear your Product properly to maximize fall detection accuracy (if applicable).'),
  bullet('Test your Product periodically (e.g., monthly) to confirm functionality and connection to the monitoring center.'),
  bullet('Keep your emergency contact information accurate and updated with us.'),
  p('Holo Alert is not responsible for issues arising from:'),
  bullet('Failure to charge, wear, or test the Product correctly.'),
  bullet('User misuse, tampering, or unauthorized modifications.'),
  bullet('Damage due to water exposure beyond specified resistance levels (e.g., IP67).'),
  bullet('Failure to maintain accurate contact information.'),

  h2('6. Emergency Response Process & Limitations'),
  p('Our 24/7 monitoring team will attempt to respond when the SOS button is pressed or an automatic fall detection alert is received (if enabled). However, Holo Alert:'),
  bb(['Does not replace 911:'], ' Always call 911 directly if possible in an emergency.'),
  bb(['Cannot guarantee response:'], ' We cannot guarantee connection or dispatch if network connectivity is disrupted or unavailable.'),
  bb(['Relies on accurate information:'], ' We are not responsible for delays or failures caused by incorrect or outdated emergency contact or location information provided by you.'),
  bb(['Is not liable for responder actions:'], ' We are not responsible for the timeliness or effectiveness of actions taken by third-party emergency responders (e.g., EMS, police, fire department).'),

  h2('7. Billing, Payment Terms, Service Term, and Financial Agreements'),
  h3('Payment Obligation'),
  p('Customers must make all payments in full and on time according to their selected service plan. An active, paid subscription is required for the monitoring Service.'),
  h3('Billing Commencement'),
  p('Charges for service begin immediately upon signing this Agreement, regardless of whether the Customer has activated or used the Product, unless Holo Technologies Inc. fails to deliver the Product within thirty (30) days of the agreed shipping date (in which case the Customer may cancel and receive a full refund of payments made).'),
  h3('Billing Methods & Assignment'),
  p('Payments may be processed, administered, or collected by Holo Technologies Inc., or by an affiliate, third-party financing company, billing administrator, or successor entity. The Customer acknowledges and agrees that Holo Technologies Inc. may assign or transfer billing rights, payment obligations, or account administration in connection with financing arrangements, affiliate relationships, mergers, acquisitions, portfolio or account sales, or the sale of all or substantially all of the Company\'s assets or business operations, without notice to or consent from the Customer.'),
  h3('Third-Party Financing'),
  p('If payments are assigned to a third-party financing company, the Customer is fully responsible for fulfilling all financial obligations under that separate agreement. Holo Technologies Inc. bears no liability for the administration or enforcement of such obligations following the transfer. Payment structures, fees, and penalties from third-party financiers are separate from those of Holo Technologies Inc.'),
  h3('Automatic Billing/Renewal'),
  bb(['Direct Billing:'], ' If Holo Technologies Inc. bills you directly throughout your initial term, your service will automatically renew and be billed on a month-to-month basis after the term ends, unless you provide written cancellation notice at least thirty (30) days prior to the desired termination date.'),
  bb(['Third-Party Financed Term:'], ' If your initial term was financed through a third party, you remain responsible for fulfilling payments to that company. Upon completion of that financing term, Holo Technologies Inc. will automatically begin billing you directly for continued service on a month-to-month basis to prevent service interruption, unless you provide written cancellation notice to Holo Technologies Inc. at least thirty (30) days prior to the end of your financing term.'),
  h3('Payment Failure'),
  p('We reserve the right to suspend or terminate service if payments are not received on time. No claims shall be made against Holo Technologies Inc. for service interruptions due to non-payment.'),
  h3('Pricing Adjustments'),
  p('We reserve the right to adjust pricing with prior notice.'),
  h3('Late Fees'),
  p('While not currently imposed, Holo Technologies Inc. reserves the right to introduce late payment fees in the future with advance written notice.'),

  h2('8. Cancellation Policy, Returns & Refunds'),
  h3('Initial Cancellation Window'),
  p('Customers may cancel their purchase, service, or contract without penalty within ten (10) days from the date of signing the agreement or from the date they receive the Product, whichever occurs later. Cancellation requests must be submitted in writing to Holo Technologies Inc. (contact details in Section 18). A full refund will be issued for payments made, provided any received Product is returned in its original condition per return instructions.'),
  h3('Cancellation After Initial Window'),
  p('If a Customer cancels after the ten (10) day period but before the end of their agreed service term, an early cancellation fee will apply equal to CAD $20 multiplied by the number of full months remaining in the service agreement at the time written notice of cancellation is received.'),
  h3('Third-Party Financing Obligations'),
  p('Cancellation of service with Holo Technologies Inc. does not automatically cancel obligations under a third-party financing agreement. The Customer remains bound by the policies and financial obligations set forth by the third-party finance company.'),
  h3('Refunds'),
  p('Except for cancellations within the initial 10-day window, subscription and service fees are generally non-refundable, except where required by law. Except as required by law, no refunds shall be issued for amounts paid beyond the applicable cancellation period.'),

  h2('9. Device Ownership (Rental Only) and Equipment Return'),
  h3('Rental Basis'),
  p('All Products provided as part of the Service remain the property of Holo Technologies Inc. and are provided on a rental basis only. The Customer acquires no ownership interest in the equipment.'),
  h3('Customer Responsibility'),
  p('The Customer must use the Product in accordance with manufacturer guidelines, regularly test the device to ensure proper operation, and is responsible for any loss, theft, or damage beyond reasonable wear and tear.'),
  h3('Return of Equipment'),
  p('Upon cancellation or termination of the Service, all equipment must be returned in good working condition, subject to reasonable wear and tear, within the timeframe specified by Holo Technologies Inc. If equipment is not returned or is returned damaged, the Customer authorizes Holo Technologies Inc. or its assignee to charge the applicable replacement and reasonable administrative costs to the Customer\'s account. Failure to return may also result in the balance being referred to a collections agency.'),

  h2('10. Disclaimer of Warranties'),
  h3('As Is Basis'),
  p('THE PRODUCT AND SERVICE ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. HOLO TECHNOLOGIES INC. EXPRESSLY DISCLAIMS ANY AND ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.'),
  h3('Service Guarantee'),
  p('We do not guarantee uninterrupted, error-free, or completely secure operation of the Product or Service. Customer acknowledges that reliability can be impacted by factors outside our control (network issues, interference, third-party services, etc.) and that such occurrences are outside of Holo Technologies Inc.\'s control.'),

  h2('11. Company is Not an Insurer & Limitation of Liability'),
  h3('Not an Insurer'),
  p('Customer acknowledges and agrees that Holo Technologies Inc. is not an insurer and does not provide insurance coverage for personal injury, loss of life, or property damage. The monitoring service fee is based solely on the provision of emergency monitoring services and does not constitute an insurance premium. Customer assumes all risks associated with medical emergencies and the use (or inability to use) the Product and Service.'),
  h3('Limitation of Liability'),
  p('TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, HOLO TECHNOLOGIES INC., ITS AFFILIATES, OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO DEATH, PERSONAL INJURY, PROPERTY LOSS, OR DAMAGES ARISING FROM THE USE, INABILITY TO USE, OR FAILURE OF THE PRODUCT OR SERVICE TO PERFORM AS EXPECTED, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. THIS INCLUDES LIABILITY ARISING FROM SERVICE DISRUPTIONS, NETWORK FAILURES, INACCURATE LOCATION INFORMATION, FAILURE OF FALL DETECTION, DELAYS IN RESPONSE, OR ACTIONS/INACTIONS OF THIRD-PARTY RESPONDERS.'),
  h3('Maximum Liability'),
  p('IF HOLO TECHNOLOGIES INC. IS FOUND LIABLE FOR ANY CLAIMS ARISING OUT OF THIS AGREEMENT OR THE USE/FAILURE OF THE PRODUCT OR SERVICE, ITS TOTAL AGGREGATE LIABILITY SHALL NOT EXCEED ONE THOUSAND CANADIAN DOLLARS (CAD $1,000).'),
  h3('Indemnification'),
  p('Customer agrees to indemnify and hold harmless Holo Technologies Inc., its affiliates, officers, directors, employees, agents, and monitoring center providers from any and all claims, damages, losses, liabilities, costs, and expenses (including reasonable attorney fees) arising from or related to the Customer\'s use or misuse of the Product or Service, breach of this Agreement, false alarms, or failure to provide accurate information.'),
  h3('Jurisdictional Exceptions'),
  p('If you reside in Quebec or another jurisdiction where certain liability exclusions or limitations are not permitted, the limitations or exclusions may not apply to you. In such cases, our liability shall be limited to the greatest extent permitted by the applicable law of that jurisdiction.'),

  h2('12. Privacy & Data Protection'),
  p('Holo Alert is committed to protecting your personal data. We collect, store, and process personal and potentially sensitive medical information necessary for providing the Service and facilitating emergency response. This may include name, contact details, location data, medical conditions, medications, and emergency contacts.'),
  h3('Data Use & Sharing'),
  p('Your data may be shared with the central monitoring station, emergency responders (like 911, EMS), monitoring partners, and essential third-party service providers as required to deliver the Service.'),
  h3('Security'),
  p('We take reasonable measures to protect your information, but no data transmission or storage is 100% secure. You acknowledge this inherent risk.'),
  h3('Consent'),
  p('By using the Service, you consent to the collection, use, storage, and sharing of your personal information as outlined here and in our full Privacy Policy, including processing or storage outside of Canada.'),
  h3('No Sale for Marketing'),
  p('We do not sell your personal data to third parties for marketing purposes.'),
  h3('Data Storage Location'),
  p('Your data may be stored and processed in Canada and/or other jurisdictions, including the United States. Data protection laws may differ in these locations. You consent to this potential cross-border transfer and processing. We retain records of SMS consent, including timestamp, source, and method of capture, for compliance purposes.'),
  h3('Anti-Spam'),
  p('Holo Technologies Inc. complies with Canada\'s Anti-Spam Legislation (CASL). We do not send commercial electronic messages without valid consent and include clear unsubscribe options in all marketing communications.'),

  h2('13. False Alarms & Customer Responsibility'),
  p('Customers acknowledge that emergency responders (e.g., police, fire departments) may impose fines, penalties, or fees for false alarms triggered by the Product. The Customer is solely responsible for paying any such fines or fees and agrees to indemnify and hold Holo Technologies Inc. harmless from any financial liability arising from false alarms. Customers agree to use the Product responsibly to minimize false alarms and to maintain accurate and up-to-date emergency contact information with us.'),

  h2('14. Termination of Service'),
  h3('Termination by Company'),
  p('We may suspend or terminate your access to our Services if:'),
  bullet('You violate this Agreement.'),
  bullet('Payments are significantly overdue.'),
  bullet('You misuse the Service or Product.'),
  bullet('The Service is discontinued (we will provide reasonable notice if feasible).'),
  h3('Termination by Customer'),
  p('You may cancel your subscription at any time by providing written notice as outlined in Section 7 and Section 8, subject to the applicable cancellation terms and potential fees.'),

  h2('15. Force Majeure'),
  p('Holo Technologies Inc. shall not be liable for any failure or delay in providing the Service due to causes beyond its reasonable control. Such causes include, but are not limited to, acts of God, natural disasters, pandemics, epidemics, public health emergencies, war, terrorism, cyber-attacks, labour disputes, government actions or orders, power outages, telecommunications or network failures (including cellular network disruptions), equipment malfunctions affecting large areas, or failure of third-party providers essential to the Service. Such events do not typically entitle the Customer to a refund or credit.'),

  h2('16. Assignment and Transfer'),
  p('Holo Technologies Inc. may assign or transfer this Agreement, in whole or in part, including the Customer account and service obligations, without notice to or consent from the Customer, to an affiliate, third-party service provider, financing partner, or any purchaser or successor in connection with a merger, acquisition, reorganization, portfolio or account sale, or sale of all or substantially all of the Company\'s assets or business. Any assignee or successor shall be entitled to all rights and protections under this Agreement and shall not be liable for any act or omission occurring prior to the effective date of the assignment. The Customer\'s obligations under this Agreement shall continue in full force and effect following any assignment or transfer.'),

  h2('17. Governing Law & Dispute Resolution'),
  p('This Agreement shall be governed by and construed in accordance with the laws of the Province of Alberta and the federal laws of Canada applicable therein, without regard to conflict of law principles.'),
  h3('Negotiation'),
  p('We encourage you to contact us first to resolve any disputes informally.'),
  h3('Arbitration'),
  p('Unless prohibited by applicable provincial consumer protection laws in your jurisdiction of residence, any dispute, claim, or controversy arising out of or relating to this Agreement, the Product, or the Service shall be resolved through final and binding arbitration administered under the rules of an established Canadian arbitration body, conducted in Alberta.'),
  h3('Class Action Waiver'),
  p('Customers agree that any disputes shall be resolved on an individual basis. Customers expressly waive the right to participate in any class action lawsuit or class-wide arbitration against Holo Technologies Inc.'),
  h3('Exceptions'),
  p('If arbitration is deemed unenforceable or is restricted by applicable consumer protection laws (e.g., potentially in Quebec), the parties agree that disputes shall be brought exclusively in the courts of competent jurisdiction in Alberta, Canada, unless the laws of your province of residence mandate jurisdiction elsewhere. You may retain rights granted under your specific provincial consumer protection laws.'),

  h2('18. Contact Information'),
  p('For questions, support, or required notices (including cancellation):'),
  p('Holo Technologies Inc., Suite 3400, 10180 101 St NW, Edmonton, AB T5J 3S4'),
  pb(['Customer Support:'], ' 1-888-411-4656'),
  pb(['Email:'], ' support@holoalert.ca'),
  pb(['Website:'], ' www.holoalert.ca'),

  h2('19. Final Provisions'),
  bb(['Severability:'], ' If any part of this Agreement is deemed invalid or unenforceable, the remaining provisions shall remain in full force and effect.'),
  bb(['Waiver:'], ' Our failure to enforce any right or provision of this Agreement will not be considered a waiver of those rights.'),
  bb(['Headings:'], ' Headings are for convenience only and do not affect the interpretation of this Agreement.'),
  bb(['Entire Agreement:'], ' This Agreement, along with the Privacy Policy and any specific purchase order or financing agreement (if applicable), constitutes the entire agreement between you and Holo Technologies Inc. regarding the Services and supersedes any prior agreements or understandings.'),
  p('By using Holo Alert Services, you acknowledge that you have read, understood, and agree to be legally bound by these Terms and Conditions.'),
]

// ─── PRIVACY POLICY ─────────────────────────────────────────────────────────

keyCounter = 1000 // reset offset for privacy policy keys

const privacyContent = [
  h2('1. Introduction'),
  p('Holo Technologies Inc. ("Holo Alert," "we," "us," or "our") is committed to protecting your privacy and handling your personal information responsibly. This Privacy Policy explains how we collect, use, disclose, retain, and protect your personal information in compliance with Canadian privacy laws, including the Personal Information Protection and Electronic Documents Act (PIPEDA) and applicable provincial legislation.'),
  p('By using our website (www.holoalert.ca), products, or services, you consent to the collection, use, and disclosure of your personal information as described in this policy.'),

  h2('2. Consent'),
  p('Your consent may be explicit or implied depending on the situation.'),
  bb(['Explicit consent'], ' is when you clearly agree (e.g., filling out a form or checking a box).'),
  bb(['Implied consent'], ' is inferred from your actions (e.g., continuing to use our services after being notified of this policy).'),
  p('You can withdraw consent at any time, subject to legal or contractual limitations.'),

  h2('3. What We Collect'),
  p('We only collect personal information necessary to deliver and support our services:'),
  bb(['Identity & Contact:'], ' Name, phone number, email, mailing address'),
  bb(['Emergency Contacts:'], ' Names and phone numbers of designated caregivers'),
  bb(['Device & Usage Info:'], ' Device ID, service activity, approximate location'),
  bb(['Billing Details:'], ' Payment method and transaction records'),
  bb(['Communication Records:'], ' Emails, support interactions, customer feedback'),
  bb(['Health & Safety:'], ' Details you or your emergency contacts provide during use'),

  h2('4. How We Use It'),
  p('We use your personal information to:'),
  bullet('Deliver and manage your medical alert service'),
  bullet('Process payments and send billing communications'),
  bullet('Provide customer support and emergency response'),
  bullet('Improve service quality and customer experience'),
  bullet('Meet legal obligations or respond to lawful requests'),

  h2('5. How We Share It'),
  p('We do not sell or rent your personal information.'),
  p('We may share your information only when necessary:'),
  bb(['Monitoring Partners:'], ' Our 24/7 monitoring providers (AvantGuard and Affiliated Monitoring) receive relevant information to support emergency response.'),
  bb(['Service Providers:'], ' We use trusted third parties for operations like payment processing, secure hosting, and communication. These include HubSpot (CRM and communication), n8n and Make.com (workflow automation), and AI agents (customer support automation, task handling).'),
  bb(['Legal Compliance:'], ' We may disclose information when required by law, court order, or government request.'),
  p('All service providers are contractually bound to keep your data secure and confidential.'),

  h2('6. SMS Communication'),
  p('We may send both service-related and promotional SMS messages to users who have expressly opted in. Promotional SMS requires separate consent and can be opted into or out of independently.'),
  p('SMS consent is not shared with third parties or affiliates for marketing purposes.'),
  p('You may opt out of SMS communications at any time by replying STOP or contacting us directly.'),

  h2('7. AI and Automation Tools'),
  p('We use AI-based tools and automation platforms (such as Make.com, n8n, and embedded AI agents) to:'),
  bullet('Automate repetitive tasks'),
  bullet('Manage customer communications'),
  bullet('Analyze patterns to improve support and service quality'),
  p('These systems may process limited personal data such as names, contact history, or service preferences. No automated decision-making is used for eligibility or emergency response.'),
  p('All automation is monitored by our team, and safeguards are in place to ensure compliance with Canadian privacy standards.'),

  h2('8. Data Storage and Security'),
  p('We store data securely in Canada and in approved jurisdictions with equivalent privacy protection.'),
  p('We retain a record of consent, including timestamp, method of collection, and source (e.g., online form, phone request), for compliance and audit purposes.'),
  p('We protect your data using:'),
  bullet('Data encryption'),
  bullet('Role-based access control'),
  bullet('Secure backups'),
  bullet('Ongoing security monitoring'),
  p('Despite best efforts, no system is entirely secure. We continually assess and improve our security practices.'),

  h2('9. Your Rights'),
  p('You have the right to:'),
  bb(['Access:'], ' See what personal data we have about you'),
  bb(['Correct:'], ' Fix incorrect or outdated information'),
  bb(['Withdraw:'], ' Limit or revoke consent for certain uses'),
  bb(['Delete:'], ' Request deletion of your personal data where possible'),
  p('Contact us at support@holoalert.ca to make a request. We may require ID verification.'),

  h2('10. Cross-Border Transfers'),
  p('Some data may be processed or stored in countries outside Canada. We ensure that all transfers meet Canadian legal standards and are protected by contractual safeguards.'),

  h2('11. Children\'s Privacy'),
  p('Our services are not intended for individuals under 16. We do not knowingly collect data from minors. If we learn we have collected data from a child without parental consent, we will delete it.'),

  h2('12. Changes to This Policy'),
  p('We may update this policy to reflect changes to our practices or legal requirements. We encourage you to check back regularly. When changes are made, the "Last Updated" date at the top will be revised.'),

  h2('13. Contact Us'),
  p('For privacy-related questions or requests, please contact:'),
  pb(['Holo Technologies Inc.'], ', Suite 3400, 10180 101 St NW, Edmonton, AB T5J 3S4'),
  pb(['Email:'], ' support@holoalert.ca'),
  pb(['Phone:'], ' 1-888-411-4656'),
  pb(['Website:'], ' www.holoalert.ca'),
  p('If you are not satisfied with our response, you may contact the Office of the Privacy Commissioner of Canada, 30 Victoria Street, Gatineau, Quebec, K1A 1H3, at www.priv.gc.ca or 1-800-282-1376.'),

  h2('14. Final Provisions'),
  p('If any part of this policy is found invalid, the rest remains enforceable. By using our services, you acknowledge that you have read, understood, and agree to this policy.'),
]

// ─── SEED ────────────────────────────────────────────────────────────────────

async function seed() {
  console.log('Seeding T&C content...')
  await client.patch('drafts.ec704273-c80b-4d9a-93c4-8036273499b5').set({ content: termsContent }).commit()
  console.log('✓ T&C content seeded')

  console.log('Seeding Privacy Policy content...')
  await client.patch('drafts.459d0d49-ade7-4720-8b1d-74ab4dafd4ad').set({ content: privacyContent }).commit()
  console.log('✓ Privacy Policy content seeded')

  console.log('Publishing both documents...')
  await client.request({
    method: 'POST',
    url: `/data/mutate/production`,
    body: {
      mutations: [
        { publish: { id: 'drafts.ec704273-c80b-4d9a-93c4-8036273499b5' } },
        { publish: { id: 'drafts.459d0d49-ade7-4720-8b1d-74ab4dafd4ad' } },
      ],
    },
  })
  console.log('✓ Both documents published')
}

seed().catch(console.error)

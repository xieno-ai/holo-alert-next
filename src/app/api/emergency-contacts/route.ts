import { NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
})

export async function POST(req: Request) {
  try {
    const body = await req.json()

    await client.create({
      _type: 'emergencyContactSubmission',
      firstName: body.firstName ?? '',
      lastName: body.lastName ?? '',
      email: body.email ?? '',
      primaryContactName: body.primaryContactName ?? '',
      primaryContactPhone: body.primaryContactPhone ?? '',
      secondaryContactName: body.secondaryContactName ?? '',
      secondaryContactPhone: body.secondaryContactPhone ?? '',
      streetAddress: body.streetAddress ?? '',
      unitNumber: body.unitNumber ?? '',
      postalCode: body.postalCode ?? '',
      city: body.city ?? '',
      country: body.country ?? '',
      userPhone: body.userPhone ?? '',
      submittedAt: new Date().toISOString(),
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[emergency-contacts] Sanity write failed:', err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}

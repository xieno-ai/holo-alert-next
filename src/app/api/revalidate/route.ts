import { revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

export async function POST(req: NextRequest) {
  try {
    const { body, isValidSignature } = await parseBody<{
      _type: string
      slug?: string
    }>(req, process.env.SANITY_WEBHOOK_SECRET)

    if (!isValidSignature) {
      return new Response('Invalid Signature', { status: 401 })
    }

    if (!body || !body._type) {
      return new Response('Bad Request', { status: 400 })
    }

    revalidateTag(body._type, {})
    return NextResponse.json({ status: 200, revalidated: true, now: Date.now(), body })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error(error)
    return new Response(message, { status: 500 })
  }
}

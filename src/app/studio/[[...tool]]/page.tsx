/**
 * Sanity Studio embedded at /studio using Next.js catch-all routes.
 * metadata must live in the Server Component; Studio rendering is delegated
 * to a Client Component to satisfy Sanity's React context requirements.
 */

export { metadata, viewport } from 'next-sanity/studio'

import StudioClient from './_StudioClient'

export default function StudioPage() {
  return <StudioClient />
}

import { sanityFetch } from '@/sanity/lib/client'
import { DEVICES_QUERY } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import Header from './Header'

interface Device {
  _id: string
  name: string
  slug: { current: string }
  pricingCardImage?: object
  pricingCardOrder?: number
}

export default async function HeaderServer() {
  let devices: Device[] = []
  try {
    devices = await sanityFetch<Device[]>({ query: DEVICES_QUERY, tags: ['device'] })
  } catch {
    // fall through to Header defaults
  }

  const productCards = devices
    .filter((d) => d.slug?.current && d.pricingCardImage)
    .map((d) => ({
      label: d.name,
      href: `/devices/${d.slug.current}`,
      img: urlFor(d.pricingCardImage!).width(300).height(300).url(),
    }))

  return <Header productCards={productCards.length > 0 ? productCards : undefined} />
}

import { sanityFetch } from '@/sanity/lib/client'
import { DEVICES_QUERY, SITE_SETTINGS_QUERY } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import Header from './Header'

interface Device {
  _id: string
  name: string
  slug: { current: string }
  featuresImage?: object
  pricingCardImage?: object
  pricingCardOrder?: number
  isVariantChild?: boolean
}

interface SiteSettings {
  logo?: { asset?: { url?: string }; alt?: string }
}

export default async function HeaderServer() {
  let devices: Device[] = []
  let badgeLogoUrl: string | undefined

  try {
    const [devicesResult, settings] = await Promise.all([
      sanityFetch<Device[]>({ query: DEVICES_QUERY, tags: ['device'] }),
      sanityFetch<SiteSettings>({ query: SITE_SETTINGS_QUERY, tags: ['siteSettings'] }),
    ])
    devices = devicesResult
    if (settings?.logo) {
      badgeLogoUrl = urlFor(settings.logo).width(80).height(80).url()
    }
  } catch {
    // fall through to Header defaults
  }

  const productCards = devices
    .filter((d) => d.slug?.current && (d.featuresImage || d.pricingCardImage) && !d.isVariantChild)
    .map((d) => ({
      label: d.name,
      href: `/devices/${d.slug.current}`,
      img: urlFor(d.featuresImage ?? d.pricingCardImage!).width(300).height(300).url(),
    }))

  return <Header productCards={productCards.length > 0 ? productCards : undefined} badgeLogoUrl={badgeLogoUrl} />
}

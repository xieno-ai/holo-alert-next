import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { sanityFetch } from '@/sanity/lib/client'
import { DEVICE_QUERY, DEVICES_QUERY, DEVICE_ADDONS_QUERY } from '@/sanity/lib/queries'

import ProductHeroSection from '@/components/product/ProductHeroSection'
import ProductFeaturesSection from '@/components/product/ProductFeaturesSection'
import ProductHowItWorksSection from '@/components/product/ProductHowItWorksSection'
import ProductStatsSection from '@/components/product/ProductStatsSection'
import CaregiverConnectedSection from '@/components/product/CaregiverConnectedSection'
import WhatsInTheBoxSection from '@/components/product/WhatsInTheBoxSection'
import ProductFAQSection from '@/components/product/ProductFAQSection'
import ProductContactCTA from '@/components/product/ProductContactCTA'
import ProductAmbientVideoSection from '@/components/product/ProductAmbientVideoSection'
import TestimonialsColumnsSection from '@/components/product/TestimonialsColumnsSection'
import OtherDevicesSection from '@/components/product/OtherDevicesSection'
import ViewItemTracker from '@/components/product/ViewItemTracker'

interface Params {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  try {
    const devices = await sanityFetch<Array<{ slug: { current: string } }>>({
      query: DEVICES_QUERY,
      tags: ['device'],
    })
    return devices.map((d) => ({ slug: d.slug.current }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  try {
    const device = await sanityFetch<{ name?: string; tagline?: string }>({
      query: DEVICE_QUERY,
      params: { slug },
      tags: ['device'],
    })
    if (device) {
      return {
        title: `${device.name ?? 'Device'} | Holo Alert`,
        description: device.tagline ?? 'Canadian medical alert device with 24/7 monitoring.',
      }
    }
  } catch {
    // fall through
  }
  return { title: 'Device | Holo Alert' }
}

interface AddonData {
  _id: string
  name: string
  slug?: { current: string }
  shortDescription?: string
  description?: string
  price?: number
  billingInterval?: string
  stripePriceIdMonthly?: string
  stripePriceIdAnnual?: string
}

export default async function DevicePage({ params }: Params) {
  const { slug } = await params

  let device = null
  let addons: AddonData[] = []
  let allDevices: Array<{
    _id: string
    name: string
    slug: { current: string }
    tagline?: string
    pricingCardImage?: object
    pricingCardSubhead?: string
    pricingCardSubscription?: string
    monthlyPriceDisplay?: string
    pricingCardBenefits?: string[]
  }> = []

  try {
    device = await sanityFetch<{
      _id: string
      name?: string
      slug?: { current: string }
      tagline?: string
      description?: Array<{ _type: string; _key?: string; [key: string]: unknown }>
      mainImage?: object
      featuresImage?: object
      gallery?: object[]
      specs?: Array<{ label: string; value: string }>
      featuresSectionEyebrow?: string
      featuresSectionHeading?: string
      features?: Array<{ _key?: string; title?: string; content?: string; image?: object }>
      howItWorksSteps?: Array<{ _key?: string; content?: string; image?: object }>
      accessories?: Array<{ _key?: string; name?: string; image?: object }>
      monthlyPriceDisplay?: string
      annualPriceDisplay?: string
      devicePrice?: number
      reducedDevicePrice?: number
      pricingCardBenefits?: string[]
      fallAlertDisclaimer?: string
      ambientVideo?: { asset?: { url?: string } }
      videoUrl?: string
      videoThumbnail?: object
      hasCaregiverApp?: boolean
      caregiverAppHeading?: string
      caregiverAppDescription?: string
      caregiverAppBackgroundImage?: { asset?: { url?: string }; alt?: string }
      caregiverAppForegroundImage?: { asset?: { url?: string }; alt?: string }
      caregiverAppFeatures?: Array<{ _key?: string; title?: string; body?: string }>
      variants?: Array<{
        _id: string
        name?: string
        slug?: { current: string }
        tagline?: string
        description?: Array<{ _type: string; _key?: string; [key: string]: unknown }>
        mainImage?: object
        gallery?: object[]
        specs?: Array<{ label: string; value: string }>
        monthlyPriceDisplay?: string
        annualPriceDisplay?: string
        devicePrice?: number
        reducedDevicePrice?: number
        pricingCardBenefits?: string[]
        fallAlertDisclaimer?: string
        stripePriceIdMonthly?: string
        stripePriceIdYearly?: string
        stripePriceIdDevice?: string
      }>
    }>({
      query: DEVICE_QUERY,
      params: { slug },
      tags: ['device'],
    })
  } catch {
    // fall through to null check
  }

  if (!device) {
    notFound()
  }

  // Fetch addons and all devices in parallel — they are independent
  const [addonsResult, allDevicesResult] = await Promise.all([
    sanityFetch<AddonData[]>({
      query: DEVICE_ADDONS_QUERY,
      params: { deviceId: device._id },
      tags: ['addon'],
    }).catch(() => null),
    sanityFetch<typeof allDevices>({
      query: DEVICES_QUERY,
      tags: ['device'],
    }).catch(() => null),
  ])
  addons = addonsResult ?? []
  allDevices = allDevicesResult ?? []

  const productName = device.name ?? 'Holo Pro'

  return (
    <>
      <ViewItemTracker
        deviceName={productName}
        deviceSlug={slug}
        monthlyPrice={device.monthlyPriceDisplay}
        annualPrice={device.annualPriceDisplay}
      />
      <ProductHeroSection device={device} addons={addons} variants={device.variants} />
      <ProductFeaturesSection
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        features={device.features as any}
        productName={productName}
        eyebrow={device.featuresSectionEyebrow}
        heading={device.featuresSectionHeading}
      />
      <ProductAmbientVideoSection videoUrl={device.ambientVideo?.asset?.url} />
      <ProductHowItWorksSection steps={device.howItWorksSteps} productName={productName} />
      <TestimonialsColumnsSection />
      <ProductStatsSection />
      {device.hasCaregiverApp && (
        <CaregiverConnectedSection
          backgroundImage={device.caregiverAppBackgroundImage?.asset?.url}
          foregroundImage={device.caregiverAppForegroundImage?.asset?.url}
          foregroundImageAlt={device.caregiverAppForegroundImage?.alt}
          heading={device.caregiverAppHeading}
          description={device.caregiverAppDescription}
          features={device.caregiverAppFeatures}
        />
      )}
      <WhatsInTheBoxSection accessories={device.accessories} productName={productName} />
      <ProductFAQSection productName={productName} />
      <OtherDevicesSection devices={allDevices} currentSlug={slug} />
      <ProductContactCTA productName={productName} />
    </>
  )
}

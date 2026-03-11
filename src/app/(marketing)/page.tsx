import type { Metadata } from 'next'
import { sanityFetch } from '@/sanity/lib/client'
import { FEATURED_DEVICE_IMAGE_QUERY, HOME_PAGE_QUERY } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import HeroSection from '@/components/home/HeroSection'
import TrustBar from '@/components/home/TrustBar'
import HowItWorksSection from '@/components/home/HowItWorksSection'
import FeatureDiagramSection from '@/components/home/FeatureDiagramSection'
import DeviceCardsSection from '@/components/home/DeviceCardsSection'
import BridgeSection from '@/components/home/BridgeSection'
import WhyChooseSection from '@/components/home/WhyChooseSection'
import CertificationsSection from '@/components/home/CertificationsSection'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import FAQSection from '@/components/home/FAQSection'
import type { HomePageData } from '@/types/homePage'

export const metadata: Metadata = {
  title: "Canada's Trusted Medical Alert System | Holo Alert",
  description:
    'Canadian-owned 24/7 medical alert devices for seniors. Fall detection, GPS tracking, and professional monitoring across Canada. Free shipping.',
}

export default async function HomePage() {
  let featuredImageUrl: string | null = null
  let featuredDeviceName = 'Holo Device'
  let homeData: HomePageData | null = null

  try {
    const [featured, home] = await Promise.all([
      sanityFetch<{ name?: string; mainImage?: object }>({
        query: FEATURED_DEVICE_IMAGE_QUERY,
        tags: ['device'],
      }),
      sanityFetch<HomePageData>({
        query: HOME_PAGE_QUERY,
        tags: ['homePage'],
      }),
    ])
    if (featured?.mainImage) {
      featuredImageUrl = urlFor(featured.mainImage).width(1040).height(1040).url()
      featuredDeviceName = featured.name ?? featuredDeviceName
    }
    homeData = home
  } catch {
    // fall back to static images
  }

  const heroImageUrl = homeData?.heroImage
    ? urlFor(homeData.heroImage).width(1120).height(1400).url()
    : null

  const heroSlot1Url = homeData?.heroImageSlot1
    ? urlFor(homeData.heroImageSlot1).width(400).height(500).url()
    : null
  const heroSlot2Url = homeData?.heroImageSlot2
    ? urlFor(homeData.heroImageSlot2).width(400).height(400).url()
    : null
  const heroSlot3Url = homeData?.heroImageSlot3
    ? urlFor(homeData.heroImageSlot3).width(200).height(200).url()
    : null

  // Use Holo Active Slim product image as the main hero device image
  const heroDeviceImageUrl = featuredImageUrl

  const howItWorksSteps = homeData?.howItWorksSteps?.map((step) => ({
    title: step.title,
    description: step.description,
    href: step.href || '/devices',
    imageUrl: step.image ? urlFor(step.image).width(600).height(900).url() : null,
  })) ?? null

  const whyChooseImageUrl = homeData?.whyChooseImage
    ? urlFor(homeData.whyChooseImage).width(600).height(400).url()
    : null

  const certifications = homeData?.certifications?.map((cert) => ({
    name: cert.name,
    description: cert.description,
    imageUrl: cert.image ? urlFor(cert.image).width(300).height(200).url() : null,
    scaleUp: cert.scaleUp ?? false,
  })) ?? null

  const trustBarLogos = homeData?.trustBarLogos?.map((logo) => ({
    url: logo.asset?.url ?? '',
    alt: logo.alt || 'Partner logo',
  })) ?? null

  const watermarkUrl = homeData?.featureDiagramWatermark
    ? urlFor(homeData.featureDiagramWatermark).url()
    : null

  return (
    <>
      <HeroSection
        heroImageUrl={heroImageUrl}
        deviceImageUrl={heroDeviceImageUrl}
        slot1Url={heroSlot1Url}
        slot2Url={heroSlot2Url}
        slot3Url={heroSlot3Url}
      />
      <TrustBar logos={trustBarLogos} />
      <HowItWorksSection steps={howItWorksSteps} />
      <FeatureDiagramSection
        featuredImageUrl={featuredImageUrl}
        featuredDeviceName={featuredDeviceName}
        watermarkUrl={watermarkUrl}
      />
      <DeviceCardsSection />
      <BridgeSection />
      <WhyChooseSection imageUrl={whyChooseImageUrl} />
      <CertificationsSection certifications={certifications} />
      <TestimonialsSection />
      <FAQSection />
    </>
  )
}

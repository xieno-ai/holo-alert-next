import type { Metadata } from 'next'
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

export const metadata: Metadata = {
  title: "Canada's Trusted Medical Alert System | Holo Alert",
  description:
    'Canadian-owned 24/7 medical alert devices for seniors. Fall detection, GPS tracking, and professional monitoring across Canada. Free shipping.',
}

export default async function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustBar />
      <HowItWorksSection />
      <FeatureDiagramSection />
      <DeviceCardsSection />
      <BridgeSection />
      <WhyChooseSection />
      <CertificationsSection />
      <TestimonialsSection />
      <FAQSection />
    </>
  )
}

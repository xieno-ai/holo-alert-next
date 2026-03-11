import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

export interface HomePageData {
  heroImage?: SanityImageSource & { alt?: string }
  heroImageSlot1?: SanityImageSource & { alt?: string }
  heroImageSlot2?: SanityImageSource & { alt?: string }
  heroImageSlot3?: SanityImageSource & { alt?: string }
  howItWorksSteps?: {
    _key: string
    title: string
    description: string
    href?: string
    image?: SanityImageSource & { alt?: string }
  }[]
  whyChooseImage?: SanityImageSource & { alt?: string }
  certifications?: {
    _key: string
    name: string
    description: string
    scaleUp?: boolean
    image?: SanityImageSource & { alt?: string }
  }[]
  trustBarLogos?: {
    _key: string
    alt?: string
    asset?: { url: string; metadata?: { dimensions?: { width: number; height: number } } }
  }[]
  featureDiagramWatermark?: SanityImageSource & { alt?: string }
}

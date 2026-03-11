import { defineType, defineField, defineArrayMember } from 'sanity'

export const device = defineType({
  name: 'device',
  title: 'Device',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'Short one-line product tagline for pricing cards and meta',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [defineArrayMember({ type: 'block' })],
      description: 'Rich text description — converted from Webflow HTML via html-to-pte',
    }),
    defineField({
      name: 'mainImage',
      title: 'Hero Product Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'featuresImage',
      title: 'Device Features Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
            }),
          ],
        }),
      ],
      description: 'Additional product images — lifestyle shots, angles, etc.',
    }),

    // === PRICING — Display strings (human-readable) ===
    defineField({
      name: 'monthlyPriceDisplay',
      title: 'Monthly Price Display',
      type: 'string',
      description: 'Display-only string, e.g. "from $64.95/month". Not used for checkout.',
    }),
    defineField({
      name: 'annualPriceDisplay',
      title: 'Annual Price Display',
      type: 'string',
      description: 'Display-only string, e.g. "779.95". Not used for checkout.',
    }),
    defineField({
      name: 'devicePrice',
      title: 'Device Price (Display)',
      type: 'number',
      description: 'One-time device fee dollar amount — DISPLAY ONLY. Use stripePriceIdDevice for checkout.',
    }),
    defineField({
      name: 'reducedDevicePrice',
      title: 'Reduced Device Price (Display)',
      type: 'number',
      description: 'Sale/promotional device price — DISPLAY ONLY.',
    }),

    defineField({
      name: 'annualBonusMonths',
      title: 'Annual Plan — Bonus Months',
      type: 'number',
      description: 'Number of free bonus months added to annual subscriptions (e.g. 2 = "14 months for the price of 12"). Set to 0 or leave empty for no bonus.',
      initialValue: 0,
      validation: (Rule) => Rule.min(0).max(6).integer(),
    }),

    // === PRICING — Stripe Price IDs (used for checkout) ===
    defineField({
      name: 'stripePriceIdMonthly',
      title: 'Stripe Price ID — Monthly',
      type: 'string',
      description: 'Paste the Stripe Price ID (starts with price_). Find it in Stripe Dashboard → Products → [Device Name] → Prices.',
      validation: (Rule) =>
        Rule.regex(/^price_/, { name: 'Stripe Price ID', invert: false }).warning(
          'Should start with "price_" — paste Price ID from Stripe dashboard, not the payment link URL',
        ),
    }),
    defineField({
      name: 'stripePriceIdYearly',
      title: 'Stripe Price ID — Yearly',
      type: 'string',
      description: 'Paste the Stripe Price ID (starts with price_). Find it in Stripe Dashboard → Products → [Device Name] → Prices.',
      validation: (Rule) =>
        Rule.regex(/^price_/, { name: 'Stripe Price ID', invert: false }).warning(
          'Should start with "price_" — paste Price ID from Stripe dashboard, not the payment link URL',
        ),
    }),
    defineField({
      name: 'stripePriceIdDevice',
      title: 'Stripe Price ID — Device (One-time)',
      type: 'string',
      description: 'Paste the Stripe Price ID (starts with price_). Find it in Stripe Dashboard → Products → [Device Name] → Prices.',
      validation: (Rule) =>
        Rule.regex(/^price_/, { name: 'Stripe Price ID', invert: false }).warning(
          'Should start with "price_" — paste Price ID from Stripe dashboard, not the payment link URL',
        ),
    }),

    // === SPECS ===
    defineField({
      name: 'specs',
      title: 'Product Specs',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'spec',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string' }),
            defineField({ name: 'value', title: 'Value', type: 'string' }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'value' },
          },
        }),
      ],
      description:
        'Spec #1=Height, Spec #2=Width, Spec #3=Weight, Spec #4=Connectivity, Spec #5=Emergency Mode. Webflow stored these as 5 unnamed columns — labels must be added during Phase 3 import.',
    }),

    // === FEATURES SECTION ===
    defineField({
      name: 'featuresSectionEyebrow',
      title: 'Features Section — Eyebrow Label',
      type: 'string',
      description: 'Small label above the features heading. Defaults to "Built For Real Life".',
    }),
    defineField({
      name: 'featuresSectionHeading',
      title: 'Features Section — Heading',
      type: 'string',
      description: 'Main heading for the features section. Defaults to "Why [device name]?".',
    }),
    defineField({
      name: 'features',
      title: 'Device Features',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'feature',
          fields: [
            defineField({ name: 'title', title: 'Title', type: 'string' }),
            defineField({ name: 'content', title: 'Content', type: 'text' }),
            defineField({
              name: 'image',
              title: 'Feature Image',
              type: 'image',
              options: { hotspot: true },
              fields: [defineField({ name: 'alt', title: 'Alt Text', type: 'string' })],
              description: 'Image displayed in the right panel when this feature is active',
            }),
          ],
          preview: {
            select: { title: 'title' },
          },
        }),
      ],
      description: 'Features shown in the scroll-snapping features section. Each feature has a title, description, and image.',
    }),

    // === HOW IT WORKS ===
    defineField({
      name: 'howItWorksSteps',
      title: 'How It Works Steps',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'step',
          fields: [
            defineField({ name: 'content', title: 'Step Content', type: 'text' }),
            defineField({
              name: 'image',
              title: 'Step Image',
              type: 'image',
              options: { hotspot: true },
              fields: [defineField({ name: 'alt', title: 'Alt Text', type: 'string' })],
            }),
          ],
          preview: {
            select: { title: 'content' },
          },
        }),
      ],
      description: 'Webflow stored as 3 pairs of How it Works Image/Content columns.',
    }),

    // === ACCESSORIES ===
    defineField({
      name: 'accessories',
      title: 'Accessories',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'accessory',
          fields: [
            defineField({ name: 'name', title: 'Name', type: 'string' }),
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
              fields: [defineField({ name: 'alt', title: 'Alt Text', type: 'string' })],
            }),
          ],
          preview: {
            select: { title: 'name' },
          },
        }),
      ],
      description: 'Webflow stored as 5 Accessory Name + 5 Accessory Image columns.',
    }),

    // === VIDEO ===
    defineField({
      name: 'ambientVideo',
      title: 'Ambient Loop Video',
      type: 'file',
      options: { accept: 'video/*' },
      description: 'Upload an MP4 directly — Sanity will host it. Up to 25 seconds, compressed for web.',
    }),
    defineField({
      name: 'videoUrl',
      title: 'Product Video URL',
      type: 'url',
      description: 'Vimeo URL for product explainer video lightbox',
    }),
    defineField({
      name: 'videoThumbnail',
      title: 'Video Thumbnail Image',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt Text', type: 'string' })],
    }),

    // === PRICING CARD ===
    defineField({
      name: 'pricingCardSubhead',
      title: 'Pricing Card Subhead',
      type: 'string',
      description: 'Subtitle shown on the pricing card component',
    }),
    defineField({
      name: 'pricingCardImage',
      title: 'Pricing Card Image',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt Text', type: 'string' })],
    }),
    defineField({
      name: 'pricingCardOrder',
      title: 'Pricing Card Order',
      type: 'number',
      description: 'Display sort order for pricing cards on the compare/products page (1 = first)',
    }),
    defineField({
      name: 'pricingCardSubscription',
      title: 'Pricing Card Subscription Label',
      type: 'string',
      description: 'e.g. "from $54.95/month" — text displayed on pricing card',
    }),
    defineField({
      name: 'pricingCardBenefits',
      title: 'Pricing Card Benefits',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      description:
        'Bullet points shown on pricing card. Webflow stored as 5 separate Benefit columns. HTML tags stripped during import.',
    }),

    // === CAREGIVER APP ===
    defineField({
      name: 'hasCaregiverApp',
      title: 'Has Caregiver App Section',
      type: 'boolean',
      description: 'Enable to show the Caregiver Connected section on this product page',
      initialValue: false,
    }),
    defineField({
      name: 'caregiverAppBackgroundImage',
      title: 'Caregiver App — Background Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Full-bleed background image for the left panel of the Caregiver Connected section',
      fields: [defineField({ name: 'alt', title: 'Alt Text', type: 'string' })],
      hidden: ({ document }) => !document?.hasCaregiverApp,
    }),
    defineField({
      name: 'caregiverAppForegroundImage',
      title: 'Caregiver App — Foreground Image (App Screenshot)',
      type: 'image',
      options: { hotspot: true },
      description: 'App screenshot displayed in the foreground of the left panel — shows the caregiver app UI',
      fields: [defineField({ name: 'alt', title: 'Alt Text', type: 'string' })],
      hidden: ({ document }) => !document?.hasCaregiverApp,
    }),

    // === DISCLAIMERS / FLAGS ===
    defineField({
      name: 'fallAlertDisclaimer',
      title: 'Fall Detection Disclaimer',
      type: 'string',
      description: 'Legal disclaimer text about fall detection limitations',
    }),
    defineField({
      name: 'shippingTimeline',
      title: 'Shipping Timeline',
      type: 'string',
      description: 'e.g. "Ships within 3-5 business days"',
    }),
    defineField({
      name: 'isActive',
      title: 'Active (Currently Sold)',
      type: 'boolean',
      description: 'Uncheck to hide device from storefront without deleting it',
      initialValue: true,
    }),

    // === MIGRATION AID ===
    defineField({
      name: 'webflowId',
      title: 'Webflow Item ID',
      type: 'string',
      description:
        'Webflow CMS Item ID — used during Phase 3 import to prevent duplicates. Can be removed post-migration.',
      hidden: true,
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'pricingCardSubscription' },
  },
})

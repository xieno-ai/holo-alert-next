import { defineType, defineField, defineArrayMember } from 'sanity'

export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  fields: [
    // === HERO SECTION ===
    defineField({
      name: 'heroImage',
      title: 'Hero Device Image',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt Text', type: 'string' })],
      description: 'Main device image displayed in the homepage hero banner',
    }),
    defineField({
      name: 'heroImageSlot1',
      title: 'Hero — Image Slot 1 (Bottom-Left Card)',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt Text', type: 'string' })],
      description: 'Lifestyle image shown in the bottom-left card of the hero section',
    }),
    defineField({
      name: 'heroImageSlot2',
      title: 'Hero — Image Slot 2 (Top-Right Card)',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt Text', type: 'string' })],
      description: 'Lifestyle image shown in the top-right card of the hero section',
    }),
    defineField({
      name: 'heroImageSlot3',
      title: 'Hero — Image Slot 3 (Customer Badge Card)',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt Text', type: 'string' })],
      description: 'Small image used in the customer social-proof badge in the hero section',
    }),

    // === HOW IT WORKS SECTION ===
    defineField({
      name: 'howItWorksSteps',
      title: 'How It Works — Steps',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'howItWorksStep',
          fields: [
            defineField({ name: 'title', title: 'Title', type: 'string' }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
            defineField({
              name: 'image',
              title: 'Step Image',
              type: 'image',
              options: { hotspot: true },
              fields: [defineField({ name: 'alt', title: 'Alt Text', type: 'string' })],
            }),
            defineField({
              name: 'href',
              title: 'Link URL',
              type: 'string',
              description: 'Destination when user clicks "Explore" (e.g. /devices)',
            }),
          ],
          preview: {
            select: { title: 'title', media: 'image' },
          },
        }),
      ],
      validation: (Rule) => Rule.max(3),
      description: 'The 3-step cards with photo backgrounds on the homepage',
    }),

    // === WHY CHOOSE SECTION ===
    defineField({
      name: 'whyChooseImage',
      title: 'Why Choose — Lifestyle Image',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt Text', type: 'string' })],
      description: 'Family/lifestyle image shown in the "Why Choose" grid (top-right cell)',
    }),

    // === CERTIFICATIONS SECTION ===
    defineField({
      name: 'certifications',
      title: 'Certifications',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'certification',
          fields: [
            defineField({ name: 'name', title: 'Name', type: 'string' }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
            defineField({
              name: 'image',
              title: 'Certification Logo',
              type: 'image',
              options: { hotspot: true },
              fields: [defineField({ name: 'alt', title: 'Alt Text', type: 'string' })],
            }),
            defineField({
              name: 'scaleUp',
              title: 'Scale Up Image',
              type: 'boolean',
              description: 'Enable to display the logo at 2× scale (useful for small logos)',
              initialValue: false,
            }),
          ],
          preview: {
            select: { title: 'name', media: 'image' },
          },
        }),
      ],
      description: 'Certification logos and descriptions (TMA, ESA, UL, etc.)',
    }),

    // === TRUST BAR / PARTNER LOGOS ===
    defineField({
      name: 'trustBarLogos',
      title: 'Trust Bar — Partner Logos',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: false },
          fields: [defineField({ name: 'alt', title: 'Alt Text', type: 'string' })],
        }),
      ],
      description: 'Logos displayed in the scrolling trust bar marquee below the hero',
    }),

    // === FEATURE DIAGRAM WATERMARK ===
    defineField({
      name: 'featureDiagramWatermark',
      title: 'Feature Diagram — Watermark Image',
      type: 'image',
      fields: [defineField({ name: 'alt', title: 'Alt Text', type: 'string' })],
      description: 'SVG or image used as the large background watermark in the feature diagram section',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Home Page' }
    },
  },
})

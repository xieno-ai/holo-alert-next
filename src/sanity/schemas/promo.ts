import { defineType, defineField, defineArrayMember } from 'sanity'

export const promo = defineType({
  name: 'promo',
  title: 'Promotion',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Internal title for editors — e.g. "Spring 2026 Sale Banner"',
    }),
    defineField({
      name: 'body',
      title: 'Promotional Copy',
      type: 'text',
      rows: 3,
      description: 'The promotional message displayed to visitors',
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      validation: (Rule) => Rule.required(),
      description:
        'Master switch. Set false to immediately hide without deleting. Date range is also checked.',
      initialValue: false,
    }),
    defineField({
      name: 'startDate',
      title: 'Start Date',
      type: 'datetime',
      description:
        'Promotion starts displaying at this time (UTC). Leave blank for no start restriction.',
    }),
    defineField({
      name: 'endDate',
      title: 'End Date',
      type: 'datetime',
      description:
        'Promotion stops displaying after this time (UTC). Leave blank for no end restriction.',
    }),
    defineField({
      name: 'ctaText',
      title: 'CTA Button Label',
      type: 'string',
      description: 'e.g. "Shop Now", "Claim Offer"',
    }),
    defineField({
      name: 'ctaUrl',
      title: 'CTA Destination URL',
      type: 'url',
      description: 'Where the CTA button links to',
    }),
    defineField({
      name: 'targetPages',
      title: 'Target Pages',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'string',
          options: {
            list: [
              { title: 'Homepage', value: 'homepage' },
              { title: 'Holo Pro', value: 'holo-pro' },
              { title: 'Holo Mini', value: 'holo-mini' },
              { title: 'Holo Active', value: 'holo-active' },
              { title: 'Checkout', value: 'checkout' },
              { title: 'Savings Program', value: 'savings-program' },
              { title: 'Referral Program', value: 'referral-program' },
              { title: 'General', value: 'general' },
            ],
          },
        }),
      ],
      description:
        'Which pages show this promotion. Empty = no pages (but keep isActive false too).',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'isActive',
    },
    prepare(selection) {
      const { title, subtitle } = selection
      return {
        title,
        subtitle: subtitle ? 'ACTIVE' : 'Inactive',
      }
    },
  },
})

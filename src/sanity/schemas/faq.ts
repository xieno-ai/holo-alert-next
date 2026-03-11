import { defineType, defineField, defineArrayMember } from 'sanity'

export const faq = defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  fields: [
    defineField({
      name: 'question',
      title: 'Question',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'answer',
      title: 'Answer',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'pages',
      title: 'Pages',
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
      description: 'Which pages should display this FAQ. One document can appear on multiple pages.',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Device-Specific', value: 'device-specific' },
          { title: 'Billing', value: 'billing' },
          { title: 'Monitoring', value: 'monitoring' },
          { title: 'Shipping', value: 'shipping' },
          { title: 'General', value: 'general' },
        ],
      },
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
      description: 'Lower numbers appear first within a page context',
      initialValue: 99,
    }),
  ],
  orderings: [
    {
      title: 'Sort Order',
      name: 'sortOrderAsc',
      by: [{ field: 'sortOrder', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'question', subtitle: 'category' },
  },
})

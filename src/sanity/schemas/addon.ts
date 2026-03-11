import { defineType, defineField, defineArrayMember } from 'sanity'

export const addon = defineType({
  name: 'addon',
  title: 'Add-on',
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
      name: 'shortDescription',
      title: 'Short Description',
      type: 'string',
      description: 'One-liner shown on the add-on toggle card (e.g. "2-year device warranty")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Full Description',
      type: 'text',
      rows: 3,
      description: 'Expanded description shown when the user opens the add-on details',
    }),
    defineField({
      name: 'priceMonthly',
      title: 'Monthly Price (Display)',
      type: 'number',
      description: 'Price shown on the card when customer selects the Monthly plan. Display only — use Stripe fields for checkout.',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'priceAnnual',
      title: 'Annual Price (Display)',
      type: 'number',
      description: 'Price shown on the card when customer selects the Annual plan. Display only — use Stripe fields for checkout.',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'billingInterval',
      title: 'Billing Type',
      type: 'string',
      options: {
        list: [
          { title: 'One-time (charged once at checkout)', value: 'one-time' },
          { title: 'Recurring (follows the customer\'s plan — monthly or annual)', value: 'recurring' },
        ],
        layout: 'radio',
      },
      initialValue: 'recurring',
      description: 'Recurring add-ons use the Monthly Stripe Price ID when the customer picks a monthly plan, and the Annual Stripe Price ID when they pick annual.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'stripePriceIdMonthly',
      title: 'Stripe Price ID — Monthly',
      type: 'string',
      description: 'Used when customer is on the Monthly plan. Starts with price_.',
      validation: (Rule) =>
        Rule.regex(/^price_/, { name: 'Stripe Price ID', invert: false }).warning(
          'Should start with "price_"',
        ),
    }),
    defineField({
      name: 'stripePriceIdAnnual',
      title: 'Stripe Price ID — Annual',
      type: 'string',
      description: 'Used when customer is on the Annual plan. Starts with price_.',
      validation: (Rule) =>
        Rule.regex(/^price_/, { name: 'Stripe Price ID', invert: false }).warning(
          'Should start with "price_"',
        ),
    }),
    defineField({
      name: 'appliesToAllDevices',
      title: 'Applies to All Devices',
      type: 'boolean',
      description: 'If checked, this add-on is shown on every product page.',
      initialValue: false,
    }),
    defineField({
      name: 'applicableDevices',
      title: 'Applicable Devices',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'device' }] })],
      description: 'Select which devices this add-on applies to. Ignored if "Applies to All Devices" is checked.',
      hidden: ({ document }) => !!document?.appliesToAllDevices,
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      description: 'Uncheck to hide this add-on without deleting it.',
      initialValue: true,
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
      description: 'Lower numbers appear first.',
      initialValue: 10,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'shortDescription',
      active: 'isActive',
    },
    prepare({ title, subtitle, active }) {
      return {
        title: `${active === false ? '⏸ ' : ''}${title}`,
        subtitle,
      }
    },
  },
})

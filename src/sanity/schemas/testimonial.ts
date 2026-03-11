import { defineType, defineField } from 'sanity'

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Customer Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
    }),
    defineField({
      name: 'body',
      title: 'Review',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role / Relationship',
      type: 'string',
      description:
        'Optional. e.g. "Daughter of Holo Alert user". Not in Webflow export — add editorially.',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'Customer location, e.g. "Saskatchewan, Canada". From Webflow export.',
    }),
    defineField({
      name: 'rating',
      title: 'Rating',
      type: 'number',
      description: '1 to 5 stars',
      validation: (Rule) => Rule.integer().min(1).max(5),
    }),
    defineField({
      name: 'date',
      title: 'Review Date',
      type: 'date',
    }),
    defineField({
      name: 'productSlug',
      title: 'Product',
      type: 'string',
      description:
        'Device slug this review is for, e.g. "holo-pro", "holo-mini", "holo-active". Stored as string to avoid broken refs during import.',
      options: {
        list: [
          { title: 'Holo Pro', value: 'holo-pro' },
          { title: 'Holo Mini', value: 'holo-mini' },
          { title: 'Holo Active', value: 'holo-active' },
        ],
      },
    }),
    defineField({
      name: 'isApproved',
      title: 'Approved',
      type: 'boolean',
      description:
        'Only approved testimonials are displayed on the site. Default true for migrated data, false for new submissions.',
      initialValue: false,
    }),

    // === MIGRATION AID ===
    defineField({
      name: 'webflowId',
      title: 'Webflow Item ID',
      type: 'string',
      description:
        'Webflow CMS Item ID — used during Phase 3 import to prevent duplicates. Remove post-migration.',
      hidden: true,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'body',
    },
    prepare(selection) {
      const { title, subtitle } = selection
      return {
        title,
        subtitle: subtitle ? subtitle.substring(0, 60) + '...' : '',
      }
    },
  },
})

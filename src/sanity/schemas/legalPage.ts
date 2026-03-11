import { defineType, defineField } from 'sanity'

export const legalPage = defineType({
  name: 'legalPage',
  title: 'Legal Page',
  type: 'document',
  fields: [
    defineField({
      name: 'pageType',
      title: 'Page Type',
      type: 'string',
      options: {
        list: [
          { title: 'Terms & Conditions', value: 'terms' },
          { title: 'Privacy Policy', value: 'privacy' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'effectiveDate',
      title: 'Effective Date',
      type: 'date',
    }),
    defineField({
      name: 'lastUpdatedDate',
      title: 'Last Updated Date',
      type: 'date',
    }),
    defineField({
      name: 'content',
      title: 'Page Content',
      type: 'array',
      description:
        'Use "Section Title (H2)" for numbered section headers, "Sub-heading (H3)" for sub-sections, Normal for body text, Bullet for lists, and "Legal Disclaimer" for uppercase liability/warranty clauses.',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Section Title (H2)', value: 'h2' },
            { title: 'Sub-heading (H3)', value: 'h3' },
            { title: 'Legal Disclaimer (uppercase)', value: 'legalNote' },
          ],
          lists: [{ title: 'Bullet', value: 'bullet' }],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  defineField({
                    name: 'href',
                    type: 'string',
                    title: 'URL',
                    validation: (Rule) => Rule.required(),
                  }),
                ],
              },
            ],
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'pageType',
    },
    prepare({ title, subtitle }) {
      return {
        title: title || 'Untitled Legal Page',
        subtitle: subtitle === 'terms' ? 'Terms & Conditions' : subtitle === 'privacy' ? 'Privacy Policy' : subtitle,
      }
    },
  },
})

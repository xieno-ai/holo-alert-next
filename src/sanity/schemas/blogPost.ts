import { defineType, defineField, defineArrayMember } from 'sanity'

export const blogPost = defineType({
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      description: 'Controls blog post chronological ordering',
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
      description: 'Author name (plain text). Webflow used e.g. "David Krawczyk".',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      description: 'Blog category tag, e.g. "Technology & Devices". Plain text in Webflow.',
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt / Meta Description',
      type: 'text',
      rows: 3,
      description:
        'Used as blog list summary AND as the page meta description. Corresponds to Webflow "Meta Description / Summary" column.',
      validation: (Rule) =>
        Rule.max(160).warning('Keep under 160 characters for optimal SEO display'),
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Thumbnail image used in blog listing pages and social sharing',
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: { hotspot: true },
      description:
        'Full-width banner image displayed at top of blog detail page. Separate from mainImage.',
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        defineArrayMember({ type: 'block' }),
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', title: 'Alt Text', type: 'string' }),
            defineField({ name: 'caption', title: 'Caption', type: 'string' }),
          ],
        }),
        defineArrayMember({
          name: 'table',
          title: 'Table',
          type: 'object',
          fields: [
            defineField({
              name: 'rows',
              title: 'Rows',
              type: 'array',
              of: [
                defineArrayMember({
                  name: 'row',
                  title: 'Row',
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'cells',
                      title: 'Cells',
                      type: 'array',
                      of: [defineArrayMember({ type: 'string' })],
                    }),
                  ],
                  preview: {
                    select: { cells: 'cells' },
                    prepare: ({ cells }: { cells?: string[] }) => ({
                      title: (cells ?? []).join(' | '),
                    }),
                  },
                }),
              ],
            }),
          ],
          preview: {
            select: { rows: 'rows' },
            prepare: ({ rows }: { rows?: { cells?: string[] }[] }) => ({
              title: `Table (${rows?.length ?? 0} rows)`,
            }),
          },
        }),
      ],
      description:
        'Portable Text body — converted from Webflow HTML via html-to-pte. Webflow column: "Main text".',
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured Post',
      type: 'boolean',
      description:
        'Pin this post to featured placement on the blog index. Webflow column: "Featured Blog".',
      initialValue: false,
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO Title Override',
      type: 'string',
      description:
        'Optional. Overrides the post title in <title> meta tag. Leave blank to use post title.',
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
      title: 'title',
      subtitle: 'publishedAt',
      media: 'mainImage',
    },
  },
})

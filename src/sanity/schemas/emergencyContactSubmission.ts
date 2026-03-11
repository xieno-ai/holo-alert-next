import { defineType, defineField } from 'sanity'

export const emergencyContactSubmission = defineType({
  name: 'emergencyContactSubmission',
  title: 'Emergency Contact Submission',
  type: 'document',
  fields: [
    defineField({
      name: 'firstName',
      title: 'First Name',
      type: 'string',
    }),
    defineField({
      name: 'lastName',
      title: 'Last Name',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
    }),
    defineField({
      name: 'primaryContactName',
      title: 'Primary Emergency Contact Name',
      type: 'string',
    }),
    defineField({
      name: 'primaryContactPhone',
      title: 'Primary Emergency Contact Phone',
      type: 'string',
    }),
    defineField({
      name: 'secondaryContactName',
      title: 'Secondary Emergency Contact Name',
      type: 'string',
    }),
    defineField({
      name: 'secondaryContactPhone',
      title: 'Secondary Emergency Contact Phone',
      type: 'string',
    }),
    defineField({
      name: 'streetAddress',
      title: 'Street Address',
      type: 'string',
    }),
    defineField({
      name: 'unitNumber',
      title: 'Unit Number',
      type: 'string',
    }),
    defineField({
      name: 'postalCode',
      title: 'Postal Code',
      type: 'string',
    }),
    defineField({
      name: 'city',
      title: 'City',
      type: 'string',
    }),
    defineField({
      name: 'country',
      title: 'Country',
      type: 'string',
    }),
    defineField({
      name: 'userPhone',
      title: 'Medical Alert User Phone',
      type: 'string',
    }),
    defineField({
      name: 'submittedAt',
      title: 'Submitted At',
      type: 'datetime',
      readOnly: true,
    }),
  ],
  orderings: [
    {
      title: 'Newest First',
      name: 'submittedAtDesc',
      by: [{ field: 'submittedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      firstName: 'firstName',
      lastName: 'lastName',
      email: 'email',
      submittedAt: 'submittedAt',
    },
    prepare({ firstName, lastName, email, submittedAt }) {
      const name = [firstName, lastName].filter(Boolean).join(' ') || 'Unknown'
      const date = submittedAt
        ? new Date(submittedAt).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })
        : ''
      return {
        title: name,
        subtitle: `${email || ''} ${date ? `— ${date}` : ''}`,
      }
    },
  },
})

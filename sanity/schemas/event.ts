import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: r => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' }, validation: r => r.required() }),
    defineField({ name: 'startDate', title: 'Start Date & Time', type: 'datetime', validation: r => r.required() }),
    defineField({ name: 'endDate', title: 'End Date & Time', type: 'datetime' }),
    defineField({ name: 'location', title: 'Location', type: 'string' }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 4 }),
    defineField({ name: 'image', title: 'Event Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'rsvpLink', title: 'RSVP / Registration Link', type: 'url' }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: { list: ['Worship', 'Community', 'Youth', 'Outreach', 'Prayer', 'Study', 'Other'] },
    }),
    defineField({ name: 'featured', title: 'Featured', type: 'boolean', initialValue: false }),
  ],
  orderings: [{ title: 'Start Date', name: 'startDateAsc', by: [{ field: 'startDate', direction: 'asc' }] }],
  preview: {
    select: { title: 'title', subtitle: 'startDate', media: 'image' },
  },
})

import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'pastor',
  title: 'Pastor / Staff',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Full Name', type: 'string', validation: r => r.required() }),
    defineField({ name: 'title', title: 'Title / Role', type: 'string', validation: r => r.required() }),
    defineField({ name: 'bio', title: 'Biography', type: 'text', rows: 5 }),
    defineField({ name: 'photo', title: 'Photo', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'email', title: 'Email', type: 'email' }),
    defineField({ name: 'order', title: 'Display Order', type: 'number', initialValue: 99 }),
  ],
  orderings: [{ title: 'Display Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'name', subtitle: 'title', media: 'photo' },
  },
})

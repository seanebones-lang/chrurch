import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'sermon',
  title: 'Sermon',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: r => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' }, validation: r => r.required() }),
    defineField({ name: 'date', title: 'Date', type: 'date', validation: r => r.required() }),
    defineField({ name: 'speaker', title: 'Speaker', type: 'string' }),
    defineField({ name: 'series', title: 'Series', type: 'string' }),
    defineField({ name: 'scripture', title: 'Scripture Reference', type: 'string' }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
    defineField({ name: 'thumbnail', title: 'Thumbnail', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'audioFile', title: 'Audio File', type: 'file', options: { accept: 'audio/*' } }),
    defineField({ name: 'videoUrl', title: 'Video URL (YouTube/Vimeo)', type: 'url' }),
    defineField({
      name: 'transcript',
      title: 'Sermon Notes / Transcript',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({ name: 'featured', title: 'Featured on Homepage', type: 'boolean', initialValue: false }),
  ],
  orderings: [{ title: 'Date, newest', name: 'dateDesc', by: [{ field: 'date', direction: 'desc' }] }],
  preview: {
    select: { title: 'title', subtitle: 'date', media: 'thumbnail' },
  },
})

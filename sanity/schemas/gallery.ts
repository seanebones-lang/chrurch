import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'gallery',
  title: 'Gallery',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Gallery Title', type: 'string', validation: r => r.required() }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: { list: ['Worship', 'Community', 'Youth', 'Outreach', 'Events', 'General'] },
    }),
    defineField({
      name: 'photos',
      title: 'Photos',
      type: 'array',
      of: [{
        type: 'image',
        options: { hotspot: true },
        fields: [
          defineField({ name: 'alt', title: 'Alt Text', type: 'string' }),
          defineField({ name: 'caption', title: 'Caption', type: 'string' }),
        ],
      }],
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'category', media: 'photos.0' },
  },
})

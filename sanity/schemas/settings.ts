import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'settings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'churchName',
      title: 'Church Name',
      type: 'string',
      initialValue: 'Harvest Fellowship Baptist Church',
    }),
    defineField({ name: 'tagline', title: 'Tagline', type: 'string' }),
    defineField({
      name: 'welcomeSectionImage',
      title: 'Home “Welcome” section image',
      description: 'Photo beside “First Time Here?” on the homepage. Optional.',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({ name: 'logo', title: 'Logo', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'serviceTimes',
      title: 'Service Times',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'day', title: 'Day', type: 'string' }),
          defineField({ name: 'time', title: 'Time', type: 'string' }),
          defineField({ name: 'name', title: 'Service Name', type: 'string' }),
        ],
        preview: { select: { title: 'name', subtitle: 'day' } },
      }],
    }),
    defineField({ name: 'address', title: 'Address', type: 'text', rows: 3 }),
    defineField({ name: 'phone', title: 'Phone Number', type: 'string' }),
    defineField({ name: 'email', title: 'General Email', type: 'email' }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'object',
      fields: [
        defineField({ name: 'facebook', title: 'Facebook URL', type: 'url' }),
        defineField({ name: 'instagram', title: 'Instagram URL', type: 'url' }),
        defineField({ name: 'youtube', title: 'YouTube URL', type: 'url' }),
        defineField({ name: 'spotify', title: 'Spotify URL', type: 'url' }),
      ],
    }),
    defineField({ name: 'primaryColor', title: 'Primary Color (hex)', type: 'string', initialValue: '#2563eb' }),
    defineField({ name: 'accentColor', title: 'Accent Color (hex)', type: 'string', initialValue: '#c9a227' }),
    defineField({ name: 'giveLink', title: 'Giving Page URL (external)', type: 'url' }),
  ],
  preview: {
    prepare: () => ({ title: 'Site Settings' }),
  },
})

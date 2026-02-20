import type { CollectionConfig } from 'payload'
import { slugify } from '../util/slugify'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            const source = typeof value === 'string' && value.length > 0 ? value : String(data?.title || '')
            return slugify(source)
          },
        ],
      },
    },
    {
      name: 'summary',
      type: 'textarea',
    },
    {
      name: 'heroHeadline',
      type: 'text',
    },
    {
      name: 'heroCopy',
      type: 'textarea',
    },
    {
      name: 'content',
      type: 'richText',
    },
  ],
}

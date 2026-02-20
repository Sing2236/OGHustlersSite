import type { CollectionConfig } from 'payload'
import { slugify } from '../util/slugify'

export const News: CollectionConfig = {
  slug: 'news',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'publishedAt', '_status', 'updatedAt'],
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
      name: 'publishedAt',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
      maxLength: 220,
    },
    {
      name: 'body',
      type: 'richText',
      required: true,
    },
  ],
}

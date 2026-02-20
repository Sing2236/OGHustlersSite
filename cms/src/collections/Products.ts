import type { CollectionConfig } from 'payload'
import { slugify } from '../util/slugify'

export const Products: CollectionConfig = {
  slug: 'products',
  dbName: 'cms_products',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'price', 'active', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      index: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            const source = typeof value === 'string' && value.length > 0 ? value : String(data?.name || '')
            return slugify(source)
          },
        ],
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: ['Vape', 'Hardware', 'THCA', 'E-Liquid', 'Glass', 'Accessories', 'Featured'],
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        step: 0.01,
      },
    },
    {
      name: 'shortDescription',
      type: 'textarea',
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}

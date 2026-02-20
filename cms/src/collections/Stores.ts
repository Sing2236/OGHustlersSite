import type { CollectionConfig } from 'payload'

export const Stores: CollectionConfig = {
  slug: 'stores',
  dbName: 'cms_stores',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'phone', 'hours', 'updatedAt'],
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
      name: 'address',
      type: 'textarea',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
    },
    {
      name: 'hours',
      type: 'text',
      required: true,
    },
    {
      name: 'mapsUrl',
      type: 'text',
      required: true,
    },
    {
      name: 'displayOrder',
      type: 'number',
      defaultValue: 0,
      admin: {
        step: 1,
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}

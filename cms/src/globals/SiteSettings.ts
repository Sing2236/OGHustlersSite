import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'brandName',
      type: 'text',
      required: true,
      defaultValue: 'OG Hustlers Vape & Smoke',
    },
    {
      name: 'tagline',
      type: 'text',
      required: true,
      defaultValue: 'Premium vape hardware, lab-tested THCA, and curated smoke essentials',
    },
    {
      name: 'supportEmail',
      type: 'email',
      required: true,
      defaultValue: 'support@oghustlers.com',
    },
    {
      name: 'supportPhone',
      type: 'text',
      required: true,
      defaultValue: '+1 (555) 010-2424',
    },
    {
      name: 'promoBarText',
      type: 'text',
      defaultValue: 'Adult 21+ Retail | Curated Vape and Smoke Inventory | Daily Store Support',
    },
    {
      name: 'heroBody',
      type: 'textarea',
      defaultValue:
        'Retail-focused service, polished presentation, and fast support across every location. Built for customers who expect quality and consistency.',
    },
  ],
}

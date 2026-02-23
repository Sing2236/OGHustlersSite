import type { Product } from '@/payload-types'

export const PRODUCT_CATEGORY_ORDER = [
  'Vape',
  'Hardware',
  'THCA',
  'E-Liquid',
  'Glass',
  'Accessories',
  'Featured',
] as const

export type ProductCategory = (typeof PRODUCT_CATEGORY_ORDER)[number]

export type SocialLink = {
  label: string
  href: string
}

const CATEGORY_PALETTE: Record<string, { from: string; to: string; tone: string }> = {
  Vape: { from: '#14c7b8', to: '#0f8f86', tone: '#c6f8f2' },
  Hardware: { from: '#fa8231', to: '#d95f12', tone: '#ffe2cc' },
  THCA: { from: '#54b948', to: '#2b8c29', tone: '#ddffd8' },
  'E-Liquid': { from: '#3f8efc', to: '#1c62d6', tone: '#d9e8ff' },
  Glass: { from: '#45b0de', to: '#17698c', tone: '#d9f3ff' },
  Accessories: { from: '#fdcb6e', to: '#cf8f14', tone: '#ffefc8' },
  Featured: { from: '#fa5f4a', to: '#d6381f', tone: '#ffe0db' },
}

export function toTitleCase(value: string): string {
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.slice(0, 1).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ')
}

export function normalizeCategory(value: string): string {
  const title = toTitleCase(value)
  const match = PRODUCT_CATEGORY_ORDER.find((entry) => entry.toLowerCase() === title.toLowerCase())
  return match || title
}

export function buildCategoryList(rawCategories: string[]): string[] {
  const unique = new Set<string>()

  for (const item of rawCategories) {
    if (!item) continue
    unique.add(normalizeCategory(item))
  }

  const ordered: string[] = []

  for (const option of PRODUCT_CATEGORY_ORDER) {
    if (unique.has(option)) {
      ordered.push(option)
      unique.delete(option)
    }
  }

  const overflow = Array.from(unique).sort((a, b) => a.localeCompare(b))
  return [...ordered, ...overflow]
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatDateLabel(value: string): string {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Unscheduled'
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

export function buildTelLink(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`
}

export function buildMapEmbedUrl(location: string): string {
  const query = encodeURIComponent(location)
  return `https://www.google.com/maps?q=${query}&output=embed`
}

export function buildDirectionsUrl(value: string): string {
  if (!value) return '#'
  if (/^https?:\/\//i.test(value)) return value
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(value)}`
}

export function getSocialLinksFromEnv(): SocialLink[] {
  const links: SocialLink[] = [
    {
      label: 'Instagram',
      href: process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://instagram.com',
    },
    {
      label: 'Facebook',
      href: process.env.NEXT_PUBLIC_FACEBOOK_URL || 'https://facebook.com',
    },
    {
      label: 'TikTok',
      href: process.env.NEXT_PUBLIC_TIKTOK_URL || 'https://tiktok.com',
    },
  ]

  return links.filter((link) => /^https?:\/\//i.test(link.href))
}

function buildCategoryPlaceholder(category: string): string {
  const palette = CATEGORY_PALETTE[category] || CATEGORY_PALETTE.Featured
  const label = encodeURIComponent(category.toUpperCase())
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='960' height='640' viewBox='0 0 960 640'>
<defs>
<linearGradient id='g' x1='0' x2='1' y1='0' y2='1'>
<stop offset='0%' stop-color='${palette.from}' />
<stop offset='100%' stop-color='${palette.to}' />
</linearGradient>
</defs>
<rect width='960' height='640' fill='url(#g)' />
<circle cx='820' cy='120' r='180' fill='${palette.tone}' fill-opacity='0.25' />
<circle cx='120' cy='560' r='180' fill='${palette.tone}' fill-opacity='0.2' />
<text x='60' y='560' fill='${palette.tone}' font-family='Verdana, Geneva, sans-serif' font-size='92' font-weight='700'>${label}</text>
</svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

export function resolveProductImage(product: Product): string {
  const withImage = product as Product & {
    image?: { url?: string | null } | string | null
    imageUrl?: string | null
  }

  if (typeof withImage.imageUrl === 'string' && withImage.imageUrl.length > 0) {
    return withImage.imageUrl
  }

  if (typeof withImage.image === 'string' && withImage.image.length > 0) {
    return withImage.image
  }

  if (withImage.image && typeof withImage.image === 'object' && typeof withImage.image.url === 'string') {
    return withImage.image.url
  }

  return buildCategoryPlaceholder(product.category)
}

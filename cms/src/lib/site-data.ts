import config from '@/payload.config'
import type { News, Page, Product, SiteSetting, Store } from '@/payload-types'
import { getPayload } from 'payload'

import { buildCategoryList } from './site-utils'

export type SiteBranding = Pick<
  SiteSetting,
  'brandName' | 'tagline' | 'supportEmail' | 'supportPhone' | 'promoBarText' | 'heroBody'
>

export type CatalogResult = {
  docs: Product[]
  page: number
  totalPages: number
  totalDocs: number
  hasNextPage: boolean
}

const FALLBACK_SITE_SETTINGS: SiteBranding = {
  brandName: 'OG Hustlers Vape & Smoke',
  tagline: 'Premium vape hardware, curated THCA, and trusted smoke essentials.',
  supportEmail: 'support@oghustlers.com',
  supportPhone: '+1 (555) 010-2424',
  promoBarText: 'Adult 21+ Retail | Curated Vape and Smoke Inventory | Daily Store Support',
  heroBody:
    'Retail-focused service, polished presentation, and fast support across every location.',
}

async function getPayloadClient() {
  return getPayload({ config: await config })
}

export async function getSiteSettings(): Promise<SiteBranding> {
  try {
    const payload = await getPayloadClient()
    const settings = await payload.findGlobal({
      slug: 'site-settings',
    })

    return {
      brandName: settings.brandName || FALLBACK_SITE_SETTINGS.brandName,
      tagline: settings.tagline || FALLBACK_SITE_SETTINGS.tagline,
      supportEmail: settings.supportEmail || FALLBACK_SITE_SETTINGS.supportEmail,
      supportPhone: settings.supportPhone || FALLBACK_SITE_SETTINGS.supportPhone,
      promoBarText: settings.promoBarText || FALLBACK_SITE_SETTINGS.promoBarText,
      heroBody: settings.heroBody || FALLBACK_SITE_SETTINGS.heroBody,
    }
  } catch {
    return FALLBACK_SITE_SETTINGS
  }
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  try {
    const payload = await getPayloadClient()

    const publishedResult = await payload.find({
      collection: 'pages',
      where: {
        slug: { equals: slug },
        _status: { equals: 'published' },
      },
      limit: 1,
      sort: '-updatedAt',
    })

    if (publishedResult.docs[0]) {
      return publishedResult.docs[0]
    }

    const fallbackResult = await payload.find({
      collection: 'pages',
      where: {
        slug: { equals: slug },
      },
      limit: 1,
      sort: '-updatedAt',
    })

    return fallbackResult.docs[0] || null
  } catch {
    return null
  }
}

export async function getFeaturedProducts(limit = 6): Promise<Product[]> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'products',
      where: {
        active: { equals: true },
        featured: { equals: true },
      },
      sort: '-updatedAt',
      limit,
    })

    return result.docs
  } catch {
    return []
  }
}

export async function getLatestNews(limit = 3): Promise<News[]> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'news',
      where: {
        _status: { equals: 'published' },
      },
      sort: '-publishedAt',
      limit,
    })

    return result.docs
  } catch {
    return []
  }
}

export async function getStores(limit = 100): Promise<Store[]> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'stores',
      where: {
        active: { equals: true },
      },
      sort: 'displayOrder',
      limit,
    })

    return result.docs
  } catch {
    return []
  }
}

export async function getCatalogPage(args?: {
  category?: string
  page?: number
  limit?: number
}): Promise<CatalogResult> {
  const page = Math.max(1, Number(args?.page || 1))
  const limit = Math.max(1, Math.min(24, Number(args?.limit || 12)))
  const category = args?.category && args.category !== 'all' ? args.category : null

  try {
    const payload = await getPayloadClient()
    const where: {
      active: { equals: boolean }
      category?: { equals: string }
    } = {
      active: { equals: true },
    }

    if (category) {
      where.category = { equals: category }
    }

    const result = await payload.find({
      collection: 'products',
      where,
      page,
      limit,
      sort: '-updatedAt',
    })

    return {
      docs: result.docs,
      page: result.page || 1,
      totalPages: result.totalPages || 1,
      totalDocs: result.totalDocs || 0,
      hasNextPage: Boolean(result.hasNextPage),
    }
  } catch {
    return {
      docs: [],
      page: 1,
      totalPages: 1,
      totalDocs: 0,
      hasNextPage: false,
    }
  }
}

export async function getCatalogCategories(): Promise<string[]> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'products',
      where: {
        active: { equals: true },
      },
      limit: 300,
      sort: 'category',
    })

    const categories = result.docs.map((product) => product.category).filter(Boolean)
    return buildCategoryList(categories)
  } catch {
    return []
  }
}

import type { Metadata } from 'next'

import { CatalogClient } from '@/components/site/CatalogClient'
import { getCatalogCategories, getCatalogPage, getPageBySlug } from '@/lib/site-data'

export const metadata: Metadata = {
  title: 'Catalogue',
  description:
    'Browse devices, e-liquids, accessories, and featured inventory with dynamic filters and pagination.',
}

type ShopPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = (await searchParams) || {}
  const requestedCategory = typeof params.category === 'string' ? params.category : 'all'

  const [shopPage, categories] = await Promise.all([getPageBySlug('shop'), getCatalogCategories()])

  const normalizedCategory =
    requestedCategory !== 'all' && categories.includes(requestedCategory) ? requestedCategory : 'all'

  const initialCatalog = await getCatalogPage({
    category: normalizedCategory,
    page: 1,
    limit: 12,
  })

  return (
    <>
      <section className="pageIntro">
        <p className="pill">Shop Catalogue</p>
        <h1>{shopPage?.heroHeadline || 'Curated Inventory, Transparent Pricing'}</h1>
        <p>
          {shopPage?.summary ||
            'All products, pricing, and availability are dynamically rendered from Payload CMS collections.'}
        </p>
      </section>

      <CatalogClient
        initialProducts={initialCatalog.docs}
        initialPage={initialCatalog.page}
        initialTotalPages={initialCatalog.totalPages}
        initialCategory={normalizedCategory}
        categories={categories}
        pageSize={12}
      />
    </>
  )
}

'use client'
/* eslint-disable @next/next/no-img-element */

import { useRef, useState, useTransition } from 'react'

import type { Product } from '@/payload-types'
import { formatCurrency, resolveProductImage } from '@/lib/site-utils'

type CatalogResponse = {
  docs: Product[]
  page: number
  totalPages: number
  hasNextPage: boolean
}

type CatalogClientProps = {
  initialProducts: Product[]
  initialPage: number
  initialTotalPages: number
  initialCategory: string
  categories: string[]
  pageSize: number
}

export function CatalogClient({
  initialProducts,
  initialPage,
  initialTotalPages,
  initialCategory,
  categories,
  pageSize,
}: CatalogClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [totalPages, setTotalPages] = useState(initialTotalPages)
  const [activeCategory, setActiveCategory] = useState(initialCategory)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const requestToken = useRef(0)

  const hasMore = currentPage < totalPages

  const fetchCatalog = async (params: {
    category: string
    page: number
    append: boolean
  }): Promise<void> => {
    const token = requestToken.current + 1
    requestToken.current = token

    const query = new URLSearchParams({
      page: String(params.page),
      limit: String(pageSize),
      sort: '-updatedAt',
      'where[active][equals]': 'true',
    })

    if (params.category !== 'all') {
      query.set('where[category][equals]', params.category)
    }

    const response = await fetch(`/api/products?${query.toString()}`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch catalogue (${response.status})`)
    }

    const payload = (await response.json()) as CatalogResponse

    if (token !== requestToken.current) {
      return
    }

    setProducts((current) => (params.append ? [...current, ...payload.docs] : payload.docs))
    setCurrentPage(payload.page)
    setTotalPages(payload.totalPages || 1)
  }

  const applyCategory = (category: string) => {
    setActiveCategory(category)
    setError(null)
    startTransition(() => {
      void fetchCatalog({
        category,
        page: 1,
        append: false,
      }).catch(() => {
        setError('Unable to refresh products right now. Please try again.')
      })
    })
  }

  const loadMore = () => {
    if (!hasMore || isPending) return

    setError(null)
    startTransition(() => {
      void fetchCatalog({
        category: activeCategory,
        page: currentPage + 1,
        append: true,
      }).catch(() => {
        setError('Unable to load more products right now. Please try again.')
      })
    })
  }

  return (
    <section className="catalogShell">
      <div className="catalogToolbar">
        <p className="pill">Filter by category</p>
        <div className="chipGroup" role="tablist" aria-label="Product categories">
          <button
            type="button"
            role="tab"
            aria-selected={activeCategory === 'all'}
            className={`chipButton ${activeCategory === 'all' ? 'isActive' : ''}`}
            onClick={() => applyCategory('all')}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={activeCategory === category}
              className={`chipButton ${activeCategory === category ? 'isActive' : ''}`}
              onClick={() => applyCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {products.length === 0 && !isPending && (
        <p className="emptyMessage">
          No products are available for this filter yet. Update the Products collection in Payload CMS.
        </p>
      )}

      <div className="productsGrid">
        {products.map((product) => (
          <article key={product.id} className="productCard">
            <div className="productImageWrap">
              <img
                src={resolveProductImage(product)}
                alt={`${product.name} product`}
                loading="lazy"
                className="productImage"
              />
              <span className={`stockBadge ${product.active ? 'inStock' : 'outOfStock'}`}>
                {product.active ? 'In Stock' : 'Unavailable'}
              </span>
            </div>

            <div className="productMeta">
              <div className="productTop">
                <h3>{product.name}</h3>
                <p>{formatCurrency(product.price)}</p>
              </div>
              <p className="productCategory">{product.category}</p>
              <p className="productDescription">
                {product.shortDescription || 'Inventory refreshed frequently across all locations.'}
              </p>
            </div>
          </article>
        ))}
      </div>

      {error && <p className="errorMessage">{error}</p>}

      {hasMore && (
        <div className="catalogLoadMore">
          <button type="button" className="loadMoreButton" onClick={loadMore} disabled={isPending}>
            {isPending ? 'Loading...' : 'Load More Products'}
          </button>
        </div>
      )}
    </section>
  )
}

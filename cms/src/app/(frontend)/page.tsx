import type { Metadata } from 'next'
import Link from 'next/link'

import { PromoCarousel } from '@/components/site/PromoCarousel'
import { getCatalogPage, getFeaturedProducts, getLatestNews, getPageBySlug, getSiteSettings, getStores } from '@/lib/site-data'
import { formatDateLabel } from '@/lib/site-utils'

export const metadata: Metadata = {
  title: 'Home',
  description:
    'Premium vape hardware, curated products, featured promotions, and trusted store support across locations.',
}

export default async function HomePage() {
  const [siteSettings, homePage, featuredProducts, latestNews, stores, productCount] = await Promise.all([
    getSiteSettings(),
    getPageBySlug('home'),
    getFeaturedProducts(6),
    getLatestNews(3),
    getStores(),
    getCatalogPage({ limit: 1 }),
  ])

  const heroTitle = homePage?.heroHeadline || siteSettings.tagline
  const heroCopy = homePage?.heroCopy || siteSettings.heroBody || ''
  const heroSummary =
    homePage?.summary || 'Professional retail support, transparent sourcing, and a highly curated catalog.'

  return (
    <>
      <section className="heroPanel">
        <p className="pill">{siteSettings.promoBarText || 'Adult 21+ Retail Only'}</p>
        <h1 className="heroTitle">{heroTitle}</h1>
        <p className="heroCopy">{heroCopy}</p>
        <p className="heroSummary">{heroSummary}</p>
        <div className="heroActions">
          <Link href="/shop" className="buttonPrimary">
            Explore Catalogue
          </Link>
          <Link href="/contact" className="buttonGhost">
            Contact Team
          </Link>
        </div>
      </section>

      <section className="statsGrid" aria-label="Store and catalogue metrics">
        <article className="statCard">
          <p>Products</p>
          <strong>{productCount.totalDocs}</strong>
        </article>
        <article className="statCard">
          <p>Active Stores</p>
          <strong>{stores.length}</strong>
        </article>
        <article className="statCard">
          <p>CMS Driven</p>
          <strong>100%</strong>
        </article>
      </section>

      <section className="sectionPanel">
        <div className="sectionHeader">
          <h2 className="sectionHeading">Featured Promotions</h2>
          <p>Managed from Payload CMS using featured products and promo copy.</p>
        </div>
        <PromoCarousel products={featuredProducts} />
      </section>

      <section className="sectionPanel">
        <div className="sectionHeader">
          <h2 className="sectionHeading">Latest Announcements</h2>
          <p>Publish updates in Payload CMS to keep customers informed in real-time.</p>
        </div>
        <div className="newsGrid">
          {latestNews.map((item) => (
            <article key={item.id} className="newsCard">
              <p className="pill">{formatDateLabel(item.publishedAt)}</p>
              <h3>{item.title}</h3>
              <p>{item.excerpt}</p>
            </article>
          ))}
          {latestNews.length === 0 && (
            <p className="emptyMessage">No published announcements yet. Add content in the News collection.</p>
          )}
        </div>
      </section>
    </>
  )
}

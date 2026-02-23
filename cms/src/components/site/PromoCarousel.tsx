'use client'
/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

import type { Product } from '@/payload-types'
import { formatCurrency, resolveProductImage } from '@/lib/site-utils'

type PromoCarouselProps = {
  products: Product[]
}

export function PromoCarousel({ products }: PromoCarouselProps) {
  const slides = useMemo(() => products.slice(0, 6), [products])
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (slides.length < 2) return

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length)
    }, 6000)

    return () => window.clearInterval(timer)
  }, [slides.length])

  if (slides.length === 0) {
    return (
      <div className="promoFallback">
        <p>Featured promotions will appear here once products are marked as featured in Payload CMS.</p>
      </div>
    )
  }

  const activeSlide = slides[activeIndex]

  return (
    <section className="promoCarousel" aria-label="Featured products">
      <div className="promoMedia">
        <img
          className="promoImage"
          src={resolveProductImage(activeSlide)}
          alt={`${activeSlide.name} featured product`}
          loading="lazy"
        />
      </div>

      <div className="promoContent">
        <p className="pill">Featured Product</p>
        <h3>{activeSlide.name}</h3>
        <p>{activeSlide.shortDescription || 'Curated in-store and online for verified quality and consistency.'}</p>
        <div className="promoMeta">
          <span>{activeSlide.category}</span>
          <span>{formatCurrency(activeSlide.price)}</span>
        </div>
        <div className="heroActions">
          <Link className="buttonPrimary" href="/shop">
            Browse Catalogue
          </Link>
          <Link className="buttonGhost" href={`/shop?category=${encodeURIComponent(activeSlide.category)}`}>
            View {activeSlide.category}
          </Link>
        </div>
      </div>

      {slides.length > 1 && (
        <div className="promoNav" role="tablist" aria-label="Promotion slides">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              className={`promoDot ${index === activeIndex ? 'isActive' : ''}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show slide ${index + 1}`}
              aria-selected={index === activeIndex}
              role="tab"
            />
          ))}
        </div>
      )}
    </section>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'

import { ContactForm } from '@/components/site/ContactForm'
import { getPageBySlug, getSiteSettings, getStores } from '@/lib/site-data'
import {
  buildDirectionsUrl,
  buildMapEmbedUrl,
  buildTelLink,
  getSocialLinksFromEnv,
} from '@/lib/site-utils'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Reach the OG Hustlers team for product inquiries, support, and wholesale questions.',
}

export default async function ContactPage() {
  const [siteSettings, contactPage, stores] = await Promise.all([
    getSiteSettings(),
    getPageBySlug('contact'),
    getStores(1),
  ])

  const socialLinks = getSocialLinksFromEnv()
  const primaryStore = stores[0]
  const mapSource = primaryStore?.address || 'Greensboro NC'

  return (
    <>
      <section className="pageIntro">
        <p className="pill">Contact</p>
        <h1>{contactPage?.heroHeadline || 'Talk with the OG Hustlers Team'}</h1>
        <p>
          {contactPage?.summary ||
            'Use this form for product questions, support requests, and wholesale opportunities.'}
        </p>
      </section>

      <section className="contactLayout">
        <article className="contactCard">
          <h2>Send an Inquiry</h2>
          <p className="cardLead">All submissions route through a server endpoint and are delivered to your support inbox.</p>
          <ContactForm />
        </article>

        <aside className="contactCard">
          <h2>Direct Contact</h2>
          <div className="contactInfoList">
            <a href={`mailto:${siteSettings.supportEmail}`}>{siteSettings.supportEmail}</a>
            <a href={buildTelLink(siteSettings.supportPhone)}>{siteSettings.supportPhone}</a>
          </div>

          <h3>Social Media</h3>
          <div className="socialLinkList">
            {socialLinks.map((link) => (
              <Link key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">
                {link.label}
              </Link>
            ))}
          </div>

          <h3>Primary Store Map</h3>
          <iframe
            className="mapFrame"
            src={buildMapEmbedUrl(mapSource)}
            title="Primary store location map"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          {primaryStore && (
            <Link
              className="buttonGhost compact"
              href={buildDirectionsUrl(primaryStore.mapsUrl || primaryStore.address)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Get Directions
            </Link>
          )}
        </aside>
      </section>
    </>
  )
}

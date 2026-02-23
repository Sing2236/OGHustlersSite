import type { Metadata } from 'next'
import Link from 'next/link'

import { getPageBySlug, getStores } from '@/lib/site-data'
import { buildDirectionsUrl, buildMapEmbedUrl, buildTelLink } from '@/lib/site-utils'

export const metadata: Metadata = {
  title: 'Locations',
  description: 'Browse all store locations with hours, contact info, and mini-map previews.',
}

export default async function LocationsPage() {
  const [locationsPage, stores] = await Promise.all([getPageBySlug('locations'), getStores()])

  return (
    <>
      <section className="pageIntro">
        <p className="pill">Store Locations</p>
        <h1>{locationsPage?.heroHeadline || 'Find the Nearest OG Hustlers Store'}</h1>
        <p>
          {locationsPage?.summary ||
            'Each location card is dynamically rendered from the Stores collection in Payload CMS.'}
        </p>
      </section>

      <section className="locationsGrid">
        {stores.map((store) => (
          <article key={store.id} className="locationCard">
            <div className="locationContent">
              <h2>{store.name}</h2>
              <p>{store.address}</p>
              <p>
                <strong>Hours:</strong> {store.hours}
              </p>
              <p>
                <strong>Phone:</strong>{' '}
                <a href={buildTelLink(store.phone)}>{store.phone}</a>
              </p>
              <div className="locationActions">
                <Link
                  className="buttonGhost compact"
                  href={buildDirectionsUrl(store.mapsUrl || store.address)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Directions
                </Link>
              </div>
            </div>

            <iframe
              className="locationMap"
              src={buildMapEmbedUrl(store.address)}
              title={`${store.name} map`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </article>
        ))}

        {stores.length === 0 && (
          <p className="emptyMessage">No active store locations yet. Add entries in the Stores collection.</p>
        )}
      </section>
    </>
  )
}

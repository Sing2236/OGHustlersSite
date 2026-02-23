import type { Metadata } from 'next'
import { Sora, Space_Grotesk } from 'next/font/google'
import React from 'react'

import { SiteFooter } from '@/components/site/SiteFooter'
import { SiteHeader } from '@/components/site/SiteHeader'
import { getSiteSettings } from '@/lib/site-data'
import { getSocialLinksFromEnv } from '@/lib/site-utils'
import './styles.css'

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-display',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-body',
})

export const metadata: Metadata = {
  title: {
    default: 'OG Hustlers Vape Shop',
    template: '%s | OG Hustlers',
  },
  description:
    'Modern vape shop catalogue, promotions, and store locations powered by Payload CMS.',
  openGraph: {
    title: 'OG Hustlers Vape Shop',
    description:
      'Premium vape hardware, curated THCA, and a professional in-store experience across multiple locations.',
    type: 'website',
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001'),
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  const siteSettings = await getSiteSettings()
  const socialLinks = getSocialLinksFromEnv()

  return (
    <html lang="en">
      <body className={`${sora.variable} ${spaceGrotesk.variable} siteBody`}>
        <div className="siteBackdrop" aria-hidden />
        <div className="grainOverlay" aria-hidden />
        <div className="siteShell">
          <SiteHeader brandName={siteSettings.brandName} tagline={siteSettings.tagline} />
          <main className="siteMain">{children}</main>
          <SiteFooter
            brandName={siteSettings.brandName}
            supportEmail={siteSettings.supportEmail}
            supportPhone={siteSettings.supportPhone}
            socialLinks={socialLinks}
          />
        </div>
      </body>
    </html>
  )
}

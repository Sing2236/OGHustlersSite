import Link from 'next/link'

import type { SocialLink } from '@/lib/site-utils'

type SiteFooterProps = {
  brandName: string
  supportEmail: string
  supportPhone: string
  socialLinks: SocialLink[]
}

export function SiteFooter({ brandName, supportEmail, supportPhone, socialLinks }: SiteFooterProps) {
  return (
    <footer className="siteFooter">
      <div className="footerGrid">
        <div className="footerBlock">
          <h2>{brandName}</h2>
          <p>Trusted inventory, transparent sourcing, and fast support across every store location.</p>
        </div>

        <div className="footerBlock">
          <h3>Contact</h3>
          <a href={`mailto:${supportEmail}`}>{supportEmail}</a>
          <a href={`tel:${supportPhone.replace(/[^\d+]/g, '')}`}>{supportPhone}</a>
        </div>

        <div className="footerBlock">
          <h3>Social</h3>
          {socialLinks.map((link) => (
            <Link key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
      <p className="footerLegal">Adults 21+ only. Copyright {new Date().getFullYear()} {brandName}.</p>
    </footer>
  )
}

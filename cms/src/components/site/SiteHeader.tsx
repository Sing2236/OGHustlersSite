import Link from 'next/link'

type SiteHeaderProps = {
  brandName: string
  tagline: string
}

const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Catalogue' },
  { href: '/locations', label: 'Locations' },
  { href: '/contact', label: 'Contact' },
]

export function SiteHeader({ brandName, tagline }: SiteHeaderProps) {
  return (
    <header className="siteHeader">
      <div className="brandBlock">
        <Link href="/" className="brandName">
          {brandName}
        </Link>
        <p className="brandTagline">{tagline}</p>
      </div>

      <nav className="topNav" aria-label="Primary navigation">
        {NAV_ITEMS.map((item) => (
          <Link key={item.href} href={item.href} className="navLink">
            {item.label}
          </Link>
        ))}
        <Link href="/admin" className="adminLink">
          CMS
        </Link>
      </nav>
    </header>
  )
}

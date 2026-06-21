import { Link } from 'react-router-dom'
import { LOGIN_PATH } from '@/constants/routes'

const anchorLinks = [
  { href: '#how', label: 'How it works' },
  { href: '#features', label: 'Features' },
  { href: '#about', label: 'About' },
  { href: '#pricing', label: 'Pricing' },
] as const

export function LandingFooter() {
  return (
    <footer className="flex flex-wrap items-center justify-between gap-4 bg-lr-blue px-[6vw] py-10 text-white/60">
      <a href="#" className="text-lg font-bold text-white">
        Lead<span className="text-lr-yellow">Razor</span>
      </a>

      <div className="flex flex-wrap gap-5">
        {anchorLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="text-sm transition-colors hover:text-lr-yellow"
          >
            {link.label}
          </a>
        ))}
        <Link to={LOGIN_PATH} className="text-sm transition-colors hover:text-lr-yellow">
          Log in
        </Link>
      </div>

      <p className="text-xs">© {new Date().getFullYear()} LeadRazor. All rights reserved.</p>
    </footer>
  )
}

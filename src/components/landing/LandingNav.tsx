import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { LOGIN_PATH, WAITLIST_PATH } from '@/constants/routes'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '#how', label: 'How it works' },
  { href: '#features', label: 'Features' },
  { href: '#about', label: 'About' },
  { href: '#pricing', label: 'Pricing' },
] as const

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={cn(
        'sticky top-0 z-50 flex items-center justify-between border-b border-[#ebebeb] bg-white/95 px-[6vw] py-4 backdrop-blur-md transition-shadow duration-300',
        scrolled && 'shadow-[0_4px_24px_rgba(26,46,90,0.08)]',
      )}
    >
      <a href="#" className="text-xl font-bold tracking-tight text-lr-blue">
        Lead<span className="text-lr-yellow-dark">Razor</span>
      </a>

      <ul className="hidden items-center gap-8 md:flex">
        {navLinks.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="text-sm text-lr-gray transition-colors hover:text-lr-blue"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-2 sm:gap-3">
        <Link
          to={LOGIN_PATH}
          className="hidden text-sm font-medium text-lr-blue transition-colors hover:text-lr-blue-mid sm:inline"
        >
          Log in
        </Link>
        <Link
          to={WAITLIST_PATH}
          className="rounded-full bg-lr-yellow px-4 py-2 text-sm font-semibold text-lr-blue transition-all hover:-translate-y-0.5 hover:bg-lr-yellow-dark hover:text-white"
        >
          Get started →
        </Link>
      </div>
    </nav>
  )
}

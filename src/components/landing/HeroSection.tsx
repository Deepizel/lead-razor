import { Link } from 'react-router-dom'
import { LOGIN_PATH, WAITLIST_PATH } from '@/constants/routes'
import { landingStats } from '@/lib/landing-content'
import { landingHeroEnter } from '@/lib/landing-tailwind'
import { cn } from '@/lib/utils'

const mockLeads = [
  {
    initials: 'SA',
    name: 'Sarah Adeyemi',
    role: 'VP Sales · Fintech Corp',
    score: 92,
    bar: 'w-[92%] bg-emerald-600',
    tag: 'Replied',
    tagClass: 'bg-[#edfaf4] text-emerald-700',
    avatar: 'bg-lr-blue-light text-lr-blue',
  },
  {
    initials: 'MO',
    name: 'Michael Osei',
    role: 'CTO · StartupNG',
    score: 68,
    bar: 'w-[68%] bg-lr-yellow-dark',
    tag: 'Opened',
    tagClass: 'bg-lr-yellow-light text-lr-yellow-dark',
    avatar: 'bg-lr-yellow-light text-lr-yellow-dark',
  },
  {
    initials: 'TE',
    name: 'Tunde Eze',
    role: 'Head of Growth · RetailPro',
    score: 85,
    bar: 'w-[85%] bg-emerald-600',
    tag: 'Sent',
    tagClass: 'bg-lr-blue-light text-lr-blue-mid',
    avatar: 'bg-[#edfaf4] text-emerald-700',
  },
  {
    initials: 'KA',
    name: 'Kemi Ade',
    role: 'CEO · LogiHub',
    score: 41,
    bar: 'w-[41%] bg-lr-red',
    tag: 'Cold',
    tagClass: 'bg-lr-red-light text-lr-red',
    avatar: 'bg-lr-red-light text-lr-red',
  },
] as const

export function HeroSection() {
  return (
    <section className="relative grid min-h-[88vh] items-center gap-12 overflow-hidden px-[6vw] py-16 lg:grid-cols-2 lg:gap-16 lg:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-20 h-[520px] w-[520px] animate-lr-blob rounded-full bg-lr-yellow-light opacity-60"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-16 -left-24 h-80 w-80 animate-lr-blob rounded-full bg-lr-blue-light opacity-50 [-animation-delay:4s]"
      />

      <div className="relative z-10">
        <div
          className={cn(
            landingHeroEnter(),
            'mb-6 inline-flex items-center gap-2 rounded-full border border-lr-yellow-dark bg-lr-yellow-light px-3.5 py-1.5 text-[0.7rem] font-medium uppercase tracking-widest text-lr-yellow-dark',
          )}
        >
          <span className="size-1.5 animate-lr-pulse-dot rounded-full bg-lr-yellow-dark" />
          AI-powered lead augmentation
        </div>

        <h1
          className={cn(
            landingHeroEnter(80),
            'text-4xl font-extrabold leading-[1.08] tracking-tight text-lr-blue sm:text-5xl lg:text-[3.5rem]',
          )}
        >
          Qualify leads.
          <br />
          <span className="relative inline-block text-lr-red">
            Close deals
            <span className="absolute -bottom-1 left-0 h-1 w-full rounded bg-lr-yellow" />
          </span>
          .
          <br />
          At scale.
        </h1>

        <p
          className={cn(
            landingHeroEnter(160),
            'mt-5 max-w-lg text-base leading-relaxed text-lr-gray sm:text-lg',
          )}
        >
          LeadRazor uses AI to score and qualify your leads based on your purpose, crafts
          assisted outreach messages, and tracks every open, click, and reply.
        </p>

        <div className={cn(landingHeroEnter(240), 'mt-8 flex flex-wrap gap-3')}>
          <Link
            to={WAITLIST_PATH}
            className="inline-flex rounded-full bg-lr-blue px-7 py-3 text-sm font-semibold text-lr-yellow transition-all hover:-translate-y-0.5 hover:bg-lr-blue-mid"
          >
            Join the waitlist
          </Link>
          <a
            href="#how"
            className="inline-flex rounded-full border-2 border-lr-blue px-7 py-3 text-sm font-semibold text-lr-blue transition-all hover:-translate-y-0.5 hover:bg-lr-blue hover:text-lr-yellow"
          >
            See how it works
          </a>
        </div>

        <div
          className={cn(
            landingHeroEnter(320),
            'mt-10 flex flex-wrap gap-8 border-t border-lr-gray-light pt-8',
          )}
        >
          {landingStats.map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl font-extrabold text-lr-blue">{stat.value}</div>
              <div className="mt-0.5 text-xs text-lr-gray">{stat.label}</div>
            </div>
          ))}
        </div>

        <p className={cn(landingHeroEnter(400), 'mt-6 text-sm text-lr-gray')}>
          Already approved?{' '}
          <Link to={LOGIN_PATH} className="font-semibold text-lr-blue-mid hover:underline">
            Log in to your dashboard
          </Link>
        </p>
      </div>

      <div className={cn(landingHeroEnter(240), 'relative z-10 lg:justify-self-end')}>
        <div
          className={cn(
            'mx-auto max-w-md animate-lr-float rounded-[20px] border border-[#e2e2e2] bg-white p-6 shadow-[0_24px_64px_rgba(26,46,90,0.12)]',
          )}
        >
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-bold text-lr-blue">Lead pipeline</span>
            <span className="rounded-full bg-[#edfaf4] px-2.5 py-1 text-[0.7rem] font-medium text-emerald-700">
              ↑ 12 new today
            </span>
          </div>

          {mockLeads.map((lead) => (
            <div
              key={lead.initials}
              className="mb-2 flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-lr-off-white"
            >
              <div
                className={cn(
                  'flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                  lead.avatar,
                )}
              >
                {lead.initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-lr-blue">{lead.name}</div>
                <div className="truncate text-[0.7rem] text-lr-gray">{lead.role}</div>
              </div>
              <div className="w-14 shrink-0">
                <div className="text-right text-[0.65rem] text-lr-gray">{lead.score}</div>
                <div className="mt-0.5 h-1 overflow-hidden rounded-full bg-lr-gray-light">
                  <div className={cn('h-full rounded-full', lead.bar)} />
                </div>
              </div>
              <span
                className={cn(
                  'shrink-0 rounded-full px-2 py-0.5 text-[0.65rem] font-medium',
                  lead.tagClass,
                )}
              >
                {lead.tag}
              </span>
            </div>
          ))}

          <div className="mt-4 grid grid-cols-3 gap-2">
            {[
              { n: '248', l: 'Total leads' },
              { n: '62%', l: 'Open rate' },
              { n: '34%', l: 'Reply rate' },
            ].map((m) => (
              <div key={m.l} className="rounded-xl bg-lr-off-white px-2 py-2.5 text-center">
                <div className="text-lg font-bold text-lr-blue">{m.n}</div>
                <div className="text-[0.65rem] text-lr-gray">{m.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

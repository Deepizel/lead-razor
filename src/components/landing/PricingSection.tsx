import { Link } from 'react-router-dom'
import { LandingReveal } from '@/components/landing/LandingReveal'
import { WAITLIST_PATH } from '@/constants/routes'
import { landingPricing } from '@/lib/landing-content'
import { landingCardLift } from '@/lib/landing-tailwind'
import { cn } from '@/lib/utils'

export function PricingSection() {
  return (
    <section id="pricing" className="bg-white px-[6vw] py-20">
      <LandingReveal>
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-lr-yellow-dark">
          Pricing
        </p>
        <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-lr-blue sm:text-4xl">
          Simple, transparent pricing
        </h2>
        <p className="mt-3 max-w-lg text-base text-lr-gray">
          Join the waitlist today. Plans scale as your pipeline grows.
        </p>
      </LandingReveal>

      <div className="mx-auto mt-12 grid max-w-4xl gap-5 md:grid-cols-3">
        {landingPricing.map((tier, i) => (
          <LandingReveal key={tier.plan} delayMs={i * 100}>
            <article
              className={cn(
                landingCardLift,
                'flex h-full flex-col rounded-[20px] border-[1.5px] p-7',
                tier.featured
                  ? 'border-lr-yellow bg-lr-blue text-white shadow-[0_16px_50px_rgba(26,46,90,0.18)]'
                  : 'border-[#e2e2e2] bg-white',
              )}
            >
              <p
                className={cn(
                  'text-xs font-bold uppercase tracking-widest',
                  tier.featured ? 'text-lr-yellow' : 'text-lr-gray',
                )}
              >
                {tier.plan}
              </p>
              <div
                className={cn(
                  'mt-1 text-4xl font-extrabold leading-none',
                  tier.featured ? 'text-white' : 'text-lr-blue',
                )}
              >
                {tier.price}
              </div>
              <p className={cn('mt-1 text-sm', tier.featured ? 'text-white/60' : 'text-lr-gray')}>
                {tier.period}
              </p>

              <ul className="my-6 flex flex-1 flex-col gap-3">
                {tier.features.map((f) => (
                  <li
                    key={f}
                    className={cn(
                      'flex items-start gap-2 text-sm',
                      tier.featured ? 'text-white/85' : 'text-[#111]',
                    )}
                  >
                    <span
                      className={cn(
                        'mt-0.5 flex size-[18px] shrink-0 items-center justify-center rounded-full text-[0.65rem] font-bold',
                        tier.featured
                          ? 'bg-lr-yellow/20 text-lr-yellow'
                          : 'bg-lr-yellow-light text-lr-yellow-dark',
                      )}
                    >
                      ✓
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                to={WAITLIST_PATH}
                className={cn(
                  'block rounded-full py-3 text-center text-sm font-bold transition-all',
                  tier.featured
                    ? 'bg-lr-yellow text-lr-blue hover:bg-white'
                    : 'border-2 border-lr-blue text-lr-blue hover:bg-lr-blue hover:text-lr-yellow',
                )}
              >
                {tier.cta}
              </Link>
            </article>
          </LandingReveal>
        ))}
      </div>
    </section>
  )
}

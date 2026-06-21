import { LandingReveal } from '@/components/landing/LandingReveal'
import { landingFeatures } from '@/lib/landing-content'
import { landingCardLift } from '@/lib/landing-tailwind'
import { cn } from '@/lib/utils'

const toneStyles = {
  yellow: 'bg-lr-yellow-light text-lr-yellow-dark',
  blue: 'bg-lr-blue-light text-lr-blue-mid',
  red: 'bg-lr-red-light text-lr-red',
  green: 'bg-[#edfaf4] text-emerald-700',
} as const

export function FeaturesSection() {
  return (
    <section id="features" className="bg-lr-off-white px-[6vw] py-20">
      <LandingReveal>
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-lr-yellow-dark">
          Core features
        </p>
        <h2 className="mt-2 max-w-lg text-3xl font-extrabold tracking-tight text-lr-blue sm:text-4xl">
          Everything your sales team needs
        </h2>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-lr-gray">
          A full-stack outreach platform with AI at its core — from qualification to engagement
          analytics.
        </p>
      </LandingReveal>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {landingFeatures.map((feature, i) => (
          <LandingReveal key={feature.title} delayMs={i * 70}>
            <article
              className={cn(
                landingCardLift,
                'h-full rounded-[20px] border border-[#e8e8e8] bg-white p-7',
              )}
            >
              <div
                className={cn(
                  'mb-4 flex size-12 items-center justify-center rounded-xl text-lg font-bold',
                  toneStyles[feature.tone],
                )}
              >
                {feature.title.charAt(0)}
              </div>
              <h3 className="text-base font-bold text-lr-blue">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-lr-gray">{feature.description}</p>
            </article>
          </LandingReveal>
        ))}
      </div>
    </section>
  )
}

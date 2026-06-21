import { LandingReveal } from '@/components/landing/LandingReveal'
import { landingTestimonials } from '@/lib/landing-content'
import { landingCardLift } from '@/lib/landing-tailwind'
import { cn } from '@/lib/utils'

const avatarTone = {
  blue: 'bg-lr-blue-light text-lr-blue',
  yellow: 'bg-lr-yellow-light text-lr-yellow-dark',
  green: 'bg-[#edfaf4] text-emerald-700',
} as const

export function TestimonialsSection() {
  return (
    <section className="bg-lr-off-white px-[6vw] py-20">
      <LandingReveal>
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-lr-yellow-dark">
          What users say
        </p>
        <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-lr-blue sm:text-4xl">
          Trusted by top sales teams
        </h2>
      </LandingReveal>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {landingTestimonials.map((t, i) => (
          <LandingReveal key={t.name} delayMs={i * 100}>
            <article
              className={cn(
                landingCardLift,
                'h-full rounded-[20px] border border-[#e8e8e8] bg-white p-7',
              )}
            >
              <div className="mb-4 text-lr-yellow-dark">★★★★★</div>
              <p className="text-sm italic leading-relaxed text-[#111]">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-5 flex items-center gap-3">
                <div
                  className={cn(
                    'flex size-9 items-center justify-center rounded-full text-xs font-bold',
                    avatarTone[t.tone],
                  )}
                >
                  {t.initials}
                </div>
                <div>
                  <div className="text-sm font-medium text-lr-blue">{t.name}</div>
                  <div className="text-xs text-lr-gray">{t.role}</div>
                </div>
              </div>
            </article>
          </LandingReveal>
        ))}
      </div>
    </section>
  )
}

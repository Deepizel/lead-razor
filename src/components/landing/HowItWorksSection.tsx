import { LandingReveal } from '@/components/landing/LandingReveal'
import { landingSteps } from '@/lib/landing-content'
import { landingCardLift } from '@/lib/landing-tailwind'
import { cn } from '@/lib/utils'

const stepIcons = [
  <svg key="1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="size-5 text-lr-blue"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  <svg key="2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="size-5 text-lr-blue"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  <svg key="3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="size-5 text-lr-blue"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  <svg key="4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="size-5 text-lr-blue"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
]

export function HowItWorksSection() {
  return (
    <section id="how" className="bg-lr-blue px-[6vw] py-20 text-white">
      <LandingReveal>
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-lr-yellow">
          How it works
        </p>
        <h2 className="mt-2 max-w-xl text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
          Four steps from cold list to warm conversation
        </h2>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-white/65">
          LeadRazor automates the most time-consuming parts of sales prospecting — powered by
          AI and scoped to your categories.
        </p>
      </LandingReveal>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {landingSteps.map((step, i) => (
          <LandingReveal key={step.num} delayMs={i * 90} className="h-full">
            <article
              className={cn(
                landingCardLift,
                'relative h-full rounded-[20px] border border-white/12 bg-white/[0.06] p-7',
              )}
            >
              <span className="absolute right-5 top-4 text-5xl font-extrabold text-lr-yellow/20">
                {step.num}
              </span>
              <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-lr-yellow">
                {stepIcons[i]}
              </div>
              <h3 className="text-lg font-bold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">{step.description}</p>
            </article>
          </LandingReveal>
        ))}
      </div>
    </section>
  )
}

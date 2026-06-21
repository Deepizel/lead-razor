import { LandingReveal } from '@/components/landing/LandingReveal'
import { landingAboutPoints } from '@/lib/landing-content'

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-3 text-lr-blue"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

export function AboutSection() {
  return (
    <section id="about" className="bg-white px-[6vw] py-20">
      <LandingReveal>
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-lr-yellow-dark">
          About LeadRazor
        </p>
        <h2 className="mt-2 max-w-lg text-3xl font-extrabold tracking-tight text-lr-blue sm:text-4xl">
          Built for sales teams that move fast
        </h2>
      </LandingReveal>

      <div className="mt-12 grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <LandingReveal className="relative">
          <div className="absolute -left-4 -top-4 hidden rounded-xl bg-lr-yellow px-4 py-3 shadow-lg lg:block">
            <div className="text-xl font-extrabold text-lr-blue">98%</div>
            <div className="text-xs text-lr-blue/70">Customer satisfaction</div>
          </div>

          <div className="rounded-[20px] bg-lr-blue p-8 text-white sm:p-10">
            <h3 className="text-2xl font-extrabold text-lr-yellow">Our mission</h3>
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              LeadRazor was built because sales teams spend too much time chasing the wrong leads
              and rewriting the same outreach over and over.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              We built an AI-native platform that understands your sales purpose, qualifies every
              contact against it, assists with genuinely personalized outreach at scale, and shows
              exactly how each message performs — so you focus only on conversations that matter.
            </p>

            <div className="mt-8 flex flex-wrap gap-8 border-t border-white/15 pt-6">
              {[
                { v: '2025', l: 'Launching' },
                { v: '40K+', l: 'Leads processed daily' },
                { v: '1,200+', l: 'Sales teams' },
              ].map((s) => (
                <div key={s.l}>
                  <div className="text-2xl font-extrabold text-lr-yellow">{s.v}</div>
                  <div className="text-xs text-white/55">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute -bottom-4 -right-4 hidden rounded-xl border border-[#e2e2e2] bg-white px-5 py-3 shadow-lg lg:block">
            <div className="text-2xl font-extrabold text-lr-red">34%</div>
            <div className="text-xs text-lr-gray">Average reply rate</div>
          </div>
        </LandingReveal>

        <LandingReveal delayMs={120}>
          <p className="text-base leading-relaxed text-lr-gray">
            LeadRazor is a full-stack AI sales platform that handles lead qualification through
            engagement tracking — so professionals spend every minute on real opportunities.
          </p>

          <ul className="mt-8 flex flex-col gap-5">
            {landingAboutPoints.map((point) => (
              <li key={point.title} className="flex gap-3 text-sm leading-relaxed">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-lr-yellow">
                  <CheckIcon />
                </span>
                <span>
                  <strong className="text-lr-blue">{point.title}</strong>
                  {' — '}
                  {point.text}
                </span>
              </li>
            ))}
          </ul>
        </LandingReveal>
      </div>
    </section>
  )
}

import { Link } from 'react-router-dom'
import { LandingReveal } from '@/components/landing/LandingReveal'
import { LOGIN_PATH, WAITLIST_PATH } from '@/constants/routes'

export function LandingCta() {
  return (
    <section className="bg-lr-yellow px-[6vw] py-16 text-center sm:py-20">
      <LandingReveal>
        <h2 className="text-3xl font-extrabold tracking-tight text-lr-blue sm:text-4xl">
          Ready to sharpen
          <br />
          your pipeline?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-base text-lr-blue/75">
          Join the waitlist for early access. Already approved? Sign in and start qualifying
          leads today.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to={WAITLIST_PATH}
            className="inline-flex rounded-full bg-lr-blue px-8 py-3.5 text-sm font-bold text-lr-yellow transition-all hover:-translate-y-0.5 hover:bg-[#0e1e3d]"
          >
            Join the waitlist
          </Link>
          <Link
            to={LOGIN_PATH}
            className="inline-flex rounded-full border-2 border-lr-blue px-8 py-3.5 text-sm font-bold text-lr-blue transition-all hover:-translate-y-0.5 hover:bg-lr-blue hover:text-lr-yellow"
          >
            Log in
          </Link>
        </div>
      </LandingReveal>
    </section>
  )
}

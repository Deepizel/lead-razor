import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthMarketingPanel } from '@/components/auth/AuthMarketingPanel'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LOGIN_PATH } from '@/constants/routes'
import { useJoinWaitlist } from '@/hooks/useWaitlist'
import { hasApiBaseUrl } from '@/lib/api-client'

export default function WaitlistPage() {
  const join = useJoinWaitlist()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [businessIndustry, setBusinessIndustry] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    join.mutate(
      {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        businessIndustry: businessIndustry.trim(),
      },
      { onSuccess: () => setSubmitted(true) },
    )
  }

  return (
    <div className="relative flex min-h-svh flex-col bg-background lg:flex-row">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[28rem] w-[28rem] rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <AuthMarketingPanel />

      <div className="relative flex flex-1 flex-col">
        <div className="flex items-center justify-end gap-2 p-4 sm:p-6">
          <ThemeToggle />
        </div>

        <div className="flex flex-1 flex-col items-center justify-center px-4 pb-10 sm:px-8">
          <div className="w-full max-w-md space-y-6">
            <div className="space-y-1 text-center lg:text-left">
              <p className="text-xs font-medium uppercase tracking-widest text-violet-500 lg:hidden">
                LeadRazor
              </p>
              <h2 className="text-2xl font-semibold tracking-tight">Join the waitlist</h2>
              <p className="text-sm text-muted-foreground">
                Request early access. We will email you when your account is approved.
              </p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-card/80 p-6 shadow-xl backdrop-blur-sm sm:p-8">
              {!hasApiBaseUrl() ? (
                <p className="text-sm text-destructive">
                  API is not configured. Set <code className="text-xs">VITE_API_BASE_URL</code> in
                  your environment and restart the dev server.
                </p>
              ) : submitted ? (
                <div className="space-y-4">
                  <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-400">
                    You are on the waitlist. Check your inbox for updates when we approve your
                    application.
                  </div>
                  <Button type="button" variant="outline" className="w-full" onClick={() => setSubmitted(false)}>
                    Submit another application
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-1.5">
                      <Label htmlFor="first-name">First name</Label>
                      <Input
                        id="first-name"
                        autoComplete="given-name"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="last-name">Last name</Label>
                      <Input
                        id="last-name"
                        autoComplete="family-name"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="waitlist-email">Work email</Label>
                    <Input
                      id="waitlist-email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="business-industry">Business / industry</Label>
                    <Input
                      id="business-industry"
                      required
                      placeholder="e.g. B2B SaaS, agency, fintech"
                      value={businessIndustry}
                      onChange={(e) => setBusinessIndustry(e.target.value)}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={join.isPending}>
                    {join.isPending ? 'Submitting…' : 'Join waitlist'}
                  </Button>
                </form>
              )}
            </div>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to={LOGIN_PATH} className="font-medium text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthMarketingPanel } from '@/components/auth/AuthMarketingPanel'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { WAITLIST_PATH } from '@/constants/routes'
import { useForgotPassword, useLogin } from '@/hooks/useAuth'

export default function LoginPage() {
  const login = useLogin()
  const forgot = useForgotPassword()

  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [forgotEmail, setForgotEmail] = useState('')
  const [showForgot, setShowForgot] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    login.mutate({ email: loginEmail.trim(), password: loginPassword })
  }

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault()
    forgot.mutate({ email: forgotEmail.trim() })
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
              <h2 className="text-2xl font-semibold tracking-tight">Sign in</h2>
              <p className="text-sm text-muted-foreground">
                Use the credentials from your waitlist approval email.
              </p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-card/80 p-6 shadow-xl backdrop-blur-sm sm:p-8">
              {showForgot ? (
                <form onSubmit={handleForgot} className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-medium">Reset password</h3>
                    <p className="text-xs text-muted-foreground">
                      We will email you a reset link if the account exists.
                    </p>
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="forgot-email">Email</Label>
                    <Input
                      id="forgot-email"
                      type="email"
                      autoComplete="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={() => setShowForgot(false)}>
                      Back
                    </Button>
                    <Button type="submit" className="flex-1" disabled={forgot.isPending}>
                      {forgot.isPending ? 'Sending…' : 'Send reset link'}
                    </Button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="grid gap-1.5">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      autoComplete="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="login-password">Password</Label>
                      <button
                        type="button"
                        className="text-xs text-primary hover:underline"
                        onClick={() => setShowForgot(true)}
                      >
                        Forgot password?
                      </button>
                    </div>
                    <Input
                      id="login-password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={login.isPending}>
                    {login.isPending ? 'Signing in…' : 'Sign in'}
                  </Button>
                </form>
              )}
            </div>

            <p className="text-center text-sm text-muted-foreground">
              Need access?{' '}
              <Link to={WAITLIST_PATH} className="font-medium text-primary hover:underline">
                Join the waitlist
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

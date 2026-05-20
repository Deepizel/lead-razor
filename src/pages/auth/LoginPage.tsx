import { useState } from 'react'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useForgotPassword, useLogin, useSignup } from '@/hooks/useAuth'
export default function LoginPage() {
  const login = useLogin()
  const signup = useSignup()
  const forgot = useForgotPassword()

  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [signupConfirm, setSignupConfirm] = useState('')
  const [forgotEmail, setForgotEmail] = useState('')
  const [showForgot, setShowForgot] = useState(false)
  const [signupDone, setSignupDone] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    login.mutate({ email: loginEmail.trim(), password: loginPassword })
  }

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    if (signupPassword !== signupConfirm) return
    signup.mutate(
      { email: signupEmail.trim(), password: signupPassword },
      { onSuccess: () => setSignupDone(true) },
    )
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

      <div className="relative hidden flex-1 flex-col justify-between border-r border-border/60 p-10 lg:flex xl:p-14">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            LeadRazor
          </p>
          <h1 className="mt-6 max-w-md text-4xl font-semibold tracking-tight text-foreground xl:text-5xl">
            AI lead qualification that actually ships revenue
          </h1>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Upload leads, score against your ICP, refresh LLM snapshots, and send
            personalized outreach — all scoped to your account.
          </p>
        </div>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-violet-500" />
            Multi-tenant categories & leads
          </li>
          <li className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-cyan-500" />
            Email verification before first login
          </li>
          <li className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            Secure JWT access with auto-refresh
          </li>
        </ul>
      </div>

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
              <h2 className="text-2xl font-semibold tracking-tight">Welcome</h2>
              <p className="text-sm text-muted-foreground">
                Sign in or create an account to open your dashboard.
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
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Sign in</TabsTrigger>
                    <TabsTrigger value="signup">Sign up</TabsTrigger>
                  </TabsList>

                  <TabsContent value="login" className="mt-6 space-y-4">
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
                  </TabsContent>

                  <TabsContent value="signup" className="mt-6 space-y-4">
                    {signupDone ? (
                      <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-400">
                        Check your inbox and click the verification link before signing in.
                      </div>
                    ) : (
                      <form onSubmit={handleSignup} className="space-y-4">
                        <div className="grid gap-1.5">
                          <Label htmlFor="signup-email">Email</Label>
                          <Input
                            id="signup-email"
                            type="email"
                            autoComplete="email"
                            required
                            value={signupEmail}
                            onChange={(e) => setSignupEmail(e.target.value)}
                          />
                        </div>
                        <div className="grid gap-1.5">
                          <Label htmlFor="signup-password">Password</Label>
                          <Input
                            id="signup-password"
                            type="password"
                            autoComplete="new-password"
                            required
                            minLength={8}
                            value={signupPassword}
                            onChange={(e) => setSignupPassword(e.target.value)}
                          />
                        </div>
                        <div className="grid gap-1.5">
                          <Label htmlFor="signup-confirm">Confirm password</Label>
                          <Input
                            id="signup-confirm"
                            type="password"
                            autoComplete="new-password"
                            required
                            value={signupConfirm}
                            onChange={(e) => setSignupConfirm(e.target.value)}
                          />
                          {signupConfirm && signupPassword !== signupConfirm && (
                            <p className="text-xs text-destructive">Passwords do not match</p>
                          )}
                        </div>
                        <Button
                          type="submit"
                          className="w-full"
                          disabled={
                            signup.isPending ||
                            (signupConfirm.length > 0 && signupPassword !== signupConfirm)
                          }
                        >
                          {signup.isPending ? 'Creating account…' : 'Create account'}
                        </Button>
                      </form>
                    )}
                  </TabsContent>
                </Tabs>
              )}
            </div>

            <p className="text-center text-xs text-muted-foreground">
              By continuing you agree to secure handling of your lead data per tenant.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

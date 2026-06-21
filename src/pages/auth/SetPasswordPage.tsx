import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { LOGIN_PATH } from '@/constants/routes'
import { useSetWaitlistPassword, useValidateSetPasswordToken } from '@/hooks/useWaitlist'
import { hasApiBaseUrl } from '@/lib/api-client'

export default function SetPasswordPage() {
  const [params] = useSearchParams()
  const token = params.get('token') ?? ''
  const tokenQuery = useValidateSetPasswordToken(token || null)
  const setPassword = useSetWaitlistPassword()
  const [password, setPasswordValue] = useState('')
  const [confirm, setConfirm] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!token || password !== confirm) return
    setPassword.mutate({ token, password })
  }

  const profile = tokenQuery.data
  const tokenInvalid = Boolean(token) && tokenQuery.isError
  const tokenLoading = Boolean(token) && tokenQuery.isLoading

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <div className="flex justify-end p-4">
        <ThemeToggle />
      </div>
      <div className="flex flex-1 flex-col items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md space-y-6 rounded-2xl border border-border/80 bg-card p-8 shadow-xl">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold">Set your password</h1>
            <p className="text-sm text-muted-foreground">
              Complete your account setup to sign in.
            </p>
          </div>

          {!hasApiBaseUrl() ? (
            <p className="text-sm text-destructive">
              API is not configured. Set VITE_API_BASE_URL and restart the dev server.
            </p>
          ) : !token ? (
            <p className="text-sm text-destructive">
              Invalid or missing setup token. Use the link from your approval email.
            </p>
          ) : tokenLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : tokenInvalid ? (
            <p className="text-sm text-destructive">
              This setup link is invalid or has expired. Contact support for a new invite.
            </p>
          ) : (
            <>
              {profile && (
                <p className="text-sm text-muted-foreground">
                  Setting password for{' '}
                  <span className="font-medium text-foreground">
                    {profile.firstName} {profile.lastName}
                  </span>{' '}
                  ({profile.email})
                </p>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-1.5">
                  <Label htmlFor="new-password">Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPasswordValue(e.target.value)}
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="confirm-password">Confirm password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                  />
                  {confirm && password !== confirm && (
                    <p className="text-xs text-destructive">Passwords do not match</p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={setPassword.isPending || password !== confirm}
                >
                  {setPassword.isPending ? 'Saving…' : 'Set password'}
                </Button>
              </form>
            </>
          )}

          <Button variant="link" asChild className="w-full">
            <Link to={LOGIN_PATH}>Back to sign in</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

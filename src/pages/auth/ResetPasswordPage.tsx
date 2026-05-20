import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useResetPassword } from '@/hooks/useAuth'

export default function ResetPasswordPage() {
  const [params] = useSearchParams()
  const token = params.get('token') ?? ''
  const reset = useResetPassword()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!token || password !== confirm) return
    reset.mutate({ token, newPassword: password })
  }

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <div className="flex justify-end p-4">
        <ThemeToggle />
      </div>
      <div className="flex flex-1 flex-col items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md space-y-6 rounded-2xl border border-border/80 bg-card p-8 shadow-xl">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold">Set new password</h1>
            <p className="text-sm text-muted-foreground">
              Choose a strong password for your account.
            </p>
          </div>

          {!token ? (
            <p className="text-sm text-destructive">
              Invalid or missing reset token. Request a new link from sign in.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-1.5">
                <Label htmlFor="new-password">New password</Label>
                <Input
                  id="new-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                disabled={reset.isPending || password !== confirm}
              >
                {reset.isPending ? 'Updating…' : 'Update password'}
              </Button>
            </form>
          )}

          <Button variant="link" asChild className="w-full">
            <Link to="/">Back to sign in</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

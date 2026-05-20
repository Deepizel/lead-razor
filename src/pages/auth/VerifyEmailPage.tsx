import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { Button } from '@/components/ui/button'
import { verifyEmail } from '@/api/auth-remote'
import { ApiError } from '@/lib/api-client'
import { notify } from '@/stores/toastStore'

export default function VerifyEmailPage() {
  const [params] = useSearchParams()
  const token = params.get('token') ?? ''
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('Missing verification token.')
      return
    }

    verifyEmail(token)
      .then((res) => {
        setStatus('success')
        setMessage(res.message ?? 'Email verified. You can sign in now.')
        notify.success('Email verified')
      })
      .catch((err) => {
        setStatus('error')
        const msg = err instanceof ApiError ? err.message : 'Verification failed.'
        setMessage(msg)
        notify.error(msg)
      })
  }, [token])

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <div className="flex justify-end p-4">
        <ThemeToggle />
      </div>
      <div className="flex flex-1 flex-col items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md space-y-6 rounded-2xl border border-border/80 bg-card p-8 text-center shadow-xl">
          <h1 className="text-xl font-semibold">Email verification</h1>
          {status === 'loading' && (
            <p className="text-sm text-muted-foreground">Confirming your email…</p>
          )}
          {status !== 'loading' && (
            <p
              className={
                status === 'success'
                  ? 'text-sm text-emerald-400'
                  : 'text-sm text-destructive'
              }
            >
              {message}
            </p>
          )}
          <Button asChild className="w-full">
            <Link to="/">Go to sign in</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

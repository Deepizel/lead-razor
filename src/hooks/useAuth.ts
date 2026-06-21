import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { fetchMe, forgotPassword, login, resetPassword } from '@/api/auth-remote'
import { markUserProfileSynced } from '@/lib/auth-session'
import { ApiError } from '@/lib/api-client'
import { useAuthStore } from '@/stores/authStore'
import { notify } from '@/stores/toastStore'
import type {
  ForgotPasswordRequest,
  LoginRequest,
  ResetPasswordRequest,
} from '@/types/auth'

export function useLogin() {
  const setSession = useAuthStore((s) => s.setSession)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (body: LoginRequest) => {
      const session = await login(body)
      try {
        const user = await fetchMe()
        markUserProfileSynced()
        return { ...session, user }
      } catch {
        return session
      }
    },
    onSuccess: (session) => {
      setSession(session)
      if (session.user.status === 'deactivated') {
        notify.error('Account deactivated', 'Contact support for access.')
        useAuthStore.getState().clearSession()
        return
      }
      notify.success('Welcome back', `Signed in as ${session.user.email}`)
      navigate('/dashboard', { replace: true })
    },
    onError: (err) => {
      const message =
        err instanceof ApiError ? err.message : 'Login failed. Check your credentials.'
      notify.error(message)
    },
  })
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (body: ForgotPasswordRequest) => forgotPassword(body),
    onSuccess: (res) => {
      notify.success(
        'Email sent',
        res.message ?? 'If an account exists, you will receive a reset link shortly.',
      )
    },
    onError: (err) => {
      notify.error(err instanceof ApiError ? err.message : 'Could not send reset email.')
    },
  })
}

export function useResetPassword() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (body: ResetPasswordRequest) => resetPassword(body),
    onSuccess: (res) => {
      notify.success(res.message ?? 'Password updated. You can sign in now.')
      navigate('/login', { replace: true })
    },
    onError: (err) => {
      notify.error(err instanceof ApiError ? err.message : 'Password reset failed.')
    },
  })
}

export function useLogout() {
  const clearSession = useAuthStore((s) => s.clearSession)
  const navigate = useNavigate()

  return () => {
    clearSession()
    notify.info('Signed out')
    navigate('/', { replace: true })
  }
}

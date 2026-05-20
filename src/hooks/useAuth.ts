import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import {
  forgotPassword,
  login,
  resetPassword,
  signup,
} from '@/api/auth-remote'
import { ApiError } from '@/lib/api-client'
import { useAuthStore } from '@/stores/authStore'
import { notify } from '@/stores/toastStore'
import type {
  ForgotPasswordRequest,
  LoginRequest,
  ResetPasswordRequest,
  SignupRequest,
} from '@/types/auth'

export function useLogin() {
  const setSession = useAuthStore((s) => s.setSession)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (body: LoginRequest) => login(body),
    onSuccess: (session) => {
      setSession(session)
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

export function useSignup() {
  return useMutation({
    mutationFn: (body: SignupRequest) => signup(body),
    onSuccess: (res) => {
      notify.success(
        'Account created',
        res.message ?? 'Check your email and click the verification link before signing in.',
      )
    },
    onError: (err) => {
      const message = err instanceof ApiError ? err.message : 'Sign up failed.'
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
      navigate('/', { replace: true })
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

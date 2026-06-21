import { useAuthStore } from '@/stores/authStore'

export function useIsAdmin() {
  return useAuthStore((s) => s.user?.role === 'admin')
}

import { ThemedToaster } from '@/components/theme/ThemedToaster'
import { AuthBootstrap } from '@/providers/AuthBootstrap'
import { QueryProvider } from '@/providers/QueryProvider'

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthBootstrap>
        {children}
        <ThemedToaster />
      </AuthBootstrap>
    </QueryProvider>
  )
}

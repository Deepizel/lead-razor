import { Toaster } from 'sonner'
import { useThemeStore } from '@/stores/themeStore'

export function ThemedToaster() {
  const theme = useThemeStore((s) => s.theme)
  return <Toaster richColors closeButton position="top-right" theme={theme} />
}

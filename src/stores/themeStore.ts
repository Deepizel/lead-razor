import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ThemeMode = 'light' | 'dark'

interface ThemeState {
  theme: ThemeMode
  setTheme: (theme: ThemeMode) => void
  toggleTheme: () => void
}

function applyTheme(theme: ThemeMode) {
  const root = document.documentElement
  root.classList.remove('light', 'dark')
  root.classList.add(theme)
  root.style.colorScheme = theme
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      setTheme: (theme) => {
        applyTheme(theme)
        set({ theme })
      },
      toggleTheme: () => {
        const next = get().theme === 'dark' ? 'light' : 'dark'
        applyTheme(next)
        set({ theme: next })
      },
    }),
    {
      name: 'leadrazor-theme',
      onRehydrateStorage: () => (state) => {
        if (state) applyTheme(state.theme)
      },
    },
  ),
)

export function initTheme(): void {
  const stored = localStorage.getItem('leadrazor-theme')
  if (stored) {
    try {
      const parsed = JSON.parse(stored) as { state?: { theme?: ThemeMode } }
      const theme = parsed.state?.theme ?? 'dark'
      applyTheme(theme)
      return
    } catch {
      /* fall through */
    }
  }
  applyTheme('dark')
}

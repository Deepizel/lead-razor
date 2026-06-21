import { cn } from '@/lib/utils'

/** Shared Tailwind utilities for the marketing landing page */
export const landingCardLift =
  'transition-all duration-250 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(26,46,90,0.12)]'

export function landingHeroEnter(delayMs = 0) {
  return cn('animate-lr-fade-up', delayMs > 0 && `[animation-delay:${delayMs}ms]`)
}

export const landingRevealBase =
  'translate-y-8 opacity-0 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]'

export const landingRevealVisible = 'translate-y-0 opacity-100'

import { cn } from '@/lib/utils'
import { useInView } from '@/hooks/useInView'
import { landingRevealBase, landingRevealVisible } from '@/lib/landing-tailwind'

interface LandingRevealProps {
  children: React.ReactNode
  className?: string
  delayMs?: number
}

export function LandingReveal({ children, className, delayMs = 0 }: LandingRevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>()

  return (
    <div
      ref={ref}
      className={cn(landingRevealBase, inView && landingRevealVisible, className)}
      style={{ transitionDelay: inView ? `${delayMs}ms` : undefined }}
    >
      {children}
    </div>
  )
}

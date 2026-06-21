import { useEffect, useRef, useState } from 'react'

interface UseInViewOptions {
  rootMargin?: string
  threshold?: number
  once?: boolean
}

export function useInView<T extends HTMLElement = HTMLDivElement>(
  options: UseInViewOptions = {},
) {
  const { rootMargin = '-60px', threshold = 0.12, once = true } = options
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (once) observer.disconnect()
        } else if (!once) {
          setInView(false)
        }
      },
      { rootMargin, threshold },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [rootMargin, threshold, once])

  return { ref, inView }
}

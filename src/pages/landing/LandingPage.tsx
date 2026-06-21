import { Navigate } from 'react-router-dom'
import { AboutSection } from '@/components/landing/AboutSection'
import { FeaturesSection } from '@/components/landing/FeaturesSection'
import { HeroSection } from '@/components/landing/HeroSection'
import { HowItWorksSection } from '@/components/landing/HowItWorksSection'
import { LandingCta } from '@/components/landing/LandingCta'
import { LandingFooter } from '@/components/landing/LandingFooter'
import { LandingNav } from '@/components/landing/LandingNav'
import { PricingSection } from '@/components/landing/PricingSection'
import { TestimonialsSection } from '@/components/landing/TestimonialsSection'
import { DASHBOARD_BASE } from '@/constants/routes'
import { useAuthStore } from '@/stores/authStore'

export default function LandingPage() {
  const isAuthenticated = useAuthStore((s) => Boolean(s.refreshToken || s.accessToken))

  if (isAuthenticated) {
    return <Navigate to={DASHBOARD_BASE} replace />
  }

  return (
    <div className="min-h-svh scroll-smooth bg-white font-sans text-[#111] antialiased [color-scheme:light]">
      <LandingNav />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <FeaturesSection />
        <AboutSection />
        <TestimonialsSection />
        <PricingSection />
        <LandingCta />
      </main>
      <LandingFooter />
    </div>
  )
}

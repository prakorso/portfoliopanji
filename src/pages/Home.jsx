import { useEffect } from 'react'
import Hero from '../components/Hero.jsx'
import AboutSection from '../components/AboutSection.jsx'
import CareerTimeline from '../components/CareerTimeline.jsx'
import ProjectCarousel from '../components/ProjectCarousel.jsx'
import ImpactMetrics from '../components/ImpactMetrics.jsx'
import MarketingFramework from '../components/MarketingFramework.jsx'
import ToolsSection from '../components/ToolsSection.jsx'
import ContactSection from '../components/ContactSection.jsx'

export default function Home() {
  useEffect(() => {
    document.title = 'Panji Prakorso — Marketing | Digital | Performance | Growth'
  }, [])

  return (
    <>
      <Hero />
      <AboutSection />
      <CareerTimeline />
      <ProjectCarousel />
      <ImpactMetrics />
      <MarketingFramework />
      <ToolsSection />
      <ContactSection />
    </>
  )
}

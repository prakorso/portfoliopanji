import Header from './components/Header'
import Hero from './components/Hero'
import DiscoverySection from './components/DiscoverySection'
import PersonalSection from './components/PersonalSection'
import BusinessSection from './components/BusinessSection'
import ModelsSection from './components/ModelsSection'
import HowItWorks from './components/HowItWorks'
import WhyUs from './components/WhyUs'
import FinalCTA from './components/FinalCTA'
import Footer from './components/Footer'
import StickyWhatsApp from './components/StickyWhatsApp'

export default function App() {
  return (
    <>
      <a
        href="#discovery"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:bg-ink focus:px-4 focus:py-3 focus:text-bone"
      >
        Skip to content
      </a>

      <Header />

      <main>
        <Hero />
        <DiscoverySection />
        <PersonalSection />
        <BusinessSection />
        <ModelsSection />
        <HowItWorks />
        <WhyUs />
        <FinalCTA />
      </main>

      <Footer />
      <StickyWhatsApp />
    </>
  )
}

import Navbar from '../components/landing/Navbar'
import Hero from '../components/landing/Hero'
import FeatureBento from '../components/landing/FeatureBento'
import HowItWorks from '../components/landing/HowItWorks'
import FAQ from '../components/landing/FAQ'
import Footer from '../components/landing/Footer'

function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-on-surface">
      <Navbar />
      <main className="pt-[72px] md:pt-[80px]">
        <Hero />
        <FeatureBento />
        <HowItWorks />
        <FAQ />
      </main>
      <Footer />
    </div>
  )
}

export default LandingPage
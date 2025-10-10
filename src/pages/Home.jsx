import Navbar from "../components/Navbar"
import { HeroSection } from "../components/homepagecomp/HeroSection"
import WhatIsMaizeTrack from "../components/homepagecomp/WhatMaizeTrack"
import { FeatureSection } from "../components/homepagecomp/FeatureSection"
import { ModulesSection } from "../components/homepagecomp/ModulesSection"
import { CallToAction } from "../components/homepagecomp/CallToAction"
import { BenefitsSection } from "../components/homepagecomp/BenefitSection"
import { Footer } from "../components/common/Footer"

function Home(){

  return (
    <>
      <Navbar/>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <HeroSection/>

        {/* What is MaizeTrack Section */}
        <WhatIsMaizeTrack/>

        {/* Features Section */}
        <FeatureSection/>

        {/* Modules Selection Section */}
        <ModulesSection/>

        {/* Benefits Section */}
        <BenefitsSection/>

        {/* Call to Action */}
        <CallToAction/>
      </div>

      <Footer/>
    </>
  )
}

export default Home

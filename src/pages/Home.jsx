import Navbar from "../components/Navbar"
import { HeroSection } from "../components/homepagecomp/HeroSection"
import WhatIsMaizeTrack from "../components/homepagecomp/WhatMaizeTrack"
import { FeatureSection } from "../components/homepagecomp/FeatureSection"
import { CallToAction } from "../components/homepagecomp/CallToAction"

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

        {/* Call to Action */}
        <CallToAction/>
      </div>
    </>
  )
}

export default Home

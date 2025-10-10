import Navbar from "../components/common/Navbar"
import { Header } from "../components/aboutpagecomp/Header"
import { SystemOverview } from "../components/aboutpagecomp/SystemOverview"
import { CallForAction } from "../components/aboutpagecomp/CallForAction"
import { Footer } from "../components/common/Footer"

function About(){
  return (
    <>
      <Navbar/>
      
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <Header/>

        {/* System Overview */}
        <SystemOverview/>

        {/* Call to Action */}
        <CallForAction/>
      </div>

      <Footer/>
    </>
  )
}

export default About

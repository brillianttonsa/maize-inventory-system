import Navbar from "../components/common/Navbar"
import { Header } from "../components/contactpagecomp/Header";
import { ContactInfo } from "../components/contactpagecomp/ContactInfo";
import { ContactForm } from "../components/contactpagecomp/ContactForm";
import { Footer } from "../components/common/Footer"


function Contact(){
  
  
  return (
    <>
      <Navbar/>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <Header/>

        {/* Contact Information and Form */}
        <section className="py-16 container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Information */}
            <ContactInfo/>

            {/* Contact Form */}
            <ContactForm/>
          </div>
        </section>  
      </div>

      <Footer/>
    </>
  )
}

export default Contact

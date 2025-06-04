import { BrowserRouter as Router, Route, Routes,Link } from "react-router-dom"
import Navbar from "./components/Navbar"
import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

// pages
import Home from "./pages/Home"
import About from "./pages/About"
import Contact from "./pages/Contact"
import Signup from "./pages/Signup"


export default function App() {
  const [showBox, setShowBox] = useState(false)

  return (
    <div>
      <Router>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/about" element={<About/>}/>
          <Route path="/contact" element={<Contact/>}/>
          <Route path="/signup" element={<Signup/>}/>
        </Routes>  
      </Router>
     



      
    </div>
  )
}

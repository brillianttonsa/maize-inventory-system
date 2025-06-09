import { BrowserRouter as Router, Route, Routes,Link } from "react-router-dom"
import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

// pages
import Home from "./pages/Home"
import About from "./pages/About"
import Contact from "./pages/Contact"
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import NotFound from "./pages/NotFound"
import ResetPassword from "./pages/ResetPassword"

//dashboards pages
// import Dashboard from "./pages/Dashboard"


export default function App() {
  const [showBox, setShowBox] = useState(false)

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/about" element={<About/>}/>
          <Route path="/contact" element={<Contact/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/reset-password" element={<ResetPassword/>}/>
          {/* <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard/>
            </ProtectedRoute>
          } /> */}
          {/* <Route path="/dashboard" element={<Dashboard/>} /> */}
          <Route path="*" element={<NotFound />} />
        </Routes>  
      </Router>
    </div>
  )
}

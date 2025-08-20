import { BrowserRouter as Router, Route, Routes,Link } from "react-router-dom"

// pages
import Home from "./pages/Home"
import About from "./pages/About"
import Contact from "./pages/Contact"
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import NotFound from "./pages/NotFound"
import ResetPassword from "./pages/ResetPassword"
import TermsPage from "./pages/legal/TermsPage"
import PrivacyPolicyPage from "./pages/legal/PrivacypolicyPage"

//dashboards pages
import Dashboard from "./pages/Dashboard"

// protecting routes
import { AuthProvider } from "./context/AuthContext"

export default function App() {

  return (
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/about" element={<About/>}/>
            <Route path="/contact" element={<Contact/>}/>
            <Route path="/signup" element={<Signup/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/reset-password" element={<ResetPassword/>}/>
            <Route path="/terms-of-service" element={<TermsPage/>}/>
            <Route path="private-policy" element={<PrivacyPolicyPage/>}/>
            <Route path="/dashboard" element={<Dashboard/>}/>
            {/* <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard/>
              </ProtectedRoute>
            } /> */}
            {/* <Route path="/dashboard" element={<Dashboard/>} /> */}
            <Route path="*" element={<NotFound />} />
          </Routes>  
        </Router>
      </AuthProvider>
  )
}

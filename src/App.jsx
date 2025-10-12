import { BrowserRouter as Router, Route, Routes} from "react-router-dom"

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


import { Dashboard } from "./dashboardpages/Dashboard"
import Layout from "./components/dashboardcomponents/Sidebar"
import Procurement from "./dashboardpages/Procurement"
import Production from "./dashboardpages/Production"
import Sales from "./dashboardpages/Sales"
import Reports from "./dashboardpages/Reports"
import { Analytics } from "./dashboardpages/Analytics"
import { Settings } from "./dashboardpages/Settings"


// protecting routes
import { AuthProvider } from "./context/AuthContext"
import ProtectedRoute from "./components/ProtectedRoute"

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
            {/* <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard/>
              </ProtectedRoute>
            } /> */}

            <Route path="/dashboard" element={
              <Layout>
                <Dashboard />
              </Layout>
            } />

            <Route path="/procurement" element={
              <Layout>
                <Procurement />
              </Layout>
            } />

            <Route path="/production" element={
              <Layout>
                <Production />
              </Layout>
            } />

            <Route path="/sales" element={
              <Layout>
                <Sales />
              </Layout>
            } />

            <Route path="/analytics" element={
              <Layout>
                <Analytics />
              </Layout>
            } />

            <Route path="/reports" element={
              <Layout>
                <Reports />
              </Layout>
            } />

            <Route path="/settings" element={
              <Layout>
                <Settings />
              </Layout>
            } />

            <Route path="*" element={<NotFound />} />
          </Routes>  
        </Router>
      </AuthProvider>
  )
}

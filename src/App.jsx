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
import ProtectedRoute from "./context/ProtectedRoute"

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
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout>
                <Dashboard />
              </Layout>
              </ProtectedRoute>
            } />

            

            <Route path="/procurement" element={
              <ProtectedRoute>
              <Layout>
              <Procurement />
            </Layout>
            </ProtectedRoute>
            } />

            <Route path="/production" element={
              <ProtectedRoute>
              <Layout>
              <Production />
            </Layout>
            </ProtectedRoute>
            } />

            <Route path="/sales" element={
              <ProtectedRoute>
              <Layout>
              <Sales />
            </Layout>
            </ProtectedRoute>
            } />

            <Route path="/analytics" element={
              <ProtectedRoute>
              <Layout>
              <Analytics />
            </Layout>
            </ProtectedRoute>
            } />

            <Route path="/reports" element={
              <ProtectedRoute>
              <Layout>
              <Reports />
            </Layout>
            </ProtectedRoute>
            } />

            <Route path="/settings" element={
              <ProtectedRoute>
              <Layout>
              <Settings />
            </Layout>
            </ProtectedRoute>
            } />

            <Route path="*" element={<NotFound />} />
          </Routes>  
        </Router>
      </AuthProvider>
  )
}

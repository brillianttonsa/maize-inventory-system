import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';

// pages
import Home from '..//src/page';
import NotFound from '../src/page/NotFound';

import Dashboard from './dashboardpages/Dashboard';
import Layout from '../src/components/dashboard/Sidebar';
import Inventory from './dashboardpages/Inventory';
import Procurement from './dashboardpages/Procurement';
import Production from './dashboardpages/Production';
import Sales from './dashboardpages/Sales';
import Reports from './dashboardpages/Reports';
import Expenses from './dashboardpages/Expenses';
import Analytics from './dashboardpages/Analytics';
import Settings from './dashboardpages/Settings';

// protecting routes
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './context/ProtectedRoute';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/inventory"
            element={
              <ProtectedRoute>
                <Layout>
                  <Inventory />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/procurement"
            element={
              <ProtectedRoute>
                <Layout>
                  <Procurement />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/production"
            element={
              <ProtectedRoute>
                <Layout>
                  <Production />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/sales"
            element={
              <ProtectedRoute>
                <Layout>
                  <Sales />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Layout>
                  <Analytics />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/expenses"
            element={
              <ProtectedRoute>
                <Layout>
                  <Expenses />
                </Layout>
              </ProtectedRoute>
            }
          />

         

          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Layout>
                  <Reports />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Layout>
                  <Settings />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

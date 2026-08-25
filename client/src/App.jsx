import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import RakhiStalls from './pages/RakhiStalls';
import RateStall from './pages/RateStall';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="app-container">
      {/* Hide public header on admin pages */}
      {!isAdminRoute && <Header />}

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Public Stalls Directory & Showcase */}
          <Route path="/rakhi-stalls" element={<RakhiStalls />} />
          <Route path="/stalls" element={<RakhiStalls />} />

          {/* Dedicated Individual Stall QR Code Rating Pages */}
          <Route path="/rate/:stallId" element={<RateStall />} />
          <Route path="/rate" element={<RateStall />} />
          <Route path="/rate-stall/:stallId" element={<RateStall />} />
          <Route path="/rate-stall" element={<RateStall />} />
          <Route path="/bazaar-rating" element={<RateStall />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      {/* Hide public footer on admin pages */}
      {!isAdminRoute && <Footer />}
    </div>
  );
}

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import VendorDashboardLayout from './layouts/VendorDashboardLayout'
import CoupleLayout from './layouts/CoupleLayout'
import Overview from './pages/vendor/Overview'
import Bookings from './pages/vendor/Bookings'
import Messages from './pages/vendor/Messages'
import Portfolio from './pages/vendor/Portfolio'
import Services from './pages/vendor/Services'
import Availability from './pages/vendor/Availability'
import Analytics from './pages/vendor/Analytics'
import Settings from './pages/vendor/Settings'
import VendorSelection from './pages/couple/vendor-selection'
import VendorDetail from './pages/couple/vendor-detail'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/couple" replace />} />
        
        {/* Vendor Dashboard Routes */}
        <Route path="/vendor" element={<VendorDashboardLayout />}>
          <Route index element={<Overview />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="messages" element={<Messages />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="services" element={<Services />} />
          <Route path="availability" element={<Availability />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Couple Wedding Planning Routes */}
        <Route path="/couple" element={<CoupleLayout />}>
          <Route index element={<Navigate to="/couple/vendor-selection" replace />} />
          <Route path="vendor-selection" element={<VendorSelection />} />
          <Route path="vendor/:vendorId" element={<VendorDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

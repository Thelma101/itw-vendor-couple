import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import VendorDashboardLayout from './layouts/VendorDashboardLayout'
import Overview from './pages/vendor/Overview'
import Bookings from './pages/vendor/Bookings'
import Messages from './pages/vendor/Messages'
import Portfolio from './pages/vendor/Portfolio'
import Services from './pages/vendor/Services'
import Availability from './pages/vendor/Availability'
import Settings from './pages/vendor/Settings'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/vendor" replace />} />
        <Route path="/vendor" element={<VendorDashboardLayout />}>
          <Route index element={<Overview />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="messages" element={<Messages />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="services" element={<Services />} />
          <Route path="availability" element={<Availability />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

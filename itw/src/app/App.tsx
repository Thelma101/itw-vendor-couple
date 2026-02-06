import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { CoupleDashboard } from './pages/couple-dashboard';
import { Landing } from './pages/landing';
import { Search } from './pages/search';
import { VendorBookings } from './pages/vendor-bookings';
import { VendorDashboard } from './pages/vendor-dashboard';
import { VendorLeads } from './pages/vendor-leads';
import { VendorProfile } from './pages/vendor-profile';
import { VendorProfileEditor } from './pages/vendor-profile-editor';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Couple Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/search" element={<Search />} />
        <Route path="/vendor/:id" element={<VendorProfile />} />
        <Route path="/couple-dashboard" element={<CoupleDashboard />} />

        {/* Vendor Routes */}
        <Route path="/vendor-dashboard" element={<VendorDashboard />} />
        <Route path="/vendor-leads" element={<VendorLeads />} />
        <Route path="/vendor-bookings" element={<VendorBookings />} />
        <Route path="/vendor-profile" element={<VendorProfileEditor />} />
      </Routes>
    </BrowserRouter>
  );
}

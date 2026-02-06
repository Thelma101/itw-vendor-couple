import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ShortlistProvider } from './contexts/ShortlistContext'
import { NotificationProvider } from './contexts/NotificationContext'
import SelectVendors from './pages/couple/SelectVendors'
import Shortlist from './pages/couple/Shortlist'
import SearchResults from './pages/couple/SearchResults'
import EnhancedSearchResults from './pages/couple/EnhancedSearchResults'
import HomePage from './pages/couple/HomePage'
import Dashboard from './pages/couple/Dashboard'
import MyVendors from './pages/couple/MyVendors'
import VendorProfile from './pages/couple/VendorProfile'
import Messages from './pages/couple/Messages'
import Booking from './pages/couple/Booking'
import CoupleProfile from './pages/couple/Profile'
import Checklist from './pages/couple/Checklist'
import BudgetTracker from './pages/couple/BudgetTracker'
import GuestList from './pages/couple/GuestList'
import WeddingWebsite from './pages/couple/WeddingWebsite'
import DayOfTimeline from './pages/couple/DayOfTimeline'
import VendorCompare from './pages/couple/VendorCompare'
import InspirationGallery from './pages/couple/InspirationGallery'
import SeatingChart from './pages/couple/SeatingChart'
import VendorDashboardLayout from './layouts/VendorDashboardLayout'
import Gallery from './pages/vendor/Gallery'
import AccountInformation from './pages/vendor/AccountInformation'
import SubscriptionPage from './pages/vendor/SubscriptionPage'
import PaymentMethod from './pages/vendor/PaymentMethod'
import SecurityPage from './pages/vendor/SecurityPage'
import SubscriptionSuccess from './pages/vendor/SubscriptionSuccess'
import VendorOverview from './pages/vendor/Overview'
import VendorAnalytics from './pages/vendor/Analytics'
import VendorMessages from './pages/vendor/Messages'
import VendorBookings from './pages/vendor/Bookings'
import VendorServices from './pages/vendor/Services'
import VendorAvailability from './pages/vendor/Availability'
import VendorPortfolio from './pages/vendor/Portfolio'
import Leads from './pages/vendor/Leads'
import Reviews from './pages/vendor/Reviews'
import Promotions from './pages/vendor/Promotions'
import TeamManagement from './pages/vendor/TeamManagement'
import BusinessInsights from './pages/vendor/BusinessInsights'

export default function App() {
  return (
    <NotificationProvider>
      <ShortlistProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            
            {/* Couple Routes (after login) */}
            <Route path="/couple/dashboard" element={<Dashboard />} />
            <Route path="/couple/search-results" element={<SearchResults />} />
            <Route path="/couple/search" element={<EnhancedSearchResults />} />
            <Route path="/couple/select-vendors" element={<SelectVendors />} />
            <Route path="/couple/vendor/:id" element={<VendorProfile />} />
            <Route path="/couple/shortlist" element={<Shortlist />} />
            <Route path="/couple/my-vendors" element={<MyVendors />} />
            <Route path="/couple/messages" element={<Messages />} />
            <Route path="/couple/booking" element={<Booking />} />
            <Route path="/couple/profile" element={<CoupleProfile />} />
            <Route path="/couple/checklist" element={<Checklist />} />
            <Route path="/couple/budget" element={<BudgetTracker />} />
            <Route path="/couple/guests" element={<GuestList />} />
            <Route path="/couple/website" element={<WeddingWebsite />} />
            <Route path="/couple/timeline" element={<DayOfTimeline />} />
            <Route path="/couple/compare" element={<VendorCompare />} />
            <Route path="/couple/inspiration" element={<InspirationGallery />} />
            <Route path="/couple/seating" element={<SeatingChart />} />

            {/* Vendor Dashboard Routes */}
            <Route path="/vendor" element={<VendorDashboardLayout />}>
              <Route index element={<VendorOverview />} />
              <Route path="overview" element={<VendorOverview />} />
              <Route path="analytics" element={<VendorAnalytics />} />
              <Route path="messages" element={<VendorMessages />} />
              <Route path="bookings" element={<VendorBookings />} />
              <Route path="services" element={<VendorServices />} />
              <Route path="availability" element={<VendorAvailability />} />
              <Route path="portfolio" element={<VendorPortfolio />} />
              <Route path="leads" element={<Leads />} />
              <Route path="reviews" element={<Reviews />} />
              <Route path="promotions" element={<Promotions />} />
              <Route path="team" element={<TeamManagement />} />
              <Route path="insights" element={<BusinessInsights />} />
              <Route path="gallery" element={<Gallery />} />
              <Route path="account" element={<AccountInformation />} />
              <Route path="subscription" element={<SubscriptionPage />} />
              <Route path="payment" element={<PaymentMethod />} />
              <Route path="security" element={<SecurityPage />} />
              <Route path="subscription/success" element={<SubscriptionSuccess />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ShortlistProvider>
    </NotificationProvider>
  )
}

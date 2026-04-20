import { lazy, Suspense, type ReactNode } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AppErrorBoundary from './components/AppErrorBoundary'
import RouteLoader from './components/RouteLoader'
import { NotificationProvider } from './contexts/NotificationContext'
import { ShortlistProvider } from './contexts/ShortlistContext'
import { useAuthFromUrl } from './hooks/useAuthFromUrl'

const SelectVendors = lazy(() => import('./pages/couple/SelectVendors'))
const Shortlist = lazy(() => import('./pages/couple/Shortlist'))
const SearchResults = lazy(() => import('./pages/couple/SearchResults'))
const EnhancedSearchResults = lazy(() => import('./pages/couple/EnhancedSearchResults'))
const HomePage = lazy(() => import('./pages/couple/HomePage'))
const Dashboard = lazy(() => import('./pages/couple/Dashboard'))
const MyVendors = lazy(() => import('./pages/couple/MyVendors'))
const VendorProfile = lazy(() => import('./pages/couple/VendorProfile'))
const Messages = lazy(() => import('./pages/couple/Messages'))
const Booking = lazy(() => import('./pages/couple/Booking'))
const CoupleProfile = lazy(() => import('./pages/couple/Profile'))
const Checklist = lazy(() => import('./pages/couple/Checklist'))
const BudgetTracker = lazy(() => import('./pages/couple/BudgetTracker'))
const GuestList = lazy(() => import('./pages/couple/GuestList'))
const WeddingWebsite = lazy(() => import('./pages/couple/WeddingWebsite'))
const DayOfTimeline = lazy(() => import('./pages/couple/DayOfTimeline'))
const VendorCompare = lazy(() => import('./pages/couple/VendorCompare'))
const InspirationGallery = lazy(() => import('./pages/couple/InspirationGallery'))
const SeatingChart = lazy(() => import('./pages/couple/SeatingChart'))
const Favourites = lazy(() => import('./pages/couple/Favourites'))
const AskWed = lazy(() => import('./pages/couple/AskWed'))
const VendorMatching = lazy(() => import('./pages/couple/VendorMatching'))
const GuestExperienceHub = lazy(() => import('./pages/couple/GuestExperienceHub'))
const LandingPage = lazy(() => import('./pages/LandingPage'))
const BlushLandingPage = lazy(() => import('./pages/BlushLandingPage'))

const VendorDashboardLayout = lazy(() => import('./layouts/VendorDashboardLayout'))
const Gallery = lazy(() => import('./pages/vendor/Gallery'))
const AccountInformation = lazy(() => import('./pages/vendor/AccountInformation'))
const SubscriptionPage = lazy(() => import('./pages/vendor/SubscriptionPage'))
const PaymentMethod = lazy(() => import('./pages/vendor/PaymentMethod'))
const SecurityPage = lazy(() => import('./pages/vendor/SecurityPage'))
const SubscriptionSuccess = lazy(() => import('./pages/vendor/SubscriptionSuccess'))
const VendorOverview = lazy(() => import('./pages/vendor/Overview'))
const VendorAnalytics = lazy(() => import('./pages/vendor/Analytics'))
const VendorMessages = lazy(() => import('./pages/vendor/Messages'))
const VendorBookings = lazy(() => import('./pages/vendor/Bookings'))
const VendorServices = lazy(() => import('./pages/vendor/Services'))
const VendorAvailability = lazy(() => import('./pages/vendor/Availability'))
const VendorPortfolio = lazy(() => import('./pages/vendor/Portfolio'))
const Leads = lazy(() => import('./pages/vendor/Leads'))
const Reviews = lazy(() => import('./pages/vendor/Reviews'))
const Promotions = lazy(() => import('./pages/vendor/Promotions'))
const TeamManagement = lazy(() => import('./pages/vendor/TeamManagement'))
const BusinessInsights = lazy(() => import('./pages/vendor/BusinessInsights'))

function AuthReceiver({ children }: { children: ReactNode }) {
  useAuthFromUrl()
  return <>{children}</>
}

function RoutedPage({ children }: { children: ReactNode }) {
  return (
    <AppErrorBoundary>
      <Suspense fallback={<RouteLoader />}>
        <main id="main-content">{children}</main>
      </Suspense>
    </AppErrorBoundary>
  )
}

export default function App() {
  return (
    <NotificationProvider>
      <ShortlistProvider>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <BrowserRouter>
          <AuthReceiver>
            <Routes>
              <Route path="/" element={<RoutedPage><HomePage /></RoutedPage>} />
              <Route path="/landing" element={<RoutedPage><LandingPage /></RoutedPage>} />
              <Route path="/landing-blush" element={<RoutedPage><BlushLandingPage /></RoutedPage>} />

              <Route path="/couple/dashboard" element={<RoutedPage><Dashboard /></RoutedPage>} />
              <Route path="/couple/search-results" element={<RoutedPage><SearchResults /></RoutedPage>} />
              <Route path="/couple/search" element={<RoutedPage><EnhancedSearchResults /></RoutedPage>} />
              <Route path="/couple/select-vendors" element={<RoutedPage><SelectVendors /></RoutedPage>} />
              <Route path="/couple/vendor/:id" element={<RoutedPage><VendorProfile /></RoutedPage>} />
              <Route path="/couple/shortlist" element={<RoutedPage><Shortlist /></RoutedPage>} />
              <Route path="/couple/my-vendors" element={<RoutedPage><MyVendors /></RoutedPage>} />
              <Route path="/couple/messages" element={<RoutedPage><Messages /></RoutedPage>} />
              <Route path="/couple/booking" element={<RoutedPage><Booking /></RoutedPage>} />
              <Route path="/couple/profile" element={<RoutedPage><CoupleProfile /></RoutedPage>} />
              <Route path="/couple/checklist" element={<RoutedPage><Checklist /></RoutedPage>} />
              <Route path="/couple/budget" element={<RoutedPage><BudgetTracker /></RoutedPage>} />
              <Route path="/couple/guests" element={<RoutedPage><GuestList /></RoutedPage>} />
              <Route path="/couple/website" element={<RoutedPage><WeddingWebsite /></RoutedPage>} />
              <Route path="/couple/timeline" element={<RoutedPage><DayOfTimeline /></RoutedPage>} />
              <Route path="/couple/compare" element={<RoutedPage><VendorCompare /></RoutedPage>} />
              <Route path="/couple/inspiration" element={<RoutedPage><InspirationGallery /></RoutedPage>} />
              <Route path="/couple/seating" element={<RoutedPage><SeatingChart /></RoutedPage>} />
              <Route path="/couple/favourites" element={<RoutedPage><Favourites /></RoutedPage>} />
              <Route path="/couple/askwed" element={<RoutedPage><AskWed /></RoutedPage>} />
              <Route path="/couple/vendor-matching" element={<RoutedPage><VendorMatching /></RoutedPage>} />
              <Route path="/couple/guest-hub" element={<RoutedPage><GuestExperienceHub /></RoutedPage>} />

              <Route path="/vendor" element={<RoutedPage><VendorDashboardLayout /></RoutedPage>}>
                <Route index element={<RoutedPage><VendorOverview /></RoutedPage>} />
                <Route path="overview" element={<RoutedPage><VendorOverview /></RoutedPage>} />
                <Route path="analytics" element={<RoutedPage><VendorAnalytics /></RoutedPage>} />
                <Route path="messages" element={<RoutedPage><VendorMessages /></RoutedPage>} />
                <Route path="bookings" element={<RoutedPage><VendorBookings /></RoutedPage>} />
                <Route path="services" element={<RoutedPage><VendorServices /></RoutedPage>} />
                <Route path="availability" element={<RoutedPage><VendorAvailability /></RoutedPage>} />
                <Route path="portfolio" element={<RoutedPage><VendorPortfolio /></RoutedPage>} />
                <Route path="leads" element={<RoutedPage><Leads /></RoutedPage>} />
                <Route path="reviews" element={<RoutedPage><Reviews /></RoutedPage>} />
                <Route path="promotions" element={<RoutedPage><Promotions /></RoutedPage>} />
                <Route path="team" element={<RoutedPage><TeamManagement /></RoutedPage>} />
                <Route path="insights" element={<RoutedPage><BusinessInsights /></RoutedPage>} />
                <Route path="gallery" element={<RoutedPage><Gallery /></RoutedPage>} />
                <Route path="account" element={<RoutedPage><AccountInformation /></RoutedPage>} />
                <Route path="subscription" element={<RoutedPage><SubscriptionPage /></RoutedPage>} />
                <Route path="payment" element={<RoutedPage><PaymentMethod /></RoutedPage>} />
                <Route path="security" element={<RoutedPage><SecurityPage /></RoutedPage>} />
                <Route path="subscription/success" element={<RoutedPage><SubscriptionSuccess /></RoutedPage>} />
              </Route>
            </Routes>
          </AuthReceiver>
        </BrowserRouter>
      </ShortlistProvider>
    </NotificationProvider>
  )
}

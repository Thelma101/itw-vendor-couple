import { lazy, Suspense, type ReactNode } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import AppErrorBoundary from '@/shared/components/AppErrorBoundary'
import DemoBanner from '@/shared/components/DemoBanner'
import RouteLoader from '@/shared/components/RouteLoader'
import ProtectedRoute from '@/shared/components/ProtectedRoute'
import { NotificationProvider } from '@/shared/contexts/NotificationContext'
import { ShortlistProvider } from '@/shared/contexts/ShortlistContext'
import { NotesProvider } from '@/shared/contexts/NotesContext'
import { PlanProvider } from '@/shared/contexts/PlanContext'
import { useAuthFromUrl } from '@/shared/hooks/useAuthFromUrl'
import NavigationTracker from '@/shared/components/NavigationTracker'

/* ── F&F core: couple ── */
const SelectVendors = lazy(() => import('@/couple/pages/SelectVendors'))
const Shortlist = lazy(() => import('@/couple/pages/Shortlist'))
const SearchResults = lazy(() => import('@/couple/pages/SearchResults'))
const EnhancedSearchResults = lazy(() => import('@/couple/pages/EnhancedSearchResults'))
const Dashboard = lazy(() => import('@/couple/pages/Dashboard'))
const MyVendors = lazy(() => import('@/couple/pages/MyVendors'))
const VendorProfile = lazy(() => import('@/couple/pages/VendorProfile'))
const Messages = lazy(() => import('@/couple/pages/Messages'))
const Booking = lazy(() => import('@/couple/pages/Booking'))
const CoupleProfile = lazy(() => import('@/couple/pages/Profile'))
const Checklist = lazy(() => import('@/couple/pages/Checklist'))
const BudgetTracker = lazy(() => import('@/couple/pages/BudgetTracker'))
const GuestList = lazy(() => import('@/couple/pages/GuestList'))
const OnboardingPage = lazy(() => import('@/auth/pages/OnboardingPage'))
const LandingPage = lazy(() => import('@/marketing/pages/LandingPage'))
const WeddingWebsite = lazy(() => import('@/couple/pages/WeddingWebsite'))
const WeddingWebsiteGuestPreview = lazy(() => import('@/couple/pages/WeddingWebsiteGuestPreview'))
const GiftRegistry = lazy(() => import('@/couple/pages/GiftRegistry'))
const PrivacyPolicy = lazy(() => import('@/shared/pages/PrivacyPolicy'))
const TermsOfService = lazy(() => import('@/shared/pages/TermsOfService'))
const PublicGiftRegistry = lazy(() => import('@/couple/pages/PublicGiftRegistry'))
const CompareVendors = lazy(() => import('@/couple/pages/CompareVendors'))

/* ── F&F core: vendor ── */
const VendorDashboardLayout = lazy(() => import('@/vendor/layouts/VendorDashboardLayout'))
const VendorOverview = lazy(() => import('@/vendor/pages/Overview'))
const VendorMessages = lazy(() => import('@/vendor/pages/Messages'))
const VendorBookings = lazy(() => import('@/vendor/pages/Bookings'))
const Leads = lazy(() => import('@/vendor/pages/Leads'))
const VendorServices = lazy(() => import('@/vendor/pages/Services'))
const VendorPortfolio = lazy(() => import('@/vendor/pages/Portfolio'))
const AccountInformation = lazy(() => import('@/vendor/pages/AccountInformation'))
const VendorSubscription = lazy(() => import('@/vendor/pages/Subscription'))

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
        <NotesProvider>
          <PlanProvider>
          <AuthReceiver>
            <NavigationTracker />
            <DemoBanner />
            <Routes>
              {/* Single landing */}
              <Route path="/" element={<RoutedPage><LandingPage /></RoutedPage>} />
              <Route path="/home-alt" element={<Navigate to="/" replace />} />
              <Route path="/landing" element={<Navigate to="/" replace />} />
              <Route path="/landing-improved" element={<Navigate to="/" replace />} />
              <Route path="/landing-blush" element={<Navigate to="/" replace />} />

              <Route path="/signin" element={<RoutedPage><OnboardingPage /></RoutedPage>} />
              <Route path="/signup" element={<RoutedPage><OnboardingPage /></RoutedPage>} />
              <Route path="/privacy" element={<RoutedPage><PrivacyPolicy /></RoutedPage>} />
              <Route path="/terms" element={<RoutedPage><TermsOfService /></RoutedPage>} />

              {/* Couple core loop */}
              <Route path="/couple/dashboard" element={<ProtectedRoute><RoutedPage><Dashboard /></RoutedPage></ProtectedRoute>} />
              <Route path="/couple/search-results" element={<ProtectedRoute><RoutedPage><SearchResults /></RoutedPage></ProtectedRoute>} />
              <Route path="/couple/search" element={<ProtectedRoute><RoutedPage><EnhancedSearchResults /></RoutedPage></ProtectedRoute>} />
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
              <Route path="/couple/wedding-website" element={<ProtectedRoute><RoutedPage><WeddingWebsite /></RoutedPage></ProtectedRoute>} />
              <Route path="/couple/wedding-website/preview" element={<RoutedPage><WeddingWebsiteGuestPreview /></RoutedPage>} />
              {/* Guest preview of wedding site — works on any host, no custom domain needed */}
              <Route path="/w/:slug" element={<RoutedPage><WeddingWebsiteGuestPreview /></RoutedPage>} />
              <Route path="/couple/registry" element={<ProtectedRoute><RoutedPage><GiftRegistry /></RoutedPage></ProtectedRoute>} />
              <Route path="/couple/registry/public/:slug" element={<RoutedPage><PublicGiftRegistry /></RoutedPage>} />
              <Route path="/couple/compare" element={<ProtectedRoute><RoutedPage><CompareVendors /></RoutedPage></ProtectedRoute>} />

              {/* Non-core couple features → dashboard for F&F */}
              <Route path="/couple/timeline" element={<Navigate to="/couple/dashboard" replace />} />
              <Route path="/couple/inspiration" element={<Navigate to="/couple/dashboard" replace />} />
              <Route path="/couple/seating" element={<Navigate to="/couple/dashboard" replace />} />
              <Route path="/couple/favourites" element={<Navigate to="/couple/dashboard" replace />} />
              <Route path="/couple/askwed" element={<Navigate to="/couple/dashboard" replace />} />
              <Route path="/couple/vendor-matching" element={<Navigate to="/couple/dashboard" replace />} />
              <Route path="/couple/guest-hub" element={<Navigate to="/couple/dashboard" replace />} />

              {/* Vendor core loop */}
              <Route path="/vendor" element={<RoutedPage><VendorDashboardLayout /></RoutedPage>}>
                <Route index element={<VendorOverview />} />
                <Route path="overview" element={<VendorOverview />} />
                <Route path="dashboard" element={<Navigate to="/vendor" replace />} />
                <Route path="leads" element={<Leads />} />
                <Route path="bookings" element={<VendorBookings />} />
                <Route path="messages" element={<VendorMessages />} />
                <Route path="services" element={<VendorServices />} />
                <Route path="portfolio" element={<VendorPortfolio />} />
                <Route path="account" element={<AccountInformation />} />
                <Route path="subscription" element={<VendorSubscription />} />
                <Route path="subscription/success" element={<Navigate to="/vendor/subscription" replace />} />
                {/* Non-core vendor → overview */}
                <Route path="analytics" element={<Navigate to="/vendor" replace />} />
                <Route path="availability" element={<Navigate to="/vendor" replace />} />
                <Route path="reviews" element={<Navigate to="/vendor" replace />} />
                <Route path="promotions" element={<Navigate to="/vendor" replace />} />
                <Route path="team" element={<Navigate to="/vendor" replace />} />
                <Route path="insights" element={<Navigate to="/vendor" replace />} />
                <Route path="gallery" element={<Navigate to="/vendor" replace />} />
                <Route path="payment" element={<Navigate to="/vendor/subscription" replace />} />
                <Route path="security" element={<Navigate to="/vendor/account" replace />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AuthReceiver>
          </PlanProvider>
        </NotesProvider>
      </ShortlistProvider>
    </NotificationProvider>
  )
}

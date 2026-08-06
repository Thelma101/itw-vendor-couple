import fs from 'node:fs'
import path from 'node:path'

const srcRoot = path.resolve('src')

/** Ordered longest-first replacements for import/export paths */
const replacements = [
  // Absolute @/ paths — domain pages
  ['@/pages/couple/', '@/couple/pages/'],
  ['@/pages/vendor/', '@/vendor/pages/'],
  ['@/pages/auth/', '@/auth/pages/'],
  ['@/pages/LandingPage', '@/marketing/pages/LandingPage'],
  ['@/pages/LandingPageAlt', '@/marketing/pages/LandingPageAlt'],
  ['@/pages/ImprovedLandingPage', '@/marketing/pages/ImprovedLandingPage'],
  ['@/pages/BlushLandingPage', '@/marketing/pages/BlushLandingPage'],

  // Absolute @/ components
  ['@/components/onboarding/', '@/auth/components/'],
  ['@/components/couple/', '@/couple/components/'],
  ['@/components/vendor/', '@/vendor/components/'],
  ['@/components/home/', '@/couple/components/home/'],

  // Marketing components
  ...[
    'Navbar', 'Banner', 'BannerMobileLayout3', 'Category', 'VendorGallery',
    'FeaturesCard', 'WeddingWebsite', 'Footer', 'CalendarSection', 'WeddingHashtags',
    'PhotoCollage', 'BorderRectangle', 'Logo',
  ].flatMap((name) => [
    [`@/components/${name}`, `@/marketing/components/${name}`],
    [`../components/${name}`, `@/marketing/components/${name}`],
    [`../../components/${name}`, `@/marketing/components/${name}`],
    [`../../../components/${name}`, `@/marketing/components/${name}`],
  ]),

  // Couple top-level components
  ...[
    'Nav', 'NotificationPanel', 'BookingCalendar', 'EnhancedBookingFlow',
    'InquiryForm', 'VendorFilter', 'VendorPreviewModal', 'VendorSearchBar',
    'AdvancedSearchFilters', 'EnhancedCategoryDropdown',
  ].flatMap((name) => [
    [`@/components/${name}`, `@/couple/components/${name}`],
    [`../components/${name}`, `@/couple/components/${name}`],
    [`../../components/${name}`, `@/couple/components/${name}`],
    [`../../../components/${name}`, `@/couple/components/${name}`],
  ]),

  // Shared components
  ...[
    'AppErrorBoundary', 'RouteLoader', 'ProtectedRoute', 'DemoBanner',
    'BackButton', 'DeleteConfirmModal', 'SimpleToast',
  ].flatMap((name) => [
    [`@/components/${name}`, `@/shared/components/${name}`],
    [`../components/${name}`, `@/shared/components/${name}`],
    [`../../components/${name}`, `@/shared/components/${name}`],
    [`../../../components/${name}`, `@/shared/components/${name}`],
  ]),

  ['@/components/icons/', '@/shared/components/icons/'],
  ['@/components/images/', '@/shared/components/images/'],

  // Shared modules
  ['@/contexts/', '@/shared/contexts/'],
  ['@/hooks/', '@/shared/hooks/'],
  ['@/lib/', '@/shared/lib/'],
  ['@/data/', '@/shared/data/'],
  ['@/styles/', '@/shared/styles/'],
  ['@/assets/', '@/shared/assets/'],
  ['@/features/', '@/marketing/features/'],
  ['@/layouts/VendorDashboardLayout', '@/vendor/layouts/VendorDashboardLayout'],
  ['@/layouts/CoupleLayout', '@/couple/layouts/CoupleLayout'],

  // Legacy aliases
  ['@pages/couple/', '@/couple/pages/'],
  ['@pages/vendor/', '@/vendor/pages/'],
  ['@pages/auth/', '@/auth/pages/'],
  ['@pages/', '@/marketing/pages/'],
  ['@components/onboarding/', '@/auth/components/'],
  ['@components/couple/', '@/couple/components/'],
  ['@components/vendor/', '@/vendor/components/'],
  ['@components/home/', '@/couple/components/home/'],
  ['@lib/', '@/shared/lib/'],
  ['@features/', '@/marketing/features/'],
  ['@styles/', '@/shared/styles/'],

  // Relative shared modules (common patterns)
  ['../contexts/', '@/shared/contexts/'],
  ['../../contexts/', '@/shared/contexts/'],
  ['../../../contexts/', '@/shared/contexts/'],
  ['../hooks/', '@/shared/hooks/'],
  ['../../hooks/', '@/shared/hooks/'],
  ['../../../hooks/', '@/shared/hooks/'],
  ['../lib/', '@/shared/lib/'],
  ['../../lib/', '@/shared/lib/'],
  ['../../../lib/', '@/shared/lib/'],
  ['../data/', '@/shared/data/'],
  ['../../data/', '@/shared/data/'],
  ['../../../data/', '@/shared/data/'],
  ['../styles/', '@/shared/styles/'],
  ['../../styles/', '@/shared/styles/'],
  ['../features/', '@/marketing/features/'],
  ['../../features/', '@/marketing/features/'],
  ['../../../features/', '@/marketing/features/'],

  // Relative page/component folder leftovers
  ['../pages/couple/', '@/couple/pages/'],
  ['../../pages/couple/', '@/couple/pages/'],
  ['../pages/vendor/', '@/vendor/pages/'],
  ['../../pages/vendor/', '@/vendor/pages/'],
  ['../pages/auth/', '@/auth/pages/'],
  ['../../pages/auth/', '@/auth/pages/'],
  ['../layouts/VendorDashboardLayout', '@/vendor/layouts/VendorDashboardLayout'],
  ['../../layouts/VendorDashboardLayout', '@/vendor/layouts/VendorDashboardLayout'],
  ['../layouts/CoupleLayout', '@/couple/layouts/CoupleLayout'],
  ['../../layouts/CoupleLayout', '@/couple/layouts/CoupleLayout'],
  ['../components/couple/', '@/couple/components/'],
  ['../../components/couple/', '@/couple/components/'],
  ['../components/vendor/', '@/vendor/components/'],
  ['../../components/vendor/', '@/vendor/components/'],
  ['../components/onboarding/', '@/auth/components/'],
  ['../../components/onboarding/', '@/auth/components/'],
  ['../components/home/', '@/couple/components/home/'],
  ['../../components/home/', '@/couple/components/home/'],
]

// Sort by search string length descending so longer matches win first
replacements.sort((a, b) => b[0].length - a[0].length)

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full, out)
    else if (/\.(ts|tsx|css|js|jsx)$/.test(entry.name)) out.push(full)
  }
  return out
}

let changedFiles = 0
let totalReplacements = 0

for (const file of walk(srcRoot)) {
  let text = fs.readFileSync(file, 'utf8')
  const original = text
  for (const [from, to] of replacements) {
    if (text.includes(from)) {
      const count = text.split(from).length - 1
      text = text.split(from).join(to)
      totalReplacements += count
    }
  }
  if (text !== original) {
    fs.writeFileSync(file, text, 'utf8')
    changedFiles++
    console.log('updated', path.relative(srcRoot, file))
  }
}

console.log(`\nDone. ${changedFiles} files, ${totalReplacements} replacements.`)

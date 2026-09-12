/**
 * iTheeWed — plan / feature registry
 *
 * Vendor commercial ladder (soft-launch):
 * Starter (free) → Professional → Business → Enterprise
 * Plus optional Jiji-style boost packs on any plan.
 *
 * Couples: Standard core free; Premium couple extras soft-gated.
 */

export type PlanId = 'standard' | 'premium' | 'business' | 'enterprise'

/** @deprecated use PlanId — kept for older imports */
export type FeatureTier = PlanId | 'free'

export interface FeatureDefinition {
  id: string
  name: string
  tier: 'standard' | 'premium' | 'business' | 'enterprise'
  description: string
  category: string
  audience: 'couple' | 'vendor' | 'both'
}

export const PLAN_LIMITS = {
  standard: {
    guestCap: 100,
    vendorMessagesPerMonth: 5,
    leadUnlocksPerMonth: 5,
    portfolioAlbums: 6,
    teamSeats: 1,
  },
  premium: {
    guestCap: Number.POSITIVE_INFINITY,
    vendorMessagesPerMonth: Number.POSITIVE_INFINITY,
    leadUnlocksPerMonth: Number.POSITIVE_INFINITY,
    portfolioAlbums: Number.POSITIVE_INFINITY,
    teamSeats: 3,
  },
  /** Between Professional and Enterprise — growing multi-person studios */
  business: {
    guestCap: Number.POSITIVE_INFINITY,
    vendorMessagesPerMonth: Number.POSITIVE_INFINITY,
    leadUnlocksPerMonth: Number.POSITIVE_INFINITY,
    portfolioAlbums: Number.POSITIVE_INFINITY,
    teamSeats: 8,
  },
  enterprise: {
    guestCap: Number.POSITIVE_INFINITY,
    vendorMessagesPerMonth: Number.POSITIVE_INFINITY,
    leadUnlocksPerMonth: Number.POSITIVE_INFINITY,
    portfolioAlbums: Number.POSITIVE_INFINITY,
    teamSeats: Number.POSITIVE_INFINITY,
  },
} as const

export const PLAN_DISPLAY = {
  standard: { name: 'Starter', monthlyNaira: 0, annualNaira: 0 },
  premium: { name: 'Professional', monthlyNaira: 15000, annualNaira: 150000 },
  business: { name: 'Business', monthlyNaira: 28000, annualNaira: 280000 },
  enterprise: { name: 'Enterprise', monthlyNaira: 45000, annualNaira: 450000 },
} as const

export const FEATURE_MAP: FeatureDefinition[] = [
  // ── Couple core ──
  { id: 'dashboard', name: 'Wedding Dashboard', tier: 'standard', description: 'Countdown, progress, budget & guests hub', category: 'Core Planning', audience: 'couple' },
  { id: 'checklist', name: 'Wedding Checklist', tier: 'standard', description: 'To-do list with completion tracking', category: 'Core Planning', audience: 'couple' },
  { id: 'checklist-custom', name: 'Custom Checklist Templates', tier: 'premium', description: 'Culture-specific or theme-based checklists', category: 'Core Planning', audience: 'couple' },
  { id: 'budget-tracker', name: 'Budget Tracker', tier: 'standard', description: 'Track expenses and allocations in ₦', category: 'Core Planning', audience: 'couple' },
  { id: 'budget-insights', name: 'AI Budget Insights', tier: 'premium', description: 'Smart spending tips and negotiation suggestions', category: 'Core Planning', audience: 'couple' },
  { id: 'vendor-search', name: 'Vendor Search & Browse', tier: 'standard', description: 'Search and hire vendors', category: 'Vendors', audience: 'couple' },
  { id: 'vendor-shortlist', name: 'Shortlist & Favourites', tier: 'standard', description: 'Save favourite vendors', category: 'Vendors', audience: 'couple' },
  { id: 'vendor-messages', name: 'Messaging (5/month)', tier: 'standard', description: 'Message up to 5 vendors per month', category: 'Vendors', audience: 'couple' },
  { id: 'vendor-messages-u', name: 'Unlimited Messaging', tier: 'premium', description: 'Unlimited vendor conversations', category: 'Vendors', audience: 'couple' },
  { id: 'guest-list', name: 'Guest List (up to 100)', tier: 'standard', description: 'Manage guests and RSVPs', category: 'Guests', audience: 'couple' },
  { id: 'guest-list-u', name: 'Unlimited Guest List', tier: 'premium', description: 'Unlimited guests + plus-ones', category: 'Guests', audience: 'couple' },
  { id: 'gift-registry', name: 'Gift Registry', tier: 'standard', description: 'Wishlist + shareable guest link', category: 'Guests', audience: 'couple' },
  { id: 'seating-chart', name: 'Seating Chart', tier: 'premium', description: 'Drag-and-drop seating planner', category: 'Guests', audience: 'couple' },

  // ── Wedding website ──
  { id: 'website-basic', name: 'Wedding Website', tier: 'standard', description: 'Templates, schedule, FAQ, hotels, privacy', category: 'Website', audience: 'couple' },
  { id: 'website-custom-domain', name: 'Custom Domain', tier: 'premium', description: 'Use your own domain', category: 'Website', audience: 'couple' },
  { id: 'website-analytics', name: 'Website Analytics', tier: 'premium', description: 'Visits, RSVP rates, engagement', category: 'Website', audience: 'couple' },
  { id: 'website-rsvp-adv', name: 'Advanced RSVP + Meal Choice', tier: 'premium', description: 'Meal selection, dietary notes, song requests', category: 'Website', audience: 'couple' },

  // ── Vendor core ──
  { id: 'vendor-overview', name: 'Vendor Overview', tier: 'standard', description: 'KPIs, pipeline, bookings, messages', category: 'Vendor Business', audience: 'vendor' },
  { id: 'vendor-leads', name: 'Lead Inbox', tier: 'standard', description: 'View leads (contact unlocks limited on Standard)', category: 'Vendor Business', audience: 'vendor' },
  { id: 'vendor-lead-unlocks', name: 'Unlimited Lead Unlocks', tier: 'premium', description: 'Unmask every lead contact without monthly caps', category: 'Vendor Business', audience: 'vendor' },
  { id: 'vendor-bookings', name: 'Bookings Calendar', tier: 'standard', description: 'Manage confirmed bookings', category: 'Vendor Business', audience: 'vendor' },
  { id: 'vendor-messages-inbox', name: 'Vendor Messages', tier: 'standard', description: 'Chat with couples', category: 'Vendor Business', audience: 'vendor' },
  { id: 'vendor-services', name: 'Service Packages', tier: 'standard', description: 'List and price services in ₦', category: 'Vendor Business', audience: 'vendor' },
  { id: 'vendor-analytics', name: 'Advanced Analytics', tier: 'premium', description: 'Demand insights and competitor pricing', category: 'Vendor Business', audience: 'vendor' },
  { id: 'vendor-portfolio-u', name: 'Unlimited Portfolio', tier: 'premium', description: 'Unlimited gallery slots + priority placement', category: 'Vendor Business', audience: 'vendor' },
  { id: 'vendor-team', name: 'Team Seats (up to 3)', tier: 'premium', description: 'Invite staff to manage leads and bookings', category: 'Vendor Business', audience: 'vendor' },
  { id: 'vendor-team-business', name: 'Team Seats (up to 8)', tier: 'business', description: 'Larger studio seats + shared lead ownership', category: 'Vendor Business', audience: 'vendor' },
  { id: 'vendor-featured', name: 'Featured Category Placement', tier: 'business', description: 'Pinned featured slot in couple search by category', category: 'Vendor Business', audience: 'vendor' },
  { id: 'vendor-multi-city', name: 'Multi-city Profiles', tier: 'business', description: 'List in multiple Lagos corridors / cities', category: 'Vendor Business', audience: 'vendor' },
  { id: 'vendor-csm', name: 'Priority Support + CSM', tier: 'enterprise', description: 'Chat SLA and dedicated success contact', category: 'Vendor Business', audience: 'vendor' },
  { id: 'vendor-api', name: 'API / White-label hooks', tier: 'enterprise', description: 'Integrations for chains and planners', category: 'Vendor Business', audience: 'vendor' },
]

const PLAN_RANK: Record<PlanId, number> = {
  standard: 0,
  premium: 1,
  business: 2,
  enterprise: 3,
}

export function normalizePlan(value: unknown): PlanId {
  if (value === 'enterprise') return 'enterprise'
  if (value === 'business' || value === 'growth') return 'business'
  if (value === 'premium' || value === 'professional') return 'premium'
  if (value === 'free' || value === 'starter' || value === 'standard') return 'standard'
  return 'standard'
}

export function getFeature(featureId: string): FeatureDefinition | undefined {
  return FEATURE_MAP.find((f) => f.id === featureId)
}

/** True if this feature requires Premium or higher */
export function isPremiumFeature(featureId: string): boolean {
  const tier = getFeature(featureId)?.tier
  return tier === 'premium' || tier === 'business' || tier === 'enterprise'
}

export function planIncludes(plan: PlanId, featureId: string): boolean {
  const feature = getFeature(featureId)
  if (!feature) return true
  const required: PlanId =
    feature.tier === 'enterprise'
      ? 'enterprise'
      : feature.tier === 'business'
        ? 'business'
        : feature.tier === 'premium'
          ? 'premium'
          : 'standard'
  return PLAN_RANK[plan] >= PLAN_RANK[required]
}

export function getFeaturesByCategory(category: string): FeatureDefinition[] {
  return FEATURE_MAP.filter((f) => f.category === category)
}

export function planIsPaid(plan: PlanId): boolean {
  return plan !== 'standard'
}

export function unlimitedUnlocks(plan: PlanId): boolean {
  return plan === 'premium' || plan === 'business' || plan === 'enterprise'
}

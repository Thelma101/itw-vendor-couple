/**
 * ═══════════════════════════════════════════════════════════════════
 * iTheeWed — Free vs Premium Feature Tier Map
 * ═══════════════════════════════════════════════════════════════════
 *
 * This file defines which features are FREE and which require PREMIUM.
 * Import this in any component to conditionally gate features.
 */

export type FeatureTier = 'free' | 'premium'

export interface FeatureDefinition {
  id: string
  name: string
  tier: FeatureTier
  description: string
  category: string
}

/* ═══════ FEATURE CATEGORIES ═══════ */

export const FEATURE_MAP: FeatureDefinition[] = [

  // ─── DASHBOARD & CORE PLANNING ───────────────────────────────
  { id: 'dashboard',         name: 'Wedding Dashboard',           tier: 'free',    description: 'Overview with countdown, quick actions, and progress', category: 'Core Planning' },
  { id: 'checklist',         name: 'Wedding Checklist',           tier: 'free',    description: 'To-do list with completion tracking and pagination', category: 'Core Planning' },
  { id: 'checklist-custom',  name: 'Custom Checklist Templates',  tier: 'premium', description: 'Import culture-specific or theme-based checklists',    category: 'Core Planning' },
  { id: 'budget-tracker',    name: 'Budget Tracker',              tier: 'free',    description: 'Track expenses, allocations, and payments',            category: 'Core Planning' },
  { id: 'budget-insights',   name: 'AI Budget Insights',          tier: 'premium', description: 'Smart spending tips, regional price comparison, and negotiation suggestions', category: 'Core Planning' },
  { id: 'timeline',          name: 'Day-of Timeline',             tier: 'free',    description: 'Create and manage your wedding day schedule',          category: 'Core Planning' },
  { id: 'timeline-collab',   name: 'Collaborative Timeline',      tier: 'premium', description: 'Share editable timeline with vendors and wedding party', category: 'Core Planning' },

  // ─── VENDOR MANAGEMENT ───────────────────────────────────────
  { id: 'vendor-search',     name: 'Vendor Search & Browse',      tier: 'free',    description: 'Search, filter, and browse all vendor categories',     category: 'Vendors' },
  { id: 'vendor-profile',    name: 'Vendor Profile View',         tier: 'free',    description: 'View vendor details, photos, reviews, and pricing',    category: 'Vendors' },
  { id: 'vendor-shortlist',  name: 'Shortlist & Favourites',      tier: 'free',    description: 'Save and compare favourite vendors',                   category: 'Vendors' },
  { id: 'vendor-compare',    name: 'Side-by-Side Comparison',     tier: 'free',    description: 'Compare up to 3 vendors at once',                      category: 'Vendors' },
  { id: 'vendor-matching',   name: 'Smart Vendor Match (Basic)',   tier: 'free',    description: 'Chemistry Score based on budget, rating, style, location', category: 'Vendors' },
  { id: 'vendor-matching-ai',name: 'AI Vendor Match (Advanced)',   tier: 'premium', description: 'Personality matching, response-time scoring, detailed compatibility reports', category: 'Vendors' },
  { id: 'vendor-messages',   name: 'Messaging (5/month)',         tier: 'free',    description: 'Message up to 5 vendors per month',                    category: 'Vendors' },
  { id: 'vendor-messages-u', name: 'Unlimited Messaging',         tier: 'premium', description: 'Unlimited vendor conversations + read receipts',       category: 'Vendors' },
  { id: 'vendor-booking',    name: 'Booking Requests',            tier: 'free',    description: 'Send booking inquiries to vendors',                    category: 'Vendors' },

  // ─── GUEST MANAGEMENT ────────────────────────────────────────
  { id: 'guest-list',        name: 'Guest List (up to 100)',      tier: 'free',    description: 'Manage guests, RSVPs, and dietary needs',              category: 'Guests' },
  { id: 'guest-list-u',      name: 'Unlimited Guest List',        tier: 'premium', description: 'Unlimited guests with aso-ebi tracking and plus-ones', category: 'Guests' },
  { id: 'seating-chart',     name: 'Seating Chart',               tier: 'premium', description: 'Drag-and-drop seating arrangement planner',            category: 'Guests' },
  { id: 'guest-hub',         name: 'Guest Wishes (Text)',         tier: 'free',    description: 'Guests can send text wishes to the couple',            category: 'Guests' },
  { id: 'guest-hub-video',   name: 'Guest Video Wishes',          tier: 'free',    description: 'Guests can upload video wishes',                       category: 'Guests' },
  { id: 'guest-hub-live',    name: 'Live Event Feed',             tier: 'free',    description: 'View live timeline of wedding day moments',            category: 'Guests' },
  { id: 'guest-hub-photos',  name: 'Live Photo Stream',           tier: 'premium', description: 'Real-time guest photo uploads during the event',       category: 'Guests' },
  { id: 'guest-hub-qr',      name: 'QR Code Guest Access',        tier: 'premium', description: 'Generate QR codes for easy guest check-in and hub access', category: 'Guests' },
  { id: 'guest-hub-reels',   name: 'Auto Highlight Reels',        tier: 'premium', description: 'AI-generated highlight reel from guest submissions',   category: 'Guests' },

  // ─── WEDDING WEBSITE ─────────────────────────────────────────
  { id: 'website-basic',     name: 'Wedding Website (6 templates)',tier: 'free',   description: 'Basic website with details, schedule, and photos',     category: 'Website' },
  { id: 'website-full',      name: 'Full Template Library (18+)',  tier: 'free',    description: 'Access all 18+ templates and colour palettes',         category: 'Website' },
  { id: 'website-fonts',     name: 'Font Customisation',          tier: 'free',    description: '14 font options for headings and body text',           category: 'Website' },
  { id: 'website-faq',       name: 'Guest Q&A / FAQ',             tier: 'free',    description: 'Accordion-style Q&A section for guest questions',      category: 'Website' },
  { id: 'website-hotels',    name: 'Hotel Blocks & Travel',       tier: 'free',    description: 'Hotel recommendations and travel information',         category: 'Website' },
  { id: 'website-stationery',name: 'Matching Stationery',         tier: 'free',    description: 'Toggle stationery items to match website theme',       category: 'Website' },
  { id: 'website-privacy',   name: 'Privacy Controls',            tier: 'free',    description: 'Password-protect your wedding website',                category: 'Website' },
  { id: 'website-custom-domain', name: 'Custom Domain',           tier: 'premium', description: 'Use your own domain (e.g. sarah-and-james.com)',   category: 'Website' },
  { id: 'website-analytics', name: 'Website Analytics',           tier: 'premium', description: 'Track visits, RSVP rates, and engagement',            category: 'Website' },
  { id: 'website-rsvp-adv',  name: 'Advanced RSVP + Meal Choice', tier: 'premium', description: 'Meal selection, dietary notes, and song requests in RSVP', category: 'Website' },

  // ─── AI CONCIERGE (AskWed) ───────────────────────────────────
  { id: 'askwed-basic',      name: 'AskWed (8 topics)',           tier: 'free',    description: 'AI wedding concierge with 8 knowledge categories',    category: 'AI Concierge' },
  { id: 'askwed-followups',  name: 'Unlimited Follow-ups',        tier: 'premium', description: 'Context-aware multi-turn conversations',               category: 'AI Concierge' },
  { id: 'askwed-personalised', name: 'Personalised Plans',        tier: 'premium', description: 'Custom wedding plan based on your date, budget, and culture', category: 'AI Concierge' },
  { id: 'askwed-negotiation', name: 'Vendor Negotiation Scripts', tier: 'premium', description: 'AI-generated negotiation talking points tailored to each vendor', category: 'AI Concierge' },

  // ─── INSPIRATION & DISCOVERY ─────────────────────────────────
  { id: 'inspiration',       name: 'Inspiration Gallery',         tier: 'free',    description: 'Browse wedding ideas, mood boards, and trends',        category: 'Discovery' },
  { id: 'inspiration-ai',    name: 'AI Style Recommendations',    tier: 'premium', description: 'Personalised style suggestions based on preferences',  category: 'Discovery' },
]

/* ═══════ HELPERS ═══════ */

/** Check if a feature is premium */
export const isPremium = (featureId: string): boolean => {
  const feature = FEATURE_MAP.find(f => f.id === featureId)
  return feature?.tier === 'premium'
}

/** Get all features by category */
export const getFeaturesByCategory = (category: string): FeatureDefinition[] => {
  return FEATURE_MAP.filter(f => f.category === category)
}

/** Get all premium features */
export const getPremiumFeatures = (): FeatureDefinition[] => {
  return FEATURE_MAP.filter(f => f.tier === 'premium')
}

/** Get all free features */
export const getFreeFeatures = (): FeatureDefinition[] => {
  return FEATURE_MAP.filter(f => f.tier === 'free')
}

/** Get all unique categories */
export const getFeatureCategories = (): string[] => {
  return Array.from(new Set(FEATURE_MAP.map(f => f.category)))
}

/* ═══════ SUMMARY ═══════
 *
 * FREE (24 features):
 *  - Dashboard, Checklist, Budget Tracker, Day-of Timeline
 *  - Vendor Search, Profiles, Shortlist, Compare, Basic Matching, Booking, 5 Messages/mo
 *  - Guest List (100), Text Wishes, Video Wishes, Live Feed
 *  - Full Website (18+ templates, fonts, FAQ, hotels, stationery, privacy)
 *  - AskWed (8 topics)
 *  - Inspiration Gallery
 *
 * PREMIUM (17 features):
 *  - Custom Checklist Templates, AI Budget Insights, Collaborative Timeline
 *  - AI Vendor Match, Unlimited Messaging
 *  - Unlimited Guests, Seating Chart, Live Photos, QR Guest Access, Auto Reels
 *  - Custom Domain, Website Analytics, Advanced RSVP
 *  - Unlimited AskWed, Personalised Plans, Negotiation Scripts
 *  - AI Style Recommendations
 *
 * ═══════════════════════════════════════════════════════════════════
 */

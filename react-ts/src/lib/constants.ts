/**
 * Centralized constants for statuses, colors, and defaults across the app
 */

/**
 * Guest/Event status styling map
 */
export const STATUS_STYLES: Record<
  'Invited' | 'Pending' | 'Confirmed' | 'Completed' | 'Open' | 'Cancelled',
  { bg: string; color: string }
> = {
  Invited: { bg: '#EFF6FF', color: '#1D4ED8' },
  Pending: { bg: '#FFF7ED', color: '#B45309' },
  Confirmed: { bg: '#ECFDF5', color: '#15803D' },
  Completed: { bg: '#DCFCE7', color: '#166534' },
  Open: { bg: '#F3E8FF', color: '#7C3AED' },
  Cancelled: { bg: '#FEE2E2', color: '#DC2626' },
}

/**
 * Common task/checklist statuses and their styles
 */
export const TASK_STATUS_STYLES: Record<
  'Completed' | 'Pending' | 'Upcoming',
  { bg: string; color: string }
> = {
  Completed: { bg: '#DCFCE7', color: '#166534' },
  Pending: { bg: '#FEF3C7', color: '#92400E' },
  Upcoming: { bg: '#DBEAFE', color: '#1E40AF' },
}

/**
 * Budget expense category defaults
 */
export const BUDGET_CATEGORIES = [
  'Venue & Logistics',
  'Catering & Drinks',
  'Photography & Video',
  'Flowers & Decoration',
  'Music & Entertainment',
  'Transportation',
  'Lodging',
  'Attire',
  'Makeup & Hair',
  'Gifts & Favors',
  'Other',
]

/**
 * Guest group categories
 */
export const GUEST_GROUPS = [
  "Bride's Family",
  "Groom's Family",
  'Friends',
  'Colleagues',
  'Extended Family',
  'Other',
]

/**
 * Default storage keys for all pages
 */
export const STORAGE_KEYS = {
  CHECKLIST: 'itw_checklist',
  BUDGET_TOTAL: 'itw_total_budget',
  BUDGET_EXPENSES: 'itw_budget',
  GUEST_LIST: 'itw_guestlist',
  MESSAGES: 'itw_messages',
  TIMELINE: 'itw_timeline',
  NOTES: 'itw_notes',
} as const

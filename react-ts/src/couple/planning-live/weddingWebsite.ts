export interface FAQItem {
  id: string
  question: string
  answer: string
}

export interface HotelBlock {
  id: string
  name: string
  address: string
  discount: string
  bookingUrl: string
}

export interface ScheduleItem {
  id: string
  time: string
  title: string
  detail: string
}

export interface WebsiteDraft {
  title: string
  subtitle: string
  story: string
  template: string
  fontFamily: string
  colorPalette: string
  faqItems: FAQItem[]
  hotelBlocks: HotelBlock[]
  matchStationery: boolean
  isPublished: boolean
  requiresPassword: boolean
  password: string
  customDomain: string
  enableAnalytics: boolean
  enableAdvancedRsvp: boolean
  publishedSlug?: string
  /* Live-account fields (saved on the server with the rest of the draft) */
  weddingDate?: string
  ceremonyTime?: string
  venue?: string
  location?: string
  heroImage?: string
  gallery?: string[]
  schedule?: ScheduleItem[]
}

export const MAX_GALLERY_PHOTOS = 6

export function defaultDraft(): WebsiteDraft {
  return {
    title: 'Our Wedding Day',
    subtitle: 'Join us for the celebration',
    story: '',
    template: 'eternal-love',
    fontFamily: 'Playfair Display',
    colorPalette: '#e91e63',
    faqItems: [],
    hotelBlocks: [],
    matchStationery: false,
    isPublished: false,
    requiresPassword: false,
    password: '',
    customDomain: '',
    enableAnalytics: false,
    enableAdvancedRsvp: false,
    publishedSlug: '',
  }
}

const str = (value: unknown, fallback = '') => (typeof value === 'string' ? value : fallback)

function list<T>(value: unknown, isItem: (item: unknown) => item is T): T[] {
  return Array.isArray(value) ? value.filter(isItem) : []
}

const isObj = (item: unknown): item is Record<string, unknown> => !!item && typeof item === 'object'

/** Accepts anything (server JSON, old localStorage drafts) and returns a complete draft. */
export function normalizeDraft(raw: unknown): WebsiteDraft {
  const base = defaultDraft()
  if (!isObj(raw)) return base
  return {
    title: str(raw.title) || base.title,
    subtitle: str(raw.subtitle) || base.subtitle,
    story: str(raw.story),
    template: str(raw.template) || base.template,
    fontFamily: str(raw.fontFamily) || base.fontFamily,
    colorPalette: str(raw.colorPalette) || base.colorPalette,
    faqItems: list(raw.faqItems, isObj).map((f, i) => ({
      id: str(f.id) || `faq-${i}`,
      question: str(f.question),
      answer: str(f.answer),
    })),
    hotelBlocks: list(raw.hotelBlocks, isObj).map((h, i) => ({
      id: str(h.id) || `hotel-${i}`,
      name: str(h.name),
      address: str(h.address),
      discount: str(h.discount),
      bookingUrl: str(h.bookingUrl),
    })),
    matchStationery: Boolean(raw.matchStationery),
    isPublished: Boolean(raw.isPublished),
    requiresPassword: Boolean(raw.requiresPassword),
    password: str(raw.password),
    customDomain: str(raw.customDomain),
    enableAnalytics: Boolean(raw.enableAnalytics),
    enableAdvancedRsvp: Boolean(raw.enableAdvancedRsvp),
    publishedSlug: str(raw.publishedSlug),
    weddingDate: str(raw.weddingDate),
    ceremonyTime: str(raw.ceremonyTime),
    venue: str(raw.venue),
    location: str(raw.location),
    heroImage: str(raw.heroImage),
    gallery: list(raw.gallery, (g): g is string => typeof g === 'string' && g.length > 0).slice(0, MAX_GALLERY_PHOTOS),
    schedule: list(raw.schedule, isObj).map((s, i) => ({
      id: str(s.id) || `slot-${i}`,
      time: str(s.time),
      title: str(s.title),
      detail: str(s.detail),
    })),
  }
}

/** What a live account stores on the server: publish state and slug live on the site record itself. */
const SERVER_OMIT: Array<keyof WebsiteDraft> = [
  'isPublished',
  'publishedSlug',
  'password',
  'requiresPassword',
  'customDomain',
  'enableAnalytics',
  'enableAdvancedRsvp',
]

export function draftToServerData(draft: WebsiteDraft): Record<string, unknown> {
  const data: Record<string, unknown> = { ...draft }
  for (const key of SERVER_OMIT) delete data[key]
  return data
}

export function slugify(title: string) {
  return (
    title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || 'our-wedding'
  )
}

export function publicSiteUrl(slug: string) {
  return `${typeof window !== 'undefined' ? window.location.origin : ''}/w/${slug}`
}

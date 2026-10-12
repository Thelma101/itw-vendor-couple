import { useCallback, useEffect, useState } from 'react'
import { apiErrorMessage, inquiriesApi, threadsApi, type Inquiry, type Profile } from '@/shared/lib/api'
import { profileString } from '@/shared/contexts/AccountContext'

export const VENDOR_CATEGORIES = [
  'Venue',
  'Catering',
  'Photography',
  'Videography',
  'Decor',
  'Florist',
  'Makeup',
  'Fashion',
  'Music & DJ',
  'Planning',
  'Cake',
  'Transport',
  'Invitations',
  'Other',
] as const

export function naira(n: number) {
  return `₦${Math.round(Number(n) || 0).toLocaleString('en-NG')}`
}

function parseDate(value: string): Date | null {
  if (!value) return null
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? null : d
}

export function formatEventDate(value: string, fallback = 'Date to be confirmed') {
  if (!value) return fallback
  const d = parseDate(value)
  return d ? d.toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }) : value
}

export function eventDateParts(value: string) {
  const d = parseDate(value)
  if (!d) return { month: 'TBC', day: '—' }
  return { month: d.toLocaleDateString('en-NG', { month: 'short' }).toUpperCase(), day: String(d.getDate()) }
}

export function isUpcoming(value: string) {
  const d = parseDate(value)
  if (!d) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return d.getTime() >= today.getTime()
}

export function timeAgo(iso: string) {
  const d = parseDate(iso)
  if (!d) return ''
  const mins = Math.round((Date.now() - d.getTime()) / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  if (days < 7) return `${days}d ago`
  return d.toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })
}

export function isBooked(i: Inquiry) {
  return i.status === 'confirmed' || i.status === 'completed'
}

/** Finds the existing thread with a couple, or opens one (vendors can only start with couples who contacted them). */
export async function openThreadWithCouple(coupleId: string): Promise<string> {
  const threads = await threadsApi.list()
  const existing = threads.find((t) => t.coupleId === coupleId)
  if (existing) return existing.id
  const created = await threadsApi.start({ coupleId })
  return created.id
}

export function useInquiries(kind?: 'inquiry' | 'booking', enabled = true) {
  const [items, setItems] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(enabled)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async () => {
    if (!enabled) return
    setLoading(true)
    try {
      setItems(await inquiriesApi.list(kind))
      setError(null)
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not load your enquiries. Check your connection and try again.'))
    } finally {
      setLoading(false)
    }
  }, [kind, enabled])

  useEffect(() => {
    void reload()
  }, [reload])

  return { items, setItems, loading, error, reload }
}

export type ProfileGap = { key: string; label: string; path: string; done: boolean }

export function profileChecklist(profile: Profile, activeServices: number, albums: number): ProfileGap[] {
  return [
    { key: 'category', label: 'Choose your category', path: '/vendor/account', done: !!profileString(profile, 'category') },
    { key: 'location', label: 'Add your location', path: '/vendor/account', done: !!profileString(profile, 'location') },
    { key: 'bio', label: 'Write a short bio', path: '/vendor/account', done: !!profileString(profile, 'bio') },
    { key: 'cover', label: 'Upload a cover photo', path: '/vendor/account', done: !!profileString(profile, 'cover') },
    { key: 'service', label: 'Publish at least one package', path: '/vendor/services', done: activeServices > 0 },
    { key: 'portfolio', label: 'Add a portfolio album', path: '/vendor/portfolio', done: albums > 0 },
  ]
}

/** The three basics couples need before the directory is useful. */
export function missingBasics(profile: Profile) {
  return ['category', 'location', 'bio'].filter((k) => !profileString(profile, k))
}

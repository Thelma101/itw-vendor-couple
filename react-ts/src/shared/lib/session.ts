/**
 * Live accounts read and write everything through the API. Friends & family testers — the
 * demo logins, offline demo tokens, or anyone browsing without signing in — keep sample data.
 */

export const DEMO_EMAIL = /@itheewed\.demo$/i

/** The production app (app.itheewed.co) is built with VITE_APP_MODE=live: no sample data, no demo logins. */
export const IS_LIVE_APP = import.meta.env.VITE_APP_MODE === 'live'

export const SITE_URL = String(import.meta.env.VITE_SITE_URL || 'https://itheewed.co').replace(/\/$/, '')

type StoredUser = { id?: string; email?: string; username?: string; business_name?: string }

export function storedUser(): StoredUser {
  try {
    return JSON.parse(localStorage.getItem('user') || '{}') as StoredUser
  } catch {
    return {}
  }
}

function tokenPayload(token: string): { sub?: string; email?: string } {
  try {
    return JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
  } catch {
    return {}
  }
}

export function isDemoSession(): boolean {
  if (IS_LIVE_APP) return false
  const token = localStorage.getItem('authToken') || ''
  if (!token || token.startsWith('demo-')) return true
  const email = storedUser().email || tokenPayload(token).email || ''
  return DEMO_EMAIL.test(email)
}

export function isLiveSession(): boolean {
  return !isDemoSession()
}

export function currentUserId(): string {
  const token = localStorage.getItem('authToken') || ''
  return storedUser().id || tokenPayload(token).sub || ''
}

/** Per-account localStorage key so a second account on the same browser never sees the first one's data. */
export function scopedKey(key: string): string {
  return isLiveSession() ? `${key}:${currentUserId()}` : key
}

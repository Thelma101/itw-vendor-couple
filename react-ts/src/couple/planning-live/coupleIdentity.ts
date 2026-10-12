import type { Profile, PublicUser } from '@/shared/lib/api'
import { profileString } from '@/shared/contexts/AccountContext'

export type CoupleIdentity = {
  /** e.g. "Kemi & Dayo"; falls back to the account username. */
  displayName: string
  /** Used in greetings ("Good morning, Kemi"). */
  firstName: string
  avatar: string
  initials: string
  /** YYYY-MM-DD or '' */
  weddingDate: string
  venue: string
  location: string
}

export function joinPartnerNames(partnerOne: string, partnerTwo: string): string {
  const a = partnerOne.trim()
  const b = partnerTwo.trim()
  if (a && b) return `${a} & ${b}`
  return a || b
}

export function coupleIdentity(user: PublicUser | null, profile: Profile): CoupleIdentity {
  const partnerOne = profileString(profile, 'partnerOne').trim()
  const partnerTwo = profileString(profile, 'partnerTwo').trim()
  const username = (user?.username || '').trim()
  const displayName =
    profileString(profile, 'displayName').trim() || joinPartnerNames(partnerOne, partnerTwo) || username || 'Your wedding'
  const firstName = partnerOne || username.split(/[\s&]+/).filter(Boolean)[0] || ''
  const initials =
    displayName
      .split(/[\s&]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('') || 'IT'
  return {
    displayName,
    firstName,
    avatar: profileString(profile, 'avatar'),
    initials,
    weddingDate: profileString(profile, 'weddingDate'),
    venue: profileString(profile, 'venue'),
    location: profileString(profile, 'location'),
  }
}

/** Parses YYYY-MM-DD as a local date (avoids the UTC off-by-one of `new Date('2027-03-15')`). */
export function parseLocalDate(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value || '')
  if (!match) return null
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]), 12)
  return Number.isNaN(date.getTime()) ? null : date
}

export function daysUntil(value: string): number | null {
  const date = parseLocalDate(value)
  if (!date) return null
  const today = new Date()
  today.setHours(12, 0, 0, 0)
  return Math.ceil((date.getTime() - today.getTime()) / 86_400_000)
}

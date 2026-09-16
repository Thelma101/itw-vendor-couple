/** Referral codes + counts for couple + vendor invites. */

export type ReferralAudience = 'couple' | 'vendor'

const CODE_KEY = (a: ReferralAudience) => `itw_referral_code_${a}`
const CODE_VER_KEY = (a: ReferralAudience) => `itw_referral_code_ver_${a}`
const COUNT_KEY = (a: ReferralAudience) => `itw_referral_count_${a}`
const CREDIT_BONUS_KEY = 'itw_referral_unlock_bonus'
/** Bump when format changes so stale short codes regenerate. */
const CODE_FORMAT_VERSION = '3'

function randomChunk(len: number) {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let out = ''
  const bytes = new Uint8Array(len)
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(bytes)
  } else {
    for (let i = 0; i < len; i++) bytes[i] = Math.floor(Math.random() * 256)
  }
  for (let i = 0; i < len; i++) out += alphabet[bytes[i]! % alphabet.length]
  return out
}

/** Professional invite code: ITW-VND-8X4K-2MQ9 / ITW-CPL-7H3N-9R2B */
function mintCode(audience: ReferralAudience): string {
  const role = audience === 'couple' ? 'CPL' : 'VND'
  return `ITW-${role}-${randomChunk(4)}-${randomChunk(4)}`
}

function isCurrentFormat(code: string, audience: ReferralAudience): boolean {
  const role = audience === 'couple' ? 'CPL' : 'VND'
  return new RegExp(`^ITW-${role}-[A-Z0-9]{4}-[A-Z0-9]{4}$`).test(code)
}

export function getOrCreateReferralCode(audience: ReferralAudience): string {
  try {
    const ver = localStorage.getItem(CODE_VER_KEY(audience))
    const existing = localStorage.getItem(CODE_KEY(audience))
    if (existing && ver === CODE_FORMAT_VERSION && isCurrentFormat(existing, audience)) {
      return existing
    }
    const code = mintCode(audience)
    localStorage.setItem(CODE_KEY(audience), code)
    localStorage.setItem(CODE_VER_KEY(audience), CODE_FORMAT_VERSION)
    return code
  } catch {
    return audience === 'couple' ? 'ITW-CPL-DEMO-CODE1' : 'ITW-VND-DEMO-CODE1'
  }
}

/** Force a fresh professional code (e.g. after format upgrade). */
export function rotateReferralCode(audience: ReferralAudience): string {
  const code = mintCode(audience)
  try {
    localStorage.setItem(CODE_KEY(audience), code)
    localStorage.setItem(CODE_VER_KEY(audience), CODE_FORMAT_VERSION)
  } catch {
    /* ignore */
  }
  return code
}

export function getReferralCount(audience: ReferralAudience): number {
  try {
    return Number(localStorage.getItem(COUNT_KEY(audience))) || 0
  } catch {
    return 0
  }
}

export function recordReferralSuccess(audience: ReferralAudience): number {
  const next = getReferralCount(audience) + 1
  try {
    localStorage.setItem(COUNT_KEY(audience), String(next))
  } catch {
    /* ignore */
  }
  return next
}

export function referralLink(audience: ReferralAudience, code: string): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://itheewed.app'
  if (audience === 'couple') return `${origin}/signup?ref=${code}&role=couple`
  return `${origin}/signup?ref=${code}&role=vendor`
}

export function getReferralUnlockBonus(): number {
  try {
    return Number(localStorage.getItem(CREDIT_BONUS_KEY)) || 0
  } catch {
    return 0
  }
}

export function addReferralUnlockBonus(n: number): number {
  const next = getReferralUnlockBonus() + n
  try {
    localStorage.setItem(CREDIT_BONUS_KEY, String(next))
    window.dispatchEvent(new Event('itw-referral-credits'))
  } catch {
    /* ignore */
  }
  return next
}

export const COUPLE_REFERRAL_REWARD =
  'When a friend signs up with your code, you both get priority support during peak season.'

export const VENDOR_REFERRAL_REWARD =
  'New vendors get 1 month Professional free. Invite 2 who finish setup → another free month (+2 unlocks each).'

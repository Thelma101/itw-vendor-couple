/** Simple local referral codes + counts for F&F demo (couple + vendor). */

export type ReferralAudience = 'couple' | 'vendor'

const CODE_KEY = (a: ReferralAudience) => `itw_referral_code_${a}`
const COUNT_KEY = (a: ReferralAudience) => `itw_referral_count_${a}`
const CREDIT_BONUS_KEY = 'itw_referral_unlock_bonus'

function randomSuffix() {
  return Math.random().toString(36).slice(2, 6).toUpperCase()
}

export function getOrCreateReferralCode(audience: ReferralAudience): string {
  try {
    const existing = localStorage.getItem(CODE_KEY(audience))
    if (existing) return existing
    const code = audience === 'couple' ? `ITW-C-${randomSuffix()}` : `ITW-V-${randomSuffix()}`
    localStorage.setItem(CODE_KEY(audience), code)
    return code
  } catch {
    return audience === 'couple' ? 'ITW-C-DEMO' : 'ITW-V-DEMO'
  }
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

/** Extra unlock credits earned from vendor referrals (demo). */
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
  'You and your friend both get a “Planner perk” badge — and we prioritize support during peak season.'

export const VENDOR_REFERRAL_REWARD =
  'When a vendor you invite completes setup, you earn +2 lead unlock credits (stacks with your monthly 5).'

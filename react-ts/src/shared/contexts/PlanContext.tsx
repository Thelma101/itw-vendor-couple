import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  normalizePlan,
  planIncludes,
  PLAN_LIMITS,
  unlimitedUnlocks,
  type PlanId,
} from '@/shared/data/featureTiers'
import { getReferralUnlockBonus } from '@/shared/lib/referrals'

const PLAN_KEY = 'userPlan'
const LEAD_UNLOCKS_KEY = 'itw_lead_unlocks_used'
const BOOST_UNLOCKS_KEY = 'itw_boost_unlock_credits'
const ACTIVE_BOOST_KEY = 'itw_active_boost'

interface PlanContextValue {
  plan: PlanId
  isPremium: boolean
  isBusiness: boolean
  isEnterprise: boolean
  setPlan: (plan: PlanId) => void
  canAccess: (featureId: string) => boolean
  guestCap: number
  messageCap: number
  leadUnlockCap: number
  leadUnlocksUsed: number
  leadUnlocksRemaining: number
  consumeLeadUnlock: () => boolean
  resetLeadUnlocks: () => void
  addUnlockCredits: (n: number) => void
  activeBoostId: string | null
  setActiveBoostId: (id: string | null) => void
}

const PlanContext = createContext<PlanContextValue | undefined>(undefined)

function readPlan(): PlanId {
  try {
    return normalizePlan(localStorage.getItem(PLAN_KEY))
  } catch {
    return 'standard'
  }
}

function readLeadUnlocks(): number {
  try {
    return Number(localStorage.getItem(LEAD_UNLOCKS_KEY)) || 0
  } catch {
    return 0
  }
}

function readBoostUnlockCredits(): number {
  try {
    return Number(localStorage.getItem(BOOST_UNLOCKS_KEY)) || 0
  } catch {
    return 0
  }
}

function readActiveBoost(): string | null {
  try {
    return localStorage.getItem(ACTIVE_BOOST_KEY)
  } catch {
    return null
  }
}

export function PlanProvider({ children }: { children: ReactNode }) {
  const [plan, setPlanState] = useState<PlanId>(() => readPlan())
  const [leadUnlocksUsed, setLeadUnlocksUsed] = useState(() => readLeadUnlocks())
  const [referralBonus, setReferralBonus] = useState(() => getReferralUnlockBonus())
  const [boostCredits, setBoostCredits] = useState(() => readBoostUnlockCredits())
  const [activeBoostId, setActiveBoostState] = useState<string | null>(() => readActiveBoost())

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === PLAN_KEY) setPlanState(normalizePlan(e.newValue))
      if (e.key === LEAD_UNLOCKS_KEY) setLeadUnlocksUsed(Number(e.newValue) || 0)
      if (e.key === BOOST_UNLOCKS_KEY) setBoostCredits(Number(e.newValue) || 0)
      if (e.key === ACTIVE_BOOST_KEY) setActiveBoostState(e.newValue)
    }
    const onPlanCustom = () => setPlanState(readPlan())
    const onReferral = () => setReferralBonus(getReferralUnlockBonus())
    window.addEventListener('storage', onStorage)
    window.addEventListener('itw-plan-changed', onPlanCustom)
    window.addEventListener('itw-referral-credits', onReferral)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('itw-plan-changed', onPlanCustom)
      window.removeEventListener('itw-referral-credits', onReferral)
    }
  }, [])

  const setPlan = useCallback((next: PlanId) => {
    const planId = normalizePlan(next)
    localStorage.setItem(PLAN_KEY, planId)
    setPlanState(planId)
    window.dispatchEvent(new Event('itw-plan-changed'))
  }, [])

  const setActiveBoostId = useCallback((id: string | null) => {
    if (id) localStorage.setItem(ACTIVE_BOOST_KEY, id)
    else localStorage.removeItem(ACTIVE_BOOST_KEY)
    setActiveBoostState(id)
  }, [])

  const addUnlockCredits = useCallback((n: number) => {
    const next = Math.max(0, readBoostUnlockCredits() + n)
    localStorage.setItem(BOOST_UNLOCKS_KEY, String(next))
    setBoostCredits(next)
  }, [])

  const limits = PLAN_LIMITS[plan]
  const paidUnlimited = unlimitedUnlocks(plan)
  const effectiveCap = paidUnlimited
    ? Number.POSITIVE_INFINITY
    : PLAN_LIMITS.standard.leadUnlocksPerMonth + referralBonus + boostCredits
  const leadUnlocksRemaining = Math.max(0, effectiveCap - leadUnlocksUsed)

  const consumeLeadUnlock = useCallback(() => {
    if (unlimitedUnlocks(plan)) return true
    const cap =
      PLAN_LIMITS.standard.leadUnlocksPerMonth + getReferralUnlockBonus() + readBoostUnlockCredits()
    if (leadUnlocksUsed >= cap) return false
    const next = leadUnlocksUsed + 1
    localStorage.setItem(LEAD_UNLOCKS_KEY, String(next))
    setLeadUnlocksUsed(next)
    return true
  }, [leadUnlocksUsed, plan])

  const resetLeadUnlocks = useCallback(() => {
    localStorage.setItem(LEAD_UNLOCKS_KEY, '0')
    setLeadUnlocksUsed(0)
  }, [])

  const value = useMemo<PlanContextValue>(
    () => ({
      plan,
      isPremium: plan === 'premium' || plan === 'business' || plan === 'enterprise',
      isBusiness: plan === 'business' || plan === 'enterprise',
      isEnterprise: plan === 'enterprise',
      setPlan,
      canAccess: (featureId: string) => planIncludes(plan, featureId),
      guestCap: limits.guestCap,
      messageCap: limits.vendorMessagesPerMonth,
      leadUnlockCap: effectiveCap,
      leadUnlocksUsed,
      leadUnlocksRemaining: paidUnlimited ? Number.POSITIVE_INFINITY : leadUnlocksRemaining,
      consumeLeadUnlock,
      resetLeadUnlocks,
      addUnlockCredits,
      activeBoostId,
      setActiveBoostId,
    }),
    [
      plan,
      setPlan,
      limits,
      effectiveCap,
      leadUnlocksUsed,
      leadUnlocksRemaining,
      paidUnlimited,
      consumeLeadUnlock,
      resetLeadUnlocks,
      addUnlockCredits,
      activeBoostId,
      setActiveBoostId,
    ],
  )

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>
}

export function usePlan() {
  const ctx = useContext(PlanContext)
  if (!ctx) throw new Error('usePlan must be used within PlanProvider')
  return ctx
}

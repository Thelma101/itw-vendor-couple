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
  type PlanId,
} from '@/shared/data/featureTiers'
import { getReferralUnlockBonus } from '@/shared/lib/referrals'

const PLAN_KEY = 'userPlan'
const LEAD_UNLOCKS_KEY = 'itw_lead_unlocks_used'

interface PlanContextValue {
  plan: PlanId
  isPremium: boolean
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

export function PlanProvider({ children }: { children: ReactNode }) {
  const [plan, setPlanState] = useState<PlanId>(() => readPlan())
  const [leadUnlocksUsed, setLeadUnlocksUsed] = useState(() => readLeadUnlocks())
  const [referralBonus, setReferralBonus] = useState(() => getReferralUnlockBonus())

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === PLAN_KEY) setPlanState(normalizePlan(e.newValue))
      if (e.key === LEAD_UNLOCKS_KEY) setLeadUnlocksUsed(Number(e.newValue) || 0)
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

  const limits = PLAN_LIMITS[plan]
  const effectiveCap =
    plan === 'premium' || plan === 'enterprise'
      ? Number.POSITIVE_INFINITY
      : PLAN_LIMITS.standard.leadUnlocksPerMonth + referralBonus
  const leadUnlocksRemaining = Math.max(0, effectiveCap - leadUnlocksUsed)

  const consumeLeadUnlock = useCallback(() => {
    if (plan === 'premium' || plan === 'enterprise') return true
    const cap = PLAN_LIMITS.standard.leadUnlocksPerMonth + getReferralUnlockBonus()
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
      isPremium: plan === 'premium' || plan === 'enterprise',
      isEnterprise: plan === 'enterprise',
      setPlan,
      canAccess: (featureId: string) => planIncludes(plan, featureId),
      guestCap: limits.guestCap,
      messageCap: limits.vendorMessagesPerMonth,
      leadUnlockCap: effectiveCap,
      leadUnlocksUsed,
      leadUnlocksRemaining:
        plan === 'premium' || plan === 'enterprise' ? Number.POSITIVE_INFINITY : leadUnlocksRemaining,
      consumeLeadUnlock,
      resetLeadUnlocks,
    }),
    [
      plan,
      setPlan,
      limits,
      effectiveCap,
      leadUnlocksUsed,
      leadUnlocksRemaining,
      consumeLeadUnlock,
      resetLeadUnlocks,
    ]
  )

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>
}

export function usePlan() {
  const ctx = useContext(PlanContext)
  if (!ctx) throw new Error('usePlan must be used within PlanProvider')
  return ctx
}

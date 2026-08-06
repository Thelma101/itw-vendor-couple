import { usePlan } from '@/shared/contexts/PlanContext'
import { PLAN_DISPLAY, type PlanId } from '@/shared/data/featureTiers'

/** Compact plan badge + demo toggle for headers */
export default function PlanBadge({ className = '' }: { className?: string }) {
  const { plan, setPlan, isPremium } = usePlan()

  const cycle = () => {
    const order: PlanId[] = ['standard', 'premium', 'enterprise']
    const next = order[(order.indexOf(plan) + 1) % order.length]
    setPlan(next)
  }

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <span
        className={`text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full border ${
          isPremium
            ? 'bg-amber-50 text-amber-800 border-amber-200'
            : 'bg-slate-100 text-slate-600 border-slate-200'
        }`}
      >
        {PLAN_DISPLAY[plan].name}
      </span>
      <button type="button" onClick={cycle} className="text-[10px] font-semibold text-teal-700 hover:underline">
        Switch plan
      </button>
    </div>
  )
}

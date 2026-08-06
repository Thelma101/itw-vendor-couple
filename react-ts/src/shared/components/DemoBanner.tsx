/**
 * Friends & family preview banner — dismissible per session + plan switcher.
 */
import { useState } from 'react'
import { usePlan } from '@/shared/contexts/PlanContext'
import { PLAN_DISPLAY, type PlanId } from '@/shared/data/featureTiers'

const STORAGE_KEY = 'itheewed-demo-banner-dismissed'

export default function DemoBanner() {
  const { plan, setPlan } = usePlan()
  const [dismissed, setDismissed] = useState(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY) === '1'
    } catch {
      return false
    }
  })

  if (dismissed) return null

  const dismiss = () => {
    try {
      sessionStorage.setItem(STORAGE_KEY, '1')
    } catch {
      /* ignore */
    }
    setDismissed(true)
  }

  const plans: PlanId[] = ['standard', 'premium', 'enterprise']

  return (
    <div
      role="status"
      className="sticky top-0 z-[100] flex flex-wrap items-center justify-center gap-2 sm:gap-3 bg-[#0F766E] px-3 py-2 text-center text-sm text-white shadow-sm"
    >
      <p className="m-0 max-w-2xl leading-snug text-xs sm:text-sm">
        <span className="font-semibold">Friends &amp; family preview</span>
        {' — '}
        sample data; try <span className="font-semibold">{PLAN_DISPLAY[plan].name}</span> plan gates.
      </p>
      <div className="flex items-center gap-1.5">
        {plans.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setPlan(id)}
            className={`rounded px-2 py-0.5 text-[11px] font-semibold border transition-colors ${
              plan === id ? 'bg-white text-teal-800 border-white' : 'border-white/40 hover:bg-white/10'
            }`}
          >
            {PLAN_DISPLAY[id].name}
          </button>
        ))}
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 rounded border border-white/40 px-2 py-0.5 text-[11px] font-medium hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          aria-label="Dismiss preview banner"
        >
          Dismiss
        </button>
      </div>
    </div>
  )
}

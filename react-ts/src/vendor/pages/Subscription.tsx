import { useState } from 'react'
import { Bolt, Check, InfoOutlined } from '@mui/icons-material'
import VendorPageShell from '@/vendor/components/VendorPageShell'
import ReferralInviteCard from '@/shared/components/ReferralInviteCard'
import { usePlan } from '@/shared/contexts/PlanContext'
import { PLAN_LIMITS } from '@/shared/data/featureTiers'
import { showToast } from '@/shared/components/SimpleToast'

type BoostId = 'week' | 'fortnight' | 'month' | 'quarter'

const boosts: {
  id: BoostId
  name: string
  price: number
  period: string
  blurb: string
  features: string[]
  recommended?: boolean
  unlockCredits: number
}[] = [
  {
    id: 'week',
    name: '7-day Boost',
    price: 2000,
    period: '7 days',
    blurb: 'A quick push for this week’s enquiries',
    unlockCredits: 1,
    features: ['Higher rank in category search', 'Boost badge on profile', '+1 unlock credit'],
  },
  {
    id: 'fortnight',
    name: '2-week Boost',
    price: 4000,
    period: '14 days',
    blurb: 'Steady visibility while you follow up leads',
    unlockCredits: 2,
    features: ['Priority in your city results', 'Boost badge', '+2 unlock credits'],
  },
  {
    id: 'month',
    name: '30-day Boost',
    price: 7000,
    period: '30 days',
    blurb: 'Best value for a full booking month',
    recommended: true,
    unlockCredits: 3,
    features: [
      'Priority placement all month',
      'Featured vendors rotation',
      '+3 unlock credits',
      'Cancel anytime — no annual lock',
    ],
  },
  {
    id: 'quarter',
    name: '3-month Boost',
    price: 21000,
    period: '90 days',
    blurb: 'Cover peak season without renewing every month',
    unlockCredits: 5,
    features: [
      'Sustained priority for a full quarter',
      'Category spotlight eligibility',
      '+5 unlock credits',
      'Best for Nov–Apr peak',
    ],
  },
]

function naira(n: number) {
  return `₦${n.toLocaleString('en-NG')}`
}

export default function Subscription() {
  const { setPlan, leadUnlocksRemaining, leadUnlockCap, isPremium } = usePlan()
  const [activeBoost, setActiveBoost] = useState<BoostId | null>(null)

  const buyBoost = (id: BoostId) => {
    setActiveBoost(id)
    const b = boosts.find((x) => x.id === id)!
    if (id === 'month' || id === 'quarter') setPlan('premium')
    showToast(`${b.name} activated (demo) · +${b.unlockCredits} unlock credit(s)`, 'success')
  }

  return (
    <VendorPageShell
      title="Grow & billing"
      subtitle="Free listing forever. Optional boosts when you want traffic. Invite other vendors for extra unlock credits."
      badge={activeBoost ? `${boosts.find((b) => b.id === activeBoost)?.name} on` : 'Free listing'}
    >
      <div className="rounded-2xl border border-teal-100 bg-teal-50/40 p-5 mb-6 font-[family-name:var(--font-ui)]">
        <div className="flex gap-3">
          <InfoOutlined sx={{ color: '#0F766E', mt: '2px' }} />
          <div className="space-y-2 text-sm text-slate-600">
            <p className="font-bold text-slate-900">Vendor model</p>
            <ol className="list-decimal pl-4 space-y-1">
              <li>
                <span className="font-semibold text-slate-800">Free listing</span> — profile, packages, leads, messages ·{' '}
                {PLAN_LIMITS.standard.leadUnlocksPerMonth} unlocks/mo.
              </li>
              <li>
                <span className="font-semibold text-slate-800">Optional boosts</span> — ₦2k / ₦4k / ₦7k / ₦21k packs.
              </li>
              <li>
                <span className="font-semibold text-slate-800">Referrals</span> — invite vendors, earn unlock credits.
              </li>
            </ol>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 mb-6 font-[family-name:var(--font-ui)] flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-[#0F766E]">Listing</p>
          <p className="font-[family-name:var(--font-display)] text-2xl font-semibold text-slate-900 mt-1">Free forever</p>
          <p className="text-sm text-slate-500 mt-1">
            {isPremium
              ? 'Boost active — priority placement unlocked for this demo.'
              : `${Number.isFinite(leadUnlocksRemaining) ? leadUnlocksRemaining : 0} of ${
                  Number.isFinite(leadUnlockCap) ? leadUnlockCap : '∞'
                } unlock credits left (includes referral bonuses).`}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setPlan('standard')
            setActiveBoost(null)
            showToast('Back to free listing', 'info')
          }}
          className="px-4 py-2 rounded-xl text-sm font-bold border border-slate-200 text-slate-600 hover:bg-slate-50"
        >
          Reset to free
        </button>
      </div>

      <div className="mb-3 flex items-center gap-2 font-[family-name:var(--font-ui)]">
        <Bolt sx={{ color: '#0F766E' }} />
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-slate-900">Optional boosts</h2>
      </div>
      <p className="text-sm text-slate-500 mb-4 font-[family-name:var(--font-ui)]">
        No subscription. Buy only when you want more couples to see you.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {boosts.map((b) => {
          const on = activeBoost === b.id
          return (
            <article
              key={b.id}
              className={`relative rounded-2xl border bg-white p-5 font-[family-name:var(--font-ui)] flex flex-col ${
                b.recommended ? 'border-[#0F766E] ring-1 ring-teal-100' : on ? 'border-amber-300' : 'border-slate-200'
              }`}
            >
              {b.recommended ? (
                <span className="absolute top-0 right-0 bg-[#0F766E] text-white text-[10px] font-extrabold px-3 py-1 rounded-bl-lg">
                  BEST VALUE
                </span>
              ) : null}
              <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold text-slate-900 pr-16">{b.name}</h3>
              <p className="text-sm text-slate-500 mt-1 min-h-[40px]">{b.blurb}</p>
              <p className="mt-4 text-3xl font-extrabold text-slate-900">
                {naira(b.price)}
                <span className="text-sm font-semibold text-slate-500"> / {b.period}</span>
              </p>
              <ul className="mt-4 space-y-2 flex-1">
                {b.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                    <Check sx={{ fontSize: 18, color: '#0F766E', mt: '1px' }} />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                disabled={on}
                onClick={() => buyBoost(b.id)}
                className={`mt-5 w-full py-3 rounded-xl font-bold ${
                  on
                    ? 'bg-slate-100 text-slate-500 cursor-default'
                    : b.recommended
                      ? 'bg-[#0F766E] hover:bg-[#0D9488] text-white'
                      : 'border-2 border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {on ? 'Active (demo)' : `Boost · ${naira(b.price)}`}
              </button>
            </article>
          )
        })}
      </div>

      <ReferralInviteCard audience="vendor" className="mb-4" />

      <p className="mt-2 text-xs text-slate-400 font-[family-name:var(--font-ui)]">
        Free tier includes {PLAN_LIMITS.standard.leadUnlocksPerMonth} lead unlocks every month. No success fees on bookings.
      </p>
    </VendorPageShell>
  )
}

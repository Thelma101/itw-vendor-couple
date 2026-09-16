import { useEffect, useState } from 'react'
import { Bolt, Check } from '@mui/icons-material'
import VendorPageShell from '@/vendor/components/VendorPageShell'
import ReferralInviteCard from '@/shared/components/ReferralInviteCard'
import { usePlan } from '@/shared/contexts/PlanContext'
import { PLAN_LIMITS } from '@/shared/data/featureTiers'
import { showToast } from '@/shared/components/SimpleToast'
import { isNetworkError, paymentsApi } from '@/shared/lib/api'
import { getPaystackPublicKey, openPaystackCheckout, payerEmailFallback } from '@/shared/lib/paystack'

type BoostId = 'week' | 'fortnight' | 'month' | 'quarter'
type PlanPick = 'standard' | 'premium' | 'business' | 'enterprise'

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
    price: 1900,
    period: '7 days',
    blurb: 'A quick push for this week’s enquiries',
    unlockCredits: 1,
    features: ['Higher rank in category search', 'Boost badge on profile', '+1 unlock credit'],
  },
  {
    id: 'fortnight',
    name: '2-week Boost',
    price: 3500,
    period: '14 days',
    blurb: 'Steady visibility while you follow up leads',
    unlockCredits: 2,
    features: ['Priority in your city results', 'Boost badge', '+2 unlock credits'],
  },
  {
    id: 'month',
    name: '30-day Boost',
    price: 6000,
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
    price: 15000,
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

function authToken() {
  return localStorage.getItem('authToken') || ''
}

function isDemoSession() {
  const t = authToken()
  return !t || t.startsWith('demo-')
}

export default function Subscription() {
  const {
    plan,
    setPlan,
    leadUnlocksRemaining,
    leadUnlockCap,
    isPremium,
    addUnlockCredits,
    activeBoostId,
    setActiveBoostId,
  } = usePlan()
  const [payingId, setPayingId] = useState<BoostId | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<PlanPick>(plan)
  const [payingPlan, setPayingPlan] = useState(false)

  useEffect(() => {
    setSelectedPlan(plan)
  }, [plan])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const reference = params.get('reference') || params.get('trxref')
    if (!reference) return
    void (async () => {
      try {
        if (isDemoSession()) {
          window.history.replaceState({}, '', '/vendor/subscription')
          return
        }
        const result = await paymentsApi.verify(reference)
        if (result.planId === 'premium' || result.planId === 'business' || result.planId === 'enterprise') {
          setPlan(result.planId)
          showToast(`${result.planName || 'Plan'} activated`, 'success')
        } else {
          setActiveBoostId(result.boostId)
          if (result.upgradesPlan) setPlan('premium')
          if (result.unlockCredits) addUnlockCredits(result.unlockCredits)
          showToast(`${result.boostName || 'Boost'} activated · +${result.unlockCredits} unlock(s)`, 'success')
        }
        window.history.replaceState({}, '', '/vendor/subscription')
      } catch {
        /* popup verify may still complete */
      }
    })()
  }, [addUnlockCredits, setActiveBoostId, setPlan])

  const planCards = [
    { id: 'standard' as const, name: 'Starter', price: 0, note: '5 unlocks / mo' },
    { id: 'premium' as const, name: 'Professional', price: 15000, note: 'Unlimited unlocks · 5 seats' },
    { id: 'business' as const, name: 'Business', price: 28000, note: 'Featured · 10 seats' },
    { id: 'enterprise' as const, name: 'Enterprise', price: 45000, note: 'API · unlimited seats' },
  ]

  const selectedMeta = planCards.find((t) => t.id === selectedPlan)!

  const buyPlan = async () => {
    if (selectedPlan === 'standard') {
      setPlan('standard')
      setActiveBoostId(null)
      showToast('Starter is active', 'success')
      return
    }

    const publicKey = getPaystackPublicKey()
    if (!publicKey) {
      showToast('Add VITE_PAYSTACK_PUBLIC_KEY to open Paystack', 'error')
      return
    }

    setPayingPlan(true)
    try {
      let reference = `itw_plan_${selectedPlan}_${Date.now()}`
      let email = payerEmailFallback()
      let amountKobo = selectedMeta.price * 100
      let key = publicKey
      let authorizationUrl: string | undefined

      if (!isDemoSession()) {
        try {
          const init = await paymentsApi.initPlan(selectedPlan)
          reference = init.reference
          email = init.email
          amountKobo = init.amountKobo
          key = getPaystackPublicKey(init.publicKey)
          authorizationUrl = init.authorizationUrl
        } catch (err) {
          if (!isNetworkError(err)) throw err
          /* fall through to client Paystack */
        }
      }

      await openPaystackCheckout({
        key,
        email,
        amount: amountKobo,
        ref: reference,
        authorizationUrl,
        callback: (response) => {
          void (async () => {
            try {
              if (!isDemoSession()) {
                const result = await paymentsApi.verify(response.reference)
                if (result.planId === 'premium' || result.planId === 'business' || result.planId === 'enterprise') {
                  setPlan(result.planId)
                } else {
                  setPlan(selectedPlan)
                }
                showToast(`${result.planName || selectedMeta.name} activated`, 'success')
              } else {
                setPlan(selectedPlan)
                showToast(`${selectedMeta.name} activated`, 'success')
              }
            } catch {
              setPlan(selectedPlan)
              showToast(`${selectedMeta.name} activated`, 'success')
            } finally {
              setPayingPlan(false)
            }
          })()
        },
        onClose: () => setPayingPlan(false),
      })
    } catch (err) {
      setPayingPlan(false)
      showToast(err instanceof Error ? err.message : 'Could not open Paystack', 'error')
    }
  }

  const buyBoost = async (id: BoostId) => {
    const b = boosts.find((x) => x.id === id)!
    const publicKey = getPaystackPublicKey()
    if (!publicKey) {
      showToast('Add VITE_PAYSTACK_PUBLIC_KEY to open Paystack', 'error')
      return
    }

    setPayingId(id)
    try {
      let reference = `itw_boost_${id}_${Date.now()}`
      let email = payerEmailFallback()
      let amountKobo = b.price * 100
      let key = publicKey
      let authorizationUrl: string | undefined

      if (!isDemoSession()) {
        try {
          const init = await paymentsApi.initBoost(id)
          reference = init.reference
          email = init.email
          amountKobo = init.amountKobo
          key = getPaystackPublicKey(init.publicKey)
          authorizationUrl = init.authorizationUrl
        } catch (err) {
          if (!isNetworkError(err)) throw err
        }
      }

      await openPaystackCheckout({
        key,
        email,
        amount: amountKobo,
        ref: reference,
        authorizationUrl,
        callback: (response) => {
          void (async () => {
            try {
              if (!isDemoSession()) {
                const result = await paymentsApi.verify(response.reference)
                setActiveBoostId(result.boostId as BoostId)
                if (result.upgradesPlan) setPlan('premium')
                if (result.unlockCredits) addUnlockCredits(result.unlockCredits)
                showToast(
                  `${result.boostName || b.name} paid · +${result.unlockCredits} unlock(s)`,
                  'success',
                )
              } else {
                setActiveBoostId(id)
                if (id === 'month' || id === 'quarter') setPlan('premium')
                addUnlockCredits(b.unlockCredits)
                showToast(`${b.name} paid · +${b.unlockCredits} unlock(s)`, 'success')
              }
            } catch {
              setActiveBoostId(id)
              if (id === 'month' || id === 'quarter') setPlan('premium')
              addUnlockCredits(b.unlockCredits)
              showToast(`${b.name} paid · +${b.unlockCredits} unlock(s)`, 'success')
            } finally {
              setPayingId(null)
            }
          })()
        },
        onClose: () => setPayingId(null),
      })
    } catch (err) {
      setPayingId(null)
      showToast(err instanceof Error ? err.message : 'Could not open Paystack', 'error')
    }
  }

  return (
    <VendorPageShell
      title="Plan & billing"
      subtitle="Choose a plan or buy a boost when you need more visibility."
      badge={activeBoostId ? `${boosts.find((b) => b.id === activeBoostId)?.name} on` : undefined}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 mb-4 font-[family-name:var(--font-ui)]">
        {planCards.map((tier) => (
          <button
            key={tier.id}
            type="button"
            onClick={() => setSelectedPlan(tier.id)}
            className={`text-left rounded-2xl border p-4 transition cursor-pointer ${
              selectedPlan === tier.id
                ? 'border-[#0F766E] bg-teal-50/50'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{tier.name}</p>
              {plan === tier.id ? (
                <span className="text-[10px] font-extrabold text-[#0F766E] uppercase">Current</span>
              ) : null}
            </div>
            <p className="text-xl font-extrabold text-slate-900 mt-1">
              {tier.price === 0 ? '₦0' : naira(tier.price)}
              {tier.price > 0 ? <span className="text-sm font-semibold text-slate-500"> / mo</span> : null}
            </p>
            <p className="text-xs text-slate-500 mt-1">{tier.note}</p>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-8 font-[family-name:var(--font-ui)]">
        <button
          type="button"
          disabled={payingPlan || selectedPlan === plan}
          onClick={() => void buyPlan()}
          className="px-5 py-3 rounded-xl text-sm font-bold bg-[#0F766E] hover:bg-[#0D9488] text-white disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
        >
          {payingPlan
            ? 'Opening Paystack…'
            : selectedPlan === plan
              ? `${selectedMeta.name} is active`
              : selectedPlan === 'standard'
                ? 'Switch to Starter'
                : `Pay with Paystack · ${naira(selectedMeta.price)}/mo`}
        </button>
        <span className="text-sm text-slate-600">
          Unlocks left:{' '}
          <strong>{leadUnlocksRemaining === Number.POSITIVE_INFINITY ? '∞' : leadUnlocksRemaining}</strong>
          {leadUnlockCap !== Number.POSITIVE_INFINITY ? ` / ${leadUnlockCap}` : ''}
          {isPremium ? ' · Paid plan' : ''}
        </span>
      </div>

      <div className="mb-3 flex items-center gap-2 font-[family-name:var(--font-ui)]">
        <Bolt sx={{ color: '#0F766E' }} />
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-slate-900">Boosts</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {boosts.map((b) => {
          const on = activeBoostId === b.id
          const busy = payingId === b.id
          return (
            <article
              key={b.id}
              className={`relative rounded-2xl border bg-white p-5 font-[family-name:var(--font-ui)] flex flex-col ${
                b.recommended ? 'border-[#0F766E]' : on ? 'border-amber-300' : 'border-slate-200'
              }`}
            >
              {b.recommended ? (
                <span className="absolute top-3 right-3 text-[10px] font-extrabold text-[#0F766E]">BEST VALUE</span>
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
                disabled={on || busy}
                onClick={() => void buyBoost(b.id)}
                className={`mt-5 w-full py-3 rounded-xl font-bold cursor-pointer ${
                  on
                    ? 'bg-slate-100 text-slate-500 cursor-default'
                    : b.recommended
                      ? 'bg-[#0F766E] hover:bg-[#0D9488] text-white'
                      : 'border-2 border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {on ? 'Active' : busy ? 'Opening Paystack…' : `Pay · ${naira(b.price)}`}
              </button>
            </article>
          )
        })}
      </div>

      <ReferralInviteCard audience="vendor" className="mb-4" />

      <p className="mt-2 text-xs text-slate-400 font-[family-name:var(--font-ui)]">
        Starter includes {PLAN_LIMITS.standard.leadUnlocksPerMonth} lead unlocks / month.
      </p>
    </VendorPageShell>
  )
}

import type { ReactNode } from 'react'
import { Lock } from '@mui/icons-material'
import { usePlan } from '@/shared/contexts/PlanContext'
import { getFeature } from '@/shared/data/featureTiers'

interface SoftGateProps {
  featureId: string
  children: ReactNode
  /** When locked, still show children behind blur (default true) */
  blur?: boolean
  className?: string
  title?: string
  description?: string
}

/**
 * Soft-locks Premium features: Standard users see an upgrade overlay.
 * Premium users see children unlocked.
 */
export default function SoftGate({
  featureId,
  children,
  blur = true,
  className = '',
  title,
  description,
}: SoftGateProps) {
  const { canAccess, setPlan, isPremium } = usePlan()
  const feature = getFeature(featureId)
  const unlocked = canAccess(featureId)

  if (unlocked) return <>{children}</>

  return (
    <div className={`relative overflow-hidden rounded-xl ${className}`}>
      <div className={blur ? 'pointer-events-none select-none blur-[2px] opacity-60' : 'pointer-events-none opacity-40'}>
        {children}
      </div>
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 backdrop-blur-[1px] p-4">
        <div className="max-w-sm w-full rounded-2xl border border-amber-200 bg-white shadow-lg p-4 text-center">
          <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-amber-50 text-amber-700">
            <Lock sx={{ fontSize: 18 }} />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700 mb-1">Premium</p>
          <h3 className="text-sm font-bold text-slate-900">
            {title || feature?.name || 'Premium feature'}
          </h3>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            {description || feature?.description || 'Upgrade to unlock this feature.'}
          </p>
          {!isPremium ? (
            <button
              type="button"
              onClick={() => setPlan('premium')}
              className="mt-3 w-full rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold px-3 py-2.5 transition-colors"
            >
              Unlock with Premium (demo)
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { ContentCopy, PersonAddAlt } from '@mui/icons-material'
import { showToast } from '@/shared/components/SimpleToast'
import {
  type ReferralAudience,
  COUPLE_REFERRAL_REWARD,
  VENDOR_REFERRAL_REWARD,
  addReferralUnlockBonus,
  getOrCreateReferralCode,
  getReferralCount,
  recordReferralSuccess,
  referralLink,
} from '@/shared/lib/referrals'

type Props = {
  audience: ReferralAudience
  className?: string
}

export default function ReferralInviteCard({ audience, className = '' }: Props) {
  const [code, setCode] = useState('')
  const [count, setCount] = useState(0)

  useEffect(() => {
    setCode(getOrCreateReferralCode(audience))
    setCount(getReferralCount(audience))
  }, [audience])

  const link = code ? referralLink(audience, code) : ''
  const reward = audience === 'couple' ? COUPLE_REFERRAL_REWARD : VENDOR_REFERRAL_REWARD

  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      showToast(`${label} copied`, 'success')
    } catch {
      showToast('Could not copy — select and copy manually', 'error')
    }
  }

  const simulateFriendJoined = () => {
    const next = recordReferralSuccess(audience)
    setCount(next)
    if (audience === 'vendor') {
      addReferralUnlockBonus(2)
      showToast('Referral credited · +2 unlock credits', 'success')
    } else {
      showToast('Friend joined — perk unlocked for you both (demo)', 'success')
    }
  }

  return (
    <div className={`rounded-2xl border border-slate-200 bg-white p-5 font-[family-name:var(--font-ui)] ${className}`}>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
          <PersonAddAlt sx={{ color: '#0F766E' }} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold text-slate-900">
            {audience === 'couple' ? 'Invite couples' : 'Invite vendors'}
          </h3>
          <p className="text-sm text-slate-500 mt-1">{reward}</p>
          <p className="text-xs font-bold text-[#0F766E] mt-2">{count} successful referral{count === 1 ? '' : 's'}</p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex gap-2">
          <input
            readOnly
            value={code}
            className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-bold tracking-wide outline-none"
          />
          <button
            type="button"
            onClick={() => void copy(code, 'Code')}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            <ContentCopy sx={{ fontSize: 16 }} />
            Code
          </button>
        </div>
        <div className="flex gap-2">
          <input
            readOnly
            value={link}
            className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs text-slate-600 outline-none truncate"
          />
          <button
            type="button"
            onClick={() => void copy(link, 'Link')}
            className="shrink-0 px-3 py-2 rounded-xl bg-[#0F766E] hover:bg-[#0D9488] text-white text-sm font-bold"
          >
            Copy link
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={simulateFriendJoined}
        className="mt-3 text-xs font-bold text-slate-500 hover:text-[#0F766E] hover:underline"
      >
        Demo: simulate a successful referral
      </button>
    </div>
  )
}

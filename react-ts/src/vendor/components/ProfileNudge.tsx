import { Link, useLocation } from 'react-router-dom'
import { useAccount } from '@/shared/contexts/AccountContext'
import { missingBasics } from '@/vendor/lib/live'

const LABELS: Record<string, string> = { category: 'category', location: 'location', bio: 'bio' }

/** Live vendors only: a slim banner while the basics couples search on are missing, or while the profile is archived. */
export default function ProfileNudge() {
  const { user, profile, loading } = useAccount()
  const { pathname } = useLocation()
  if (loading || !user || pathname.startsWith('/vendor/account')) return null

  if (profile.archived === true) {
    return (
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 md:px-12 pt-4 font-[family-name:var(--font-ui)]">
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-900">
          <span>Your profile is archived — couples can’t find you in search.</span>
          <Link to="/vendor/account" className="font-bold underline">
            Unarchive
          </Link>
        </div>
      </div>
    )
  }

  const missing = missingBasics(profile)
  if (!missing.length) return null

  return (
    <div className="mx-auto max-w-[1280px] px-4 sm:px-6 md:px-12 pt-4 font-[family-name:var(--font-ui)]">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-teal-200 bg-teal-50 px-4 py-2.5 text-sm text-teal-900">
        <span>
          Complete your profile so couples can find you — add your {missing.map((k) => LABELS[k]).join(', ')}.
        </span>
        <Link to="/vendor/account" className="font-bold underline">
          Complete profile
        </Link>
      </div>
    </div>
  )
}

import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CouplePageShell from '@/couple/components/CouplePageShell'
import FloatingNoteButton from '@/couple/components/FloatingNoteButton'
import PlanBadge from '@/shared/components/PlanBadge'
import {
  SearchOutlined,
  GroupsOutlined,
  ChecklistOutlined,
  WarningAmberRounded,
  LanguageOutlined,
  PhotoCameraOutlined,
  DeleteOutline,
  AddPhotoAlternateOutlined,
} from '@mui/icons-material'

interface ChecklistTask {
  id: string
  title: string
  completed: boolean
  dueDate: string
}

interface Guest {
  name: string
  status?: 'confirmed' | 'declined' | 'pending'
  partySize?: number
  table?: string
}

interface BudgetItem {
  id: string
  category: string
  actual: number
  estimated: number
}

interface BookedVendor {
  name: string
  category: string
  location: string
  status: 'BOOKED' | 'SHORTLISTED'
  avatar: string
}

const BANNER_KEY = 'itw_dashboard_banner'
const WEDDING_DATE = new Date('2027-03-15T12:00:00')
const FIRST_NAME = 'Adaeze'
const COUPLE_NAMES = 'Adaeze & Chidi'
const VENUE = 'The Civic Centre, Victoria Island, Lagos'
const MAX_BANNER_BYTES = 1_200_000

const DEMO_BUDGET: BudgetItem[] = [
  { id: '1', category: 'Venue', actual: 2100000, estimated: 2200000 },
  { id: '2', category: 'Catering', actual: 900000, estimated: 1000000 },
  { id: '3', category: 'Photography', actual: 675000, estimated: 730000 },
  { id: '4', category: 'Decor', actual: 540000, estimated: 600000 },
  { id: '5', category: 'Attire', actual: 450000, estimated: 500000 },
  { id: '6', category: 'Other', actual: 350000, estimated: 400000 },
]

const DEMO_GUESTS: Guest[] = [
  { name: 'Aunty Ngozi & family', status: 'confirmed', partySize: 4, table: 'VIP Table 2' },
  { name: 'Mr. & Mrs. Okafor', status: 'confirmed', partySize: 2, table: 'General Table 12' },
  { name: 'Tunde Bakare', status: 'pending', partySize: 1, table: 'Friends Table 4' },
  { name: 'Halima Yusuf', status: 'declined', partySize: 2, table: '—' },
]

const DEMO_VENDORS: BookedVendor[] = [
  {
    name: 'The Civic Centre',
    category: 'Venue',
    location: 'Lagos',
    status: 'BOOKED',
    avatar: 'https://images.unsplash.com/photo-1519167758481-83f29da84985?w=80&h=80&fit=crop',
  },
  {
    name: 'Chef Funke & Co',
    category: 'Catering',
    location: 'Lagos',
    status: 'BOOKED',
    avatar: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=80&h=80&fit=crop',
  },
  {
    name: 'Deji Studios',
    category: 'Photography',
    location: 'Lagos',
    status: 'SHORTLISTED',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop',
  },
  {
    name: "Aisha's Aso-Oke Couture",
    category: 'Fashion',
    location: 'Abuja',
    status: 'BOOKED',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop',
  },
]

const DEMO_TIMELINE = [
  { title: 'Finalize venue reservation', detail: 'Civic Centre confirmed. Deposit paid.', status: 'done' as const, when: 'Jan 5' },
  { title: 'Book chief wedding photographer', detail: 'Deji Studios contract pending signature.', status: 'urgent' as const, when: 'Due soon' },
  { title: 'Order wedding cake', detail: 'Consultation scheduled with designer.', status: 'upcoming' as const, when: 'Jan 15' },
  { title: 'Send save-the-dates', detail: 'Digital invites ready to launch.', status: 'upcoming' as const, when: 'Jan 20' },
]

const RECENT_ACTIVITY = [
  {
    label: 'Guests',
    text: 'Chidi added 12 guests to Lagos Traditional VIP block',
    time: '3h ago',
    path: '/couple/guests',
  },
  {
    label: 'Messages',
    text: 'Chef Funke sent a message regarding custom mocktail ingredients',
    time: '5h ago',
    path: '/couple/messages',
  },
  {
    label: 'Budget',
    text: 'Budget updated: ₦15,000 transferred from Other to Decor',
    time: 'Yesterday',
    path: '/couple/budget',
  },
  {
    label: 'Transactions',
    text: 'Venue deposit transaction ₦600,000 confirmed by iTheeWed',
    time: '2 days ago',
    path: '/couple/budget',
  },
]

const readJson = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

const naira = (value: number) =>
  `₦${value.toLocaleString('en-NG', { maximumFractionDigits: 0 })}`

const nairaCompact = (value: number) => {
  if (value >= 1_000_000) return `₦${(value / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
  if (value >= 1_000) return `₦${Math.round(value / 1_000)}K`
  return naira(value)
}

function greetingForNow() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function CircularProgress({
  percent,
  centerLabel,
  centerValue,
}: {
  percent: number
  centerLabel: string
  centerValue: string
}) {
  const size = 120
  const stroke = 11
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (Math.min(percent, 100) / 100) * circumference

  return (
    <div className="relative shrink-0 mx-auto sm:mx-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#E2E8F0" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#0F766E"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-3">
        <span className="text-[9px] font-bold tracking-wider text-slate-400 uppercase">{centerLabel}</span>
        <span className="text-base font-bold text-slate-800 leading-tight">{centerValue}</span>
      </div>
    </div>
  )
}

function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Could not read image'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('Invalid image'))
      img.onload = () => {
        const maxW = 1600
        const scale = Math.min(1, maxW / img.width)
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Canvas unavailable'))
          return
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        let quality = 0.82
        let dataUrl = canvas.toDataURL('image/jpeg', quality)
        while (dataUrl.length > MAX_BANNER_BYTES && quality > 0.45) {
          quality -= 0.1
          dataUrl = canvas.toDataURL('image/jpeg', quality)
        }
        if (dataUrl.length > MAX_BANNER_BYTES) {
          reject(new Error('Image is too large. Try a smaller photo.'))
          return
        }
        resolve(dataUrl)
      }
      img.src = String(reader.result)
    }
    reader.readAsDataURL(file)
  })
}

export default function Dashboard() {
  const navigate = useNavigate()
  const fileRef = useRef<HTMLInputElement>(null)
  const [bannerImage, setBannerImage] = useState<string | null>(() => localStorage.getItem(BANNER_KEY))
  const [bannerError, setBannerError] = useState('')
  const [uploading, setUploading] = useState(false)

  const website = useMemo(() => readJson<{ published?: boolean; slug?: string }>('itw_website', { published: false }), [])

  const hub = useMemo(() => {
    const tasks = readJson<ChecklistTask[]>('itw_checklist', [])
    const guestsStored = readJson<Guest[]>('itw_guestlist', [])
    const budgetStored = readJson<BudgetItem[]>('itw_budget', [])
    const totalBudget = Number(localStorage.getItem('itw_total_budget')) || 6_000_000

    const budget = budgetStored.length ? budgetStored : DEMO_BUDGET
    const guests = guestsStored.length
      ? guestsStored.map((g) => ({
          ...g,
          status: g.status ?? 'pending',
          partySize: g.partySize ?? 1,
        }))
      : DEMO_GUESTS

    const spent = budget.reduce((sum, item) => sum + (item.actual || 0), 0)
    const remaining = Math.max(totalBudget - spent, 0)
    const spendPercent = Math.round((spent / Math.max(totalBudget, 1)) * 100)

    const confirmed = guests.filter((g) => g.status === 'confirmed').length
    const declined = guests.filter((g) => g.status === 'declined').length
    const pending = guests.length - confirmed - declined
    const invited = guests.length || 187
    const confirmedCount = guestsStored.length ? confirmed : 142
    const declinedCount = guestsStored.length ? declined : 8
    const pendingCount = guestsStored.length ? pending : 37
    const invitedCount = guestsStored.length ? invited : 187

    const totalTasks = tasks.length || 52
    const doneTasks = tasks.length ? tasks.filter((t) => t.completed).length : 34
    const upcomingDue = tasks.length
      ? tasks.filter((t) => !t.completed).length
      : 18
    const planningProgress = Math.round((doneTasks / Math.max(totalTasks, 1)) * 100)

    const msLeft = WEDDING_DATE.getTime() - Date.now()
    const daysToGo = Math.max(0, Math.ceil(msLeft / (1000 * 60 * 60 * 24)))

    const photo = budget.find((b) => /photo/i.test(b.category))
    const photoRemain = photo ? Math.max((photo.estimated || 0) - (photo.actual || 0), 0) : 55_000
    const photoPct = photo ? Math.round(((photo.actual || 0) / Math.max(photo.estimated || 1, 1)) * 100) : 92

    const categoryColors = ['#0F766E', '#38BDF8', '#C9A227', '#A78BFA', '#FB7185', '#94A3B8']

    return {
      daysToGo,
      planningProgress,
      spent,
      remaining,
      totalBudget,
      spendPercent,
      budget,
      categoryColors,
      invitedCount,
      confirmedCount,
      declinedCount,
      pendingCount,
      recentGuests: guests.slice(0, 3),
      totalTasks,
      doneTasks,
      upcomingDue,
      bookedCount: DEMO_VENDORS.filter((v) => v.status === 'BOOKED').length,
      vendorTotal: 12,
      photoRemain,
      photoPct,
    }
  }, [])

  const onBannerFile = async (file: File | undefined) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setBannerError('Please choose an image file.')
      return
    }
    setUploading(true)
    setBannerError('')
    try {
      const dataUrl = await compressImage(file)
      localStorage.setItem(BANNER_KEY, dataUrl)
      setBannerImage(dataUrl)
    } catch (err) {
      setBannerError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const clearBanner = () => {
    localStorage.removeItem(BANNER_KEY)
    setBannerImage(null)
    setBannerError('')
  }

  return (
    <CouplePageShell bare>
      {/* Page greeting */}
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5 md:mb-8">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-semibold text-slate-900">
            {greetingForNow()}, {FIRST_NAME}
          </h1>
          <p className="text-sm text-slate-500 mt-1">Here&apos;s where Adaeze &amp; Chidi stand — pick up whatever needs a decision today.</p>
        </div>
        <PlanBadge />
      </header>

      {/* Countdown / photo banner */}
      <section
        className="relative overflow-hidden rounded-2xl text-white mb-5 md:mb-8 shadow-lg shadow-teal-900/10 min-h-[200px] md:min-h-[220px]"
        style={
          bannerImage
            ? {
                backgroundImage: `linear-gradient(120deg, rgba(11,45,49,0.78), rgba(15,118,110,0.55)), url(${bannerImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }
            : {
                background: 'linear-gradient(135deg, #0B4F4A 0%, #0F766E 55%, #115E59 100%)',
              }
        }
      >
        <div className="relative z-10 p-5 md:p-7 flex flex-col md:flex-row md:items-end md:justify-between gap-5">
          <div className="min-w-0 flex-1">
            <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-semibold leading-tight">
              {COUPLE_NAMES}
            </h2>
            <p className="mt-2 text-[#E8C96A] text-xs md:text-sm font-semibold tracking-wide">
              {WEDDING_DATE.toLocaleDateString('en-NG', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              }).toUpperCase()}
            </p>
            <p className="text-teal-50/95 text-sm mt-1">{VENUE}</p>
            <div className="mt-5 max-w-md">
              <div className="flex justify-between text-[11px] font-bold tracking-wider uppercase mb-1.5">
                <span className="text-teal-100/85">Planning progress</span>
                <span className="text-[#E8C96A]">{hub.planningProgress}% complete</span>
              </div>
              <div className="h-2 rounded-full bg-white/20 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#E8C96A] transition-all duration-500"
                  style={{ width: `${hub.planningProgress}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
            <div className="text-left md:text-right">
              <div className="text-5xl md:text-6xl font-bold leading-none tracking-tight">{hub.daysToGo}</div>
              <div className="text-sm font-semibold tracking-[0.18em] uppercase text-teal-100/90 mt-1">days to go</div>
            </div>

            <div className="flex flex-wrap gap-2">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => void onBannerFile(e.target.files?.[0])}
              />
              <button
                type="button"
                disabled={uploading}
                onClick={() => fileRef.current?.click()}
                className="inline-flex items-center gap-1.5 rounded-lg bg-white/15 hover:bg-white/25 border border-white/25 px-3 py-1.5 text-xs font-semibold backdrop-blur-sm transition-colors disabled:opacity-60"
              >
                {bannerImage ? <PhotoCameraOutlined sx={{ fontSize: 16 }} /> : <AddPhotoAlternateOutlined sx={{ fontSize: 16 }} />}
                {uploading ? 'Uploading…' : bannerImage ? 'Change photo' : 'Upload banner'}
              </button>
              {bannerImage ? (
                <button
                  type="button"
                  onClick={clearBanner}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-black/20 hover:bg-black/30 border border-white/20 px-3 py-1.5 text-xs font-semibold transition-colors"
                >
                  <DeleteOutline sx={{ fontSize: 16 }} />
                  Use teal default
                </button>
              ) : null}
            </div>
          </div>
        </div>
        {bannerError ? (
          <p className="relative z-10 px-5 pb-4 text-xs text-amber-200">{bannerError}</p>
        ) : null}
      </section>

      {/* Quick actions — desktop 3 / mobile scroll */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5 md:mb-8">
        {[
          {
            label: 'Find Vendors',
            detail: '850+ Verified Master Artisans',
            icon: SearchOutlined,
            path: '/couple/search-results',
            cta: 'Search Marketplace',
          },
          {
            label: 'Guest List',
            detail: `${hub.invitedCount} Invited · ${hub.pendingCount} Pending RSVPs`,
            icon: GroupsOutlined,
            path: '/couple/guests',
            cta: 'Manage Guest List',
          },
          {
            label: 'Checklist',
            detail: `${hub.upcomingDue} Tasks Due this Fortnight`,
            icon: ChecklistOutlined,
            path: '/couple/checklist',
            cta: 'Open Planning Canvas',
          },
        ].map(({ label, detail, icon: Icon, path, cta }) => (
          <div key={path} className="bg-white border border-slate-200 rounded-2xl p-4 md:p-5 flex flex-col">
            <Icon className="text-teal-700 mb-2" sx={{ fontSize: 22 }} />
            <div className="text-sm font-bold text-slate-800">{label}</div>
            <p className="text-xs text-slate-500 mt-1 flex-1">{detail}</p>
            <button
              type="button"
              onClick={() => navigate(path)}
              className="mt-3 self-start text-xs font-bold text-teal-700 border border-teal-200 rounded-lg px-3 py-1.5 hover:bg-teal-50 transition-colors"
            >
              {cta}
            </button>
          </div>
        ))}
      </div>

      {/* Mobile KPI strip */}
      <div className="grid grid-cols-2 gap-2 mb-5 md:hidden">
        {[
          { label: 'Budget used', value: `${nairaCompact(hub.spent)} / ${nairaCompact(hub.totalBudget)}`, pct: hub.spendPercent },
          {
            label: 'Guests RSVP',
            value: `${hub.confirmedCount} / ${hub.invitedCount}`,
            pct: Math.round((hub.confirmedCount / hub.invitedCount) * 100),
          },
          {
            label: 'Vendors',
            value: `${hub.bookedCount} of ${hub.vendorTotal}`,
            pct: Math.round((hub.bookedCount / hub.vendorTotal) * 100),
          },
          { label: 'Tasks done', value: `${hub.doneTasks} / ${hub.totalTasks}`, pct: hub.planningProgress },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white border border-slate-200 rounded-xl p-3">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{kpi.label}</div>
            <div className="text-sm font-bold text-slate-800 mt-1">{kpi.value}</div>
            <div className="h-1 rounded-full bg-slate-100 mt-2 overflow-hidden">
              <div className="h-full bg-teal-600 rounded-full" style={{ width: `${kpi.pct}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 mb-4 md:mb-8">
        <section className="bg-white border border-slate-200 rounded-2xl p-4 md:p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-slate-800">Budget Overview</h2>
            <button type="button" onClick={() => navigate('/couple/budget')} className="text-xs font-bold text-teal-700 tracking-wide cursor-pointer hover:underline">
              VIEW TRACKER
            </button>
          </div>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5">
            <CircularProgress percent={hub.spendPercent} centerLabel="Remaining" centerValue={nairaCompact(hub.remaining)} />
            <ul className="space-y-2 flex-1 min-w-0 w-full">
              {hub.budget.slice(0, 6).map((item, i) => (
                <li key={item.id} className="flex items-center justify-between gap-2 text-sm">
                  <span className="flex items-center gap-2 text-slate-600 truncate">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: hub.categoryColors[i % hub.categoryColors.length] }}
                    />
                    {item.category}
                  </span>
                  <span className="font-semibold text-slate-800 shrink-0">{naira(item.actual)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-4 flex items-start gap-2 rounded-xl bg-amber-50 border border-amber-100 px-3 py-2.5 text-sm text-amber-900">
            <WarningAmberRounded sx={{ fontSize: 18, mt: '1px' }} className="text-amber-600" />
            <span>
              Photography budget is {hub.photoPct}% spent. {naira(hub.photoRemain)} remains.
            </span>
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-2xl p-4 md:p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-slate-800">Guest Tracker</h2>
            <button type="button" onClick={() => navigate('/couple/guests')} className="text-xs font-bold text-teal-700 tracking-wide cursor-pointer hover:underline">
              VIEW RSVP STATUS
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2 mb-3">
            {[
              { label: 'Invited', value: hub.invitedCount },
              { label: 'Confirmed', value: hub.confirmedCount },
              { label: 'Declined', value: hub.declinedCount },
              { label: 'Pending', value: hub.pendingCount },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-base md:text-lg font-bold text-slate-800">{stat.value}</div>
                <div className="text-[10px] uppercase tracking-wide text-slate-400 font-semibold">{stat.label}</div>
              </div>
            ))}
          </div>
          <div className="h-2.5 rounded-full overflow-hidden flex bg-slate-100 mb-2">
            <div className="bg-emerald-500" style={{ width: `${(hub.confirmedCount / hub.invitedCount) * 100}%` }} />
            <div className="bg-rose-400" style={{ width: `${(hub.declinedCount / hub.invitedCount) * 100}%` }} />
            <div className="bg-amber-400" style={{ width: `${(hub.pendingCount / hub.invitedCount) * 100}%` }} />
          </div>
          <p className="text-xs text-slate-500 mb-4">
            {hub.confirmedCount} confirmed · {hub.pendingCount} pending · {hub.declinedCount} declined
          </p>
          <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-2">Recent RSVPs</p>
          <ul className="space-y-3">
            {hub.recentGuests.map((guest) => (
              <li key={guest.name} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-slate-800 truncate">{guest.name}</div>
                  <div className="text-xs text-slate-500">
                    Party of {guest.partySize ?? 1}
                    {guest.table ? ` · ${guest.table}` : ''}
                  </div>
                </div>
                <span
                  className={`text-[10px] font-bold tracking-wide px-2 py-1 rounded-full shrink-0 ${
                    guest.status === 'confirmed'
                      ? 'bg-emerald-50 text-emerald-700'
                      : guest.status === 'declined'
                        ? 'bg-rose-50 text-rose-700'
                        : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  {(guest.status ?? 'pending').toUpperCase()}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 mb-4 md:mb-8">
        <section className="bg-white border border-slate-200 rounded-2xl p-4 md:p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-slate-800">Planning Timeline</h2>
            <button type="button" onClick={() => navigate('/couple/checklist')} className="text-xs font-bold text-teal-700 tracking-wide cursor-pointer hover:underline">
              FULL ROADMAP
            </button>
          </div>
          <ol className="relative space-y-4 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-px before:bg-slate-200">
            {DEMO_TIMELINE.map((item) => (
              <li key={item.title} className="pl-7 relative">
                <span
                  className={`absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white shadow ${
                    item.status === 'done' ? 'bg-emerald-500' : item.status === 'urgent' ? 'bg-amber-500' : 'bg-sky-400'
                  }`}
                />
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-semibold text-slate-800">{item.title}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{item.detail}</div>
                  </div>
                  <span className={`text-[10px] font-bold shrink-0 ${item.status === 'urgent' ? 'text-amber-600' : 'text-slate-400'}`}>
                    {item.when}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="bg-white border border-slate-200 rounded-2xl p-4 md:p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-slate-800">
              Your Vendors ({DEMO_VENDORS.length} of {hub.vendorTotal})
            </h2>
            <button
              type="button"
              onClick={() => navigate('/couple/my-vendors')}
              className="text-xs font-bold text-teal-700 tracking-wide cursor-pointer hover:underline"
            >
              VIEW ALL
            </button>
          </div>
          <p className="text-xs text-slate-500 mb-3">
            {hub.bookedCount} booked · {DEMO_VENDORS.length - hub.bookedCount} shortlisted
          </p>
          <ul className="space-y-3">
            {DEMO_VENDORS.map((vendor) => (
              <li key={vendor.name} className="flex items-center gap-3">
                <img src={vendor.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-800 truncate">{vendor.name}</div>
                  <div className="text-xs text-slate-500">
                    {vendor.category} • {vendor.location}
                  </div>
                </div>
                <span
                  className={`text-[10px] font-bold tracking-wide px-2 py-1 rounded-full ${
                    vendor.status === 'BOOKED' ? 'bg-teal-50 text-teal-700' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {vendor.status}
                </span>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => navigate('/couple/my-vendors')}
            className="mt-4 text-xs font-bold text-teal-700 hover:underline cursor-pointer"
          >
            Open My Vendors →
          </button>
          <button
            type="button"
            onClick={() => navigate('/couple/search-results')}
            className="mt-2 block text-xs font-semibold text-slate-500 hover:text-teal-700 hover:underline cursor-pointer"
          >
            Or find more vendors on the Guild →
          </button>
        </section>
      </div>

      {/* Wedding website — volume + core feature */}
      <section className="bg-white border border-slate-200 rounded-2xl p-4 md:p-5 mb-4 md:mb-8">
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:justify-between">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-700 grid place-items-center shrink-0">
              <LanguageOutlined />
            </div>
            <div className="min-w-0">
              <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-slate-800">Wedding Website</h2>
              <p className="text-sm text-slate-500 mt-1">
                Share your story, RSVP link, and Lagos day-of details with guests.
                {website.published ? ' Your site is live.' : ' Still in draft — publish when ready.'}
              </p>
              <span
                className={`inline-block mt-2 text-[10px] font-bold tracking-wide px-2 py-1 rounded-full ${
                  website.published ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800'
                }`}
              >
                {website.published ? 'PUBLISHED' : 'DRAFT'}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/couple/wedding-website')}
            className="shrink-0 bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
          >
            {website.published ? 'Manage website' : 'Build website'}
          </button>
        </div>
      </section>

      {/* Recent Activity — replaces marketing footer on hub */}
      <section className="mb-2">
        <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-slate-800 mb-3 md:mb-4">
          Recent Activity
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {RECENT_ACTIVITY.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => navigate(item.path)}
              className="text-left bg-white border border-slate-200 rounded-2xl p-4 hover:border-teal-300 hover:shadow-sm transition-all"
            >
              <div className="text-[10px] font-bold tracking-wider uppercase text-teal-700 mb-2">{item.label}</div>
              <p className="text-sm text-slate-700 leading-snug">{item.text}</p>
              <p className="text-xs text-slate-400 mt-3">{item.time}</p>
            </button>
          ))}
        </div>
      </section>

      <FloatingNoteButton />
    </CouplePageShell>
  )
}

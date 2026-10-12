import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CouplePageShell from '@/couple/components/CouplePageShell'
import FloatingNoteButton from '@/couple/components/FloatingNoteButton'
import PlanBadge from '@/shared/components/PlanBadge'
import { CircularProgress, compressImage, greetingForNow, naira, nairaCompact } from '@/couple/components/dashboardParts'
import { coupleIdentity, daysUntil, parseLocalDate } from '@/couple/planning-live/coupleIdentity'
import { formatDate } from '@/couple/live/liveVendor'
import { useAccount } from '@/shared/contexts/AccountContext'
import { useServerState } from '@/shared/hooks/useServerState'
import {
  inquiriesApi,
  notificationsApi,
  planningApi,
  uploadsApi,
  websiteApi,
  type Inquiry,
  type InquiryStatus,
  type ServerNotification,
  type WeddingSite,
} from '@/shared/lib/api'
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

type Task = { id: string; title: string; completed: boolean; dueDate: string }
type Guest = { id: string; name: string; group: string; rsvp: 'pending' | 'yes' | 'no' | 'maybe' }
type Expense = { id: string; category: string; amount: number; spent: number }

type HubData = {
  tasks: Task[]
  guests: Guest[]
  expenses: Expense[]
  totalBudget: number
  inquiries: Inquiry[]
  notifications: ServerNotification[]
  website: WeddingSite | null
}

const EMPTY_HUB: HubData = {
  tasks: [],
  guests: [],
  expenses: [],
  totalBudget: 0,
  inquiries: [],
  notifications: [],
  website: null,
}

const BOOKED: InquiryStatus[] = ['confirmed', 'completed']
const CLOSED: InquiryStatus[] = ['declined', 'cancelled']
const CATEGORY_COLORS = ['#0F766E', '#38BDF8', '#C9A227', '#A78BFA', '#FB7185', '#94A3B8']
const DAY_MS = 86_400_000

const VENDOR_STATUS: Record<InquiryStatus, { label: string; className: string }> = {
  new: { label: 'REQUESTED', className: 'bg-sky-50 text-sky-700' },
  contacted: { label: 'REPLIED', className: 'bg-indigo-50 text-indigo-700' },
  quoted: { label: 'QUOTED', className: 'bg-amber-50 text-amber-800' },
  confirmed: { label: 'BOOKED', className: 'bg-teal-50 text-teal-700' },
  completed: { label: 'COMPLETED', className: 'bg-slate-100 text-slate-700' },
  declined: { label: 'DECLINED', className: 'bg-rose-50 text-rose-700' },
  cancelled: { label: 'CANCELLED', className: 'bg-slate-100 text-slate-500' },
}

const ACTIVITY_LABEL: Record<ServerNotification['type'], string> = {
  inquiry: 'Vendors',
  booking: 'Bookings',
  message: 'Messages',
  payment: 'Payments',
  system: 'Updates',
}

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : []
}

function toTask(raw: Record<string, unknown>): Task {
  return {
    id: String(raw.id),
    title: String(raw.title || 'Untitled task'),
    completed: !!raw.completed,
    dueDate: String(raw.dueDate || ''),
  }
}

function toGuest(raw: Record<string, unknown>): Guest {
  const rsvp = raw.rsvp
  return {
    id: String(raw.id),
    name: String(raw.name || 'Guest'),
    group: String(raw.group || ''),
    rsvp: rsvp === 'yes' || rsvp === 'no' || rsvp === 'maybe' ? rsvp : 'pending',
  }
}

function toExpense(raw: Record<string, unknown>): Expense {
  const amount = Number(raw.amount) || 0
  const committed = raw.status === 'committed' || raw.status === 'paid'
  return {
    id: String(raw.id),
    category: String(raw.category || raw.title || 'Expense'),
    amount,
    spent: committed ? amount : Number(raw.actual) || 0,
  }
}

function timeAgo(value: string) {
  const then = new Date(value).getTime()
  if (Number.isNaN(then)) return ''
  const mins = Math.round((Date.now() - then) / 60_000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  return formatDate(value)
}

function EmptyCard({ text, cta, onClick }: { text: string; cta: string; onClick: () => void }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-6 text-center">
      <p className="text-sm text-slate-500">{text}</p>
      <button
        type="button"
        onClick={onClick}
        className="mt-3 text-xs font-bold text-teal-700 border border-teal-200 rounded-lg px-3 py-1.5 hover:bg-teal-50 transition-colors"
      >
        {cta}
      </button>
    </div>
  )
}

export default function LiveDashboard() {
  const navigate = useNavigate()
  const { user, profile } = useAccount()
  const identity = coupleIdentity(user, profile)
  const fileRef = useRef<HTMLInputElement>(null)
  const { data: bannerImage, save: saveBanner } = useServerState<string>('dashboard-banner', {
    demoKey: 'itw_dashboard_banner',
    demo: '',
    empty: '',
  })
  const [bannerError, setBannerError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [hub, setHub] = useState<HubData>(EMPTY_HUB)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    let cancelled = false
    const settle = <T,>(p: Promise<T>) => p.then((value) => ({ ok: true as const, value })).catch(() => ({ ok: false as const }))
    void Promise.all([
      settle(planningApi.listChecklist()),
      settle(planningApi.listGuests()),
      settle(planningApi.getBudget()),
      settle(inquiriesApi.list()),
      settle(notificationsApi.list()),
      settle(websiteApi.mine()),
    ]).then(([tasks, guests, budget, inquiries, notifications, website]) => {
      if (cancelled) return
      const budgetValue = budget.ok ? (budget.value as Record<string, unknown> | null) : null
      setHub({
        tasks: tasks.ok ? asArray<Record<string, unknown>>(tasks.value).map(toTask) : [],
        guests: guests.ok ? asArray<Record<string, unknown>>(guests.value).map(toGuest) : [],
        expenses: asArray<Record<string, unknown>>(budgetValue?.expenses).map(toExpense),
        totalBudget: Number(budgetValue?.totalBudget) || 0,
        inquiries: inquiries.ok ? asArray<Inquiry>(inquiries.value) : [],
        notifications: notifications.ok ? asArray<ServerNotification>(notifications.value) : [],
        website: website.ok ? (website.value as WeddingSite | null) : null,
      })
      const failed = [tasks, guests, budget, inquiries, notifications, website].some((r) => !r.ok)
      setLoadError(failed ? 'Some of your planning data could not be loaded. Refresh to try again.' : '')
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const stats = useMemo(() => {
    const { tasks, guests, expenses, totalBudget, inquiries } = hub
    const doneTasks = tasks.filter((t) => t.completed).length
    const planningProgress = tasks.length ? Math.round((doneTasks / tasks.length) * 100) : 0
    const fortnight = Date.now() + 14 * DAY_MS
    const openTasks = tasks.filter((t) => !t.completed)
    const dueSoon = openTasks.filter((t) => {
      const due = parseLocalDate(t.dueDate)
      return due ? due.getTime() <= fortnight : false
    }).length

    const spent = expenses.reduce((sum, e) => sum + e.spent, 0)
    const remaining = Math.max(totalBudget - spent, 0)
    const spendPercent = totalBudget > 0 ? Math.round((spent / totalBudget) * 100) : 0
    const byCategory = new Map<string, { category: string; amount: number; spent: number }>()
    for (const e of expenses) {
      const row = byCategory.get(e.category) || { category: e.category, amount: 0, spent: 0 }
      row.amount += e.amount
      row.spent += e.spent
      byCategory.set(e.category, row)
    }
    const categories = [...byCategory.values()].sort((a, b) => b.spent + b.amount - (a.spent + a.amount))
    const overspent = categories.find((c) => c.amount > 0 && c.spent > c.amount)

    const confirmed = guests.filter((g) => g.rsvp === 'yes').length
    const declined = guests.filter((g) => g.rsvp === 'no').length
    const pending = guests.length - confirmed - declined

    const activeVendors = inquiries.filter((i) => !CLOSED.includes(i.status))
    const booked = inquiries.filter((i) => BOOKED.includes(i.status)).length

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const upcoming = [...openTasks]
      .sort((a, b) => (a.dueDate || '9999').localeCompare(b.dueDate || '9999'))
      .slice(0, 4)
      .map((t) => {
        const due = parseLocalDate(t.dueDate)
        const overdue = !!due && due.getTime() < today.getTime()
        const soon = !!due && due.getTime() <= fortnight
        return {
          id: t.id,
          title: t.title,
          status: overdue || soon ? ('urgent' as const) : ('upcoming' as const),
          when: due ? (overdue ? 'Overdue' : formatDate(t.dueDate)) : 'No date',
        }
      })

    return {
      planningProgress,
      doneTasks,
      totalTasks: tasks.length,
      dueSoon,
      spent,
      remaining,
      spendPercent,
      categories,
      overspent,
      confirmed,
      declined,
      pending,
      invited: guests.length,
      recentGuests: guests.slice(-3).reverse(),
      activeVendors,
      booked,
      upcoming,
    }
  }, [hub])

  const days = daysUntil(identity.weddingDate)
  const weddingDate = parseLocalDate(identity.weddingDate)
  const venueLine = [identity.venue, identity.location].filter(Boolean).join(', ')
  const website = hub.website
  const greetingName = identity.firstName ? `, ${identity.firstName}` : ''

  const onBannerFile = async (file: File | undefined) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setBannerError('Please choose an image file.')
      return
    }
    setUploading(true)
    setBannerError('')
    try {
      const url = await uploadsApi.upload(await compressImage(file))
      if (!(await saveBanner(url))) setBannerError('Could not save your banner. Please try again.')
    } catch (err) {
      setBannerError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const clearBanner = () => {
    setBannerError('')
    void saveBanner('')
  }

  const pct = (part: number, whole: number) => (whole > 0 ? Math.round((part / whole) * 100) : 0)

  return (
    <CouplePageShell bare>
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5 md:mb-8">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-semibold text-slate-900">
            {greetingForNow()}
            {greetingName}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {loading ? 'Loading your planning hub…' : 'Here’s where your wedding stands. Pick up whatever needs a decision today.'}
          </p>
        </div>
        <PlanBadge />
      </header>

      {loadError ? (
        <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">{loadError}</div>
      ) : null}

      <section
        className="relative overflow-hidden rounded-2xl text-white mb-5 md:mb-8 shadow-lg shadow-teal-900/10 min-h-[200px] md:min-h-[220px]"
        style={
          bannerImage
            ? {
                backgroundImage: `linear-gradient(120deg, rgba(11,45,49,0.78), rgba(15,118,110,0.55)), url(${bannerImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }
            : { background: 'linear-gradient(135deg, #0B4F4A 0%, #0F766E 55%, #115E59 100%)' }
        }
      >
        <div className="relative z-10 p-5 md:p-7 flex flex-col md:flex-row md:items-end md:justify-between gap-5">
          <div className="min-w-0 flex-1">
            <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-semibold leading-tight">
              {identity.displayName}
            </h2>
            {weddingDate ? (
              <p className="mt-2 text-[#E8C96A] text-xs md:text-sm font-semibold tracking-wide">
                {weddingDate
                  .toLocaleDateString('en-NG', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
                  .toUpperCase()}
              </p>
            ) : (
              <button
                type="button"
                onClick={() => navigate('/couple/profile')}
                className="mt-2 text-[#E8C96A] text-xs md:text-sm font-semibold tracking-wide hover:underline"
              >
                ADD YOUR WEDDING DATE →
              </button>
            )}
            {venueLine ? <p className="text-teal-50/95 text-sm mt-1">{venueLine}</p> : null}
            <div className="mt-5 max-w-md">
              <div className="flex justify-between text-[11px] font-bold tracking-wider uppercase mb-1.5">
                <span className="text-teal-100/85">Planning progress</span>
                <span className="text-[#E8C96A]">{stats.planningProgress}% complete</span>
              </div>
              <div className="h-2 rounded-full bg-white/20 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#E8C96A] transition-all duration-500"
                  style={{ width: `${stats.planningProgress}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
            {days !== null && days >= 0 ? (
              <div className="text-left md:text-right">
                <div className="text-5xl md:text-6xl font-bold leading-none tracking-tight">{days}</div>
                <div className="text-sm font-semibold tracking-[0.18em] uppercase text-teal-100/90 mt-1">
                  {days === 0 ? 'it’s today!' : days === 1 ? 'day to go' : 'days to go'}
                </div>
              </div>
            ) : null}

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
        {bannerError ? <p className="relative z-10 px-5 pb-4 text-xs text-amber-200">{bannerError}</p> : null}
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5 md:mb-8">
        {[
          {
            label: 'Find Vendors',
            detail: stats.activeVendors.length
              ? `${stats.booked} booked · ${stats.activeVendors.length - stats.booked} in conversation`
              : 'Browse verified vendors and send your first request',
            icon: SearchOutlined,
            path: '/couple/search-results',
            cta: 'Search Marketplace',
          },
          {
            label: 'Guest List',
            detail: stats.invited ? `${stats.invited} Invited · ${stats.pending} Awaiting RSVP` : 'No guests added yet',
            icon: GroupsOutlined,
            path: '/couple/guests',
            cta: stats.invited ? 'Manage Guest List' : 'Add Guests',
          },
          {
            label: 'Checklist',
            detail: stats.totalTasks
              ? `${stats.dueSoon} ${stats.dueSoon === 1 ? 'Task' : 'Tasks'} due in the next two weeks`
              : 'No tasks yet. Start your planning list',
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

      <div className="grid grid-cols-2 gap-2 mb-5 md:hidden">
        {[
          {
            label: 'Budget used',
            value: hub.totalBudget ? `${nairaCompact(stats.spent)} / ${nairaCompact(hub.totalBudget)}` : 'Not set',
            pct: stats.spendPercent,
          },
          { label: 'Guests RSVP', value: `${stats.confirmed} / ${stats.invited}`, pct: pct(stats.confirmed, stats.invited) },
          { label: 'Vendors booked', value: `${stats.booked}`, pct: pct(stats.booked, stats.activeVendors.length) },
          { label: 'Tasks done', value: `${stats.doneTasks} / ${stats.totalTasks}`, pct: stats.planningProgress },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white border border-slate-200 rounded-xl p-3">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{kpi.label}</div>
            <div className="text-sm font-bold text-slate-800 mt-1">{kpi.value}</div>
            <div className="h-1 rounded-full bg-slate-100 mt-2 overflow-hidden">
              <div className="h-full bg-teal-600 rounded-full" style={{ width: `${Math.min(kpi.pct, 100)}%` }} />
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
          {!hub.totalBudget && !hub.expenses.length ? (
            <EmptyCard text="Set your total budget to see how your spending is tracking." cta="Set budget" onClick={() => navigate('/couple/budget')} />
          ) : (
            <>
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5">
                <CircularProgress percent={stats.spendPercent} centerLabel="Remaining" centerValue={nairaCompact(stats.remaining)} />
                {stats.categories.length ? (
                  <ul className="space-y-2 flex-1 min-w-0 w-full">
                    {stats.categories.slice(0, 6).map((item, i) => (
                      <li key={item.category} className="flex items-center justify-between gap-2 text-sm">
                        <span className="flex items-center gap-2 text-slate-600 truncate">
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }} />
                          {item.category}
                        </span>
                        <span className="font-semibold text-slate-800 shrink-0">{naira(item.spent || item.amount)}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="flex-1 text-sm text-slate-500">
                    Budget of {naira(hub.totalBudget)} set. Add expenses as you get quotes and pay deposits.
                  </p>
                )}
              </div>
              {stats.overspent ? (
                <div className="mt-4 flex items-start gap-2 rounded-xl bg-amber-50 border border-amber-100 px-3 py-2.5 text-sm text-amber-900">
                  <WarningAmberRounded sx={{ fontSize: 18, mt: '1px' }} className="text-amber-600" />
                  <span>
                    {stats.overspent.category} is {naira(stats.overspent.spent - stats.overspent.amount)} over its estimate.
                  </span>
                </div>
              ) : null}
            </>
          )}
        </section>

        <section className="bg-white border border-slate-200 rounded-2xl p-4 md:p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-slate-800">Guest Tracker</h2>
            <button type="button" onClick={() => navigate('/couple/guests')} className="text-xs font-bold text-teal-700 tracking-wide cursor-pointer hover:underline">
              VIEW RSVP STATUS
            </button>
          </div>
          {!stats.invited ? (
            <EmptyCard text="Add your guests to track invitations and RSVPs here." cta="Add guests" onClick={() => navigate('/couple/guests')} />
          ) : (
            <>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {[
                  { label: 'Invited', value: stats.invited },
                  { label: 'Confirmed', value: stats.confirmed },
                  { label: 'Declined', value: stats.declined },
                  { label: 'Pending', value: stats.pending },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-base md:text-lg font-bold text-slate-800">{stat.value}</div>
                    <div className="text-[10px] uppercase tracking-wide text-slate-400 font-semibold">{stat.label}</div>
                  </div>
                ))}
              </div>
              <div className="h-2.5 rounded-full overflow-hidden flex bg-slate-100 mb-2">
                <div className="bg-emerald-500" style={{ width: `${pct(stats.confirmed, stats.invited)}%` }} />
                <div className="bg-rose-400" style={{ width: `${pct(stats.declined, stats.invited)}%` }} />
                <div className="bg-amber-400" style={{ width: `${pct(stats.pending, stats.invited)}%` }} />
              </div>
              <p className="text-xs text-slate-500 mb-4">
                {stats.confirmed} confirmed · {stats.pending} pending · {stats.declined} declined
              </p>
              <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-2">Recently added</p>
              <ul className="space-y-3">
                {stats.recentGuests.map((guest) => (
                  <li key={guest.id} className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-slate-800 truncate">{guest.name}</div>
                      {guest.group ? <div className="text-xs text-slate-500">{guest.group}</div> : null}
                    </div>
                    <span
                      className={`text-[10px] font-bold tracking-wide px-2 py-1 rounded-full shrink-0 ${
                        guest.rsvp === 'yes'
                          ? 'bg-emerald-50 text-emerald-700'
                          : guest.rsvp === 'no'
                            ? 'bg-rose-50 text-rose-700'
                            : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {guest.rsvp === 'yes' ? 'CONFIRMED' : guest.rsvp === 'no' ? 'DECLINED' : 'PENDING'}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 mb-4 md:mb-8">
        <section className="bg-white border border-slate-200 rounded-2xl p-4 md:p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-slate-800">Up Next</h2>
            <button type="button" onClick={() => navigate('/couple/checklist')} className="text-xs font-bold text-teal-700 tracking-wide cursor-pointer hover:underline">
              FULL ROADMAP
            </button>
          </div>
          {!stats.upcoming.length ? (
            <EmptyCard
              text={stats.totalTasks ? 'Every task is done. Nice work!' : 'Add tasks to your checklist and the next ones will show up here.'}
              cta={stats.totalTasks ? 'Add another task' : 'Start checklist'}
              onClick={() => navigate('/couple/checklist')}
            />
          ) : (
            <ol className="relative space-y-4 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-px before:bg-slate-200">
              {stats.upcoming.map((item) => (
                <li key={item.id} className="pl-7 relative">
                  <span
                    className={`absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white shadow ${
                      item.status === 'urgent' ? 'bg-amber-500' : 'bg-sky-400'
                    }`}
                  />
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-sm font-semibold text-slate-800">{item.title}</div>
                    <span className={`text-[10px] font-bold shrink-0 ${item.status === 'urgent' ? 'text-amber-600' : 'text-slate-400'}`}>
                      {item.when}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </section>

        <section className="bg-white border border-slate-200 rounded-2xl p-4 md:p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-slate-800">Your Vendors</h2>
            <button
              type="button"
              onClick={() => navigate('/couple/my-vendors')}
              className="text-xs font-bold text-teal-700 tracking-wide cursor-pointer hover:underline"
            >
              VIEW ALL
            </button>
          </div>
          {!stats.activeVendors.length ? (
            <EmptyCard
              text="You haven’t contacted any vendors yet. Requests and bookings will appear here."
              cta="Find vendors"
              onClick={() => navigate('/couple/search-results')}
            />
          ) : (
            <>
              <p className="text-xs text-slate-500 mb-3">
                {stats.booked} booked · {stats.activeVendors.length - stats.booked} in conversation
              </p>
              <ul className="space-y-3">
                {stats.activeVendors.slice(0, 4).map((row) => (
                  <li key={row.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-700 grid place-items-center text-sm font-bold shrink-0">
                      {(row.vendorName || 'V').charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-slate-800 truncate">{row.vendorName || 'Vendor'}</div>
                      <div className="text-xs text-slate-500">
                        {[row.vendorCategory, row.eventDate ? formatDate(row.eventDate) : ''].filter(Boolean).join(' • ')}
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold tracking-wide px-2 py-1 rounded-full ${VENDOR_STATUS[row.status].className}`}>
                      {VENDOR_STATUS[row.status].label}
                    </span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => navigate('/couple/search-results')}
                className="mt-4 block text-xs font-semibold text-slate-500 hover:text-teal-700 hover:underline cursor-pointer"
              >
                Find more vendors →
              </button>
            </>
          )}
        </section>
      </div>

      <section className="bg-white border border-slate-200 rounded-2xl p-4 md:p-5 mb-4 md:mb-8">
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:justify-between">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-700 grid place-items-center shrink-0">
              <LanguageOutlined />
            </div>
            <div className="min-w-0">
              <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-slate-800">Wedding Website</h2>
              <p className="text-sm text-slate-500 mt-1">
                Share your story, RSVP link, and day-of details with guests.
                {website?.published ? ' Your site is live.' : website ? ' Still in draft. Publish when ready.' : ' You haven’t started one yet.'}
              </p>
              <span
                className={`inline-block mt-2 text-[10px] font-bold tracking-wide px-2 py-1 rounded-full ${
                  website?.published ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800'
                }`}
              >
                {website?.published ? 'PUBLISHED' : website ? 'DRAFT' : 'NOT STARTED'}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/couple/wedding-website')}
            className="shrink-0 bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
          >
            {website?.published ? 'Manage website' : 'Build website'}
          </button>
        </div>
      </section>

      <section className="mb-2">
        <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-slate-800 mb-3 md:mb-4">Recent Activity</h2>
        {!hub.notifications.length ? (
          <p className="text-sm text-slate-500 bg-white border border-slate-200 rounded-2xl p-4">
            Vendor replies, booking updates, and messages will show up here.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
            {hub.notifications.slice(0, 4).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (!item.read) void notificationsApi.markRead(item.id).catch(() => undefined)
                  navigate(item.link || '/couple/dashboard')
                }}
                className="text-left bg-white border border-slate-200 rounded-2xl p-4 hover:border-teal-300 hover:shadow-sm transition-all"
              >
                <div className="text-[10px] font-bold tracking-wider uppercase text-teal-700 mb-2">{ACTIVITY_LABEL[item.type] || 'Updates'}</div>
                <p className="text-sm font-semibold text-slate-800 leading-snug">{item.title}</p>
                {item.message ? <p className="text-sm text-slate-600 leading-snug mt-1 line-clamp-2">{item.message}</p> : null}
                <p className="text-xs text-slate-400 mt-3">{timeAgo(item.createdAt)}</p>
              </button>
            ))}
          </div>
        )}
      </section>

      <FloatingNoteButton />
    </CouplePageShell>
  )
}

import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  AddPhotoAlternateOutlined,
  ArrowForward,
  CheckCircle,
  DeleteOutline,
  PhotoCameraOutlined,
  RadioButtonUnchecked,
  Schedule,
} from '@mui/icons-material'
import VendorPageShell from '@/vendor/components/VendorPageShell'
import { ErrorBanner } from '@/vendor/components/LiveState'
import { profileString, useAccount } from '@/shared/contexts/AccountContext'
import { usePlan } from '@/shared/contexts/PlanContext'
import { apiErrorMessage, threadsApi, type ThreadSummary } from '@/shared/lib/api'
import { uploadImage } from '@/shared/lib/imageCompress'
import { showToast } from '@/shared/components/SimpleToast'
import { useVendorServices } from '@/shared/lib/vendorServices'
import { useVendorPortfolio } from '@/vendor/lib/portfolio'
import {
  eventDateParts,
  formatEventDate,
  isBooked,
  isUpcoming,
  naira,
  profileChecklist,
  timeAgo,
  useInquiries,
} from '@/vendor/lib/live'

function greetingForNow() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

const OPEN_STATUSES = new Set(['new', 'contacted', 'quoted'])

export default function LiveOverview() {
  const navigate = useNavigate()
  const { isPremium } = usePlan()
  const { user, profile, update } = useAccount()
  const { items, loading, error, reload } = useInquiries()
  const { data: services } = useVendorServices()
  const { data: albums } = useVendorPortfolio()
  const [threads, setThreads] = useState<ThreadSummary[]>([])
  const [threadsError, setThreadsError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    let cancelled = false
    threadsApi
      .list()
      .then((list) => {
        if (!cancelled) setThreads(list)
      })
      .catch((err) => {
        if (!cancelled) setThreadsError(apiErrorMessage(err, 'Could not load your inbox.'))
      })
    return () => {
      cancelled = true
    }
  }, [])

  const businessName = user?.business_name || user?.username || 'Your business'
  const ownerFirst = profileString(profile, 'ownerName').split(' ')[0] || user?.username || ''
  const cover = profileString(profile, 'cover')
  const avatar = profileString(profile, 'avatar')
  const category = profileString(profile, 'category')
  const location = profileString(profile, 'location')
  const tagline = profileString(profile, 'tagline')
  const responseTime = profileString(profile, 'responseTime')

  const stats = useMemo(() => {
    const leads = items.filter((i) => i.kind === 'inquiry' && OPEN_STATUSES.has(i.status))
    const newLeads = leads.filter((i) => i.status === 'new')
    const bookings = items.filter(isBooked)
    const upcoming = bookings
      .filter((b) => b.status === 'confirmed' && isUpcoming(b.eventDate))
      .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
    const revenue = bookings.reduce((sum, b) => sum + (Number(b.amount) || 0), 0)
    return { leads, newLeads, bookings, upcoming, revenue }
  }, [items])

  const unread = threads.reduce((sum, t) => sum + (t.unread || 0), 0)
  const activeServices = services.filter((s) => s.active).length
  const checklist = profileChecklist(profile, activeServices, albums.length)
  const completed = checklist.filter((c) => c.done).length
  const nextEvent = stats.upcoming[0]

  const onCoverFile = async (file: File | undefined) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      showToast('Please choose an image file.', 'error')
      return
    }
    setUploading(true)
    try {
      const url = await uploadImage(file)
      await update({ profile: { cover: url } })
      showToast('Cover photo updated', 'success')
    } catch (err) {
      showToast(apiErrorMessage(err, err instanceof Error ? err.message : 'Upload failed'), 'error')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const removeCover = async () => {
    try {
      await update({ profile: { cover: '' } })
      showToast('Cover photo removed', 'info')
    } catch (err) {
      showToast(apiErrorMessage(err, 'Could not remove the cover photo'), 'error')
    }
  }

  const summary = loading
    ? 'Loading your enquiries…'
    : [
        `${stats.newLeads.length} new ${stats.newLeads.length === 1 ? 'lead' : 'leads'}`,
        `${unread} unread in inbox`,
        nextEvent ? `next event ${formatEventDate(nextEvent.eventDate)}` : 'no upcoming events yet',
      ].join(' · ')

  return (
    <VendorPageShell bare>
      <header className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6 md:mb-8">
        <div>
          <p className="text-[11px] font-bold tracking-[0.22em] uppercase text-[#0F5C56] font-[family-name:var(--font-ui)] mb-2">
            Vendor desk
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-[2.75rem] font-semibold text-[#0B2D31] leading-tight">
            {greetingForNow()}
            {ownerFirst ? `, ${ownerFirst}` : ''}
          </h1>
          <p className="text-sm text-slate-500 mt-2 max-w-xl font-[family-name:var(--font-ui)]">{summary}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {!isPremium ? (
            <button
              type="button"
              onClick={() => navigate('/vendor/subscription')}
              className="inline-flex items-center justify-center rounded-xl border border-amber-300 bg-amber-50 text-amber-900 px-4 py-2.5 text-sm font-bold font-[family-name:var(--font-ui)] hover:bg-amber-100 cursor-pointer"
            >
              Upgrade plan
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => navigate('/vendor/services')}
            className="inline-flex items-center justify-center rounded-xl bg-[#0F766E] hover:bg-[#0D9488] text-white px-5 py-2.5 text-sm font-bold font-[family-name:var(--font-ui)] cursor-pointer"
          >
            Edit packages
          </button>
          <button
            type="button"
            onClick={() => navigate('/vendor/bookings?add=1')}
            className="inline-flex items-center justify-center rounded-xl border border-[#0F766E] text-[#0F766E] bg-white hover:bg-teal-50 px-5 py-2.5 text-sm font-bold font-[family-name:var(--font-ui)] cursor-pointer"
          >
            Log booking
          </button>
        </div>
      </header>

      {error ? <ErrorBanner message={error} onRetry={() => void reload()} /> : null}

      <section
        className="relative overflow-hidden rounded-2xl text-white mb-5 md:mb-7 min-h-[220px] md:min-h-[260px] shadow-lg shadow-teal-900/10"
        style={{
          backgroundImage: cover
            ? `linear-gradient(120deg, rgba(11,45,49,0.78), rgba(15,118,110,0.55)), url("${cover}")`
            : 'linear-gradient(120deg, #0B2D31, #0F766E)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="relative z-10 p-5 md:p-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="min-w-0 flex-1 flex items-start gap-4">
            {avatar ? (
              <img
                src={avatar}
                alt=""
                className="w-[4.5rem] h-[4.5rem] md:w-24 md:h-24 rounded-2xl object-cover border-2 border-white/40 shrink-0"
              />
            ) : (
              <Link
                to="/vendor/account"
                className="w-[4.5rem] h-[4.5rem] md:w-24 md:h-24 rounded-2xl border-2 border-dashed border-white/40 shrink-0 flex items-center justify-center text-3xl font-[family-name:var(--font-display)] bg-white/10"
                title="Add a profile photo"
              >
                {businessName.charAt(0).toUpperCase()}
              </Link>
            )}
            <div className="min-w-0 pt-0.5">
              {category ? (
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="rounded-full bg-white/15 border border-white/25 px-2.5 py-0.5 text-[10px] font-bold tracking-wide uppercase font-[family-name:var(--font-ui)]">
                    {category}
                  </span>
                </div>
              ) : null}
              <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-5xl font-semibold leading-[1.05] tracking-tight break-words">
                {businessName}
              </h2>
              {tagline || location ? (
                <p className="mt-2 text-[#E8C96A] text-sm font-[family-name:var(--font-ui)]">
                  {[tagline, location].filter(Boolean).join(' · ')}
                </p>
              ) : (
                <Link to="/vendor/account" className="mt-2 inline-block text-[#E8C96A] text-sm font-semibold underline font-[family-name:var(--font-ui)]">
                  Add a tagline and location
                </Link>
              )}
              {responseTime ? (
                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-[family-name:var(--font-ui)]">
                  <span className="inline-flex items-center gap-1 text-white/75">
                    <Schedule sx={{ fontSize: 15 }} />
                    Usually replies {responseTime.toLowerCase()}
                  </span>
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col items-stretch md:items-end gap-3 shrink-0">
            <div className="grid grid-cols-3 gap-2 md:gap-3 w-full md:w-auto">
              {[
                { label: 'Open leads', value: loading ? '—' : String(stats.leads.length) },
                { label: 'Booked', value: loading ? '—' : String(stats.bookings.length) },
                { label: 'Profile', value: `${Math.round((completed / checklist.length) * 100)}%` },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl bg-white/15 border border-white/25 px-3 py-2.5 text-center min-w-[72px] backdrop-blur-sm"
                >
                  <div className="font-[family-name:var(--font-display)] text-2xl font-semibold leading-none">{stat.value}</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-white/65 mt-1.5 font-[family-name:var(--font-ui)]">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 justify-end">
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => void onCoverFile(e.target.files?.[0])} />
              <button
                type="button"
                disabled={uploading}
                onClick={() => fileRef.current?.click()}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-60 font-[family-name:var(--font-ui)] cursor-pointer"
              >
                {cover ? <PhotoCameraOutlined sx={{ fontSize: 16 }} /> : <AddPhotoAlternateOutlined sx={{ fontSize: 16 }} />}
                {uploading ? 'Uploading…' : cover ? 'Change cover' : 'Add cover'}
              </button>
              {cover ? (
                <button
                  type="button"
                  onClick={() => void removeCover()}
                  className="inline-flex items-center gap-1.5 rounded-full bg-black/20 hover:bg-black/30 border border-white/20 px-3 py-1.5 text-xs font-semibold font-[family-name:var(--font-ui)] cursor-pointer"
                >
                  <DeleteOutline sx={{ fontSize: 16 }} />
                  Remove
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5 md:mb-7">
        {[
          { label: 'New leads', value: loading ? '—' : String(stats.newLeads.length), hint: 'Waiting for your reply', path: '/vendor/leads' },
          {
            label: 'Bookings',
            value: loading ? '—' : String(stats.bookings.length),
            hint: nextEvent ? `Next · ${formatEventDate(nextEvent.eventDate)}` : 'Confirmed & completed',
            path: '/vendor/bookings',
          },
          { label: 'Booked revenue', value: loading ? '—' : naira(stats.revenue), hint: 'Confirmed + completed', path: '/vendor/bookings' },
          { label: 'Unread', value: String(unread), hint: 'Messages from couples', path: '/vendor/messages' },
        ].map((kpi) => (
          <button
            key={kpi.label}
            type="button"
            onClick={() => navigate(kpi.path)}
            className="text-left rounded-2xl border border-slate-200 bg-white px-4 py-4 hover:border-teal-200 hover:bg-teal-50/30 transition-colors cursor-pointer"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 font-[family-name:var(--font-ui)]">{kpi.label}</p>
            <p className="font-[family-name:var(--font-display)] text-3xl font-semibold text-slate-900 mt-1.5 truncate">{kpi.value}</p>
            <p className="text-xs text-slate-500 mt-1 font-[family-name:var(--font-ui)]">{kpi.hint}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 md:gap-5 mb-5 md:mb-7">
        <section className="xl:col-span-5 rounded-2xl bg-[#0F766E] text-white p-5 md:p-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#E8C96A] font-[family-name:var(--font-ui)]">
            Profile {completed}/{checklist.length}
          </p>
          <h3 className="font-[family-name:var(--font-display)] text-2xl font-semibold mt-2">
            {completed === checklist.length ? 'Your profile is complete' : 'Get found by couples'}
          </h3>
          <ul className="mt-5 space-y-2 font-[family-name:var(--font-ui)]">
            {checklist.map((item) => (
              <li key={item.key}>
                <Link
                  to={item.path}
                  className="w-full flex items-center justify-between gap-2 rounded-xl border border-white/15 bg-white/10 hover:bg-white/15 px-3.5 py-2.5 transition-colors"
                >
                  <span className="flex items-center gap-2 text-sm font-semibold">
                    {item.done ? (
                      <CheckCircle sx={{ fontSize: 18, color: '#E8C96A' }} />
                    ) : (
                      <RadioButtonUnchecked sx={{ fontSize: 18, color: 'rgba(255,255,255,0.6)' }} />
                    )}
                    <span className={item.done ? 'text-white/70 line-through' : ''}>{item.label}</span>
                  </span>
                  {!item.done ? <ArrowForward sx={{ fontSize: 16, color: '#E8C96A' }} /> : null}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="xl:col-span-7 bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="px-4 md:px-5 py-4 flex items-center justify-between gap-3 border-b border-slate-100">
            <div>
              <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[#0B2D31]">New leads</h3>
              <p className="text-xs text-slate-500 mt-0.5 font-[family-name:var(--font-ui)]">Couples who enquired and are waiting on you</p>
            </div>
            <Link to="/vendor/leads" className="text-xs font-bold tracking-wide text-[#0F5C56] hover:underline font-[family-name:var(--font-ui)]">
              ALL LEADS
            </Link>
          </div>
          {loading ? (
            <p className="px-5 py-10 text-center text-sm text-slate-400 font-[family-name:var(--font-ui)]">Loading…</p>
          ) : stats.leads.length === 0 ? (
            <div className="px-5 py-10 text-center font-[family-name:var(--font-ui)]">
              <p className="font-semibold text-slate-700">No leads yet</p>
              <p className="text-sm text-slate-500 mt-1">Complete your profile and publish a package so couples can find and enquire.</p>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                <Link to="/vendor/account" className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#0F766E]">
                  Complete profile
                </Link>
                <Link to="/vendor/services" className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#0F766E] border border-teal-200">
                  Add a package
                </Link>
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100 font-[family-name:var(--font-ui)]">
              {stats.leads.slice(0, 5).map((lead) => (
                <li key={lead.id}>
                  <Link to="/vendor/leads" className="flex items-center justify-between gap-3 px-4 md:px-5 py-3.5 hover:bg-[#FAFCFC]">
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 truncate">{lead.coupleName || 'Couple'}</p>
                      <p className="text-xs text-slate-500 mt-0.5 truncate">
                        {[formatEventDate(lead.eventDate), lead.location, lead.budget ? `Budget ${naira(lead.budget)}` : '']
                          .filter(Boolean)
                          .join(' · ')}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-bold tracking-wide px-2 py-1 rounded-full bg-[#F8EFE8] text-[#9A3412] uppercase">
                        {lead.status}
                      </span>
                      <p className="text-[11px] text-slate-400 mt-1">{timeAgo(lead.createdAt)}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
        <section className="bg-white border border-slate-200 rounded-2xl p-4 md:p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[#0B2D31]">Upcoming events</h3>
              <p className="text-xs text-slate-500 mt-0.5 font-[family-name:var(--font-ui)]">Confirmed bookings by date</p>
            </div>
            <Link to="/vendor/bookings" className="text-xs font-bold tracking-wide text-[#0F5C56] hover:underline font-[family-name:var(--font-ui)]">
              BOOKINGS
            </Link>
          </div>
          {stats.upcoming.length === 0 ? (
            <div className="py-8 text-center font-[family-name:var(--font-ui)]">
              <p className="text-sm text-slate-500">No upcoming events yet.</p>
              <Link to="/vendor/bookings?add=1" className="mt-2 inline-block text-sm font-bold text-[#0F766E]">
                Log an offline booking
              </Link>
            </div>
          ) : (
            <ul className="space-y-2.5 font-[family-name:var(--font-ui)]">
              {stats.upcoming.slice(0, 5).map((b) => {
                const parts = eventDateParts(b.eventDate)
                return (
                  <li key={b.id}>
                    <Link
                      to="/vendor/bookings"
                      className="flex items-center gap-3 p-2.5 rounded-xl border border-transparent hover:border-slate-100 hover:bg-[#FAFCFC]"
                    >
                      <div className="w-12 h-14 rounded-xl bg-teal-50 text-teal-800 flex flex-col items-center justify-center shrink-0">
                        <span className="text-[9px] font-bold tracking-[0.14em]">{parts.month}</span>
                        <span className="text-xl font-bold leading-none mt-0.5 font-[family-name:var(--font-display)]">{parts.day}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-slate-800 truncate">{b.coupleName || 'Client'}</div>
                        <div className="text-xs text-slate-500 truncate">
                          {[b.packageName, b.location].filter(Boolean).join(' · ') || 'Booking'}
                        </div>
                      </div>
                      {b.amount ? <div className="text-sm font-bold text-slate-800 shrink-0">{naira(b.amount)}</div> : null}
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        <section className="bg-white border border-slate-200 rounded-2xl p-4 md:p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[#0B2D31]">Inbox</h3>
              <p className="text-xs text-slate-500 mt-0.5 font-[family-name:var(--font-ui)]">{unread} waiting on you</p>
            </div>
            <Link to="/vendor/messages" className="text-xs font-bold tracking-wide text-[#0F5C56] hover:underline font-[family-name:var(--font-ui)]">
              OPEN
            </Link>
          </div>
          {threadsError ? <p className="text-sm text-rose-700 font-[family-name:var(--font-ui)]">{threadsError}</p> : null}
          {!threadsError && threads.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500 font-[family-name:var(--font-ui)]">
              No conversations yet — couples’ messages will appear here.
            </p>
          ) : (
            <ul className="space-y-1 font-[family-name:var(--font-ui)]">
              {threads.slice(0, 4).map((t) => (
                <li key={t.id}>
                  <Link
                    to={`/vendor/messages?thread=${encodeURIComponent(t.id)}`}
                    className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#FAFCFC] text-left"
                  >
                    <div className="relative shrink-0 w-10 h-10 rounded-full bg-teal-50 text-teal-800 flex items-center justify-center font-bold">
                      {(t.coupleName || '?').charAt(0).toUpperCase()}
                      {t.unread ? (
                        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#0F5C56] rounded-full border-2 border-white" />
                      ) : null}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-slate-800 text-sm truncate">{t.coupleName || 'Couple'}</span>
                        <span className="text-[11px] text-slate-400 shrink-0">{timeAgo(t.updatedAt)}</span>
                      </div>
                      <p className={`text-xs mt-0.5 truncate ${t.unread ? 'text-slate-700 font-medium' : 'text-slate-500'}`}>
                        {t.lastMessage || 'No messages yet'}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </VendorPageShell>
  )
}

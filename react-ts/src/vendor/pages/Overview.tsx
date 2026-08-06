import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  PhotoCameraOutlined,
  DeleteOutline,
  AddPhotoAlternateOutlined,
  Star,
  LeaderboardOutlined,
  EventOutlined,
  ChatOutlined,
  TrendingUp,
} from '@mui/icons-material'
import VendorPageShell from '@/vendor/components/VendorPageShell'
import { VENDOR_PROFILE } from '@/vendor/lib/vendorProfile'
import { compressImageToDataUrl } from '@/shared/lib/imageCompress'
import { showToast } from '@/shared/components/SimpleToast'
import { usePlan } from '@/shared/contexts/PlanContext'

type PipelineStage = 'New' | 'Contacted' | 'Quoted' | 'Won' | 'Lost'

interface PipelineLead {
  couple: string
  weddingDate: string
  budget: string
  location: string
  stage: PipelineStage
  lastActivity: string
  action: string
}

const BANNER_KEY = 'itw_vendor_banner'

const pipelineLeads: PipelineLead[] = [
  { couple: 'Amara & Obinna', weddingDate: 'Mar 15, 2027', budget: '₦800K–₦1.2M', location: 'Lagos', stage: 'New', lastActivity: '2h ago', action: 'Respond' },
  { couple: 'Halima & Usman', weddingDate: 'Apr 22, 2027', budget: '₦1.5M–₦2M', location: 'Abuja', stage: 'Contacted', lastActivity: 'Yesterday', action: 'Send Quote' },
  { couple: 'Tolu & Kayode', weddingDate: 'Jun 10, 2027', budget: '₦600K–₦900K', location: 'Lagos', stage: 'Quoted', lastActivity: '3d ago', action: 'Follow Up' },
  { couple: 'Chioma & Emeka', weddingDate: 'Aug 5, 2027', budget: '₦1.2M–₦1.8M', location: 'Port Harcourt', stage: 'New', lastActivity: '5h ago', action: 'Respond' },
  { couple: 'Fatima & Ibrahim', weddingDate: 'Sep 18, 2027', budget: '₦950K–₦1.4M', location: 'Abuja', stage: 'Contacted', lastActivity: '1d ago', action: 'Send Quote' },
  { couple: 'Ngozi & Chidi', weddingDate: 'Dec 2, 2027', budget: '₦2M–₦2.5M', location: 'Lagos', stage: 'Won', lastActivity: '1w ago', action: 'View' },
]

const bookings = [
  { month: 'JAN', day: '28', couple: 'Bola & Segun', service: 'Full Day Coverage', price: '₦450,000', status: 'DEPOSIT PAID' },
  { month: 'FEB', day: '14', couple: 'Ada & Kunle', service: 'Engagement Session', price: '₦180,000', status: 'PENDING PAYMENT' },
  { month: 'MAR', day: '15', couple: 'Adaeze & Chidi', service: 'Full Day + Album', price: '₦675,000', status: 'CONFIRMED' },
  { month: 'MAR', day: '22', couple: 'Zainab & Musa', service: 'Traditional Coverage', price: '₦320,000', status: 'DEPOSIT PAID' },
]

const messages = [
  { name: 'Amara Okonkwo', snippet: 'Can we schedule a Lagos venue walkthrough this weekend?', time: '12m', unread: true, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop' },
  { name: 'Usman Bello', snippet: 'Quote received — waiting on family approval in Abuja.', time: '1h', unread: true, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop' },
  { name: 'Tolu Adeyemi', snippet: 'Please send the revised Lekki package breakdown.', time: 'Yesterday', unread: false, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop' },
  { name: 'Chioma Nwosu', snippet: 'Deposit transferred via Paystack. Receipt attached.', time: '2d', unread: false, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop' },
]

const stageStyles: Record<PipelineStage, string> = {
  New: 'bg-rose-50 text-rose-700',
  Contacted: 'bg-sky-50 text-sky-700',
  Quoted: 'bg-amber-50 text-amber-800',
  Won: 'bg-emerald-50 text-emerald-700',
  Lost: 'bg-slate-100 text-slate-600',
}

const bookingStyles: Record<string, string> = {
  'DEPOSIT PAID': 'bg-emerald-50 text-emerald-700',
  'PENDING PAYMENT': 'bg-amber-50 text-amber-800',
  CONFIRMED: 'bg-teal-50 text-teal-800',
}

const stages: PipelineStage[] = ['New', 'Contacted', 'Quoted', 'Won', 'Lost']

function greetingForNow() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function Overview() {
  const navigate = useNavigate()
  const { isPremium } = usePlan()
  const fileRef = useRef<HTMLInputElement>(null)
  const [activeStage, setActiveStage] = useState<PipelineStage>('New')
  const [bannerImage, setBannerImage] = useState<string | null>(() => localStorage.getItem(BANNER_KEY))
  const [bannerError, setBannerError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [quoteOpen, setQuoteOpen] = useState(false)
  const [quoteForm, setQuoteForm] = useState({ couple: '', packageName: '', amount: '', notes: '' })

  const stageCounts = useMemo(
    () =>
      stages.reduce(
        (acc, stage) => {
          acc[stage] = pipelineLeads.filter((l) => l.stage === stage).length
          return acc
        },
        {} as Record<PipelineStage, number>,
      ),
    [],
  )

  const visibleLeads = pipelineLeads.filter((l) => l.stage === activeStage)
  const unread = messages.filter((m) => m.unread).length

  const onBannerFile = async (file: File | undefined) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setBannerError('Please choose an image file.')
      return
    }
    setUploading(true)
    setBannerError('')
    try {
      const dataUrl = await compressImageToDataUrl(file)
      localStorage.setItem(BANNER_KEY, dataUrl)
      setBannerImage(dataUrl)
      showToast('Banner updated', 'success')
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

  const submitQuote = () => {
    if (!quoteForm.couple.trim() || !quoteForm.amount.trim()) {
      showToast('Add couple name and amount', 'error')
      return
    }
    showToast(`Quote drafted for ${quoteForm.couple.trim()}`, 'success')
    setQuoteOpen(false)
    setQuoteForm({ couple: '', packageName: '', amount: '', notes: '' })
    navigate('/vendor/leads')
  }

  const kpis = [
    {
      title: 'Active leads',
      value: '24',
      hint: '+12% this week',
      icon: <LeaderboardOutlined sx={{ color: '#0F766E' }} />,
      path: '/vendor/leads',
    },
    {
      title: 'Bookings',
      value: '8',
      hint: 'Next: Jan 28',
      icon: <EventOutlined sx={{ color: '#B45309' }} />,
      path: '/vendor/bookings',
    },
    {
      title: 'Revenue',
      value: '₦3.2M',
      hint: '+18% YoY',
      icon: <TrendingUp sx={{ color: '#047857' }} />,
      path: '/vendor/bookings',
    },
    {
      title: 'Inbox',
      value: String(unread),
      hint: 'Unread threads',
      icon: <ChatOutlined sx={{ color: '#0369A1' }} />,
      path: '/vendor/messages',
    },
  ]

  return (
    <VendorPageShell bare>
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5 md:mb-8">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-semibold text-slate-900">
            {greetingForNow()}, {VENDOR_PROFILE.ownerFirstName}
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-[family-name:var(--font-ui)]">
            Leads, bookings, and portfolio — keep your studio moving.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {!isPremium ? (
            <button
              type="button"
              onClick={() => navigate('/vendor/subscription')}
              className="inline-flex items-center justify-center rounded-xl border border-amber-300 bg-amber-50 text-amber-900 px-4 py-2.5 text-sm font-bold font-[family-name:var(--font-ui)] hover:bg-amber-100"
            >
              Upgrade plan
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => setQuoteOpen(true)}
            className="inline-flex items-center justify-center rounded-xl bg-[#0F766E] hover:bg-[#0D9488] text-white px-4 py-2.5 text-sm font-bold font-[family-name:var(--font-ui)] shadow-sm"
          >
            Create Quote
          </button>
          <button
            type="button"
            onClick={() => navigate('/vendor/bookings?add=1')}
            className="inline-flex items-center justify-center rounded-xl border border-[#0F766E] text-[#0F766E] bg-white hover:bg-teal-50 px-4 py-2.5 text-sm font-bold font-[family-name:var(--font-ui)]"
          >
            Add Booking
          </button>
        </div>
      </header>

      {/* Couple-style banner */}
      <section
        className="relative overflow-hidden rounded-2xl text-white mb-5 md:mb-8 shadow-lg shadow-teal-900/10 min-h-[210px] md:min-h-[240px]"
        style={
          bannerImage
            ? {
                backgroundImage: `linear-gradient(120deg, rgba(11,45,49,0.78), rgba(15,118,110,0.55)), url(${bannerImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }
            : {
                backgroundImage: `linear-gradient(120deg, rgba(11,45,49,0.78), rgba(15,118,110,0.55)), url(${VENDOR_PROFILE.cover})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }
        }
      >
        <div className="relative z-10 p-5 md:p-7 flex flex-col md:flex-row md:items-end md:justify-between gap-5">
          <div className="min-w-0 flex-1 flex items-start gap-4">
            <img
              src={VENDOR_PROFILE.avatar}
              alt=""
              className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover border-2 border-white/40 shadow-md shrink-0"
            />
            <div className="min-w-0">
              <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-semibold leading-tight">
                {VENDOR_PROFILE.businessName}
              </h2>
              <p className="mt-2 text-[#E8C96A] text-xs md:text-sm font-semibold tracking-wide uppercase font-[family-name:var(--font-ui)]">
                {VENDOR_PROFILE.category}
              </p>
              <p className="text-teal-50/95 text-sm mt-1 font-[family-name:var(--font-ui)]">{VENDOR_PROFILE.location}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-semibold font-[family-name:var(--font-ui)]">
                <span className="inline-flex items-center gap-1 rounded-full bg-white/15 border border-white/25 px-2.5 py-1">
                  <Star sx={{ fontSize: 14, color: '#E8C96A' }} />
                  {VENDOR_PROFILE.rating} ({VENDOR_PROFILE.reviewCount} reviews)
                </span>
                <span className="rounded-full bg-white/15 border border-white/25 px-2.5 py-1">
                  Responds {VENDOR_PROFILE.responseTime.toLowerCase()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setQuoteOpen(true)}
                className="rounded-xl bg-white text-[#0B2D31] hover:bg-teal-50 px-4 py-2 text-sm font-bold font-[family-name:var(--font-ui)]"
              >
                Create Quote
              </button>
              <button
                type="button"
                onClick={() => navigate('/vendor/portfolio')}
                className="rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 px-4 py-2 text-sm font-bold font-[family-name:var(--font-ui)]"
              >
                Portfolio
              </button>
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
                className="inline-flex items-center gap-1.5 rounded-lg bg-white/15 hover:bg-white/25 border border-white/25 px-3 py-1.5 text-xs font-semibold backdrop-blur-sm transition-colors disabled:opacity-60 font-[family-name:var(--font-ui)]"
              >
                {bannerImage ? <PhotoCameraOutlined sx={{ fontSize: 16 }} /> : <AddPhotoAlternateOutlined sx={{ fontSize: 16 }} />}
                {uploading ? 'Uploading…' : bannerImage ? 'Change photo' : 'Upload banner'}
              </button>
              {bannerImage ? (
                <button
                  type="button"
                  onClick={clearBanner}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1.5 text-xs font-semibold font-[family-name:var(--font-ui)]"
                >
                  <DeleteOutline sx={{ fontSize: 16 }} />
                  Remove
                </button>
              ) : null}
            </div>
            {bannerError ? <p className="text-xs text-rose-200 font-semibold">{bannerError}</p> : null}
          </div>
        </div>
      </section>

      {/* KPI cards — couple style */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-5 md:mb-8">
        {kpis.map((kpi) => (
          <button
            key={kpi.title}
            type="button"
            onClick={() => navigate(kpi.path)}
            className="text-left rounded-2xl border border-slate-200 bg-white p-4 md:p-5 hover:border-teal-200 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">{kpi.icon}</div>
            </div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400 font-[family-name:var(--font-ui)]">{kpi.title}</p>
            <p className="font-[family-name:var(--font-display)] text-3xl font-semibold text-slate-900 mt-1">{kpi.value}</p>
            <p className="text-xs text-slate-500 mt-1 font-[family-name:var(--font-ui)]">{kpi.hint}</p>
          </button>
        ))}
      </div>

      <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden mb-5 md:mb-8">
        <div className="px-4 md:px-5 py-4 flex items-center justify-between gap-3 border-b border-slate-100">
          <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold text-slate-800">Lead Pipeline</h3>
          <button
            type="button"
            onClick={() => navigate('/vendor/leads')}
            className="text-sm font-bold text-[#0F766E] hover:text-teal-800 font-[family-name:var(--font-ui)]"
          >
            View all leads →
          </button>
        </div>

        <div className="px-4 md:px-5 py-3 flex gap-2 overflow-x-auto">
          {stages.map((stage) => {
            const active = activeStage === stage
            return (
              <button
                key={stage}
                type="button"
                onClick={() => setActiveStage(stage)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-colors font-[family-name:var(--font-ui)] ${
                  active ? 'bg-[#0F766E] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {stage} ({stageCounts[stage]})
              </button>
            )
          })}
        </div>

        <div className="overflow-x-auto hidden md:block">
          <table className="w-full text-sm min-w-[720px] font-[family-name:var(--font-ui)]">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-slate-400 border-y border-slate-100">
                <th className="px-5 py-3 font-bold">Couple</th>
                <th className="px-3 py-3 font-bold">Wedding</th>
                <th className="px-3 py-3 font-bold">Budget</th>
                <th className="px-3 py-3 font-bold">Location</th>
                <th className="px-3 py-3 font-bold">Stage</th>
                <th className="px-3 py-3 font-bold">Activity</th>
                <th className="px-5 py-3 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {visibleLeads.map((lead) => (
                <tr key={lead.couple} className="border-b border-slate-50 hover:bg-slate-50/80">
                  <td className="px-5 py-3.5 font-semibold text-slate-800">{lead.couple}</td>
                  <td className="px-3 py-3.5 text-slate-600">{lead.weddingDate}</td>
                  <td className="px-3 py-3.5 text-slate-700 font-medium">{lead.budget}</td>
                  <td className="px-3 py-3.5 text-slate-600">{lead.location}</td>
                  <td className="px-3 py-3.5">
                    <span className={`text-[10px] font-bold tracking-wide px-2 py-1 rounded-full ${stageStyles[lead.stage]}`}>
                      {lead.stage.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-3 py-3.5 text-slate-500">{lead.lastActivity}</td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        if (lead.action === 'Send Quote' || lead.action === 'Respond') {
                          setQuoteForm((f) => ({ ...f, couple: lead.couple }))
                          setQuoteOpen(true)
                        } else navigate('/vendor/leads')
                      }}
                      className="bg-[#0F766E] hover:bg-[#0D9488] text-white text-xs font-semibold px-3 py-1.5 rounded-lg"
                    >
                      {lead.action}
                    </button>
                  </td>
                </tr>
              ))}
              {visibleLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-400">
                    No leads in this stage
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="md:hidden divide-y divide-slate-100">
          {visibleLeads.length === 0 ? (
            <p className="px-4 py-8 text-center text-slate-400 text-sm">No leads in this stage</p>
          ) : (
            visibleLeads.map((lead) => (
              <div key={lead.couple} className="px-4 py-3.5 space-y-2 font-[family-name:var(--font-ui)]">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 truncate">{lead.couple}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {lead.weddingDate} · {lead.location}
                    </p>
                  </div>
                  <span className={`shrink-0 text-[10px] font-bold tracking-wide px-2 py-1 rounded-full ${stageStyles[lead.stage]}`}>
                    {lead.stage.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm text-slate-700 font-medium">{lead.budget}</p>
                  <p className="text-xs text-slate-500">{lead.lastActivity}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setQuoteForm((f) => ({ ...f, couple: lead.couple }))
                    setQuoteOpen(true)
                  }}
                  className="w-full bg-[#0F766E] hover:bg-[#0D9488] text-white text-xs font-semibold px-3 py-2 rounded-lg"
                >
                  {lead.action}
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
        <section className="bg-white border border-slate-200 rounded-2xl p-4 md:p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold text-slate-800">
              Upcoming bookings
            </h3>
            <button
              type="button"
              onClick={() => navigate('/vendor/bookings')}
              className="text-sm font-bold text-[#0F766E] font-[family-name:var(--font-ui)]"
            >
              Open bookings →
            </button>
          </div>
          <ul className="space-y-3 font-[family-name:var(--font-ui)]">
            {bookings.map((b) => (
              <li key={`${b.couple}-${b.day}`} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50">
                <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-800 flex flex-col items-center justify-center shrink-0">
                  <span className="text-[9px] font-bold tracking-wider">{b.month}</span>
                  <span className="text-lg font-bold leading-none">{b.day}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-800 truncate">{b.couple}</div>
                  <div className="text-xs text-slate-500 truncate">{b.service}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-bold text-slate-800">{b.price}</div>
                  <span className={`text-[9px] font-bold tracking-wide px-1.5 py-0.5 rounded-full ${bookingStyles[b.status]}`}>
                    {b.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-white border border-slate-200 rounded-2xl p-4 md:p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold text-slate-800">Recent messages</h3>
            <button
              type="button"
              onClick={() => navigate('/vendor/messages')}
              className="text-sm font-bold text-[#0F766E] font-[family-name:var(--font-ui)]"
            >
              Open inbox →
            </button>
          </div>
          <ul className="space-y-1 font-[family-name:var(--font-ui)]">
            {messages.map((m) => (
              <li
                key={m.name}
                className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer"
                onClick={() => navigate('/vendor/messages')}
              >
                <div className="relative shrink-0">
                  <img src={m.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                  {m.unread ? <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-teal-600 rounded-full border-2 border-white" /> : null}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-slate-800 text-sm truncate">{m.name}</span>
                    <span className="text-[11px] text-slate-400 shrink-0">{m.time}</span>
                  </div>
                  <p className={`text-xs mt-0.5 truncate ${m.unread ? 'text-slate-700 font-medium' : 'text-slate-500'}`}>{m.snippet}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Quote modal */}
      {quoteOpen ? (
        <div className="fixed inset-0 z-[1300] flex items-center justify-center p-4">
          <button type="button" className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" aria-label="Close" onClick={() => setQuoteOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl p-5 md:p-6 font-[family-name:var(--font-ui)]">
            <h3 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-slate-900">Create quote</h3>
            <p className="text-sm text-slate-500 mt-1">Draft a package estimate for a couple.</p>
            <div className="mt-4 space-y-3">
              <input
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500"
                placeholder="Couple name"
                value={quoteForm.couple}
                onChange={(e) => setQuoteForm((f) => ({ ...f, couple: e.target.value }))}
              />
              <input
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500"
                placeholder="Package (e.g. Full Day Coverage)"
                value={quoteForm.packageName}
                onChange={(e) => setQuoteForm((f) => ({ ...f, packageName: e.target.value }))}
              />
              <input
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500"
                placeholder="Amount (₦)"
                type="number"
                value={quoteForm.amount}
                onChange={(e) => setQuoteForm((f) => ({ ...f, amount: e.target.value }))}
              />
              <textarea
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500 min-h-[88px]"
                placeholder="Notes"
                value={quoteForm.notes}
                onChange={(e) => setQuoteForm((f) => ({ ...f, notes: e.target.value }))}
              />
            </div>
            <div className="mt-5 flex gap-2 justify-end">
              <button type="button" onClick={() => setQuoteOpen(false)} className="px-4 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100">
                Cancel
              </button>
              <button type="button" onClick={submitQuote} className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-[#0F766E] hover:bg-[#0D9488]">
                Save quote
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </VendorPageShell>
  )
}

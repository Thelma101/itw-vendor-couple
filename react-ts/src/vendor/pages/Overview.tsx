import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  PhotoCameraOutlined,
  DeleteOutline,
  AddPhotoAlternateOutlined,
  Star,
  ArrowForward,
  Schedule,
  Verified,
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
  priority?: boolean
}

const BANNER_KEY = 'itw_vendor_banner'

const pipelineLeads: PipelineLead[] = [
  { couple: 'Amara & Obinna', weddingDate: 'Mar 15, 2027', budget: '₦800K–₦1.2M', location: 'Lagos', stage: 'New', lastActivity: '2h ago', action: 'Reply', priority: true },
  { couple: 'Halima & Usman', weddingDate: 'Apr 22, 2027', budget: '₦1.5M–₦2M', location: 'Abuja', stage: 'Contacted', lastActivity: 'Yesterday', action: 'Send quote' },
  { couple: 'Tolu & Kayode', weddingDate: 'Jun 10, 2027', budget: '₦600K–₦900K', location: 'Lagos', stage: 'Quoted', lastActivity: '3d ago', action: 'Follow up', priority: true },
  { couple: 'Chioma & Emeka', weddingDate: 'Aug 5, 2027', budget: '₦1.2M–₦1.8M', location: 'Port Harcourt', stage: 'New', lastActivity: '5h ago', action: 'Reply' },
  { couple: 'Fatima & Ibrahim', weddingDate: 'Sep 18, 2027', budget: '₦950K–₦1.4M', location: 'Abuja', stage: 'Contacted', lastActivity: '1d ago', action: 'Send quote' },
  { couple: 'Ngozi & Chidi', weddingDate: 'Dec 2, 2027', budget: '₦2M–₦2.5M', location: 'Lagos', stage: 'Won', lastActivity: '1w ago', action: 'Open booking' },
]

const bookings = [
  { month: 'JAN', day: '28', couple: 'Bola & Segun', service: 'Full planning · Civic Centre', price: '₦450,000', status: 'DEPOSIT PAID' },
  { month: 'FEB', day: '14', couple: 'Ada & Kunle', service: 'Styling day · Lekki', price: '₦180,000', status: 'PENDING PAYMENT' },
  { month: 'MAR', day: '15', couple: 'Adaeze & Chidi', service: 'Full planning + décor direction', price: '₦675,000', status: 'CONFIRMED' },
  { month: 'MAR', day: '22', couple: 'Zainab & Musa', service: 'Traditional coordination', price: '₦320,000', status: 'DEPOSIT PAID' },
]

const messages = [
  { name: 'Amara Okonkwo', snippet: 'Can we walk the Lagos venue this weekend?', time: '12m', unread: true, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop' },
  { name: 'Usman Bello', snippet: 'Quote received — family is reviewing in Abuja.', time: '1h', unread: true, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop' },
  { name: 'Tolu Adeyemi', snippet: 'Please send the revised Lekki package.', time: 'Yesterday', unread: false, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop' },
  { name: 'Chioma Nwosu', snippet: 'Deposit landed via Paystack — receipt attached.', time: '2d', unread: false, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop' },
]

const stageStyles: Record<PipelineStage, string> = {
  New: 'bg-[#F8EFE8] text-[#9A3412]',
  Contacted: 'bg-[#EEF6F4] text-[#0F5C56]',
  Quoted: 'bg-[#F5F0E6] text-[#92400E]',
  Won: 'bg-[#E8F5EF] text-[#047857]',
  Lost: 'bg-slate-100 text-slate-600',
}

const bookingStyles: Record<string, string> = {
  'DEPOSIT PAID': 'bg-[#E8F5EF] text-[#047857]',
  'PENDING PAYMENT': 'bg-[#F5F0E6] text-[#92400E]',
  CONFIRMED: 'bg-[#EEF6F4] text-[#0F5C56]',
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
  const needsAttention = pipelineLeads.filter((l) => l.priority).length
  const winRate = Math.round((stageCounts.Won / pipelineLeads.length) * 100)

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
      showToast('Cover photo updated', 'success')
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
      showToast('Add the couple name and amount first', 'error')
      return
    }
    showToast(`Quote ready for ${quoteForm.couple.trim()}`, 'success')
    setQuoteOpen(false)
    setQuoteForm({ couple: '', packageName: '', amount: '', notes: '' })
    navigate('/vendor/leads')
  }

  return (
    <VendorPageShell bare>
      {/* Greeting row */}
      <header className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6 md:mb-8">
        <div>
          <p className="text-[11px] font-bold tracking-[0.22em] uppercase text-[#0F5C56] font-[family-name:var(--font-ui)] mb-2">
            Studio desk
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-[2.75rem] font-semibold text-[#0B2D31] leading-tight">
            {greetingForNow()}, {VENDOR_PROFILE.ownerFirstName}
          </h1>
          <p className="text-sm text-slate-500 mt-2 max-w-xl font-[family-name:var(--font-ui)]">
            {needsAttention} couples need a reply today · {unread} unread in inbox · next wedding{' '}
            <span className="font-semibold text-slate-700">Jan 28</span>
          </p>
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
            onClick={() => setQuoteOpen(true)}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#0F766E] hover:bg-[#0D9488] text-white px-5 py-2.5 text-sm font-bold font-[family-name:var(--font-ui)] cursor-pointer"
          >
            New quote
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

      {/* Editorial hero — darker, brand-forward, not a couple clone */}
      <section
        className="relative overflow-hidden rounded-2xl text-white mb-5 md:mb-7 min-h-[220px] md:min-h-[260px] shadow-lg shadow-teal-900/10"
        style={{
          backgroundImage: bannerImage
            ? `linear-gradient(120deg, rgba(11,45,49,0.78), rgba(15,118,110,0.55)), url(${bannerImage})`
            : `linear-gradient(120deg, rgba(11,45,49,0.78), rgba(15,118,110,0.55)), url(${VENDOR_PROFILE.cover})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="relative z-10 p-5 md:p-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="min-w-0 flex-1 flex items-start gap-4">
            <img
              src={VENDOR_PROFILE.avatar}
              alt=""
              className="w-[4.5rem] h-[4.5rem] md:w-24 md:h-24 rounded-2xl object-cover border-2 border-white/40 shrink-0"
            />
            <div className="min-w-0 pt-0.5">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {VENDOR_PROFILE.verified ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/15 border border-white/25 px-2.5 py-0.5 text-[10px] font-bold tracking-wide uppercase font-[family-name:var(--font-ui)]">
                    <Verified sx={{ fontSize: 14, color: '#E8C96A' }} />
                    Verified
                  </span>
                ) : null}
                <span className="rounded-full bg-white/15 border border-white/25 px-2.5 py-0.5 text-[10px] font-bold tracking-wide uppercase font-[family-name:var(--font-ui)]">
                  {VENDOR_PROFILE.category}
                </span>
              </div>
              <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-5xl font-semibold leading-[1.05] tracking-tight">
                {VENDOR_PROFILE.businessName}
              </h2>
              <p className="mt-2 text-[#E8C96A] text-sm font-[family-name:var(--font-ui)]">
                {VENDOR_PROFILE.tagline} · {VENDOR_PROFILE.location}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-[family-name:var(--font-ui)]">
                <span className="inline-flex items-center gap-1 text-white/90">
                  <Star sx={{ fontSize: 15, color: '#E8C96A' }} />
                  <strong>{VENDOR_PROFILE.rating}</strong>
                  <span className="text-white/60">({VENDOR_PROFILE.reviewCount} reviews)</span>
                </span>
                <span className="inline-flex items-center gap-1 text-white/75">
                  <Schedule sx={{ fontSize: 15 }} />
                  Usually replies {VENDOR_PROFILE.responseTime.toLowerCase()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-stretch md:items-end gap-3 shrink-0">
            <div className="grid grid-cols-3 gap-2 md:gap-3 w-full md:w-auto">
              {[
                { label: 'Pipeline', value: '24' },
                { label: 'Win rate', value: `${winRate}%` },
                { label: 'Booked', value: '8' },
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
                className="inline-flex items-center gap-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-60 font-[family-name:var(--font-ui)] cursor-pointer"
              >
                {bannerImage ? <PhotoCameraOutlined sx={{ fontSize: 16 }} /> : <AddPhotoAlternateOutlined sx={{ fontSize: 16 }} />}
                {uploading ? 'Uploading…' : bannerImage ? 'Change cover' : 'Add cover'}
              </button>
              {bannerImage ? (
                <button
                  type="button"
                  onClick={clearBanner}
                  className="inline-flex items-center gap-1.5 rounded-full bg-black/20 hover:bg-black/30 border border-white/20 px-3 py-1.5 text-xs font-semibold font-[family-name:var(--font-ui)] cursor-pointer"
                >
                  <DeleteOutline sx={{ fontSize: 16 }} />
                  Reset
                </button>
              ) : null}
            </div>
            {bannerError ? <p className="text-xs text-rose-200 font-semibold text-right">{bannerError}</p> : null}
          </div>
        </div>
      </section>

      {/* Performance strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5 md:mb-7">
        {[
          { label: 'Active leads', value: '24', hint: '+3 this week', path: '/vendor/leads' },
          { label: 'Confirmed jobs', value: '8', hint: 'Next · Jan 28', path: '/vendor/bookings' },
          { label: 'Revenue (YTD)', value: '₦3.2M', hint: 'Deposits + balances', path: '/vendor/bookings' },
          { label: 'Unread', value: String(unread), hint: 'Couples waiting', path: '/vendor/messages' },
        ].map((kpi) => (
          <button
            key={kpi.label}
            type="button"
            onClick={() => navigate(kpi.path)}
            className="text-left rounded-2xl border border-slate-200 bg-white px-4 py-4 hover:border-teal-200 hover:bg-teal-50/30 transition-colors cursor-pointer"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 font-[family-name:var(--font-ui)]">{kpi.label}</p>
            <p className="font-[family-name:var(--font-display)] text-3xl font-semibold text-slate-900 mt-1.5">{kpi.value}</p>
            <p className="text-xs text-slate-500 mt-1 font-[family-name:var(--font-ui)]">{kpi.hint}</p>
          </button>
        ))}
      </div>

      {/* Focus + pipeline */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 md:gap-5 mb-5 md:mb-7">
        <section className="xl:col-span-4 rounded-2xl bg-[#0F766E] text-white p-5 md:p-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#E8C96A] font-[family-name:var(--font-ui)]">Today</p>
          <h3 className="font-[family-name:var(--font-display)] text-2xl font-semibold mt-2">What needs you</h3>
          <ul className="mt-5 space-y-3 font-[family-name:var(--font-ui)]">
            {[
              { title: 'Reply to Amara & Obinna', detail: 'New lead · Lagos · 2h waiting', path: '/vendor/messages' },
              { title: 'Follow up Tolu & Kayode quote', detail: 'Quoted 3 days ago', path: '/vendor/leads' },
              { title: 'Collect Ada & Kunle balance', detail: 'Engagement styling · pending', path: '/vendor/bookings' },
            ].map((item) => (
              <li key={item.title}>
                <button
                  type="button"
                  onClick={() => navigate(item.path)}
                  className="w-full text-left rounded-xl border border-white/15 bg-white/10 hover:bg-white/15 px-3.5 py-3 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold">{item.title}</p>
                      <p className="text-xs text-white/70 mt-0.5">{item.detail}</p>
                    </div>
                    <ArrowForward sx={{ fontSize: 16, color: '#E8C96A', mt: '2px' }} />
                  </div>
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => navigate('/vendor/portfolio')}
            className="mt-5 w-full rounded-xl border border-white/25 py-2.5 text-sm font-bold hover:bg-white/10 cursor-pointer font-[family-name:var(--font-ui)]"
          >
            Refresh portfolio for peak season
          </button>
        </section>

        <section className="xl:col-span-8 bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="px-4 md:px-5 py-4 flex items-center justify-between gap-3 border-b border-slate-100">
            <div>
              <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[#0B2D31]">Lead pipeline</h3>
              <p className="text-xs text-slate-500 mt-0.5 font-[family-name:var(--font-ui)]">Move enquiries toward a booked date</p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/vendor/leads')}
              className="text-xs font-bold tracking-wide text-[#0F5C56] hover:underline cursor-pointer font-[family-name:var(--font-ui)]"
            >
              ALL LEADS
            </button>
          </div>

          <div className="px-4 md:px-5 py-3 flex gap-2 overflow-x-auto border-b border-slate-50">
            {stages.map((stage) => {
              const active = activeStage === stage
              return (
                <button
                  key={stage}
                  type="button"
                  onClick={() => setActiveStage(stage)}
                  className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors font-[family-name:var(--font-ui)] cursor-pointer ${
                    active ? 'bg-[#0F766E] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {stage}
                  <span className={`ml-1.5 ${active ? 'text-white/70' : 'text-slate-400'}`}>{stageCounts[stage]}</span>
                </button>
              )
            })}
          </div>

          <div className="overflow-x-auto hidden md:block">
            <table className="w-full text-sm min-w-[680px] font-[family-name:var(--font-ui)]">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-[0.14em] text-slate-400 border-b border-slate-100">
                  <th className="px-5 py-3 font-bold">Couple</th>
                  <th className="px-3 py-3 font-bold">Wedding</th>
                  <th className="px-3 py-3 font-bold">Budget</th>
                  <th className="px-3 py-3 font-bold">City</th>
                  <th className="px-3 py-3 font-bold">Stage</th>
                  <th className="px-5 py-3 font-bold text-right">Next step</th>
                </tr>
              </thead>
              <tbody>
                {visibleLeads.map((lead) => (
                  <tr key={lead.couple} className="border-b border-slate-50 hover:bg-[#FAFCFC]">
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-slate-800">{lead.couple}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{lead.lastActivity}</div>
                    </td>
                    <td className="px-3 py-3.5 text-slate-600">{lead.weddingDate}</td>
                    <td className="px-3 py-3.5 text-slate-700 font-medium">{lead.budget}</td>
                    <td className="px-3 py-3.5 text-slate-600">{lead.location}</td>
                    <td className="px-3 py-3.5">
                      <span className={`text-[10px] font-bold tracking-wide px-2 py-1 rounded-full ${stageStyles[lead.stage]}`}>
                        {lead.stage.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          if (lead.action === 'Send quote' || lead.action === 'Reply' || lead.action === 'Follow up') {
                            setQuoteForm((f) => ({ ...f, couple: lead.couple }))
                            setQuoteOpen(true)
                          } else navigate('/vendor/leads')
                        }}
                        className="bg-[#0F766E] hover:bg-[#0D9488] text-white text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer"
                      >
                        {lead.action}
                      </button>
                    </td>
                  </tr>
                ))}
                {visibleLeads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-slate-400">
                      Nothing in this stage — check New or Contacted.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          <div className="md:hidden divide-y divide-slate-100">
            {visibleLeads.length === 0 ? (
              <p className="px-4 py-8 text-center text-slate-400 text-sm">Nothing in this stage yet.</p>
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
                    <button
                      type="button"
                      onClick={() => {
                        setQuoteForm((f) => ({ ...f, couple: lead.couple }))
                        setQuoteOpen(true)
                      }}
                      className="bg-[#0F766E] text-white text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer"
                    >
                      {lead.action}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
        <section className="bg-white border border-slate-200 rounded-2xl p-4 md:p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[#0B2D31]">Upcoming weddings</h3>
              <p className="text-xs text-slate-500 mt-0.5 font-[family-name:var(--font-ui)]">Deposits, dates, and status</p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/vendor/bookings')}
              className="text-xs font-bold tracking-wide text-[#0F5C56] hover:underline cursor-pointer font-[family-name:var(--font-ui)]"
            >
              CALENDAR
            </button>
          </div>
          <ul className="space-y-2.5 font-[family-name:var(--font-ui)]">
            {bookings.map((b) => (
              <li
                key={`${b.couple}-${b.day}`}
                className="flex items-center gap-3 p-2.5 rounded-xl border border-transparent hover:border-slate-100 hover:bg-[#FAFCFC]"
              >
                <div className="w-12 h-14 rounded-xl bg-teal-50 text-teal-800 flex flex-col items-center justify-center shrink-0">
                  <span className="text-[9px] font-bold tracking-[0.14em]">{b.month}</span>
                  <span className="text-xl font-bold leading-none mt-0.5 font-[family-name:var(--font-display)]">{b.day}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-800 truncate">{b.couple}</div>
                  <div className="text-xs text-slate-500 truncate">{b.service}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-bold text-slate-800">{b.price}</div>
                  <span className={`inline-block mt-1 text-[9px] font-bold tracking-wide px-1.5 py-0.5 rounded-full ${bookingStyles[b.status]}`}>
                    {b.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-white border border-slate-200 rounded-2xl p-4 md:p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[#0B2D31]">Inbox</h3>
              <p className="text-xs text-slate-500 mt-0.5 font-[family-name:var(--font-ui)]">{unread} waiting on you</p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/vendor/messages')}
              className="text-xs font-bold tracking-wide text-[#0F5C56] hover:underline cursor-pointer font-[family-name:var(--font-ui)]"
            >
              OPEN
            </button>
          </div>
          <ul className="space-y-1 font-[family-name:var(--font-ui)]">
            {messages.map((m) => (
              <li key={m.name}>
                <button
                  type="button"
                  onClick={() => navigate('/vendor/messages')}
                  className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#FAFCFC] cursor-pointer text-left"
                >
                  <div className="relative shrink-0">
                    <img src={m.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                    {m.unread ? (
                      <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#0F5C56] rounded-full border-2 border-white" />
                    ) : null}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-slate-800 text-sm truncate">{m.name}</span>
                      <span className="text-[11px] text-slate-400 shrink-0">{m.time}</span>
                    </div>
                    <p className={`text-xs mt-0.5 truncate ${m.unread ? 'text-slate-700 font-medium' : 'text-slate-500'}`}>{m.snippet}</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {quoteOpen ? (
        <div className="fixed inset-0 z-[1300] flex items-center justify-center p-4">
          <button type="button" className="absolute inset-0 bg-slate-900/45 backdrop-blur-sm cursor-pointer" aria-label="Close" onClick={() => setQuoteOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl p-5 md:p-6 font-[family-name:var(--font-ui)]">
            <h3 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[#0B2D31]">New quote</h3>
            <p className="text-sm text-slate-500 mt-1">Send a clear package estimate before the chat goes cold.</p>
            <div className="mt-4 space-y-3">
              <input
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#0F5C56]"
                placeholder="Couple names"
                value={quoteForm.couple}
                onChange={(e) => setQuoteForm((f) => ({ ...f, couple: e.target.value }))}
              />
              <input
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#0F5C56]"
                placeholder="Package (e.g. Full planning · Traditional)"
                value={quoteForm.packageName}
                onChange={(e) => setQuoteForm((f) => ({ ...f, packageName: e.target.value }))}
              />
              <input
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#0F5C56]"
                placeholder="Amount (₦)"
                type="number"
                value={quoteForm.amount}
                onChange={(e) => setQuoteForm((f) => ({ ...f, amount: e.target.value }))}
              />
              <textarea
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#0F5C56] min-h-[88px]"
                placeholder="What’s included / next steps"
                value={quoteForm.notes}
                onChange={(e) => setQuoteForm((f) => ({ ...f, notes: e.target.value }))}
              />
            </div>
            <div className="mt-5 flex gap-2 justify-end">
              <button type="button" onClick={() => setQuoteOpen(false)} className="px-4 py-2 rounded-full text-sm font-bold text-slate-600 hover:bg-slate-100 cursor-pointer">
                Cancel
              </button>
              <button type="button" onClick={submitQuote} className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-[#0F766E] hover:bg-[#0D9488] cursor-pointer">
                Save quote
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </VendorPageShell>
  )
}

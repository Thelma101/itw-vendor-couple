import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CalendarMonth,
  Close,
  Email,
  Lock,
  LocationOn,
  PersonAdd,
  Phone,
  Search,
  TrendingUp,
} from '@mui/icons-material'
import VendorPageShell from '@/vendor/components/VendorPageShell'
import PlanBadge from '@/shared/components/PlanBadge'
import { usePlan } from '@/shared/contexts/PlanContext'
import { showToast } from '@/shared/components/SimpleToast'

type LeadStatus = 'New' | 'Contacted' | 'Quoted' | 'Negotiating'

type Lead = {
  id: string
  name: string
  email: string
  emailFull: string
  phone: string
  phoneFull: string
  date: string
  location: string
  status: LeadStatus
  isUnlocked: boolean
  matchScore: number
  budget: string
}

const initialLeads: Lead[] = [
  {
    id: 'L1',
    name: 'Amara & Obinna',
    email: 'amara.o***@gmail.com',
    emailFull: 'amara.obinna@gmail.com',
    phone: '+234 803 *** ****',
    phoneFull: '+234 803 112 4455',
    date: 'Mar 15, 2027',
    location: 'Lagos',
    status: 'New',
    isUnlocked: false,
    matchScore: 92,
    budget: '₦800K–₦1.2M',
  },
  {
    id: 'L2',
    name: 'Halima & Usman',
    email: 'halima.u***@yahoo.com',
    emailFull: 'halima.usman@yahoo.com',
    phone: '+234 812 *** ****',
    phoneFull: '+234 812 334 7788',
    date: 'Apr 22, 2027',
    location: 'Abuja',
    status: 'New',
    isUnlocked: false,
    matchScore: 85,
    budget: '₦1.5M–₦2M',
  },
  {
    id: 'L3',
    name: 'Tolu & Kayode',
    email: 'tolu.k@gmail.com',
    emailFull: 'tolu.k@gmail.com',
    phone: '+234 809 123 4567',
    phoneFull: '+234 809 123 4567',
    date: 'Jun 10, 2027',
    location: 'Port Harcourt',
    status: 'Quoted',
    isUnlocked: true,
    matchScore: 78,
    budget: '₦600K–₦900K',
  },
  {
    id: 'L4',
    name: 'Chioma & Emeka',
    email: 'chioma.e***@gmail.com',
    emailFull: 'chioma.emeka@gmail.com',
    phone: '+234 701 *** ****',
    phoneFull: '+234 701 555 9090',
    date: 'Aug 5, 2027',
    location: 'Lagos',
    status: 'Contacted',
    isUnlocked: false,
    matchScore: 88,
    budget: '₦1.2M–₦1.8M',
  },
]

const statusStyle: Record<LeadStatus, string> = {
  New: 'bg-rose-50 text-rose-700',
  Contacted: 'bg-sky-50 text-sky-700',
  Quoted: 'bg-amber-50 text-amber-800',
  Negotiating: 'bg-teal-50 text-teal-800',
}

export default function Leads() {
  const navigate = useNavigate()
  const { isPremium, leadUnlocksRemaining, leadUnlockCap, consumeLeadUnlock } = usePlan()
  const [leads, setLeads] = useState<Lead[]>(initialLeads)
  const [filter, setFilter] = useState<'All' | LeadStatus>('All')
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [detail, setDetail] = useState<Lead | null>(null)
  const [form, setForm] = useState({ name: '', email: '', phone: '', date: '', location: '', budget: '' })

  const counts = useMemo(() => {
    const c = { All: leads.length, New: 0, Contacted: 0, Quoted: 0, Negotiating: 0 } as Record<'All' | LeadStatus, number>
    leads.forEach((l) => {
      c[l.status] += 1
    })
    return c
  }, [leads])

  const visible = leads.filter((l) => {
    if (filter !== 'All' && l.status !== filter) return false
    const q = search.toLowerCase()
    if (!q) return true
    return l.name.toLowerCase().includes(q) || l.location.toLowerCase().includes(q)
  })

  const unlockLead = (id: string) => {
    const target = leads.find((l) => l.id === id)
    if (!target || target.isUnlocked) return
    if (!isPremium && !consumeLeadUnlock()) {
      showToast('Free plan includes 5 unlocks/month (plus referral bonuses). Buy a boost for more visibility.', 'error')
      navigate('/vendor/subscription')
      return
    }
    setLeads((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, isUnlocked: true, email: l.emailFull, phone: l.phoneFull, status: l.status === 'New' ? 'Contacted' : l.status } : l,
      ),
    )
    setDetail((d) =>
      d && d.id === id
        ? { ...d, isUnlocked: true, email: d.emailFull, phone: d.phoneFull, status: d.status === 'New' ? 'Contacted' : d.status }
        : d,
    )
    showToast('Contact unlocked', 'success')
  }

  const addLead = () => {
    if (!form.name.trim()) {
      showToast('Couple name required', 'error')
      return
    }
    const lead: Lead = {
      id: `L${Date.now()}`,
      name: form.name.trim(),
      email: form.email || '—',
      emailFull: form.email || '—',
      phone: form.phone || '—',
      phoneFull: form.phone || '—',
      date: form.date || 'TBD',
      location: form.location || 'Lagos',
      status: 'New',
      isUnlocked: true,
      matchScore: 70,
      budget: form.budget || 'TBD',
    }
    setLeads((prev) => [lead, ...prev])
    setModalOpen(false)
    setForm({ name: '', email: '', phone: '', date: '', location: '', budget: '' })
    showToast('Lead added', 'success')
  }

  return (
    <VendorPageShell
      title="Leads"
      subtitle="Inbound couple interest — unlock contacts within your plan limits, then move them toward a quote."
      badge={`${counts.New} new`}
      actions={
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 bg-[#0F766E] hover:bg-[#0D9488] text-white px-5 py-2.5 rounded-xl font-bold font-[family-name:var(--font-ui)] w-full sm:w-auto"
        >
          <PersonAdd fontSize="small" />
          Add lead
        </button>
      }
    >
      <div className="flex flex-wrap items-center gap-2 mb-4 font-[family-name:var(--font-ui)]">
        <PlanBadge />
        <span className="text-xs text-slate-500">
          {isPremium
            ? 'Unlimited lead unlocks on Professional / Enterprise.'
            : `${Number.isFinite(leadUnlocksRemaining) ? leadUnlocksRemaining : 0} of ${leadUnlockCap} Starter unlocks left this month.`}
        </span>
        {!isPremium ? (
          <button type="button" onClick={() => navigate('/vendor/subscription')} className="text-xs font-bold text-amber-700 hover:underline">
            View plans
          </button>
        ) : null}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4 font-[family-name:var(--font-ui)]">
        <div className="flex gap-1.5 overflow-x-auto pb-1 flex-1">
          {(['All', 'New', 'Contacted', 'Quoted', 'Negotiating'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setFilter(t)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold border ${
                filter === t ? 'bg-[#0F766E] text-white border-[#0F766E]' : 'bg-white text-slate-600 border-slate-200'
              }`}
            >
              {t} · {counts[t]}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" sx={{ fontSize: 18 }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search couples or city…"
            className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-teal-500 bg-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-[family-name:var(--font-ui)]">
        {visible.map((lead) => (
          <article key={lead.id} className="rounded-2xl border border-slate-200 bg-white p-4 hover:border-teal-200 transition-colors">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold text-slate-900">{lead.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{lead.id}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={`text-[10px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-full ${statusStyle[lead.status]}`}>
                  {lead.status}
                </span>
                <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-[#0F766E]">
                  <TrendingUp sx={{ fontSize: 12 }} />
                  {lead.matchScore}% match
                </span>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-slate-600">
              <p className="flex items-center gap-1.5 truncate">
                <CalendarMonth sx={{ fontSize: 16, color: '#94a3b8' }} />
                {lead.date}
              </p>
              <p className="flex items-center gap-1.5 truncate">
                <LocationOn sx={{ fontSize: 16, color: '#94a3b8' }} />
                {lead.location}
              </p>
              <p className="col-span-2 text-xs font-semibold text-slate-500">Budget {lead.budget}</p>
            </div>

            <div className="mt-3 rounded-xl bg-slate-50 border border-slate-100 p-3 space-y-1.5 text-sm">
              <p className="flex items-center gap-2 text-slate-600">
                <Email sx={{ fontSize: 16, color: '#94a3b8' }} />
                {lead.email}
                {!lead.isUnlocked ? <Lock sx={{ fontSize: 14, color: '#94a3b8' }} /> : null}
              </p>
              <p className="flex items-center gap-2 text-slate-600">
                <Phone sx={{ fontSize: 16, color: '#94a3b8' }} />
                {lead.phone}
              </p>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {!lead.isUnlocked ? (
                <button
                  type="button"
                  onClick={() => unlockLead(lead.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold text-white bg-[#0F766E] hover:bg-[#0D9488]"
                >
                  <Lock sx={{ fontSize: 14 }} />
                  Unlock contact
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => navigate('/vendor/messages')}
                  className="px-3 py-2 rounded-xl text-sm font-bold text-[#0F766E] border border-teal-200 hover:bg-teal-50"
                >
                  Message
                </button>
              )}
              <button
                type="button"
                onClick={() => setDetail(lead)}
                className="px-3 py-2 rounded-xl text-sm font-bold text-slate-600 border border-slate-200 hover:bg-slate-50"
              >
                Details
              </button>
            </div>
          </article>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-14 text-center font-[family-name:var(--font-ui)]">
          <p className="font-bold text-slate-700">No leads here</p>
          <button type="button" onClick={() => setModalOpen(true)} className="mt-2 text-sm font-bold text-[#0F766E]">
            Add a lead manually
          </button>
        </div>
      ) : null}

      {detail ? (
        <div className="fixed inset-0 z-[1300] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <button type="button" className="absolute inset-0 bg-slate-900/40" aria-label="Close" onClick={() => setDetail(null)} />
          <div className="relative w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl p-5 border border-slate-200 shadow-2xl font-[family-name:var(--font-ui)]">
            <div className="flex justify-between gap-2">
              <h3 className="font-[family-name:var(--font-display)] text-2xl font-semibold">{detail.name}</h3>
              <button type="button" onClick={() => setDetail(null)} className="p-1.5 rounded-lg hover:bg-slate-100" aria-label="Close">
                <Close fontSize="small" />
              </button>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              {detail.date} · {detail.location} · {detail.budget}
            </p>
            <div className="mt-4 space-y-2 text-sm">
              <p>
                Email: <span className="font-semibold">{detail.isUnlocked ? detail.emailFull : detail.email}</span>
              </p>
              <p>
                Phone: <span className="font-semibold">{detail.isUnlocked ? detail.phoneFull : detail.phone}</span>
              </p>
              <p>
                Match: <span className="font-semibold text-[#0F766E]">{detail.matchScore}%</span>
              </p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {(['New', 'Contacted', 'Quoted', 'Negotiating'] as LeadStatus[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    setLeads((prev) => prev.map((l) => (l.id === detail.id ? { ...l, status: s } : l)))
                    setDetail({ ...detail, status: s })
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold ${detail.status === s ? 'bg-[#0F766E] text-white' : 'bg-slate-100 text-slate-600'}`}
                >
                  {s}
                </button>
              ))}
            </div>
            {!detail.isUnlocked ? (
              <button
                type="button"
                onClick={() => unlockLead(detail.id)}
                className="mt-4 w-full py-2.5 rounded-xl font-bold text-white bg-[#0F766E]"
              >
                Unlock contact
              </button>
            ) : null}
          </div>
        </div>
      ) : null}

      {modalOpen ? (
        <div className="fixed inset-0 z-[1300] flex items-center justify-center p-4">
          <button type="button" className="absolute inset-0 bg-slate-900/40" aria-label="Close" onClick={() => setModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl border border-slate-200 p-5 shadow-2xl font-[family-name:var(--font-ui)]">
            <h3 className="font-[family-name:var(--font-display)] text-2xl font-semibold">Add lead</h3>
            <div className="mt-4 space-y-3">
              {(['name', 'email', 'phone', 'date', 'location', 'budget'] as const).map((key) => (
                <input
                  key={key}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500"
                  placeholder={key === 'name' ? 'Couple name' : key.charAt(0).toUpperCase() + key.slice(1)}
                  value={form[key]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                />
              ))}
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-xl text-sm font-bold text-slate-600">
                Cancel
              </button>
              <button type="button" onClick={addLead} className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-[#0F766E]">
                Save
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </VendorPageShell>
  )
}

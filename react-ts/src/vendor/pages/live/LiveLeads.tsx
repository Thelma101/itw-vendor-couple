import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarMonth, Close, Email, Groups, LocationOn, Lock, PersonAdd, Phone, Search } from '@mui/icons-material'
import VendorPageShell from '@/vendor/components/VendorPageShell'
import { EmptyState, ErrorBanner, LoadingBlock } from '@/vendor/components/LiveState'
import PlanBadge from '@/shared/components/PlanBadge'
import { usePlan } from '@/shared/contexts/PlanContext'
import { showToast } from '@/shared/components/SimpleToast'
import { apiErrorMessage, inquiriesApi, type Inquiry, type InquiryStatus } from '@/shared/lib/api'
import { scopedKey } from '@/shared/lib/session'
import { activePackages, useVendorServices } from '@/shared/lib/vendorServices'
import { formatEventDate, naira, openThreadWithCouple, timeAgo, useInquiries } from '@/vendor/lib/live'

type Filter = 'Open' | 'New' | 'Contacted' | 'Quoted' | 'Closed'

const FILTERS: Filter[] = ['Open', 'New', 'Contacted', 'Quoted', 'Closed']
const OPEN = new Set<InquiryStatus>(['new', 'contacted', 'quoted'])
const CLOSED = new Set<InquiryStatus>(['declined', 'cancelled'])

const statusStyle: Record<string, string> = {
  new: 'bg-rose-50 text-rose-700',
  contacted: 'bg-sky-50 text-sky-700',
  quoted: 'bg-amber-50 text-amber-800',
  declined: 'bg-slate-100 text-slate-500',
  cancelled: 'bg-slate-100 text-slate-500',
}

const UNLOCKED_KEY = 'itw_unlocked_leads'

function readUnlocked(): string[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(scopedKey(UNLOCKED_KEY)) || '[]') as unknown
    return Array.isArray(parsed) ? parsed.map(String) : []
  } catch {
    return []
  }
}

function matchesFilter(lead: Inquiry, filter: Filter) {
  if (filter === 'Open') return OPEN.has(lead.status)
  if (filter === 'Closed') return CLOSED.has(lead.status)
  return lead.status === filter.toLowerCase()
}

const inputCls = 'w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500'

export default function LiveLeads() {
  const navigate = useNavigate()
  const { isPremium, leadUnlocksRemaining, leadUnlockCap, consumeLeadUnlock } = usePlan()
  const { items, setItems, loading, error, reload } = useInquiries('inquiry')
  const { data: services } = useVendorServices()
  const packages = activePackages(services)
  const [filter, setFilter] = useState<Filter>('Open')
  const [search, setSearch] = useState('')
  const [unlocked, setUnlocked] = useState<string[]>(() => readUnlocked())
  const [detail, setDetail] = useState<Inquiry | null>(null)
  const [notes, setNotes] = useState('')
  const [confirming, setConfirming] = useState<Inquiry | null>(null)
  const [confirmForm, setConfirmForm] = useState({ packageName: '', amount: '' })
  const [busyId, setBusyId] = useState<string | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const [form, setForm] = useState({ coupleName: '', coupleEmail: '', couplePhone: '', eventDate: '', location: '', budget: '', notes: '' })

  const leads = useMemo(() => items.filter((i) => i.status !== 'confirmed' && i.status !== 'completed'), [items])

  const counts = useMemo(() => {
    const c = { Open: 0, New: 0, Contacted: 0, Quoted: 0, Closed: 0 } as Record<Filter, number>
    for (const lead of leads) {
      for (const f of FILTERS) if (matchesFilter(lead, f)) c[f] += 1
    }
    return c
  }, [leads])

  const visible = leads.filter((l) => {
    if (!matchesFilter(l, filter)) return false
    const q = search.trim().toLowerCase()
    if (!q) return true
    return l.coupleName.toLowerCase().includes(q) || (l.location || '').toLowerCase().includes(q)
  })

  const canSeeContact = (lead: Inquiry) => isPremium || lead.source === 'vendor' || unlocked.includes(lead.id)

  const replaceLead = (updated: Inquiry) => {
    setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)))
    setDetail((d) => (d && d.id === updated.id ? updated : d))
  }

  const unlockLead = (lead: Inquiry) => {
    if (canSeeContact(lead)) return
    if (!consumeLeadUnlock()) {
      showToast('You have used this month’s free unlocks. Upgrade or buy a boost for more.', 'error')
      navigate('/vendor/subscription')
      return
    }
    const next = [...unlocked, lead.id]
    localStorage.setItem(scopedKey(UNLOCKED_KEY), JSON.stringify(next))
    setUnlocked(next)
    showToast('Contact details unlocked', 'success')
  }

  const setStatus = async (lead: Inquiry, status: InquiryStatus) => {
    setBusyId(lead.id)
    try {
      replaceLead(await inquiriesApi.update(lead.id, { status }))
      showToast(status === 'declined' ? 'Lead declined' : `Marked ${status}`, 'success')
    } catch (err) {
      showToast(apiErrorMessage(err, 'Could not update this lead'), 'error')
    } finally {
      setBusyId(null)
    }
  }

  const messageCouple = async (lead: Inquiry) => {
    if (!lead.coupleId) return
    setBusyId(lead.id)
    try {
      const threadId = await openThreadWithCouple(lead.coupleId)
      if (lead.status === 'new') void inquiriesApi.update(lead.id, { status: 'contacted' }).then(replaceLead).catch(() => undefined)
      navigate(`/vendor/messages?thread=${encodeURIComponent(threadId)}`)
    } catch (err) {
      showToast(apiErrorMessage(err, 'Could not open the conversation'), 'error')
    } finally {
      setBusyId(null)
    }
  }

  const openConfirm = (lead: Inquiry) => {
    const pkg = packages.find((p) => p.name === lead.packageName)
    setConfirmForm({
      packageName: lead.packageName || '',
      amount: String(lead.amount || pkg?.price || lead.budget || ''),
    })
    setConfirming(lead)
  }

  const submitConfirm = async () => {
    if (!confirming) return
    setBusyId(confirming.id)
    try {
      await inquiriesApi.update(confirming.id, {
        status: 'confirmed',
        kind: 'booking',
        packageName: confirmForm.packageName.trim(),
        amount: Number(confirmForm.amount) || 0,
      })
      setItems((prev) => prev.filter((i) => i.id !== confirming.id))
      setConfirming(null)
      setDetail(null)
      showToast('Booking confirmed — the couple has been notified', 'success')
    } catch (err) {
      showToast(apiErrorMessage(err, 'Could not confirm this booking'), 'error')
    } finally {
      setBusyId(null)
    }
  }

  const saveNotes = async () => {
    if (!detail) return
    setBusyId(detail.id)
    try {
      replaceLead(await inquiriesApi.update(detail.id, { notes: notes.trim() }))
      showToast('Notes saved', 'success')
    } catch (err) {
      showToast(apiErrorMessage(err, 'Could not save notes'), 'error')
    } finally {
      setBusyId(null)
    }
  }

  const removeLead = async (lead: Inquiry) => {
    setBusyId(lead.id)
    try {
      await inquiriesApi.remove(lead.id)
      setItems((prev) => prev.filter((i) => i.id !== lead.id))
      setDetail(null)
      showToast('Lead removed', 'info')
    } catch (err) {
      showToast(apiErrorMessage(err, 'Could not remove this lead'), 'error')
    } finally {
      setBusyId(null)
    }
  }

  const addLead = async () => {
    if (!form.coupleName.trim()) {
      showToast('Couple name required', 'error')
      return
    }
    setBusyId('new')
    try {
      const created = await inquiriesApi.createManual({
        kind: 'inquiry',
        status: 'new',
        coupleName: form.coupleName.trim(),
        coupleEmail: form.coupleEmail.trim() || undefined,
        couplePhone: form.couplePhone.trim() || undefined,
        eventDate: form.eventDate || undefined,
        location: form.location.trim() || undefined,
        budget: Number(form.budget) || undefined,
        notes: form.notes.trim() || undefined,
      })
      setItems((prev) => [created, ...prev])
      setAddOpen(false)
      setFilter('Open')
      setForm({ coupleName: '', coupleEmail: '', couplePhone: '', eventDate: '', location: '', budget: '', notes: '' })
      showToast('Lead added', 'success')
    } catch (err) {
      showToast(apiErrorMessage(err, 'Could not add this lead'), 'error')
    } finally {
      setBusyId(null)
    }
  }

  const contactBlock = (lead: Inquiry) => {
    const visibleContact = canSeeContact(lead)
    const hasContact = !!(lead.coupleEmail || lead.couplePhone)
    if (!hasContact) return null
    return (
      <div className="mt-3 rounded-xl bg-slate-50 border border-slate-100 p-3 space-y-1.5 text-sm">
        {visibleContact ? (
          <>
            {lead.coupleEmail ? (
              <p className="flex items-center gap-2 text-slate-600 break-all">
                <Email sx={{ fontSize: 16, color: '#94a3b8' }} />
                {lead.coupleEmail}
              </p>
            ) : null}
            {lead.couplePhone ? (
              <p className="flex items-center gap-2 text-slate-600">
                <Phone sx={{ fontSize: 16, color: '#94a3b8' }} />
                {lead.couplePhone}
              </p>
            ) : null}
          </>
        ) : (
          <p className="flex items-center gap-2 text-slate-500">
            <Lock sx={{ fontSize: 16, color: '#94a3b8' }} />
            Contact details hidden — unlock to see email and phone
          </p>
        )}
      </div>
    )
  }

  return (
    <VendorPageShell
      title="Leads"
      subtitle="Couples who enquired about your services. Reply in Messages, then confirm the booking."
      badge={`${counts.New} new`}
      actions={
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="inline-flex items-center justify-center gap-2 bg-[#0F766E] hover:bg-[#0D9488] text-white px-5 py-2.5 rounded-xl font-bold font-[family-name:var(--font-ui)] w-full sm:w-auto cursor-pointer"
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
            ? 'Unlimited contact unlocks on your plan.'
            : `${Number.isFinite(leadUnlocksRemaining) ? leadUnlocksRemaining : 0} of ${leadUnlockCap} contact unlocks left this month. Replying in Messages is always free.`}
        </span>
        {!isPremium ? (
          <button type="button" onClick={() => navigate('/vendor/subscription')} className="text-xs font-bold text-amber-700 hover:underline cursor-pointer">
            View plans
          </button>
        ) : null}
      </div>

      {error ? <ErrorBanner message={error} onRetry={() => void reload()} /> : null}

      {loading && !items.length ? (
        <LoadingBlock label="Loading your leads…" />
      ) : leads.length === 0 ? (
        <EmptyState
          icon={<Groups sx={{ fontSize: 40 }} />}
          title="No leads yet"
          body="When couples enquire from your public profile they’ll show up here. Complete your profile and publish a package so couples can find you."
          actions={[
            { label: 'Complete profile', to: '/vendor/account' },
            { label: 'Add a package', to: '/vendor/services' },
            { label: 'Add a lead manually', onClick: () => setAddOpen(true) },
          ]}
        />
      ) : (
        <>
          <div className="flex flex-col sm:flex-row gap-3 mb-4 font-[family-name:var(--font-ui)]">
            <div className="flex gap-1.5 overflow-x-auto pb-1 flex-1">
              {FILTERS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFilter(t)}
                  className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold border cursor-pointer ${
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
            {visible.map((lead) => {
              const busy = busyId === lead.id
              const open = OPEN.has(lead.status)
              return (
                <article key={lead.id} className="rounded-2xl border border-slate-200 bg-white p-4 hover:border-teal-200 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold text-slate-900 truncate">
                        {lead.coupleName || 'Couple'}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {lead.source === 'vendor' ? 'Added by you' : 'Enquired'} · {timeAgo(lead.createdAt)}
                      </p>
                    </div>
                    <span className={`shrink-0 text-[10px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-full ${statusStyle[lead.status] || 'bg-slate-100 text-slate-600'}`}>
                      {lead.status}
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-slate-600">
                    <p className="flex items-center gap-1.5 truncate">
                      <CalendarMonth sx={{ fontSize: 16, color: '#94a3b8' }} />
                      {formatEventDate(lead.eventDate)}
                    </p>
                    <p className="flex items-center gap-1.5 truncate">
                      <LocationOn sx={{ fontSize: 16, color: '#94a3b8' }} />
                      {lead.location || 'Location TBC'}
                    </p>
                    {lead.budget || lead.guestCount || lead.packageName ? (
                      <p className="col-span-2 text-xs font-semibold text-slate-500">
                        {[
                          lead.budget ? `Budget ${naira(lead.budget)}` : '',
                          lead.guestCount ? `${lead.guestCount} guests` : '',
                          lead.packageName ? `Interested in ${lead.packageName}` : '',
                        ]
                          .filter(Boolean)
                          .join(' · ')}
                      </p>
                    ) : null}
                  </div>

                  {lead.message ? <p className="mt-3 text-sm text-slate-600 line-clamp-3 whitespace-pre-line">“{lead.message}”</p> : null}

                  {contactBlock(lead)}

                  <div className="mt-3 flex flex-wrap gap-2">
                    {lead.coupleId && lead.source === 'couple' ? (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void messageCouple(lead)}
                        className="px-3 py-2 rounded-xl text-sm font-bold text-white bg-[#0F766E] hover:bg-[#0D9488] disabled:opacity-60 cursor-pointer"
                      >
                        Message
                      </button>
                    ) : null}
                    {!canSeeContact(lead) && (lead.coupleEmail || lead.couplePhone) ? (
                      <button
                        type="button"
                        onClick={() => unlockLead(lead)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold text-[#0F766E] border border-teal-200 hover:bg-teal-50 cursor-pointer"
                      >
                        <Lock sx={{ fontSize: 14 }} />
                        Unlock contact
                      </button>
                    ) : null}
                    {open ? (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => openConfirm(lead)}
                        className="px-3 py-2 rounded-xl text-sm font-bold text-emerald-700 border border-emerald-200 hover:bg-emerald-50 disabled:opacity-60 cursor-pointer"
                      >
                        Confirm booking
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => {
                        setDetail(lead)
                        setNotes(lead.notes || '')
                      }}
                      className="px-3 py-2 rounded-xl text-sm font-bold text-slate-600 border border-slate-200 hover:bg-slate-50 cursor-pointer"
                    >
                      Details
                    </button>
                    {open ? (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void setStatus(lead, 'declined')}
                        className="px-3 py-2 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50 disabled:opacity-60 ml-auto cursor-pointer"
                      >
                        Decline
                      </button>
                    ) : null}
                  </div>
                </article>
              )
            })}
          </div>

          {visible.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-12 text-center font-[family-name:var(--font-ui)]">
              <p className="font-bold text-slate-700">No leads in this view</p>
              <button type="button" onClick={() => setFilter('Open')} className="mt-2 text-sm font-bold text-[#0F766E] cursor-pointer">
                Show open leads
              </button>
            </div>
          ) : null}
        </>
      )}

      {detail ? (
        <div className="fixed inset-0 z-[1300] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <button type="button" className="absolute inset-0 bg-slate-900/40" aria-label="Close" onClick={() => setDetail(null)} />
          <div className="relative w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl p-5 border border-slate-200 shadow-2xl font-[family-name:var(--font-ui)] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between gap-2">
              <h3 className="font-[family-name:var(--font-display)] text-2xl font-semibold">{detail.coupleName || 'Couple'}</h3>
              <button type="button" onClick={() => setDetail(null)} className="p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer" aria-label="Close">
                <Close fontSize="small" />
              </button>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              {[formatEventDate(detail.eventDate), detail.location, detail.budget ? `Budget ${naira(detail.budget)}` : '', detail.guestCount ? `${detail.guestCount} guests` : '']
                .filter(Boolean)
                .join(' · ')}
            </p>
            {detail.message ? (
              <p className="mt-4 text-sm text-slate-700 whitespace-pre-line rounded-xl bg-slate-50 border border-slate-100 p-3">{detail.message}</p>
            ) : null}
            {contactBlock(detail)}
            {OPEN.has(detail.status) ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {(['new', 'contacted', 'quoted'] as InquiryStatus[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    disabled={busyId === detail.id}
                    onClick={() => void setStatus(detail, s)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize cursor-pointer ${
                      detail.status === s ? 'bg-[#0F766E] text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            ) : (
              <button
                type="button"
                disabled={busyId === detail.id}
                onClick={() => void setStatus(detail, 'new')}
                className="mt-4 text-sm font-bold text-[#0F766E] cursor-pointer"
              >
                Reopen lead
              </button>
            )}
            <label className="block mt-4 text-xs font-bold text-slate-500 uppercase tracking-wide">Private notes</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Only you can see these"
              className={`${inputCls} mt-1 resize-none`}
            />
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                disabled={busyId === detail.id || notes.trim() === (detail.notes || '').trim()}
                onClick={() => void saveNotes()}
                className="px-3 py-2 rounded-xl text-sm font-bold text-slate-700 border border-slate-200 hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
              >
                Save notes
              </button>
              {OPEN.has(detail.status) ? (
                <button
                  type="button"
                  onClick={() => openConfirm(detail)}
                  className="px-3 py-2 rounded-xl text-sm font-bold text-white bg-[#0F766E] hover:bg-[#0D9488] cursor-pointer"
                >
                  Confirm booking
                </button>
              ) : null}
              {detail.source === 'vendor' ? (
                <button
                  type="button"
                  disabled={busyId === detail.id}
                  onClick={() => void removeLead(detail)}
                  className="px-3 py-2 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50 ml-auto cursor-pointer"
                >
                  Delete
                </button>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      {confirming ? (
        <div className="fixed inset-0 z-[1350] flex items-center justify-center p-4">
          <button type="button" className="absolute inset-0 bg-slate-900/40" aria-label="Close" onClick={() => setConfirming(null)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl border border-slate-200 p-5 shadow-2xl font-[family-name:var(--font-ui)]">
            <h3 className="font-[family-name:var(--font-display)] text-2xl font-semibold">Confirm booking</h3>
            <p className="text-sm text-slate-500 mt-1">
              {confirming.coupleName || 'This couple'} moves to Bookings{confirming.source === 'couple' ? ' and gets notified' : ''}.
            </p>
            <div className="mt-4 space-y-3">
              {packages.length ? (
                <select
                  className={`${inputCls} bg-white`}
                  value={packages.some((p) => p.name === confirmForm.packageName) ? confirmForm.packageName : ''}
                  onChange={(e) => {
                    const pkg = packages.find((p) => p.name === e.target.value)
                    setConfirmForm((f) => ({ packageName: e.target.value, amount: pkg ? String(pkg.price) : f.amount }))
                  }}
                >
                  <option value="">Choose a package (optional)</option>
                  {packages.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name} — {naira(p.price)}
                    </option>
                  ))}
                </select>
              ) : null}
              <input
                className={inputCls}
                placeholder="Package or service"
                value={confirmForm.packageName}
                onChange={(e) => setConfirmForm((f) => ({ ...f, packageName: e.target.value }))}
              />
              <input
                className={inputCls}
                placeholder="Agreed amount (₦)"
                type="number"
                min={0}
                value={confirmForm.amount}
                onChange={(e) => setConfirmForm((f) => ({ ...f, amount: e.target.value }))}
              />
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setConfirming(null)} className="px-4 py-2 rounded-xl text-sm font-bold text-slate-600 cursor-pointer">
                Cancel
              </button>
              <button
                type="button"
                disabled={busyId === confirming.id}
                onClick={() => void submitConfirm()}
                className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-[#0F766E] disabled:opacity-60 cursor-pointer"
              >
                {busyId === confirming.id ? 'Confirming…' : 'Confirm booking'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {addOpen ? (
        <div className="fixed inset-0 z-[1300] flex items-center justify-center p-4">
          <button type="button" className="absolute inset-0 bg-slate-900/40" aria-label="Close" onClick={() => setAddOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl border border-slate-200 p-5 shadow-2xl font-[family-name:var(--font-ui)] max-h-[90vh] overflow-y-auto">
            <h3 className="font-[family-name:var(--font-display)] text-2xl font-semibold">Add lead</h3>
            <p className="text-sm text-slate-500 mt-1">For enquiries that came in by phone, WhatsApp or in person.</p>
            <div className="mt-4 space-y-3">
              <input className={inputCls} placeholder="Couple name" value={form.coupleName} onChange={(e) => setForm((f) => ({ ...f, coupleName: e.target.value }))} />
              <input className={inputCls} placeholder="Email (optional)" type="email" value={form.coupleEmail} onChange={(e) => setForm((f) => ({ ...f, coupleEmail: e.target.value }))} />
              <input className={inputCls} placeholder="Phone (optional)" value={form.couplePhone} onChange={(e) => setForm((f) => ({ ...f, couplePhone: e.target.value }))} />
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                Event date
                <input className={`${inputCls} mt-1 normal-case font-normal`} type="date" value={form.eventDate} onChange={(e) => setForm((f) => ({ ...f, eventDate: e.target.value }))} />
              </label>
              <input className={inputCls} placeholder="Location" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} />
              <input className={inputCls} placeholder="Budget (₦)" type="number" min={0} value={form.budget} onChange={(e) => setForm((f) => ({ ...f, budget: e.target.value }))} />
              <textarea className={`${inputCls} resize-none`} rows={3} placeholder="Notes" value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setAddOpen(false)} className="px-4 py-2 rounded-xl text-sm font-bold text-slate-600 cursor-pointer">
                Cancel
              </button>
              <button
                type="button"
                disabled={busyId === 'new'}
                onClick={() => void addLead()}
                className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-[#0F766E] disabled:opacity-60 cursor-pointer"
              >
                {busyId === 'new' ? 'Saving…' : 'Save lead'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </VendorPageShell>
  )
}

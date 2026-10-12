import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CalendarMonth, Cancel, CheckCircle, Close, Email, EventAvailable, LocationOn, Phone, Search } from '@mui/icons-material'
import VendorPageShell from '@/vendor/components/VendorPageShell'
import { EmptyState, ErrorBanner, LoadingBlock } from '@/vendor/components/LiveState'
import { showToast } from '@/shared/components/SimpleToast'
import { apiErrorMessage, inquiriesApi, type Inquiry, type InquiryStatus } from '@/shared/lib/api'
import { activePackages, useVendorServices } from '@/shared/lib/vendorServices'
import { formatEventDate, isUpcoming, naira, openThreadWithCouple, useInquiries } from '@/vendor/lib/live'

type Tab = 'All' | 'Upcoming' | 'Confirmed' | 'Completed' | 'Cancelled'

const TABS: Tab[] = ['All', 'Upcoming', 'Confirmed', 'Completed', 'Cancelled']
const MANAGE_STATUSES: InquiryStatus[] = ['confirmed', 'completed', 'cancelled']

const statusStyle: Record<string, string> = {
  confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  completed: 'bg-teal-50 text-teal-800 border-teal-100',
  cancelled: 'bg-rose-50 text-rose-700 border-rose-100',
  declined: 'bg-rose-50 text-rose-700 border-rose-100',
}

const statusIcon: Record<string, ReactNode> = {
  confirmed: <CheckCircle sx={{ fontSize: 14 }} />,
  completed: <CheckCircle sx={{ fontSize: 14 }} />,
  cancelled: <Cancel sx={{ fontSize: 14 }} />,
  declined: <Cancel sx={{ fontSize: 14 }} />,
}

function matchesTab(b: Inquiry, tab: Tab) {
  if (tab === 'All') return true
  if (tab === 'Upcoming') return b.status === 'confirmed' && isUpcoming(b.eventDate)
  if (tab === 'Cancelled') return b.status === 'cancelled' || b.status === 'declined'
  return b.status === tab.toLowerCase()
}

const inputCls = 'w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500'
const blankForm = { coupleName: '', eventDate: '', packageName: '', amount: '', location: '', coupleEmail: '', couplePhone: '', notes: '' }

export default function LiveBookings() {
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const { items, setItems, loading, error, reload } = useInquiries('booking')
  const { data: services } = useVendorServices()
  const packages = activePackages(services)
  const [tab, setTab] = useState<Tab>('All')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Inquiry | null>(null)
  const [notes, setNotes] = useState('')
  const [busy, setBusy] = useState(false)
  const [addOpen, setAddOpen] = useState(() => params.get('add') === '1')
  const [form, setForm] = useState(blankForm)

  const sorted = useMemo(
    () =>
      [...items].sort((a, b) => {
        const da = new Date(a.eventDate).getTime() || Number.MAX_SAFE_INTEGER
        const db = new Date(b.eventDate).getTime() || Number.MAX_SAFE_INTEGER
        return da - db
      }),
    [items],
  )

  const counts = useMemo(() => {
    const c = { All: 0, Upcoming: 0, Confirmed: 0, Completed: 0, Cancelled: 0 } as Record<Tab, number>
    for (const b of items) {
      for (const t of TABS) if (matchesTab(b, t)) c[t] += 1
    }
    return c
  }, [items])

  const booked = items.filter((b) => b.status === 'confirmed' || b.status === 'completed')
  const revenue = booked.reduce((s, b) => s + (Number(b.amount) || 0), 0)
  const upcomingValue = items
    .filter((b) => matchesTab(b, 'Upcoming'))
    .reduce((s, b) => s + (Number(b.amount) || 0), 0)

  const filtered = sorted.filter((b) => {
    if (!matchesTab(b, tab)) return false
    const q = search.trim().toLowerCase()
    if (!q) return true
    return (
      b.coupleName.toLowerCase().includes(q) ||
      (b.location || '').toLowerCase().includes(q) ||
      (b.packageName || '').toLowerCase().includes(q)
    )
  })

  const closeAdd = () => {
    setAddOpen(false)
    if (params.get('add')) {
      params.delete('add')
      setParams(params, { replace: true })
    }
  }

  const openAdd = () => {
    const first = packages[0]
    setForm({ ...blankForm, packageName: first?.name || '', amount: first ? String(first.price) : '' })
    setAddOpen(true)
  }

  const replace = (updated: Inquiry) => {
    setItems((prev) => prev.map((b) => (b.id === updated.id ? updated : b)))
    setSelected((s) => (s && s.id === updated.id ? updated : s))
  }

  const saveBooking = async () => {
    if (!form.coupleName.trim() || !form.eventDate) {
      showToast('Client name and event date are required', 'error')
      return
    }
    setBusy(true)
    try {
      const created = await inquiriesApi.createManual({
        kind: 'booking',
        status: 'confirmed',
        coupleName: form.coupleName.trim(),
        eventDate: form.eventDate,
        packageName: form.packageName.trim() || undefined,
        amount: Number(form.amount) || 0,
        location: form.location.trim() || undefined,
        coupleEmail: form.coupleEmail.trim() || undefined,
        couplePhone: form.couplePhone.trim() || undefined,
        notes: form.notes.trim() || undefined,
      })
      setItems((prev) => [created, ...prev])
      closeAdd()
      setTab('All')
      showToast('Booking added', 'success')
    } catch (err) {
      showToast(apiErrorMessage(err, 'Could not add this booking'), 'error')
    } finally {
      setBusy(false)
    }
  }

  const setStatus = async (b: Inquiry, status: InquiryStatus) => {
    if (b.status === status) return
    setBusy(true)
    try {
      replace(await inquiriesApi.update(b.id, { status }))
      showToast(`Marked ${status}`, 'success')
    } catch (err) {
      showToast(apiErrorMessage(err, 'Could not update this booking'), 'error')
    } finally {
      setBusy(false)
    }
  }

  const saveNotes = async () => {
    if (!selected) return
    setBusy(true)
    try {
      replace(await inquiriesApi.update(selected.id, { notes: notes.trim() }))
      showToast('Notes saved', 'success')
    } catch (err) {
      showToast(apiErrorMessage(err, 'Could not save notes'), 'error')
    } finally {
      setBusy(false)
    }
  }

  const remove = async (b: Inquiry) => {
    if (!window.confirm('Delete this booking? This cannot be undone.')) return
    setBusy(true)
    try {
      await inquiriesApi.remove(b.id)
      setItems((prev) => prev.filter((x) => x.id !== b.id))
      setSelected(null)
      showToast('Booking deleted', 'info')
    } catch (err) {
      showToast(apiErrorMessage(err, 'Could not delete this booking'), 'error')
    } finally {
      setBusy(false)
    }
  }

  const message = async (b: Inquiry) => {
    setBusy(true)
    try {
      const threadId = await openThreadWithCouple(b.coupleId)
      navigate(`/vendor/messages?thread=${encodeURIComponent(threadId)}`)
    } catch (err) {
      showToast(apiErrorMessage(err, 'Could not open the conversation'), 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <VendorPageShell
      title="Bookings"
      subtitle="Confirmed events from couples on iTheeWed, plus clients you add yourself."
      badge={`${counts.Upcoming} upcoming`}
      actions={
        <button
          type="button"
          onClick={openAdd}
          className="w-full sm:w-auto bg-[#0F766E] hover:bg-[#0D9488] text-white px-5 py-2.5 rounded-xl font-bold shadow-sm font-[family-name:var(--font-ui)] cursor-pointer"
        >
          Add Booking
        </button>
      }
    >
      {error ? <ErrorBanner message={error} onRetry={() => void reload()} /> : null}

      {loading && !items.length ? (
        <LoadingBlock label="Loading your bookings…" />
      ) : items.length === 0 ? (
        <EmptyState
          icon={<EventAvailable sx={{ fontSize: 40 }} />}
          title="No bookings yet"
          body="Confirm a lead to turn it into a booking, or add a client who booked you offline."
          actions={[
            { label: 'Add a booking', onClick: openAdd },
            { label: 'Go to leads', to: '/vendor/leads' },
          ]}
        />
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5 font-[family-name:var(--font-ui)]">
            {(
              [
                ['Booked revenue', naira(revenue)],
                ['Upcoming value', naira(upcomingValue)],
                ['Upcoming events', String(counts.Upcoming)],
                ['Completed', String(counts.Completed)],
              ] as const
            ).map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{label}</p>
                <p className="mt-1 font-[family-name:var(--font-display)] text-2xl font-semibold text-slate-900 truncate">{value}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-4 font-[family-name:var(--font-ui)]">
            <div className="flex gap-1.5 overflow-x-auto pb-1 flex-1">
              {TABS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold border cursor-pointer ${
                    tab === t ? 'bg-[#0F766E] text-white border-[#0F766E]' : 'bg-white text-slate-600 border-slate-200'
                  }`}
                >
                  {t} · {counts[t]}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" sx={{ fontSize: 18 }} />
              <input
                type="text"
                placeholder="Search client, venue, package…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-teal-500 bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-[family-name:var(--font-ui)]">
            {filtered.map((b) => (
              <article key={b.id} className="rounded-2xl border border-slate-200 bg-white overflow-hidden hover:border-teal-200 hover:shadow-sm transition-all">
                <div className="p-4 flex gap-3">
                  <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-800 flex items-center justify-center font-bold shrink-0">
                    {(b.coupleName || '?').charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="font-bold text-slate-900 truncate">{b.coupleName || 'Client'}</h3>
                        <p className="text-xs text-slate-400">{b.source === 'vendor' ? 'Added by you' : 'Booked on iTheeWed'}</p>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold border capitalize ${
                          statusStyle[b.status] || 'bg-slate-50 text-slate-600 border-slate-100'
                        }`}
                      >
                        {statusIcon[b.status]}
                        {b.status}
                      </span>
                    </div>
                    <div className="mt-3 space-y-1.5 text-sm text-slate-600">
                      <p className="flex items-center gap-1.5">
                        <CalendarMonth sx={{ fontSize: 16, color: '#94a3b8' }} />
                        {formatEventDate(b.eventDate)}
                      </p>
                      {b.location ? (
                        <p className="flex items-center gap-1.5 truncate">
                          <LocationOn sx={{ fontSize: 16, color: '#94a3b8' }} />
                          {b.location}
                        </p>
                      ) : null}
                    </div>
                    <div className="mt-3 flex items-end justify-between gap-2 pt-3 border-t border-slate-100">
                      <div>
                        <p className="text-xs text-slate-400">{b.packageName || 'Custom'}</p>
                        <p className="font-extrabold text-[#0F766E]">{b.amount ? naira(b.amount) : 'Amount not set'}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelected(b)
                          setNotes(b.notes || '')
                        }}
                        className="text-sm font-bold text-[#0F766E] hover:underline cursor-pointer"
                      >
                        Manage
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-14 text-center font-[family-name:var(--font-ui)]">
              <CalendarMonth sx={{ fontSize: 40, color: '#cbd5e1' }} />
              <p className="mt-2 font-bold text-slate-700">No bookings in this view</p>
              <button type="button" onClick={() => setTab('All')} className="mt-2 text-sm font-bold text-[#0F766E] cursor-pointer">
                Show all bookings
              </button>
            </div>
          ) : null}
        </>
      )}

      {selected ? (
        <div className="fixed inset-0 z-[1300] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <button type="button" className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" aria-label="Close" onClick={() => setSelected(null)} />
          <div className="relative w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl border border-slate-200 shadow-2xl p-5 font-[family-name:var(--font-ui)] max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-[family-name:var(--font-display)] text-2xl font-semibold truncate">{selected.coupleName || 'Client'}</h3>
                <p className="text-sm text-slate-500">{selected.packageName || 'Custom booking'}</p>
              </div>
              <button type="button" onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer" aria-label="Close">
                <Close fontSize="small" />
              </button>
            </div>
            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <p className="flex items-center gap-2"><CalendarMonth sx={{ fontSize: 18 }} /> {formatEventDate(selected.eventDate)}</p>
              {selected.location ? <p className="flex items-center gap-2"><LocationOn sx={{ fontSize: 18 }} /> {selected.location}</p> : null}
              {selected.coupleEmail ? <p className="flex items-center gap-2 break-all"><Email sx={{ fontSize: 18 }} /> {selected.coupleEmail}</p> : null}
              {selected.couplePhone ? <p className="flex items-center gap-2"><Phone sx={{ fontSize: 18 }} /> {selected.couplePhone}</p> : null}
              <p className="font-bold text-[#0F766E] text-lg pt-1">{selected.amount ? naira(selected.amount) : 'Amount not set'}</p>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2">
              {MANAGE_STATUSES.map((s) => (
                <button
                  key={s}
                  type="button"
                  disabled={busy}
                  onClick={() => void setStatus(selected, s)}
                  className={`py-2 rounded-xl text-xs font-bold border capitalize disabled:opacity-60 cursor-pointer ${
                    selected.status === s ? 'bg-[#0F766E] text-white border-[#0F766E]' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <label className="block mt-4 text-xs font-bold text-slate-500 uppercase tracking-wide">Private notes</label>
            <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Deposits, timings, contacts…" className={`${inputCls} mt-1 resize-none`} />
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                disabled={busy || notes.trim() === (selected.notes || '').trim()}
                onClick={() => void saveNotes()}
                className="px-3 py-2 rounded-xl text-sm font-bold text-slate-700 border border-slate-200 hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
              >
                Save notes
              </button>
              {selected.source === 'couple' && selected.coupleId ? (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void message(selected)}
                  className="px-3 py-2 rounded-xl text-sm font-bold text-white bg-[#0F766E] hover:bg-[#0D9488] disabled:opacity-60 cursor-pointer"
                >
                  Message couple
                </button>
              ) : null}
              {selected.source === 'vendor' ? (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void remove(selected)}
                  className="px-3 py-2 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50 ml-auto cursor-pointer"
                >
                  Delete
                </button>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      {addOpen ? (
        <div className="fixed inset-0 z-[1300] flex items-center justify-center p-4">
          <button type="button" className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" aria-label="Close" onClick={closeAdd} />
          <div className="relative w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl p-5 font-[family-name:var(--font-ui)] max-h-[90vh] overflow-y-auto">
            <h3 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-slate-900">Add booking</h3>
            <p className="text-sm text-slate-500 mt-1">For clients who booked you outside iTheeWed.</p>
            <div className="mt-4 space-y-3">
              <input className={inputCls} placeholder="Client / couple name" value={form.coupleName} onChange={(e) => setForm((f) => ({ ...f, coupleName: e.target.value }))} />
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                Event date
                <input className={`${inputCls} mt-1 normal-case font-normal`} type="date" value={form.eventDate} onChange={(e) => setForm((f) => ({ ...f, eventDate: e.target.value }))} />
              </label>
              {packages.length ? (
                <select
                  className={`${inputCls} bg-white`}
                  value={packages.some((p) => p.name === form.packageName) ? form.packageName : 'Custom'}
                  onChange={(e) => {
                    const pkg = packages.find((p) => p.name === e.target.value)
                    setForm((f) => ({ ...f, packageName: pkg ? pkg.name : '', amount: pkg ? String(pkg.price) : f.amount }))
                  }}
                >
                  {packages.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name} — {naira(p.price)}
                    </option>
                  ))}
                  <option value="Custom">Custom</option>
                </select>
              ) : null}
              {!packages.some((p) => p.name === form.packageName) ? (
                <input className={inputCls} placeholder="Package or service" value={form.packageName} onChange={(e) => setForm((f) => ({ ...f, packageName: e.target.value }))} />
              ) : null}
              <input className={inputCls} placeholder="Amount (₦)" type="number" min={0} value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} />
              <input className={inputCls} placeholder="Venue / location" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} />
              <input className={inputCls} placeholder="Email (optional)" type="email" value={form.coupleEmail} onChange={(e) => setForm((f) => ({ ...f, coupleEmail: e.target.value }))} />
              <input className={inputCls} placeholder="Phone (optional)" value={form.couplePhone} onChange={(e) => setForm((f) => ({ ...f, couplePhone: e.target.value }))} />
              <textarea className={`${inputCls} resize-none`} rows={2} placeholder="Notes (optional)" value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />
            </div>
            <div className="mt-5 flex gap-2 justify-end">
              <button type="button" onClick={closeAdd} className="px-4 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 cursor-pointer">
                Cancel
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => void saveBooking()}
                className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-[#0F766E] hover:bg-[#0D9488] disabled:opacity-60 cursor-pointer"
              >
                {busy ? 'Saving…' : 'Save booking'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </VendorPageShell>
  )
}

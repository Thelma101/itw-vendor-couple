import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CouplePageShell from '@/couple/components/CouplePageShell'
import { showToast } from '@/shared/components/SimpleToast'
import { apiErrorMessage, inquiriesApi, threadsApi, type Inquiry, type InquiryStatus } from '@/shared/lib/api'
import { formatDate, naira } from '@/couple/live/liveVendor'

const BOOKED: InquiryStatus[] = ['confirmed', 'completed']
const FINAL: InquiryStatus[] = ['confirmed', 'completed', 'declined', 'cancelled']

const STATUS_STYLE: Record<InquiryStatus, { label: string; className: string }> = {
  new: { label: 'Sent', className: 'bg-sky-50 text-sky-700' },
  contacted: { label: 'Vendor replied', className: 'bg-indigo-50 text-indigo-700' },
  quoted: { label: 'Quote received', className: 'bg-amber-50 text-amber-800' },
  confirmed: { label: 'Confirmed', className: 'bg-emerald-50 text-emerald-700' },
  completed: { label: 'Completed', className: 'bg-slate-100 text-slate-700' },
  declined: { label: 'Declined', className: 'bg-rose-50 text-rose-700' },
  cancelled: { label: 'Cancelled', className: 'bg-slate-100 text-slate-500' },
}

export default function LiveMyVendors() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<'booked' | 'inquiries'>('booked')
  const [rows, setRows] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState('')
  const [confirmCancel, setConfirmCancel] = useState<Inquiry | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const list = await inquiriesApi.list()
      setRows([...list].sort((a, b) => (b.updatedAt || b.createdAt).localeCompare(a.updatedAt || a.createdAt)))
      setError('')
    } catch (err) {
      setError(apiErrorMessage(err, 'We could not load your vendors. Please try again.'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const booked = useMemo(() => rows.filter((r) => BOOKED.includes(r.status)), [rows])
  const requests = useMemo(() => rows.filter((r) => !BOOKED.includes(r.status)), [rows])
  const openRequests = requests.filter((r) => !FINAL.includes(r.status)).length
  const bookedTotal = booked.reduce((sum, r) => sum + (r.amount || 0), 0)

  const autoTabbed = useRef(false)
  useEffect(() => {
    if (loading || autoTabbed.current) return
    autoTabbed.current = true
    if (booked.length === 0 && requests.length > 0) setTab('inquiries')
  }, [loading, booked.length, requests.length])

  const message = async (row: Inquiry) => {
    setBusyId(row.id)
    try {
      const thread = await threadsApi.start({ vendorId: row.vendorId })
      navigate(`/couple/messages?thread=${encodeURIComponent(thread.id)}`)
    } catch (err) {
      showToast(apiErrorMessage(err, 'Could not open a conversation. Please try again.'), 'error')
    } finally {
      setBusyId('')
    }
  }

  const cancel = async (row: Inquiry) => {
    setBusyId(row.id)
    try {
      const updated = await inquiriesApi.update(row.id, { status: 'cancelled' })
      setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, ...updated } : r)))
      showToast('Request cancelled', 'success')
    } catch (err) {
      showToast(apiErrorMessage(err, 'Could not cancel this request. Please try again.'), 'error')
    } finally {
      setBusyId('')
      setConfirmCancel(null)
    }
  }

  const list = tab === 'booked' ? booked : requests

  return (
    <CouplePageShell
      title="My Vendors"
      subtitle="Bookings and inquiries with vendors you’ve hired or contacted."
      badge={loading ? 'Loading…' : `${booked.length} booked`}
    >
      <div className="grid grid-cols-3 gap-3 mb-6 font-[family-name:var(--font-ui)]">
        {[
          { label: 'Booked', value: String(booked.length) },
          { label: 'Booked value', value: bookedTotal > 0 ? naira(bookedTotal) : '—' },
          { label: 'Open requests', value: String(openRequests) },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{s.label}</p>
            <p className="font-[family-name:var(--font-display)] text-2xl font-semibold text-slate-900 mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-4 border-b border-slate-200 mb-5 font-[family-name:var(--font-ui)]">
        {(
          [
            { id: 'booked' as const, label: `Booked (${booked.length})` },
            { id: 'inquiries' as const, label: `Inquiries & requests (${requests.length})` },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`pb-2.5 text-sm font-bold cursor-pointer ${
              tab === t.id ? 'text-[#0F766E] border-b-2 border-[#0F766E]' : 'text-slate-500'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 mb-4 flex flex-wrap items-center justify-between gap-3 font-[family-name:var(--font-ui)]">
          <p className="text-sm text-rose-800">{error}</p>
          <button
            type="button"
            onClick={() => void load()}
            className="px-3.5 py-2 rounded-xl border border-rose-300 text-sm font-bold text-rose-800 hover:bg-rose-100 cursor-pointer"
          >
            Retry
          </button>
        </div>
      ) : null}

      {loading && rows.length === 0 ? (
        <div className="flex justify-center py-16" role="status" aria-label="Loading">
          <span className="h-8 w-8 rounded-full border-4 border-teal-100 border-t-[#0F766E] animate-spin" />
        </div>
      ) : !error && list.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center font-[family-name:var(--font-ui)]">
          <p className="font-semibold text-slate-900 text-lg">
            {rows.length === 0
              ? "You haven't contacted any vendors yet"
              : tab === 'booked'
                ? 'No confirmed bookings yet'
                : 'No open inquiries'}
          </p>
          <p className="text-sm text-slate-500 mt-1.5 max-w-md mx-auto">
            {rows.length === 0
              ? 'Browse vendors, send an inquiry or booking request, and track everything here.'
              : tab === 'booked'
                ? 'Once a vendor confirms your booking request it will show up here.'
                : 'Inquiries and booking requests you send to vendors will show up here.'}
          </p>
          <button
            type="button"
            onClick={() => navigate('/couple/search-results')}
            className="mt-5 px-4 py-2.5 rounded-xl bg-[#0F766E] text-white text-sm font-bold hover:bg-[#0D9488] cursor-pointer"
          >
            Browse vendors
          </button>
        </div>
      ) : (
        <ul className="space-y-3 font-[family-name:var(--font-ui)]">
          {list.map((row) => {
            const status = STATUS_STYLE[row.status] || STATUS_STYLE.new
            const canCancel = !FINAL.includes(row.status)
            const busy = busyId === row.id
            return (
              <li key={row.id} className="rounded-2xl border border-slate-200 bg-white p-4 md:p-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-slate-900 text-lg">{row.vendorName || 'Vendor'}</h3>
                    <p className="text-sm text-slate-500">
                      {row.vendorCategory}
                      {row.vendorCategory ? ' · ' : ''}
                      {row.kind === 'booking' ? 'Booking request' : 'Inquiry'} sent {formatDate(row.createdAt)}
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full ${status.className}`}>
                    {status.label}
                  </span>
                </div>

                {row.eventDate || row.packageName || row.amount > 0 || row.guestCount > 0 ? (
                  <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    {row.eventDate ? (
                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-slate-400 font-bold">Event date</p>
                        <p className="font-semibold text-slate-800">{formatDate(row.eventDate)}</p>
                      </div>
                    ) : null}
                    {row.packageName ? (
                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-slate-400 font-bold">Package</p>
                        <p className="font-semibold text-slate-800">{row.packageName}</p>
                      </div>
                    ) : null}
                    {row.amount > 0 ? (
                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-slate-400 font-bold">Amount</p>
                        <p className="font-semibold text-slate-800">{naira(row.amount)}</p>
                      </div>
                    ) : row.budget > 0 ? (
                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-slate-400 font-bold">Your budget</p>
                        <p className="font-semibold text-slate-800">{naira(row.budget)}</p>
                      </div>
                    ) : null}
                    {row.guestCount > 0 ? (
                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-slate-400 font-bold">Guests</p>
                        <p className="font-semibold text-slate-800">{row.guestCount}</p>
                      </div>
                    ) : null}
                  </div>
                ) : null}

                {row.message ? <p className="text-sm text-slate-600 mt-3 whitespace-pre-line line-clamp-3">{row.message}</p> : null}

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void message(row)}
                    className="px-3.5 py-2 rounded-xl bg-[#0F766E] text-white text-sm font-bold hover:bg-[#0D9488] cursor-pointer disabled:opacity-60"
                  >
                    Message
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(`/couple/vendor/${row.vendorId}`)}
                    className="px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-bold text-[#0F766E] hover:bg-teal-50 cursor-pointer"
                  >
                    View profile
                  </button>
                  {canCancel ? (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => setConfirmCancel(row)}
                      className="px-3.5 py-2 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50 cursor-pointer disabled:opacity-60"
                    >
                      Cancel request
                    </button>
                  ) : null}
                </div>
              </li>
            )
          })}
        </ul>
      )}

      {confirmCancel ? (
        <div className="fixed inset-0 z-[1300] flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/40 cursor-pointer"
            aria-label="Close"
            onClick={() => busyId !== confirmCancel.id && setConfirmCancel(null)}
          />
          <div className="relative w-full max-w-sm bg-white rounded-2xl border border-slate-200 p-5 font-[family-name:var(--font-ui)]">
            <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold">Cancel this request?</h3>
            <p className="text-sm text-slate-600 mt-2">
              {confirmCancel.vendorName || 'The vendor'} will see that you cancelled. You can still message them afterwards.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                disabled={busyId === confirmCancel.id}
                onClick={() => setConfirmCancel(null)}
                className="px-4 py-2 rounded-xl text-sm font-bold text-slate-600 cursor-pointer"
              >
                Keep it
              </button>
              <button
                type="button"
                disabled={busyId === confirmCancel.id}
                onClick={() => void cancel(confirmCancel)}
                className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 cursor-pointer disabled:opacity-60"
              >
                {busyId === confirmCancel.id ? 'Cancelling…' : 'Cancel request'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </CouplePageShell>
  )
}

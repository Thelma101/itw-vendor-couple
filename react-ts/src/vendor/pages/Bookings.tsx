import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import {
  AccessTime,
  CalendarMonth,
  Cancel,
  CheckCircle,
  Close,
  Email,
  LocationOn,
  Phone,
  Search,
} from '@mui/icons-material'
import VendorPageShell from '@/vendor/components/VendorPageShell'
import { showToast } from '@/shared/components/SimpleToast'
import { activePackages } from '@/shared/lib/vendorServices'

type BookingStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled'

type Booking = {
  id: string
  couple: string
  email: string
  phone: string
  date: string
  package: string
  amount: number
  deposit: number
  depositPaid: boolean
  status: BookingStatus
  avatar: string
  venue: string
}

const initialBookings: Booking[] = [
  {
    id: 'BKG-201',
    couple: 'Sarah & Michael',
    email: 'sarah.m@email.com',
    phone: '+234 801 234 5678',
    date: 'Mar 15, 2026',
    package: 'Premium',
    amount: 350000,
    deposit: 105000,
    depositPaid: true,
    status: 'Confirmed',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    venue: 'Eko Hotel & Suites',
  },
  {
    id: 'BKG-202',
    couple: 'Jane & John',
    email: 'jane.j@email.com',
    phone: '+234 802 345 6789',
    date: 'Apr 22, 2026',
    package: 'Luxury',
    amount: 650000,
    deposit: 195000,
    depositPaid: false,
    status: 'Pending',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    venue: 'Oriental Hotel',
  },
  {
    id: 'BKG-203',
    couple: 'Amara & Uche',
    email: 'amara.uche@email.com',
    phone: '+234 803 456 7890',
    date: 'Feb 28, 2026',
    package: 'Essential',
    amount: 150000,
    deposit: 45000,
    depositPaid: true,
    status: 'Completed',
    avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100',
    venue: 'Civic Center, VI',
  },
  {
    id: 'BKG-204',
    couple: 'Halima & Usman',
    email: 'halima.u@email.com',
    phone: '+234 812 111 2222',
    date: 'Jun 10, 2026',
    package: 'Premium',
    amount: 350000,
    deposit: 105000,
    depositPaid: false,
    status: 'Cancelled',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100',
    venue: 'Transcorp Hilton, Abuja',
  },
]

const statusStyle: Record<BookingStatus, string> = {
  Confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  Pending: 'bg-amber-50 text-amber-800 border-amber-100',
  Completed: 'bg-teal-50 text-teal-800 border-teal-100',
  Cancelled: 'bg-rose-50 text-rose-700 border-rose-100',
}

const statusIcon: Record<BookingStatus, ReactNode> = {
  Confirmed: <CheckCircle sx={{ fontSize: 14 }} />,
  Pending: <AccessTime sx={{ fontSize: 14 }} />,
  Completed: <CheckCircle sx={{ fontSize: 14 }} />,
  Cancelled: <Cancel sx={{ fontSize: 14 }} />,
}

function naira(n: number) {
  return `₦${n.toLocaleString('en-NG')}`
}

export default function Bookings() {
  const packages = useMemo(() => activePackages(), [])
  const [tab, setTab] = useState<'All' | BookingStatus>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [bookings, setBookings] = useState<Booking[]>(initialBookings)
  const [selected, setSelected] = useState<Booking | null>(null)
  const [addOpen, setAddOpen] = useState(() => new URLSearchParams(window.location.search).get('add') === '1')
  const [form, setForm] = useState({
    couple: '',
    date: '',
    package: packages[0]?.name || 'Premium',
    amount: String(packages[0]?.price || ''),
    venue: '',
    email: '',
    phone: '',
  })

  const counts = useMemo(() => {
    const base = { All: bookings.length, Pending: 0, Confirmed: 0, Completed: 0, Cancelled: 0 } as Record<'All' | BookingStatus, number>
    bookings.forEach((b) => {
      base[b.status] += 1
    })
    return base
  }, [bookings])

  const filtered = bookings.filter((b) => {
    const matchesTab = tab === 'All' || b.status === tab
    const q = searchQuery.toLowerCase()
    const matchesSearch =
      !q ||
      b.couple.toLowerCase().includes(q) ||
      b.id.toLowerCase().includes(q) ||
      b.venue.toLowerCase().includes(q)
    return matchesTab && matchesSearch
  })

  const saveBooking = () => {
    if (!form.couple.trim() || !form.date.trim()) {
      showToast('Couple name and date are required', 'error')
      return
    }
    const amount = Number(form.amount) || 0
    const next: Booking = {
      id: `BKG-${200 + bookings.length + 1}`,
      couple: form.couple.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      date: form.date.trim(),
      package: form.package.trim() || 'Custom package',
      amount,
      deposit: Math.round(amount * 0.3),
      depositPaid: false,
      status: 'Pending',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      venue: form.venue.trim() || 'TBD',
    }
    setBookings((prev) => [next, ...prev])
    setAddOpen(false)
    setTab('Pending')
    showToast('Booking added', 'success')
  }

  const setStatus = (id: string, status: BookingStatus) => {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)))
    setSelected((s) => (s && s.id === id ? { ...s, status } : s))
    showToast(`Marked ${status}`, 'success')
  }

  return (
    <VendorPageShell
      title="Bookings"
      subtitle="Track upcoming weddings, deposits, and booking status."
      badge={`${counts.Pending} pending`}
      actions={
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="w-full sm:w-auto bg-[#0F766E] hover:bg-[#0D9488] text-white px-5 py-2.5 rounded-xl font-bold shadow-sm font-[family-name:var(--font-ui)]"
        >
          Add Booking
        </button>
      }
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5 font-[family-name:var(--font-ui)]">
        {(
          [
            ['Pipeline value', naira(bookings.filter((b) => b.status !== 'Cancelled').reduce((s, b) => s + b.amount, 0))],
            ['Deposits owed', naira(bookings.filter((b) => !b.depositPaid && b.status === 'Pending').reduce((s, b) => s + b.deposit, 0))],
            ['Confirmed', String(counts.Confirmed)],
            ['This season', String(bookings.filter((b) => b.status !== 'Cancelled').length)],
          ] as const
        ).map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{label}</p>
            <p className="mt-1 font-[family-name:var(--font-display)] text-2xl font-semibold text-slate-900">{value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4 font-[family-name:var(--font-ui)]">
        <div className="flex gap-1.5 overflow-x-auto pb-1 flex-1">
          {(['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold border ${
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
            placeholder="Search couple, venue, ID…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-teal-500 bg-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-[family-name:var(--font-ui)]">
        {filtered.map((booking) => (
          <article
            key={booking.id}
            className="rounded-2xl border border-slate-200 bg-white overflow-hidden hover:border-teal-200 hover:shadow-sm transition-all"
          >
            <div className="p-4 flex gap-3">
              <img src={booking.avatar} alt="" className="w-12 h-12 rounded-full object-cover border border-slate-100" />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-900 truncate">{booking.couple}</h3>
                    <p className="text-xs text-slate-400">{booking.id}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold border ${statusStyle[booking.status]}`}>
                    {statusIcon[booking.status]}
                    {booking.status}
                  </span>
                </div>
                <div className="mt-3 space-y-1.5 text-sm text-slate-600">
                  <p className="flex items-center gap-1.5">
                    <CalendarMonth sx={{ fontSize: 16, color: '#94a3b8' }} />
                    {booking.date}
                  </p>
                  <p className="flex items-center gap-1.5 truncate">
                    <LocationOn sx={{ fontSize: 16, color: '#94a3b8' }} />
                    {booking.venue}
                  </p>
                </div>
                <div className="mt-3 flex items-end justify-between gap-2 pt-3 border-t border-slate-100">
                  <div>
                    <p className="text-xs text-slate-400">{booking.package}</p>
                    <p className="font-extrabold text-[#0F766E]">{naira(booking.amount)}</p>
                    <p className="text-[11px] text-slate-500">
                      Deposit {naira(booking.deposit)} · {booking.depositPaid ? 'paid' : 'owed'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelected(booking)}
                    className="text-sm font-bold text-[#0F766E] hover:underline"
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
          <button type="button" onClick={() => setAddOpen(true)} className="mt-2 text-sm font-bold text-[#0F766E]">
            Add your first booking
          </button>
        </div>
      ) : null}

      {selected ? (
        <div className="fixed inset-0 z-[1300] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <button type="button" className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" aria-label="Close" onClick={() => setSelected(null)} />
          <div className="relative w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl border border-slate-200 shadow-2xl p-5 font-[family-name:var(--font-ui)]">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-[family-name:var(--font-display)] text-2xl font-semibold">{selected.couple}</h3>
                <p className="text-sm text-slate-500">{selected.id} · {selected.package}</p>
              </div>
              <button type="button" onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-slate-100" aria-label="Close">
                <Close fontSize="small" />
              </button>
            </div>
            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <p className="flex items-center gap-2"><CalendarMonth sx={{ fontSize: 18 }} /> {selected.date}</p>
              <p className="flex items-center gap-2"><LocationOn sx={{ fontSize: 18 }} /> {selected.venue}</p>
              {selected.email ? <p className="flex items-center gap-2"><Email sx={{ fontSize: 18 }} /> {selected.email}</p> : null}
              {selected.phone ? <p className="flex items-center gap-2"><Phone sx={{ fontSize: 18 }} /> {selected.phone}</p> : null}
              <p className="font-bold text-[#0F766E] text-lg pt-1">{naira(selected.amount)}</p>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2">
              {(['Pending', 'Confirmed', 'Completed', 'Cancelled'] as BookingStatus[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(selected.id, s)}
                  className={`py-2 rounded-xl text-xs font-bold border ${
                    selected.status === s ? 'bg-[#0F766E] text-white border-[#0F766E]' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {addOpen ? (
        <div className="fixed inset-0 z-[1300] flex items-center justify-center p-4">
          <button type="button" className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" aria-label="Close" onClick={() => setAddOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl p-5 font-[family-name:var(--font-ui)] max-h-[90vh] overflow-y-auto">
            <h3 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-slate-900">Add booking</h3>
            <p className="text-sm text-slate-500 mt-1">Use a live package from Services so amounts stay consistent.</p>
            <div className="mt-4 space-y-3">
              <input className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500" placeholder="Couple name" value={form.couple} onChange={(e) => setForm((f) => ({ ...f, couple: e.target.value }))} />
              <input className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500" placeholder="Event date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />
              <select
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500 bg-white"
                value={form.package}
                onChange={(e) => {
                  const pkg = packages.find((p) => p.name === e.target.value)
                  setForm((f) => ({ ...f, package: e.target.value, amount: pkg ? String(pkg.price) : f.amount }))
                }}
              >
                {packages.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name} — {naira(p.price)}
                  </option>
                ))}
                <option value="Custom">Custom</option>
              </select>
              <input className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500" placeholder="Amount (₦)" type="number" value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} />
              <input className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500" placeholder="Venue" value={form.venue} onChange={(e) => setForm((f) => ({ ...f, venue: e.target.value }))} />
              <input className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500" placeholder="Email (optional)" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
              <input className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500" placeholder="Phone (optional)" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
            </div>
            <div className="mt-5 flex gap-2 justify-end">
              <button type="button" onClick={() => setAddOpen(false)} className="px-4 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100">
                Cancel
              </button>
              <button type="button" onClick={saveBooking} className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-[#0F766E] hover:bg-[#0D9488]">
                Save booking
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </VendorPageShell>
  )
}

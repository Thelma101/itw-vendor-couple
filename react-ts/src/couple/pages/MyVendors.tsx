import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CouplePageShell from '@/couple/components/CouplePageShell'
import { showToast } from '@/shared/components/SimpleToast'

type BookedVendor = {
  id: string
  name: string
  category: string
  image: string
  price: number
  location: string
  eventDate: string
  status: 'confirmed' | 'pending' | 'completed'
  depositPaid: number
  hasRated: boolean
}

type Inquiry = {
  id: string
  vendorName: string
  vendorCategory: string
  vendorImage: string
  submittedDate: string
  status: 'pending' | 'responded' | 'declined'
  message: string
  response?: string
}

const mockBookedVendors: BookedVendor[] = [
  {
    id: '1',
    name: 'Regina Ugwu Photography',
    category: 'Photographer',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    price: 350000,
    location: 'Ikeja, Lagos',
    eventDate: '2025-06-15',
    status: 'confirmed',
    depositPaid: 105000,
    hasRated: false,
  },
  {
    id: '2',
    name: 'Emerald Gardens Venue',
    category: 'Venue',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=200',
    price: 500000,
    location: 'Lekki, Lagos',
    eventDate: '2025-06-15',
    status: 'confirmed',
    depositPaid: 150000,
    hasRated: false,
  },
  {
    id: '3',
    name: 'Divine Catering Services',
    category: 'Caterer',
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=200',
    price: 300000,
    location: 'Victoria Island, Lagos',
    eventDate: '2025-06-15',
    status: 'pending',
    depositPaid: 90000,
    hasRated: false,
  },
]

const mockInquiries: Inquiry[] = [
  {
    id: '1',
    vendorName: 'Adaeze Flowers & Decor',
    vendorCategory: 'Florist',
    vendorImage: 'https://images.unsplash.com/photo-1522653216850-4699c7e43a3a?w=200',
    submittedDate: '2025-01-12',
    status: 'pending',
    message: 'Looking for bridal bouquet and reception centerpieces for 20 tables.',
  },
  {
    id: '2',
    vendorName: 'Sugar Rush Cakes',
    vendorCategory: 'Cake',
    vendorImage: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=200',
    submittedDate: '2025-01-11',
    status: 'responded',
    message: 'Need a 5-tier wedding cake for 200 guests.',
    response: 'Happy to design this — tasting available Jan 25.',
  },
]

function naira(n: number) {
  return `₦${n.toLocaleString('en-NG')}`
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function MyVendors() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<'booked' | 'inquiries'>('booked')
  const [vendors, setVendors] = useState(mockBookedVendors)
  const [rateId, setRateId] = useState<string | null>(null)
  const [rating, setRating] = useState(5)

  const totalSpent = vendors.reduce((sum, v) => sum + v.depositPaid, 0)
  const pendingInquiries = mockInquiries.filter((i) => i.status === 'pending').length

  return (
    <CouplePageShell
      title="My Vendors"
      subtitle="Bookings and inquiries with vendors you’ve hired or contacted."
      badge={`${vendors.length} booked`}
    >
      <div className="grid grid-cols-3 gap-3 mb-6 font-[family-name:var(--font-ui)]">
        {[
          { label: 'Booked', value: String(vendors.length) },
          { label: 'Deposits paid', value: naira(totalSpent) },
          { label: 'Open inquiries', value: String(pendingInquiries) },
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
            { id: 'booked' as const, label: `Booked (${vendors.length})` },
            { id: 'inquiries' as const, label: `Inquiries (${mockInquiries.length})` },
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

      {tab === 'booked' ? (
        <ul className="space-y-3 font-[family-name:var(--font-ui)]">
          {vendors.map((vendor) => (
            <li key={vendor.id} className="rounded-2xl border border-slate-200 bg-white p-4 md:p-5">
              <div className="flex flex-col md:flex-row gap-4">
                <img src={vendor.image} alt="" className="w-20 h-20 rounded-xl object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-slate-900 text-lg">{vendor.name}</h3>
                      <p className="text-sm text-slate-500">{vendor.category}</p>
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full ${
                        vendor.status === 'confirmed'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-800'
                      }`}
                    >
                      {vendor.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    {vendor.location} · Event {formatDate(vendor.eventDate)}
                  </p>
                  <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-slate-400 font-bold">Total</p>
                      <p className="font-semibold text-slate-800">{naira(vendor.price)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-slate-400 font-bold">Deposit</p>
                      <p className="font-semibold text-emerald-700">{naira(vendor.depositPaid)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-slate-400 font-bold">Balance</p>
                      <p className="font-semibold text-amber-700">{naira(vendor.price - vendor.depositPaid)}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => navigate('/couple/messages')}
                      className="px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-bold text-[#0F766E] hover:bg-teal-50 cursor-pointer"
                    >
                      Message
                    </button>
                    {!vendor.hasRated ? (
                      <button
                        type="button"
                        onClick={() => {
                          setRateId(vendor.id)
                          setRating(5)
                        }}
                        className="px-3.5 py-2 rounded-xl bg-[#0F766E] text-white text-sm font-bold hover:bg-[#0D9488] cursor-pointer"
                      >
                        Rate vendor
                      </button>
                    ) : (
                      <span className="text-xs font-semibold text-slate-500 self-center">Rated</span>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="space-y-3 font-[family-name:var(--font-ui)]">
          {mockInquiries.map((inq) => (
            <li key={inq.id} className="rounded-2xl border border-slate-200 bg-white p-4 md:p-5">
              <div className="flex gap-3">
                <img src={inq.vendorImage} alt="" className="w-12 h-12 rounded-full object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-semibold text-slate-900">{inq.vendorName}</p>
                      <p className="text-xs text-slate-500">{inq.vendorCategory}</p>
                    </div>
                    <span className="text-[10px] font-bold uppercase text-slate-500">{inq.status}</span>
                  </div>
                  <p className="text-sm text-slate-600 mt-2">{inq.message}</p>
                  {inq.response ? <p className="text-sm text-[#0F766E] mt-2 bg-teal-50/60 rounded-xl px-3 py-2">{inq.response}</p> : null}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {rateId ? (
        <div className="fixed inset-0 z-[1300] flex items-center justify-center p-4">
          <button type="button" className="absolute inset-0 bg-slate-900/40 cursor-pointer" aria-label="Close" onClick={() => setRateId(null)} />
          <div className="relative w-full max-w-sm bg-white rounded-2xl border border-slate-200 p-5 font-[family-name:var(--font-ui)]">
            <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold">Rate this vendor</h3>
            <div className="flex gap-2 mt-4">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  className={`w-10 h-10 rounded-xl font-bold cursor-pointer ${rating >= n ? 'bg-[#0F766E] text-white' : 'bg-slate-100 text-slate-500'}`}
                >
                  {n}
                </button>
              ))}
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setRateId(null)} className="px-4 py-2 rounded-xl text-sm font-bold text-slate-600 cursor-pointer">
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setVendors((prev) => prev.map((v) => (v.id === rateId ? { ...v, hasRated: true } : v)))
                  setRateId(null)
                  showToast('Thanks for the rating', 'success')
                }}
                className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-[#0F766E] cursor-pointer"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </CouplePageShell>
  )
}

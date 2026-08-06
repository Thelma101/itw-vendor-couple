import { VendorCard } from '@/vendor/components/ui/VendorCard'
import { Add, CheckCircle } from '@mui/icons-material'

/** Vendor team page — outside F&F core; safe stub after restructure. */
export default function Team() {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Team Management</h1>
          <p className="text-slate-500 mt-1 text-sm">Team invites will return here in a later release.</p>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl font-medium"
        >
          <Add fontSize="small" />
          Invite member
        </button>
      </div>
      <VendorCard className="p-6 flex items-center gap-3">
        <CheckCircle className="text-emerald-500" />
        <p className="text-slate-600 text-sm">Preview mode — team management is paused for friends &amp; family testing.</p>
      </VendorCard>
    </div>
  )
}

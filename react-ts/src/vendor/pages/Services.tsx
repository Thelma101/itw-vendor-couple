import { useMemo, useState } from 'react'
import { Add, CheckCircle, Close, DeleteOutline, EditOutlined, InfoOutlined, ToggleOff, ToggleOn } from '@mui/icons-material'
import VendorPageShell from '@/vendor/components/VendorPageShell'
import { showToast } from '@/shared/components/SimpleToast'
import {
  type ServiceType,
  type VendorService,
  loadVendorServices,
  saveVendorServices,
} from '@/shared/lib/vendorServices'

const emptyForm = {
  name: '',
  price: '',
  description: '',
  type: 'Package' as ServiceType,
  features: '',
  popular: false,
}

function naira(n: number) {
  return `₦${n.toLocaleString('en-NG')}`
}

export default function Services() {
  const [services, setServices] = useState<VendorService[]>(() => loadVendorServices())
  const [filter, setFilter] = useState<'All' | ServiceType | 'Inactive'>('All')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<VendorService | null>(null)
  const [form, setForm] = useState(emptyForm)

  const persist = (next: VendorService[]) => {
    setServices(next)
    saveVendorServices(next)
  }

  const visible = useMemo(() => {
    if (filter === 'All') return services
    if (filter === 'Inactive') return services.filter((s) => !s.active)
    return services.filter((s) => s.type === filter && s.active)
  }, [filter, services])

  const openCreate = (type: ServiceType = 'Package') => {
    setEditing(null)
    setForm({ ...emptyForm, type })
    setModalOpen(true)
  }

  const openEdit = (service: VendorService) => {
    setEditing(service)
    setForm({
      name: service.name,
      price: String(service.price),
      description: service.description,
      type: service.type,
      features: service.features.join(', '),
      popular: Boolean(service.popular),
    })
    setModalOpen(true)
  }

  const save = () => {
    if (!form.name.trim() || !form.price || Number(form.price) <= 0) {
      showToast('Add a name and valid price', 'error')
      return
    }
    const payload: VendorService = {
      id: editing?.id || `svc-${Date.now()}`,
      name: form.name.trim(),
      price: Number(form.price),
      description:
        form.description.trim() ||
        (form.type === 'Package' ? 'Package couples can select on your profile.' : 'Optional extra couples can add to a package.'),
      type: form.type,
      active: editing?.active ?? true,
      features: form.features
        .split(',')
        .map((f) => f.trim())
        .filter(Boolean),
      popular: form.type === 'Package' ? form.popular : false,
    }

    let next = editing ? services.map((s) => (s.id === editing.id ? payload : s)) : [payload, ...services]
    if (payload.popular && payload.type === 'Package') {
      next = next.map((s) => (s.id === payload.id ? s : { ...s, popular: s.type === 'Package' ? false : s.popular }))
    }
    persist(next)
    setModalOpen(false)
    showToast(editing ? 'Updated — couples will see this on your profile' : 'Added — visible to couples when Live', 'success')
  }

  return (
    <VendorPageShell
      title="Services & Pricing"
      subtitle="Packages appear as the three pricing cards couples see on your profile. Add-ons are optional extras they can stack on a package."
      badge={`${services.filter((s) => s.active && s.type === 'Package').length} packages live`}
      actions={
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => openCreate('Package')}
            className="inline-flex items-center justify-center gap-2 bg-[#0F766E] hover:bg-[#0D9488] text-white px-5 py-2.5 rounded-xl font-bold font-[family-name:var(--font-ui)]"
          >
            <Add fontSize="small" />
            New package
          </button>
          <button
            type="button"
            onClick={() => openCreate('Add-on')}
            className="inline-flex items-center justify-center gap-2 border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 px-5 py-2.5 rounded-xl font-bold font-[family-name:var(--font-ui)]"
          >
            <Add fontSize="small" />
            New add-on
          </button>
        </div>
      }
    >
      <div className="mb-5 rounded-2xl border border-teal-100 bg-teal-50/40 px-4 py-3 flex gap-3 font-[family-name:var(--font-ui)]">
        <InfoOutlined sx={{ color: '#0F766E', fontSize: 20, mt: '2px' }} />
        <div className="text-sm text-slate-600">
          <p className="font-bold text-slate-800">What couples see</p>
          <p className="mt-0.5">
            <span className="font-semibold text-[#0F766E]">Package</span> = main offer (Essential / Premium / Luxury style) with
            feature checklist + “Select Package”.{' '}
            <span className="font-semibold text-amber-800">Add-on</span> = optional upgrade (engagement shoot, album, film)
            shown under packages — not a standalone booking path.
          </p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 mb-5 font-[family-name:var(--font-ui)]">
        {(['All', 'Package', 'Add-on', 'Inactive'] as const).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors ${
              filter === key ? 'bg-[#0F766E] text-white' : 'bg-white border border-slate-200 text-slate-600'
            }`}
          >
            {key}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {visible.map((service) => {
          const isPackage = service.type === 'Package'
          return (
            <article
              key={service.id}
              className={`relative flex flex-col rounded-2xl border bg-white overflow-hidden transition-shadow hover:shadow-md ${
                service.popular && service.active ? 'border-[#0F766E] ring-1 ring-teal-100' : 'border-slate-200'
              } ${!service.active ? 'opacity-70' : ''}`}
            >
              {service.popular && isPackage ? (
                <div className="absolute top-3 right-3 z-10 text-[10px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-full bg-[#0F766E] text-white">
                  Most popular
                </div>
              ) : null}
              <div className={`h-1.5 ${isPackage ? 'bg-[#0F766E]' : 'bg-amber-400'}`} style={{ opacity: service.active ? 1 : 0.35 }} />
              <div className="p-5 flex flex-col flex-1 font-[family-name:var(--font-ui)]">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span
                    className={`text-[10px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                      isPackage ? 'bg-teal-50 text-teal-800' : 'bg-amber-50 text-amber-800'
                    }`}
                  >
                    {service.type}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      service.active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {service.active ? 'Live on profile' : 'Hidden'}
                  </span>
                </div>

                <h3 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-slate-900 leading-tight pr-16">
                  {service.name}
                </h3>
                <p className="text-[#0F766E] font-extrabold text-xl mt-1">{naira(service.price)}</p>
                <p className="text-sm text-slate-500 mt-2 leading-relaxed flex-1">{service.description}</p>

                {service.features.length ? (
                  <ul className="mt-4 space-y-1.5">
                    {service.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                        <CheckCircle sx={{ fontSize: 16, color: '#22c55e', mt: '2px' }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                ) : null}

                <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => openEdit(service)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold text-[#0F766E] border border-teal-200 hover:bg-teal-50"
                  >
                    <EditOutlined sx={{ fontSize: 16 }} />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      persist(services.map((s) => (s.id === service.id ? { ...s, active: !s.active } : s)))
                      showToast(service.active ? 'Hidden from couples' : 'Now live on your profile', 'success')
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold text-slate-600 border border-slate-200 hover:bg-slate-50"
                  >
                    {service.active ? <ToggleOn sx={{ fontSize: 18, color: '#0F766E' }} /> : <ToggleOff sx={{ fontSize: 18 }} />}
                    {service.active ? 'Hide' : 'Publish'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      persist(services.filter((s) => s.id !== service.id))
                      showToast('Removed', 'info')
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold text-rose-600 border border-rose-100 hover:bg-rose-50 ml-auto"
                  >
                    <DeleteOutline sx={{ fontSize: 16 }} />
                    Delete
                  </button>
                </div>
              </div>
            </article>
          )
        })}
      </div>

      {visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-14 text-center font-[family-name:var(--font-ui)]">
          <p className="font-bold text-slate-700">Nothing in this view</p>
          <button type="button" onClick={() => openCreate('Package')} className="mt-3 text-sm font-bold text-[#0F766E]">
            Add a package couples can select
          </button>
        </div>
      ) : null}

      {modalOpen ? (
        <div className="fixed inset-0 z-[1300] flex items-center justify-center p-4">
          <button type="button" className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" aria-label="Close" onClick={() => setModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden font-[family-name:var(--font-ui)] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
              <div>
                <h3 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-slate-900">
                  {editing ? 'Edit' : 'New'} {form.type === 'Package' ? 'package' : 'add-on'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {form.type === 'Package'
                    ? 'Shown as a pricing card on your couple-facing profile'
                    : 'Optional extra listed under packages for couples to add'}
                </p>
              </div>
              <button type="button" onClick={() => setModalOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100" aria-label="Close">
                <Close fontSize="small" />
              </button>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex gap-1 p-1 rounded-xl bg-slate-100">
                {(['Package', 'Add-on'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, type: t, popular: t === 'Add-on' ? false : f.popular }))}
                    className={`flex-1 rounded-lg text-xs font-bold py-2.5 ${form.type === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <input
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500"
                placeholder={form.type === 'Package' ? 'e.g. Essential, Premium, Luxury' : 'e.g. Engagement Session'}
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
              <input
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500"
                placeholder="Price (₦)"
                type="number"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              />
              <textarea
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500 min-h-[80px]"
                placeholder="Short description (shown under the price)"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Feature checklist</label>
                <input
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500"
                  placeholder="Comma separated — e.g. 8 hours, Online gallery, 2 photographers"
                  value={form.features}
                  onChange={(e) => setForm((f) => ({ ...f, features: e.target.value }))}
                />
                <p className="text-[11px] text-slate-400 mt-1">Same green tick list couples see on Select Package cards.</p>
              </div>
              {form.type === 'Package' ? (
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.popular}
                    onChange={(e) => setForm((f) => ({ ...f, popular: e.target.checked }))}
                    className="rounded border-slate-300 text-[#0F766E] focus:ring-[#0F766E]"
                  />
                  Mark as “Most Popular” on couple profile
                </label>
              ) : null}
            </div>
            <div className="px-5 py-4 border-t border-slate-100 flex justify-end gap-2 bg-slate-50 sticky bottom-0">
              <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-200">
                Cancel
              </button>
              <button type="button" onClick={save} className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-[#0F766E] hover:bg-[#0D9488]">
                Save
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </VendorPageShell>
  )
}

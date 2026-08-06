import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import {
  Add,
  CardGiftcard,
  ContentCopy,
  DeleteOutline,
  EditOutlined,
  Link as LinkIcon,
  PhotoCamera,
} from '@mui/icons-material'
import CouplePageShell from '@/couple/components/CouplePageShell'
import apiClient, { isNetworkError } from '@/shared/lib/api'
import PlanBadge from '@/shared/components/PlanBadge'

type GiftStatus = 'wanted' | 'purchased' | 'reserved'

type GiftItem = {
  id: string
  title: string
  description?: string
  price?: number
  url?: string
  imageUrl?: string
  quantity: number
  status: GiftStatus
}

type RegistryPayload = {
  registry: { title: string; message: string; slug: string; coupleName: string }
  items: GiftItem[]
  stats: { total: number; wanted: number; reserved: number; purchased: number; totalValue: number }
}

const emptyForm = {
  title: '',
  description: '',
  price: '',
  url: '',
  imageUrl: '',
  quantity: '1',
  status: 'wanted' as GiftStatus,
}

const naira = (n?: number) =>
  typeof n === 'number'
    ? new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(n)
    : '—'

const statusColor: Record<GiftStatus, string> = {
  wanted: 'bg-teal-50 text-teal-800 border-teal-200',
  reserved: 'bg-amber-50 text-amber-800 border-amber-200',
  purchased: 'bg-slate-100 text-slate-600 border-slate-200',
}

function storageKey(coupleId: string) {
  return `itw_gift_registry_${coupleId}`
}

function computeStats(items: GiftItem[]): RegistryPayload['stats'] {
  return {
    total: items.length,
    wanted: items.filter((i) => i.status === 'wanted').length,
    reserved: items.filter((i) => i.status === 'reserved').length,
    purchased: items.filter((i) => i.status === 'purchased').length,
    totalValue: items.reduce((sum, i) => sum + (i.price || 0) * i.quantity, 0),
  }
}

function defaultLocalPayload(coupleId: string): RegistryPayload {
  const items: GiftItem[] = [
    {
      id: 'local-1',
      title: 'Cash contribution — honeymoon',
      description: 'Help us explore Zanzibar after the wedding',
      price: 50000,
      quantity: 10,
      status: 'wanted',
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400',
    },
    {
      id: 'local-2',
      title: 'KitchenAid stand mixer',
      description: 'For our new home in Lekki',
      price: 185000,
      quantity: 1,
      status: 'wanted',
      url: 'https://www.jumia.com.ng',
      imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
    },
  ]
  return {
    registry: {
      coupleName: 'Ada & Tunde',
      slug: 'ada-tunde',
      title: 'Ada & Tunde Gift Registry',
      message: 'Your presence is the greatest gift — but if you’d like to contribute, here are a few ideas.',
    },
    items,
    stats: computeStats(items),
  }
}

function readLocal(coupleId: string): RegistryPayload | null {
  try {
    const raw = localStorage.getItem(storageKey(coupleId))
    if (!raw) return null
    return JSON.parse(raw) as RegistryPayload
  } catch {
    return null
  }
}

function writeLocal(coupleId: string, payload: RegistryPayload) {
  localStorage.setItem(storageKey(coupleId), JSON.stringify(payload))
}

/** Compress image file to a JPEG data URL under ~1.2MB */
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Could not read photo'))
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        const max = 1200
        const scale = Math.min(1, max / Math.max(img.width, img.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          resolve(String(reader.result))
          return
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', 0.82))
      }
      img.onerror = () => reject(new Error('Invalid image'))
      img.src = String(reader.result)
    }
    reader.readAsDataURL(file)
  })
}

function apiErrorMessage(error: unknown, fallback: string) {
  if (axiosIsError(error)) {
    const data = error.response?.data as { message?: string | string[] } | undefined
    if (Array.isArray(data?.message)) return data.message.join(', ')
    if (typeof data?.message === 'string') return data.message
    if (isNetworkError(error)) return `${fallback} (API offline — using local save)`
  }
  return fallback
}

function axiosIsError(error: unknown): error is import('axios').AxiosError {
  return Boolean(error && typeof error === 'object' && 'isAxiosError' in error)
}

export default function GiftRegistry() {
  const [data, setData] = useState<RegistryPayload | null>(null)
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [filter, setFilter] = useState<'all' | GiftStatus>('all')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [uploading, setUploading] = useState(false)
  const [editing, setEditing] = useState<GiftItem | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const coupleId = useMemo(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}') as { id?: string; email?: string }
      if (user.email === 'couple@itheewed.demo' || user.id === 'demo-couple-1') return 'demo-couple'
      return user.id || 'demo-couple'
    } catch {
      return 'demo-couple'
    }
  }, [])

  const persist = (payload: RegistryPayload) => {
    const next = { ...payload, stats: computeStats(payload.items) }
    writeLocal(coupleId, next)
    setData(next)
  }

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await apiClient.get('/api/v1/registry', {
        headers: { 'x-couple-id': coupleId },
      })
      const payload = res.data as RegistryPayload
      writeLocal(coupleId, payload)
      setData(payload)
      setInfo('')
    } catch (err) {
      const local = readLocal(coupleId) || defaultLocalPayload(coupleId)
      writeLocal(coupleId, local)
      setData(local)
      setInfo(
        isNetworkError(err)
          ? 'Showing local registry (API unreachable). Gifts still save on this device.'
          : apiErrorMessage(err, 'Could not reach registry API — using local copy.'),
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coupleId])

  const items = (data?.items || []).filter((i) => filter === 'all' || i.status === filter)

  const shareUrl = data
    ? `${window.location.origin}/couple/registry/public/${data.registry.slug}`
    : ''

  const copyLink = async () => {
    if (!shareUrl) return
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const onPhotoSelected = async (file?: File | null) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file (JPG, PNG, WEBP).')
      return
    }
    setUploading(true)
    setError('')
    try {
      const dataUrl = await fileToDataUrl(file)
      setForm((f) => ({ ...f, imageUrl: dataUrl }))
    } catch {
      setError('Could not process photo. Try a smaller image or use an image URL.')
    } finally {
      setUploading(false)
    }
  }

  const addItem = async () => {
    if (!form.title.trim() || saving) return
    setSaving(true)
    setError('')
    const body = {
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      price: form.price !== '' ? Number(form.price) : undefined,
      url: form.url.trim() || undefined,
      imageUrl: form.imageUrl.trim() || undefined,
      quantity: Math.max(1, Number(form.quantity) || 1),
      status: form.status,
    }

    try {
      const res = await apiClient.post('/api/v1/registry/items', body, {
        headers: { 'x-couple-id': coupleId },
      })
      const created = res.data as GiftItem
      const base = data || defaultLocalPayload(coupleId)
      persist({ ...base, items: [...base.items, created] })
      setOpen(false)
      setForm(emptyForm)
      setInfo('')
      await load()
    } catch (err) {
      // Always succeed locally so Save is never a dead end
      const created: GiftItem = {
        id: `local-${Date.now()}`,
        title: body.title,
        description: body.description,
        price: body.price,
        url: body.url,
        imageUrl: body.imageUrl,
        quantity: body.quantity,
        status: body.status,
      }
      const base = data || defaultLocalPayload(coupleId)
      persist({ ...base, items: [...base.items, created] })
      setOpen(false)
      setForm(emptyForm)
      setInfo(apiErrorMessage(err, 'Saved on this device (API sync failed).'))
    } finally {
      setSaving(false)
    }
  }

  const setStatus = async (id: string, status: GiftStatus) => {
    const base = data
    if (!base) return
    persist({
      ...base,
      items: base.items.map((i) => (i.id === id ? { ...i, status } : i)),
    })
    try {
      await apiClient.patch(
        `/api/v1/registry/items/${id}`,
        { status },
        { headers: { 'x-couple-id': coupleId } },
      )
    } catch {
      /* local already updated */
    }
  }

  const openEdit = (item: GiftItem) => {
    setEditing(item)
    setForm({
      title: item.title,
      description: item.description || '',
      price: item.price != null ? String(item.price) : '',
      url: item.url || '',
      imageUrl: item.imageUrl || '',
      quantity: String(item.quantity || 1),
      status: item.status,
    })
  }

  const saveEdit = async () => {
    if (!editing || !form.title.trim()) return
    setSaving(true)
    const patch = {
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      price: form.price !== '' ? Number(form.price) : undefined,
      url: form.url.trim() || undefined,
      imageUrl: form.imageUrl.trim() || undefined,
      quantity: Math.max(1, Number(form.quantity) || 1),
      status: form.status,
    }
    if (data) {
      persist({
        ...data,
        items: data.items.map((i) => (i.id === editing.id ? { ...i, ...patch } : i)),
      })
    }
    try {
      await apiClient.patch(`/api/v1/registry/items/${editing.id}`, patch, {
        headers: { 'x-couple-id': coupleId },
      })
    } catch {
      setInfo('Updated on this device (API sync failed).')
    } finally {
      setSaving(false)
      setEditing(null)
      setForm(emptyForm)
    }
  }

  const confirmDelete = async () => {
    if (!deleteId || !data) return
    const id = deleteId
    setDeleteId(null)
    persist({ ...data, items: data.items.filter((i) => i.id !== id) })
    try {
      await apiClient.delete(`/api/v1/registry/items/${id}`, {
        headers: { 'x-couple-id': coupleId },
      })
    } catch {
      /* local already updated */
    }
  }

  const removeItem = (id: string) => setDeleteId(id)

  return (
    <CouplePageShell
      title="Gift Registry"
      subtitle="Share wishlist items with guests — cash gifts, home essentials, and more."
      badge="Standard"
      actions={<PlanBadge />}
    >
      <Stack spacing={2.5}>
        {error ? (
          <Box className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </Box>
        ) : null}
        {info ? (
          <Box className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {info}
          </Box>
        ) : null}

        <Box className="rounded-2xl border border-slate-200 bg-white p-4 md:p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-teal-800 font-bold text-sm mb-1">
                <CardGiftcard sx={{ fontSize: 18 }} />
                {data?.registry.title || 'Your registry'}
              </div>
              <p className="text-slate-600 text-sm">{data?.registry.message}</p>
            </div>
            <div className="flex flex-wrap gap-2 shrink-0">
              <Button
                variant="outlined"
                startIcon={<ContentCopy />}
                onClick={() => void copyLink()}
                sx={{ textTransform: 'none', borderRadius: 2, borderColor: '#0F766E', color: '#0F766E' }}
              >
                {copied ? 'Copied' : 'Copy share link'}
              </Button>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => {
                  setError('')
                  setOpen(true)
                }}
                sx={{ textTransform: 'none', borderRadius: 2, bgcolor: '#0F766E', '&:hover': { bgcolor: '#0D9488' } }}
              >
                Add gift
              </Button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { label: 'Items', value: data?.stats.total ?? '—' },
              { label: 'Wanted', value: data?.stats.wanted ?? '—' },
              { label: 'Reserved', value: data?.stats.reserved ?? '—' },
              { label: 'Est. value', value: naira(data?.stats.totalValue) },
            ].map((s) => (
              <div key={s.label} className="rounded-xl bg-slate-50 border border-slate-100 px-3 py-2.5">
                <p className="text-[11px] uppercase tracking-wide text-slate-400 font-bold">{s.label}</p>
                <p className="text-base font-bold text-slate-800 mt-0.5 truncate">{s.value}</p>
              </div>
            ))}
          </div>

          {shareUrl ? (
            <p className="mt-3 text-xs text-slate-500 flex items-start gap-1.5 break-all">
              <LinkIcon sx={{ fontSize: 14, mt: '1px' }} />
              Public: /couple/registry/public/{data?.registry.slug}
            </p>
          ) : null}
        </Box>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {(['all', 'wanted', 'reserved', 'purchased'] as const).map((key) => (
            <Chip
              key={key}
              label={key === 'all' ? 'All' : key[0].toUpperCase() + key.slice(1)}
              onClick={() => setFilter(key)}
              sx={{
                fontWeight: 700,
                bgcolor: filter === key ? '#0F766E' : '#F1F5F9',
                color: filter === key ? '#fff' : '#475569',
              }}
            />
          ))}
        </div>

        {loading ? (
          <p className="text-slate-500 text-sm py-8 text-center">Loading registry…</p>
        ) : items.length === 0 ? (
          <Box className="rounded-2xl border border-dashed border-slate-300 bg-white py-12 text-center px-4">
            <CardGiftcard sx={{ fontSize: 36, color: '#94A3B8', mb: 1 }} />
            <p className="font-semibold text-slate-700">No gifts in this view</p>
            <p className="text-sm text-slate-500 mt-1">Add your first wishlist item for guests.</p>
          </Box>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
            {items.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl border border-slate-200 bg-white overflow-hidden flex flex-col min-h-0 shadow-sm hover:shadow-md transition-shadow"
              >
                <div
                  className="h-40 shrink-0 bg-cover bg-center bg-slate-100"
                  style={{
                    backgroundImage: item.imageUrl
                      ? `url(${item.imageUrl})`
                      : 'linear-gradient(135deg,#CCFBF1,#FEF3C7)',
                  }}
                />
                <div className="p-3.5 flex flex-col gap-2 flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-slate-800 text-[15px] leading-snug line-clamp-2">{item.title}</h3>
                      {item.description ? (
                        <p className="text-sm text-slate-500 mt-1 line-clamp-2">{item.description}</p>
                      ) : null}
                    </div>
                    <Stack direction="row" spacing={0.25} className="shrink-0">
                      <IconButton size="small" onClick={() => openEdit(item)} aria-label="Edit gift">
                        <EditOutlined fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => removeItem(item.id)} aria-label="Delete gift">
                        <DeleteOutline fontSize="small" />
                      </IconButton>
                    </Stack>
                  </div>
                  <div className="mt-auto pt-2 flex flex-wrap items-center gap-2 justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-bold text-teal-800 text-sm">{naira(item.price)}</span>
                      <span className="text-xs text-slate-400 font-semibold">×{item.quantity}</span>
                    </div>
                    <select
                      className={`text-[11px] font-bold border rounded-full px-2.5 py-1 ${statusColor[item.status]}`}
                      value={item.status}
                      onChange={(e) => void setStatus(item.id, e.target.value as GiftStatus)}
                    >
                      <option value="wanted">Wanted</option>
                      <option value="reserved">Reserved</option>
                      <option value="purchased">Purchased</option>
                    </select>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </Stack>

      <Dialog open={open} onClose={() => !saving && setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700 }}>Add gift</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Title"
              required
              fullWidth
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              minRows={2}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <TextField
                label="Price (₦)"
                type="number"
                fullWidth
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              />
              <TextField
                label="Quantity"
                type="number"
                fullWidth
                value={form.quantity}
                onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))}
              />
            </div>
            <TextField
              label="Product link"
              fullWidth
              value={form.url}
              onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
            />

            <div className="rounded-xl border border-slate-200 p-3 space-y-2">
              <p className="text-sm font-semibold text-slate-700">Gift photo</p>
              <div className="flex flex-wrap gap-2">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => void onPhotoSelected(e.target.files?.[0])}
                />
                <Button
                  variant="outlined"
                  startIcon={<PhotoCamera />}
                  disabled={uploading}
                  onClick={() => fileRef.current?.click()}
                  sx={{ textTransform: 'none', borderRadius: 2, borderColor: '#0F766E', color: '#0F766E' }}
                >
                  {uploading ? 'Processing…' : 'Upload photo'}
                </Button>
                {form.imageUrl ? (
                  <Button
                    onClick={() => setForm((f) => ({ ...f, imageUrl: '' }))}
                    sx={{ textTransform: 'none', color: '#64748B' }}
                  >
                    Clear photo
                  </Button>
                ) : null}
              </div>
              {form.imageUrl ? (
                <img
                  src={form.imageUrl}
                  alt="Gift preview"
                  className="mt-1 h-28 w-full max-w-xs object-cover rounded-lg border border-slate-100"
                />
              ) : null}
              <TextField
                label="Or paste image URL"
                fullWidth
                size="small"
                value={form.imageUrl.startsWith('data:') ? '' : form.imageUrl}
                placeholder="https://…"
                onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
              />
            </div>

            <TextField
              select
              label="Status"
              fullWidth
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as GiftStatus }))}
            >
              <MenuItem value="wanted">Wanted</MenuItem>
              <MenuItem value="reserved">Reserved</MenuItem>
              <MenuItem value="purchased">Purchased</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button disabled={saving} onClick={() => setOpen(false)} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={saving || !form.title.trim()}
            onClick={() => void addItem()}
            sx={{ textTransform: 'none', bgcolor: '#0F766E', '&:hover': { bgcolor: '#0D9488' } }}
          >
            {saving ? 'Saving…' : 'Save gift'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={!!editing}
        onClose={() => {
          if (!saving) {
            setEditing(null)
            setForm(emptyForm)
          }
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Edit gift</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Title"
              required
              fullWidth
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              minRows={2}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <TextField
                label="Price (₦)"
                type="number"
                fullWidth
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              />
              <TextField
                label="Quantity"
                type="number"
                fullWidth
                value={form.quantity}
                onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))}
              />
            </div>
            <TextField
              label="Product link"
              fullWidth
              value={form.url}
              onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
            />
            <TextField
              label="Image URL"
              fullWidth
              value={form.imageUrl.startsWith('data:') ? '' : form.imageUrl}
              onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
            />
            <TextField
              select
              label="Status"
              fullWidth
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as GiftStatus }))}
            >
              <MenuItem value="wanted">Wanted</MenuItem>
              <MenuItem value="reserved">Reserved</MenuItem>
              <MenuItem value="purchased">Purchased</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            disabled={saving}
            onClick={() => {
              setEditing(null)
              setForm(emptyForm)
            }}
            sx={{ textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={saving || !form.title.trim()}
            onClick={() => void saveEdit()}
            sx={{ textTransform: 'none', bgcolor: '#0F766E' }}
          >
            {saving ? 'Saving…' : 'Save changes'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Delete gift?</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#475569' }}>
            This removes the item from your registry. Guests won’t see it anymore.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteId(null)} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => void confirmDelete()}
            sx={{ textTransform: 'none', bgcolor: '#B91C1C', '&:hover': { bgcolor: '#991B1B' } }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </CouplePageShell>
  )
}

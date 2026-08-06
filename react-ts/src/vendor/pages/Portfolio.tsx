import { useMemo, useRef, useState } from 'react'
import { VendorCard } from '@/vendor/components/ui/VendorCard'
import { Add, PhotoLibrary, PlayCircleOutline, Close, ChevronLeft, ChevronRight, EditOutlined } from '@mui/icons-material'
import VendorPageShell from '@/vendor/components/VendorPageShell'
import { compressImageToDataUrl } from '@/shared/lib/imageCompress'
import { showToast } from '@/shared/components/SimpleToast'

type AlbumType = 'Photo' | 'Video'

type Album = {
  id: string
  title: string
  items: number
  type: AlbumType
  cover: string
  published: boolean
  gallery?: string[]
}

const STORAGE_KEY = 'itw_vendor_portfolio'

const DEFAULT_ALBUMS: Album[] = [
  {
    id: 'a1',
    title: 'Royal Wedding - Lagos',
    items: 124,
    type: 'Photo',
    cover: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=500&h=400&fit=crop',
    published: true,
    gallery: [
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200',
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200',
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200',
    ],
  },
  {
    id: 'a2',
    title: 'Intimate Beach Ceremony',
    items: 45,
    type: 'Photo',
    cover: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500&h=400&fit=crop',
    published: true,
    gallery: [
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200',
      'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1200',
    ],
  },
  {
    id: 'a3',
    title: 'Pre-wedding Highlights',
    items: 1,
    type: 'Video',
    cover: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=500&h=400&fit=crop',
    published: true,
    gallery: ['https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=1200'],
  },
  {
    id: 'a4',
    title: 'Traditional Colour Story',
    items: 86,
    type: 'Photo',
    cover: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=500&h=400&fit=crop',
    published: true,
    gallery: [
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200',
      'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=1200',
    ],
  },
]

function loadAlbums(): Album[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_ALBUMS
    const parsed = JSON.parse(raw) as Album[]
    return Array.isArray(parsed) && parsed.length ? parsed : DEFAULT_ALBUMS
  } catch {
    return DEFAULT_ALBUMS
  }
}

export default function Portfolio() {
  const [albums, setAlbums] = useState<Album[]>(() => loadAlbums())
  const [modalOpen, setModalOpen] = useState(false)
  const [mode, setMode] = useState<'album' | 'upload' | 'edit'>('album')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [type, setType] = useState<AlbumType>('Photo')
  const [cover, setCover] = useState('')
  const [saving, setSaving] = useState(false)
  const [viewAlbum, setViewAlbum] = useState<Album | null>(null)
  const [viewIndex, setViewIndex] = useState(0)
  const fileRef = useRef<HTMLInputElement>(null)

  const persist = (next: Album[]) => {
    setAlbums(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }

  const resetForm = () => {
    setTitle('')
    setType('Photo')
    setCover('')
    setEditingId(null)
  }

  const openCreate = () => {
    setMode('album')
    resetForm()
    setModalOpen(true)
  }

  const openUpload = () => {
    setMode('upload')
    resetForm()
    setModalOpen(true)
  }

  const openEdit = (album: Album) => {
    setMode('edit')
    setEditingId(album.id)
    setTitle(album.title)
    setType(album.type)
    setCover(album.cover)
    setModalOpen(true)
  }

  const openView = (album: Album) => {
    setViewAlbum(album)
    setViewIndex(0)
  }

  const gallery = viewAlbum?.gallery?.length ? viewAlbum.gallery : viewAlbum ? [viewAlbum.cover] : []

  const onFile = async (file: File | undefined) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      showToast('Please choose an image', 'error')
      return
    }
    setSaving(true)
    try {
      const dataUrl = await compressImageToDataUrl(file)
      setCover(dataUrl)
      if (!title.trim()) setTitle(file.name.replace(/\.[^.]+$/, '').slice(0, 48))
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Upload failed', 'error')
    } finally {
      setSaving(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const save = () => {
    if (!title.trim()) {
      showToast('Give this album a title', 'error')
      return
    }
    if (!cover) {
      showToast('Add a cover photo', 'error')
      return
    }

    if (mode === 'edit' && editingId) {
      persist(
        albums.map((a) =>
          a.id === editingId
            ? {
                ...a,
                title: title.trim(),
                type,
                cover,
                gallery: [cover, ...(a.gallery || []).filter((g) => g !== a.cover)],
              }
            : a,
        ),
      )
      setModalOpen(false)
      showToast('Album updated', 'success')
      return
    }

    const album: Album = {
      id: `album-${Date.now()}`,
      title: title.trim(),
      items: mode === 'upload' ? 1 : 0,
      type,
      cover,
      published: true,
      gallery: [cover],
    }
    persist([album, ...albums])
    setModalOpen(false)
    showToast(mode === 'upload' ? 'Media uploaded' : 'Album created', 'success')
  }

  const badge = useMemo(() => `${albums.length} albums`, [albums.length])

  return (
    <VendorPageShell
      title="Portfolio"
      subtitle="Showcase albums that help couples shortlist you faster."
      badge={badge}
      actions={
        <button
          type="button"
          onClick={openUpload}
          className="flex items-center justify-center gap-2 bg-[#0F766E] hover:bg-[#0D9488] text-white px-5 py-2.5 rounded-xl font-bold shadow-sm transition-all active:scale-95 w-full sm:w-auto font-[family-name:var(--font-ui)]"
        >
          <Add fontSize="small" />
          Upload Media
        </button>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <button type="button" onClick={openCreate} className="text-left">
          <VendorCard
            className="flex flex-col items-center justify-center min-h-[260px] border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group hover:border-teal-400"
            noPadding
          >
            <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform mb-3">
              <Add className="text-teal-700" />
            </div>
            <p className="font-bold text-slate-700 font-[family-name:var(--font-ui)]">Create New Album</p>
            <p className="text-sm text-slate-500 text-center px-4 mt-1 font-[family-name:var(--font-ui)]">
              Upload photos or video links
            </p>
          </VendorCard>
        </button>

        {albums.map((album) => (
          <VendorCard key={album.id} className="group relative overflow-hidden" noPadding>
            <button type="button" className="block w-full text-left" onClick={() => openView(album)}>
              <div className="h-44 overflow-hidden relative">
                <img
                  src={album.cover}
                  alt={album.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="flex items-center gap-2 mb-1">
                    {album.type === 'Photo' ? (
                      <PhotoLibrary fontSize="small" className="text-white/80" />
                    ) : (
                      <PlayCircleOutline fontSize="small" className="text-white/80" />
                    )}
                    <span className="text-xs font-semibold bg-white/20 px-2 py-0.5 rounded backdrop-blur-md font-[family-name:var(--font-ui)]">
                      {album.items} {album.type === 'Photo' ? 'items' : 'video'}
                    </span>
                  </div>
                </div>
              </div>
            </button>
            <div className="p-4">
              <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-slate-800 truncate">
                {album.title}
              </h3>
              <div className="mt-2 flex items-center justify-between gap-2 font-[family-name:var(--font-ui)]">
                <span className="text-xs text-slate-500">{album.published ? 'Published' : 'Draft'}</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => openView(album)}
                    className="text-xs font-bold text-[#0F766E] hover:underline"
                  >
                    View
                  </button>
                  <button
                    type="button"
                    onClick={() => openEdit(album)}
                    className="inline-flex items-center gap-0.5 text-xs font-bold text-slate-600 hover:text-[#0F766E]"
                  >
                    <EditOutlined sx={{ fontSize: 14 }} />
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </VendorCard>
        ))}
      </div>

      {modalOpen ? (
        <div className="fixed inset-0 z-[1300] flex items-center justify-center p-4">
          <button type="button" className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" aria-label="Close" onClick={() => setModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden font-[family-name:var(--font-ui)]">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h3 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-slate-900">
                {mode === 'edit' ? 'Edit album' : mode === 'upload' ? 'Upload media' : 'Create album'}
              </h3>
              <button type="button" onClick={() => setModalOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100" aria-label="Close">
                <Close fontSize="small" />
              </button>
            </div>
            <div className="p-5 space-y-3">
              <input
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500"
                placeholder="Album title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <div className="flex gap-2">
                {(['Photo', 'Video'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`flex-1 rounded-xl py-2 text-sm font-bold border ${
                      type === t ? 'bg-teal-50 border-teal-300 text-teal-800' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => void onFile(e.target.files?.[0])} />
              <button
                type="button"
                disabled={saving}
                onClick={() => fileRef.current?.click()}
                className="w-full rounded-xl border border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 py-8 text-sm font-bold text-slate-600 disabled:opacity-60"
              >
                {saving ? 'Processing…' : cover ? 'Change cover photo' : 'Choose cover photo'}
              </button>
              {cover ? <img src={cover} alt="Cover preview" className="w-full h-36 object-cover rounded-xl border border-slate-200" /> : null}
            </div>
            <div className="px-5 py-4 border-t border-slate-100 flex justify-end gap-2 bg-slate-50">
              <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-200">
                Cancel
              </button>
              <button type="button" onClick={save} className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-[#0F766E] hover:bg-[#0D9488]">
                {mode === 'edit' ? 'Save changes' : mode === 'upload' ? 'Upload' : 'Create album'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {viewAlbum ? (
        <div className="fixed inset-0 z-[1400] bg-black/94 flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 text-white">
            <div className="min-w-0">
              <p className="font-[family-name:var(--font-display)] text-xl font-semibold truncate">{viewAlbum.title}</p>
              <p className="text-xs text-white/70 font-[family-name:var(--font-ui)]">
                {viewIndex + 1} / {gallery.length}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setViewAlbum(null)
                  openEdit(viewAlbum)
                }}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-bold"
              >
                Edit
              </button>
              <button type="button" onClick={() => setViewAlbum(null)} className="p-2 rounded-lg hover:bg-white/10" aria-label="Close">
                <Close />
              </button>
            </div>
          </div>
          <div className="flex-1 relative flex items-center justify-center px-4 pb-8">
            <button
              type="button"
              onClick={() => setViewIndex((i) => (i - 1 + gallery.length) % gallery.length)}
              className="absolute left-3 md:left-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20"
              aria-label="Previous"
            >
              <ChevronLeft fontSize="large" />
            </button>
            <img src={gallery[viewIndex]} alt="" className="max-h-[75vh] max-w-full object-contain rounded-lg" />
            <button
              type="button"
              onClick={() => setViewIndex((i) => (i + 1) % gallery.length)}
              className="absolute right-3 md:right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20"
              aria-label="Next"
            >
              <ChevronRight fontSize="large" />
            </button>
          </div>
        </div>
      ) : null}
    </VendorPageShell>
  )
}

import { useMemo, useRef, useState } from 'react'
import { VendorCard } from '@/vendor/components/ui/VendorCard'
import { Add, PhotoLibrary, PlayCircleOutline, Close, ChevronLeft, ChevronRight, EditOutlined, VisibilityOutlined } from '@mui/icons-material'
import VendorPageShell from '@/vendor/components/VendorPageShell'
import { uploadImage } from '@/shared/lib/imageCompress'
import { showToast } from '@/shared/components/SimpleToast'
import { apiErrorMessage } from '@/shared/lib/api'
import { VENDOR_PROFILE } from '@/vendor/lib/vendorProfile'
import { useAccount } from '@/shared/contexts/AccountContext'
import { ErrorBanner, LoadingBlock } from '@/vendor/components/LiveState'
import { type Album, type AlbumType, useVendorPortfolio } from '@/vendor/lib/portfolio'

export default function Portfolio() {
  const { isDemo, user } = useAccount()
  const { data: albums, save: saveAlbums, loading, error } = useVendorPortfolio()
  const businessName = isDemo ? VENDOR_PROFILE.businessName : user?.business_name || user?.username || 'Your business'
  const [modalOpen, setModalOpen] = useState(false)
  const [mode, setMode] = useState<'album' | 'upload' | 'edit'>('album')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [type, setType] = useState<AlbumType>('Photo')
  const [cover, setCover] = useState('')
  const [saving, setSaving] = useState(false)
  const [viewAlbum, setViewAlbum] = useState<Album | null>(null)
  const [viewIndex, setViewIndex] = useState(0)
  const [pendingGallery, setPendingGallery] = useState<string[]>([])
  const [clientPreview, setClientPreview] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const persist = async (next: Album[]) => {
    const ok = await saveAlbums(next)
    if (!ok) showToast('Could not save to your account. Check your connection and try again.', 'error')
    return ok
  }

  const resetForm = () => {
    setTitle('')
    setType('Photo')
    setCover('')
    setPendingGallery([])
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

  const onFiles = async (fileList: FileList | null) => {
    if (!fileList?.length) return
    const files = Array.from(fileList)
    setSaving(true)
    try {
      const urls: string[] = []
      for (const file of files) {
        if (!file.type.startsWith('image/')) {
          showToast(`${file.name} skipped — images only`, 'error')
          continue
        }
        urls.push(await uploadImage(file))
      }
      if (!urls.length) return
      setCover((prev) => prev || urls[0]!)
      setPendingGallery((prev) => [...prev, ...urls])
      if (!title.trim() && files[0]) setTitle(files[0].name.replace(/\.[^.]+$/, '').slice(0, 48))
      showToast(`${urls.length} image(s) ready`, 'success')
    } catch (err) {
      showToast(apiErrorMessage(err, err instanceof Error ? err.message : 'Upload failed'), 'error')
    } finally {
      setSaving(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const onFile = async (file: File | undefined) => {
    if (!file) return
    const dt = new DataTransfer()
    dt.items.add(file)
    await onFiles(dt.files)
  }

  const save = async () => {
    if (!title.trim()) {
      showToast('Give this album a title', 'error')
      return
    }
    if (!cover) {
      showToast('Add a cover photo', 'error')
      return
    }

    if (mode === 'edit' && editingId) {
      setModalOpen(false)
      const ok = await persist(
        albums.map((a) => {
          if (a.id !== editingId) return a
          const nextGallery = [cover, ...pendingGallery.filter((g) => g !== cover), ...(a.gallery || []).filter((g) => g !== a.cover && g !== cover)]
          return { ...a, title: title.trim(), type, cover, gallery: nextGallery, items: isDemo ? a.items : nextGallery.length }
        }),
      )
      if (ok) showToast('Album updated', 'success')
      return
    }

    const gallery = [cover, ...pendingGallery.filter((g) => g !== cover)]
    const album: Album = {
      id: `album-${Date.now()}`,
      title: title.trim(),
      items: gallery.length,
      type,
      cover,
      published: true,
      gallery,
    }
    setModalOpen(false)
    if (await persist([album, ...albums])) {
      showToast(mode === 'upload' ? `${gallery.length} media uploaded` : 'Album created', 'success')
    }
  }

  const togglePublished = async (album: Album) => {
    const ok = await persist(albums.map((a) => (a.id === album.id ? { ...a, published: !a.published } : a)))
    if (ok) showToast(album.published ? 'Hidden from couples' : 'Published to your profile', 'success')
  }

  const deleteAlbum = async (id: string) => {
    if (!window.confirm('Delete this album? Couples will no longer see it.')) return
    setModalOpen(false)
    if (await persist(albums.filter((a) => a.id !== id))) showToast('Album deleted', 'info')
  }

  const badge = useMemo(() => `${albums.length} albums`, [albums.length])

  return (
    <VendorPageShell
      title="Portfolio"
      subtitle="Albums couples see when they open your profile."
      badge={badge}
      actions={
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setClientPreview(true)}
            className="inline-flex items-center justify-center gap-2 border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 px-4 py-2.5 rounded-xl font-bold font-[family-name:var(--font-ui)] cursor-pointer"
          >
            <VisibilityOutlined fontSize="small" />
            Preview as couple
          </button>
          <button
            type="button"
            onClick={openUpload}
            className="flex items-center justify-center gap-2 bg-[#0F766E] hover:bg-[#0D9488] text-white px-5 py-2.5 rounded-xl font-bold transition-all active:scale-95 w-full sm:w-auto font-[family-name:var(--font-ui)] cursor-pointer"
          >
            <Add fontSize="small" />
            Upload Media
          </button>
        </div>
      }
    >
      {!isDemo && error ? <ErrorBanner message={error} /> : null}
      {!isDemo && loading && albums.length === 0 ? (
        <LoadingBlock label="Loading your portfolio…" />
      ) : (
      <>
      {!isDemo && albums.length === 0 ? (
        <div className="mb-4 rounded-2xl border border-teal-100 bg-teal-50/60 px-4 py-3 text-sm text-teal-900 font-[family-name:var(--font-ui)]">
          <p className="font-bold">Your portfolio is empty</p>
          <p className="mt-0.5 text-teal-800/80">
            Create your first album — couples decide faster when they can see your past work.
          </p>
        </div>
      ) : null}
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
              {isDemo ? 'Upload photos or video links' : 'Upload photos from your device'}
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
                {isDemo ? (
                  <span className="text-xs text-slate-500">{album.published ? 'Published' : 'Draft'}</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => void togglePublished(album)}
                    className={`text-xs font-bold cursor-pointer ${album.published ? 'text-emerald-700' : 'text-slate-500'} hover:underline`}
                    title={album.published ? 'Hide from couples' : 'Publish to your profile'}
                  >
                    {album.published ? 'Published' : 'Hidden · Publish'}
                  </button>
                )}
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
      </>
      )}

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
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => void onFiles(e.target.files)}
              />
              <button
                type="button"
                disabled={saving}
                onClick={() => fileRef.current?.click()}
                className="w-full rounded-xl border border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 py-8 text-sm font-bold text-slate-600 disabled:opacity-60"
              >
                {saving
                  ? 'Processing…'
                  : pendingGallery.length
                    ? `${pendingGallery.length} selected — add more`
                    : cover
                      ? 'Change / add photos'
                      : 'Choose photos (multi-select)'}
              </button>
              {cover ? <img src={cover} alt="Cover preview" className="w-full h-36 object-cover rounded-xl border border-slate-200" /> : null}
              {pendingGallery.length > 1 ? (
                <p className="text-xs text-slate-500">{pendingGallery.length} images selected for this album</p>
              ) : null}
            </div>
            <div className="px-5 py-4 border-t border-slate-100 flex justify-end gap-2 bg-slate-50">
              {!isDemo && mode === 'edit' && editingId ? (
                <button
                  type="button"
                  onClick={() => void deleteAlbum(editingId)}
                  className="mr-auto px-3 py-2 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50 cursor-pointer"
                >
                  Delete
                </button>
              ) : null}
              <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-200">
                Cancel
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => void save()}
                className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-[#0F766E] hover:bg-[#0D9488] disabled:opacity-60"
              >
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

      {clientPreview ? (
        <div className="fixed inset-0 z-[1300] flex items-center justify-center p-4">
          <button type="button" className="absolute inset-0 bg-slate-900/45 backdrop-blur-sm cursor-pointer" aria-label="Close" onClick={() => setClientPreview(false)} />
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#F4F7F8] rounded-2xl border border-slate-200 shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between gap-3 px-5 py-3 bg-white border-b border-slate-100">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#0F766E]">Couple view</p>
                <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold text-slate-900">
                  {businessName} · Portfolio
                </h3>
              </div>
              <button type="button" onClick={() => setClientPreview(false)} className="p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer" aria-label="Close">
                <Close fontSize="small" />
              </button>
            </div>
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {albums.filter((a) => a.published).map((album) => (
                <button
                  key={album.id}
                  type="button"
                  onClick={() => {
                    setClientPreview(false)
                    openView(album)
                  }}
                  className="text-left rounded-2xl border border-slate-200 bg-white overflow-hidden hover:border-teal-200 cursor-pointer"
                >
                  <div className="h-40 overflow-hidden">
                    <img src={album.cover} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3">
                    <p className="font-semibold text-slate-800 text-sm">{album.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{album.type} · {album.items} items</p>
                  </div>
                </button>
              ))}
              {!albums.some((a) => a.published) ? (
                <p className="col-span-full py-10 text-center text-sm text-slate-500 font-[family-name:var(--font-ui)]">
                  No published albums yet — couples will see your albums here once you add them.
                </p>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </VendorPageShell>
  )
}

import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Box, Chip, Stack, Typography } from '@mui/material'
import { CardGiftcard } from '@mui/icons-material'
import Logo from '@/marketing/components/Logo'
import apiClient from '@/shared/lib/api'

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

const naira = (n?: number) =>
  typeof n === 'number'
    ? new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(n)
    : '—'

const statusLabel: Record<GiftStatus, string> = {
  wanted: 'Still needed',
  reserved: 'Reserved',
  purchased: 'Purchased',
}

export default function PublicGiftRegistry() {
  const { slug = '' } = useParams()
  const [data, setData] = useState<RegistryPayload | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await apiClient.get(`/api/v1/registry/public/${encodeURIComponent(slug)}`)
        if (!cancelled) setData(res.data)
      } catch {
        // Fallback: local couple registry if API is down and slug matches
        try {
          const local = localStorage.getItem('itw_gift_registry_demo-couple')
          if (local) {
            const parsed = JSON.parse(local) as RegistryPayload
            if (parsed.registry?.slug === slug && !cancelled) {
              setData(parsed)
              return
            }
          }
        } catch {
          /* ignore */
        }
        if (!cancelled) setError('This gift registry could not be found.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [slug])

  const items = (data?.items || []).filter((i) => i.status !== 'purchased')

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F4F7F8' }}>
      <Box
        sx={{
          borderBottom: '1px solid #E2E8F0',
          bgcolor: 'rgba(255,255,255,0.95)',
          px: { xs: 2, md: 4 },
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Logo linkToHome height={36} />
        <Chip label="Public gift registry" sx={{ fontWeight: 700, bgcolor: '#CCFBF1', color: '#0F766E' }} />
      </Box>

      <Box sx={{ maxWidth: 920, mx: 'auto', px: { xs: 2, md: 3 }, py: { xs: 3, md: 5 } }}>
        {loading ? (
          <Typography sx={{ color: '#64748B', textAlign: 'center', py: 8 }}>Loading registry…</Typography>
        ) : error ? (
          <Box className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-8 text-center text-rose-700">
            {error}
          </Box>
        ) : (
          <Stack spacing={3}>
            <Box className="rounded-2xl border border-slate-200 bg-white p-5 md:p-7">
              <div className="flex items-center gap-2 text-teal-800 font-bold text-sm mb-2">
                <CardGiftcard sx={{ fontSize: 18 }} />
                Gift Registry
              </div>
              <Typography
                sx={{
                  fontFamily: 'var(--font-display)',
                  fontSize: { xs: 28, md: 36 },
                  fontWeight: 700,
                  color: '#0B2D31',
                  lineHeight: 1.15,
                }}
              >
                {data?.registry.title}
              </Typography>
              <Typography sx={{ mt: 1.5, color: '#475569', fontSize: 15 }}>{data?.registry.message}</Typography>
              <div className="mt-4 flex flex-wrap gap-2">
                <Chip label={`${data?.stats.wanted ?? 0} still needed`} sx={{ fontWeight: 700 }} />
                <Chip label={`${data?.stats.reserved ?? 0} reserved`} sx={{ fontWeight: 700 }} />
              </div>
            </Box>

            {items.length === 0 ? (
              <Box className="rounded-2xl border border-dashed border-slate-300 bg-white py-12 text-center text-slate-500">
                No open gift items right now — thank you for celebrating with us.
              </Box>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {items.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-2xl border border-slate-200 bg-white overflow-hidden flex flex-col"
                  >
                    <div
                      className="h-40 bg-cover bg-center bg-slate-100"
                      style={{
                        backgroundImage: item.imageUrl
                          ? `url(${item.imageUrl})`
                          : 'linear-gradient(135deg,#CCFBF1,#FEF3C7)',
                      }}
                    />
                    <div className="p-4 flex-1 flex flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-slate-800">{item.title}</h3>
                        <span className="text-[11px] font-bold uppercase tracking-wide text-teal-700 shrink-0">
                          {statusLabel[item.status]}
                        </span>
                      </div>
                      {item.description ? (
                        <p className="text-sm text-slate-500 mt-1 line-clamp-3">{item.description}</p>
                      ) : null}
                      <div className="mt-auto pt-3 flex items-center justify-between gap-2">
                        <span className="font-bold text-teal-800">{naira(item.price)}</span>
                        {item.url ? (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm font-bold text-teal-700 hover:underline"
                          >
                            View item →
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </Stack>
        )}
      </Box>
    </Box>
  )
}

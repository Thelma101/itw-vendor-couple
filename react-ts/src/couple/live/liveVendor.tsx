/* eslint-disable react-refresh/only-export-components */
import { Box, type SxProps, type Theme } from '@mui/material'
import type { DirectoryVendor } from '@/shared/lib/api'
import type { ShortlistItem } from '@/shared/contexts/ShortlistContext'

export function naira(n: number) {
  return `₦${Math.round(n).toLocaleString('en-NG')}`
}

/** Vendors who have not set prices yet show "Price on request" instead of ₦0. */
export function priceLabel(n: number | undefined, prefix = '') {
  return n && n > 0 ? `${prefix}${naira(n)}` : 'Price on request'
}

export function formatDate(value: string) {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function shortlistItemFromCard(card: DirectoryVendor): ShortlistItem {
  return {
    id: card.id,
    name: card.name,
    price: card.price || 0,
    category: card.category,
    image: card.image || card.avatar || '',
    location: card.location || undefined,
    rating: card.rating > 0 ? card.rating : undefined,
  }
}

/** Real vendor photo, or a neutral monogram tile when the vendor has not uploaded one. */
export function VendorImage({
  src,
  name,
  sx,
  rounded = 0,
  onClick,
}: {
  src?: string
  name: string
  sx?: SxProps<Theme>
  rounded?: number | string
  onClick?: () => void
}) {
  if (src) {
    return (
      <Box
        component="img"
        src={src}
        alt={name}
        onClick={onClick}
        sx={[{ objectFit: 'cover', borderRadius: rounded, display: 'block', cursor: onClick ? 'pointer' : undefined }, ...(Array.isArray(sx) ? sx : [sx])]}
      />
    )
  }
  return (
    <Box
      onClick={onClick}
      role="img"
      aria-label={name}
      sx={[
        {
          borderRadius: rounded,
          display: 'grid',
          placeItems: 'center',
          background: 'linear-gradient(135deg, #CCFBF1 0%, #F0FDFA 55%, #FCE7F3 100%)',
          color: '#0F766E',
          fontWeight: 800,
          fontSize: 28,
          cursor: onClick ? 'pointer' : undefined,
          userSelect: 'none',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {(name.trim()[0] || '?').toUpperCase()}
    </Box>
  )
}

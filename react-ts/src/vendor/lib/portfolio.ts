import { useServerState } from '@/shared/hooks/useServerState'

export type AlbumType = 'Photo' | 'Video'

export type Album = {
  id: string
  title: string
  items: number
  type: AlbumType
  cover: string
  published: boolean
  gallery?: string[]
}

export const PORTFOLIO_STORAGE_KEY = 'itw_vendor_portfolio'

export const DEFAULT_ALBUMS: Album[] = [
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

/** Server doc `vendor-portfolio` (read by the couple directory) for live vendors; demo localStorage otherwise. */
export function useVendorPortfolio() {
  return useServerState<Album[]>('vendor-portfolio', {
    demoKey: PORTFOLIO_STORAGE_KEY,
    demo: DEFAULT_ALBUMS,
    empty: [],
  })
}

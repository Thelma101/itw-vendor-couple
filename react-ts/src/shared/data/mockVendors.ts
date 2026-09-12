// src/data/mockVendors.ts
export interface Vendor {
  id: string
  name: string
  price: string
  image: string
  category: string
  location: string
  fullAddress: string
  rating: number
  reviewCount: number
}

export const mockVendors: Vendor[] = [
  // VENUES
  {
    id: 'rosevet-event-center',
    name: 'Rosevet Event Center',
    price: 'N187,000',
    image: 'https://images.unsplash.com/photo-1519167758481-83f2946fead6?w=400&h=300&fit=crop&crop=center',
    category: 'Venue',
    location: 'Ikeja, Lagos',
    fullAddress: '123 Allen Avenue, Ikeja, Lagos State, Nigeria',
    rating: 4.8,
    reviewCount: 124
  },
  {
    id: 'charly-inn',
    name: 'Charly Inn',
    price: 'N387,000',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop&crop=center',
    category: 'Venue',
    location: 'Victoria Island, Lagos',
    fullAddress: '456 Ahmadu Bello Way, Victoria Island, Lagos State, Nigeria',
    rating: 4.6,
    reviewCount: 89
  },
  {
    id: 'esther-suit',
    name: 'Esther Suit',
    price: 'N132,000',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop&crop=center',
    category: 'Venue',
    location: 'Lekki, Lagos',
    fullAddress: '789 Admiralty Way, Lekki Phase 1, Lagos State, Nigeria',
    rating: 4.9,
    reviewCount: 156
  },
  {
    id: 'okeiran-even-homes',
    name: 'Okeiran Even Homes',
    price: 'N812,000',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center',
    category: 'Venue',
    location: 'Ikoyi, Lagos',
    fullAddress: '321 Bourdillon Road, Ikoyi, Lagos State, Nigeria',
    rating: 4.7,
    reviewCount: 203
  },
  {
    id: 'master-event-place',
    name: 'Master Event Place',
    price: 'N1,212,000',
    image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300&fit=crop&crop=center',
    category: 'Venue',
    location: 'Banana Island, Lagos',
    fullAddress: '654 Banana Island Road, Banana Island, Lagos State, Nigeria',
    rating: 4.9,
    reviewCount: 78
  },

  // PHOTOGRAPHERS
  {
    id: 'lens-love-photography',
    name: 'Lens & Love Photography',
    price: 'N150,000',
    image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400&h=300&fit=crop&crop=center',
    category: 'Photography',
    location: 'Lagos',
    fullAddress: '987 Ozumba Mbadiwe Avenue, Victoria Island, Lagos State, Nigeria',
    rating: 4.8,
    reviewCount: 95
  },
  {
    id: 'golden-moments-studio',
    name: 'Golden Moments Studio',
    price: 'N200,000',
    image: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=400&h=300&fit=crop&crop=center',
    category: 'Photography',
    location: 'Lagos',
    fullAddress: '245 Adeola Odeku Street, Victoria Island, Lagos State, Nigeria',
    rating: 4.9,
    reviewCount: 142
  },
  {
    id: 'wedding-lens-pro',
    name: 'Wedding Lens Pro',
    price: 'N120,000',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=center',
    category: 'Photography',
    location: 'Lagos',
    fullAddress: '112 Awolowo Road, Ikoyi, Lagos State, Nigeria',
    rating: 4.7,
    reviewCount: 67
  },

  // FLORISTS
  {
    id: 'bloom-blossom',
    name: 'Bloom & Blossom',
    price: 'N80,000',
    image: 'https://images.unsplash.com/photo-1563241527-3004b7be99c3?w=400&h=300&fit=crop&crop=center',
    category: 'Florist',
    location: 'Lagos',
    fullAddress: '78 Toyin Street, Ikeja, Lagos State, Nigeria',
    rating: 4.8,
    reviewCount: 112
  },
  {
    id: 'elegant-petals',
    name: 'Elegant Petals',
    price: 'N95,000',
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop&crop=center',
    category: 'Florist',
    location: 'Lagos',
    fullAddress: '45 Adeniran Ogunsanya Street, Surulere, Lagos State, Nigeria',
    rating: 4.9,
    reviewCount: 89
  },

  // CAKE & DESSERTS
  {
    id: 'sweet-dreams-bakery',
    name: 'Sweet Dreams Bakery',
    price: 'N45,000',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1c9587?w=400&h=300&fit=crop&crop=center',
    category: 'Cake & Desserts',
    location: 'Lagos',
    fullAddress: '23 Opebi Road, Ikeja, Lagos State, Nigeria',
    rating: 4.6,
    reviewCount: 156
  },
  {
    id: 'royal-cakes-studio',
    name: 'Royal Cakes Studio',
    price: 'N65,000',
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop&crop=center',
    category: 'Cake & Desserts',
    location: 'Lagos',
    fullAddress: '89 Adeyemo Alakija Street, Victoria Island, Lagos State, Nigeria',
    rating: 4.8,
    reviewCount: 203
  },

  // CATERING
  {
    id: 'gourmet-delights',
    name: 'Gourmet Delights',
    price: 'N120,000',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&crop=center',
    category: 'Catering',
    location: 'Lagos',
    fullAddress: '67 Isaac John Street, GRA, Ikeja, Lagos State, Nigeria',
    rating: 4.7,
    reviewCount: 134
  },
  {
    id: 'elite-catering-co',
    name: 'Elite Catering Co',
    price: 'N150,000',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop&crop=center',
    category: 'Catering',
    location: 'Lagos',
    fullAddress: '34 Kofo Abayomi Street, Victoria Island, Lagos State, Nigeria',
    rating: 4.9,
    reviewCount: 178
  },

  // DRESS & APPAREL
  {
    id: 'bridal-elegance',
    name: 'Bridal Elegance',
    price: 'N250,000',
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=300&fit=crop&crop=center',
    category: 'Dress & Apparel',
    location: 'Lagos',
    fullAddress: '152 Broad Street, Lagos Island, Lagos State, Nigeria',
    rating: 4.8,
    reviewCount: 95
  },
  {
    id: 'designer-dreams',
    name: 'Designer Dreams',
    price: 'N180,000',
    image: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=400&h=300&fit=crop&crop=center',
    category: 'Dress & Apparel',
    location: 'Lagos',
    fullAddress: '88 Balogun Street, Lagos Island, Lagos State, Nigeria',
    rating: 4.6,
    reviewCount: 67
  },

  // NEW VENDORS ADDED BELOW

  // MUSIC & ENTERTAINMENT
  {
    id: 'harmony-live-band',
    name: 'Harmony Live Band',
    price: 'N300,000',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=300&fit=crop&crop=center',
    category: 'Music & Entertainment',
    location: 'Lagos',
    fullAddress: '25 Awolowo Road, Ikoyi, Lagos State, Nigeria',
    rating: 4.7,
    reviewCount: 89
  },

  // MAKEUP ARTISTS
  {
    id: 'glamour-beauty-studio',
    name: 'Glamour Beauty Studio',
    price: 'N75,000',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop&crop=center',
    category: 'Makeup Artist',
    location: 'Lagos',
    fullAddress: '47 Ogunlana Drive, Surulere, Lagos State, Nigeria',
    rating: 4.9,
    reviewCount: 134
  },

  // DECOR & RENTALS
  {
    id: 'royal-decor-events',
    name: 'Royal Decor & Events',
    price: 'N180,000',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=300&fit=crop&crop=center',
    category: 'Decor & Rentals',
    location: 'Lagos',
    fullAddress: '62 Adeniyi Jones Avenue, Ikeja, Lagos State, Nigeria',
    rating: 4.8,
    reviewCount: 156
  },

  // TRANSPORTATION
  {
    id: 'luxury-wedding-cars',
    name: 'Luxury Wedding Cars',
    price: 'N95,000',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400&h=300&fit=crop&crop=center',
    category: 'Transportation',
    location: 'Lagos',
    fullAddress: '38 Mobolaji Bank Anthony Way, Ikeja, Lagos State, Nigeria',
    rating: 4.5,
    reviewCount: 78
  },

  // WEDDING PLANNERS
  {
    id: 'perfect-day-planners',
    name: 'Perfect Day Planners',
    price: 'N200,000',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop&crop=center',
    category: 'Wedding Planner',
    location: 'Lagos',
    fullAddress: '15 Sanusi Fafunwa Street, Victoria Island, Lagos State, Nigeria',
    rating: 4.9,
    reviewCount: 203
  }
]

/** Legacy numeric IDs from early demos → slug ids */
export const LEGACY_VENDOR_ID_MAP: Record<string, string> = {
  "1": "rosevet-event-center",
  "2": "charly-inn",
  "3": "esther-suit",
  "4": "okeiran-even-homes",
  "5": "master-event-place",
  "6": "lens-love-photography",
  "7": "golden-moments-studio",
  "8": "wedding-lens-pro",
  "9": "bloom-blossom",
  "10": "elegant-petals",
  "11": "sweet-dreams-bakery",
  "12": "royal-cakes-studio",
  "13": "gourmet-delights",
  "14": "elite-catering-co",
  "15": "bridal-elegance",
  "16": "designer-dreams",
  "17": "harmony-live-band",
  "18": "glamour-beauty-studio",
  "19": "royal-decor-events",
  "20": "luxury-wedding-cars",
  "21": "perfect-day-planners"
}

export function resolveVendorId(id: string | undefined): string | undefined {
  if (!id) return id
  return LEGACY_VENDOR_ID_MAP[id] || id
}

export const getVendorsByCategory = (categories: string[]): Vendor[] => {
  return mockVendors.filter((vendor) => categories.includes(vendor.category))
}

export const getAllCategories = (): string[] => {
  return Array.from(new Set(mockVendors.map((vendor) => vendor.category)))
}

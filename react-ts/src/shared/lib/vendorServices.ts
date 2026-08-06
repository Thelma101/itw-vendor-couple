/** Shared vendor service catalog — couples read the same shape vendors edit. */

export type ServiceType = 'Package' | 'Add-on'

export type VendorService = {
  id: string
  name: string
  price: number
  description: string
  active: boolean
  type: ServiceType
  features: string[]
  /** Highlighted as “Most Popular” on couple profile (packages only). */
  popular?: boolean
}

export const VENDOR_SERVICES_KEY = 'itw_vendor_services'

/** Defaults mirror what couples already see on VendorProfile. */
export const DEFAULT_VENDOR_SERVICES: VendorService[] = [
  {
    id: 'pkg-essential',
    name: 'Essential',
    price: 150000,
    description: 'Perfect for intimate ceremonies',
    active: true,
    type: 'Package',
    features: ['4 hours coverage', '100 edited photos', 'Online gallery', '1 photographer'],
    popular: false,
  },
  {
    id: 'pkg-premium',
    name: 'Premium',
    price: 350000,
    description: 'Our most popular package',
    active: true,
    type: 'Package',
    features: ['8 hours coverage', '300 edited photos', 'Online gallery', '2 photographers', 'Engagement shoot', 'Photo album'],
    popular: true,
  },
  {
    id: 'pkg-luxury',
    name: 'Luxury',
    price: 650000,
    description: 'The complete experience',
    active: true,
    type: 'Package',
    features: [
      'Full day coverage',
      'Unlimited photos',
      'Online gallery',
      '3 photographers',
      'Engagement shoot',
      'Premium album',
      'Drone footage',
      'Same-day edits',
    ],
    popular: false,
  },
  {
    id: 'addon-engagement',
    name: 'Engagement Session',
    price: 95000,
    description: 'Add a styled pre-wedding shoot — couples pick this on top of a package.',
    active: true,
    type: 'Add-on',
    features: ['2 hours', '20 edited images', '1 location'],
  },
  {
    id: 'addon-sameday',
    name: 'Same-day Highlight Film',
    price: 180000,
    description: 'Optional upgrade delivered before reception ends.',
    active: true,
    type: 'Add-on',
    features: ['3-min film', 'Same-day delivery'],
  },
]

export function loadVendorServices(): VendorService[] {
  try {
    const raw = localStorage.getItem(VENDOR_SERVICES_KEY)
    if (!raw) return DEFAULT_VENDOR_SERVICES
    const parsed = JSON.parse(raw) as VendorService[]
    return Array.isArray(parsed) && parsed.length ? parsed : DEFAULT_VENDOR_SERVICES
  } catch {
    return DEFAULT_VENDOR_SERVICES
  }
}

export function saveVendorServices(services: VendorService[]) {
  localStorage.setItem(VENDOR_SERVICES_KEY, JSON.stringify(services))
}

export function activePackages(services: VendorService[] = loadVendorServices()) {
  return services.filter((s) => s.type === 'Package' && s.active)
}

export function activeAddOns(services: VendorService[] = loadVendorServices()) {
  return services.filter((s) => s.type === 'Add-on' && s.active)
}

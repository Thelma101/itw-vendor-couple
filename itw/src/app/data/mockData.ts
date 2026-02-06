export interface Vendor {
  id: string;
  name: string;
  category: string;
  priceRange: string;
  rating: number;
  reviewCount: number;
  location: string;
  image: string;
  featured: boolean;
  description: string;
  services: string[];
  faqs: Array<{ question: string; answer: string }>;
  gallery: string[];
  availability: string[];
}

export interface Inquiry {
  id: string;
  vendorId: string;
  coupleName: string;
  eventDate: string;
  message: string;
  status: 'new' | 'responded' | 'accepted' | 'declined';
  createdAt: string;
  email: string;
  phone: string;
}

export interface Booking {
  id: string;
  vendorId: string;
  clientName: string;
  eventDate: string;
  package: string;
  amount: number;
  status: 'confirmed' | 'pending' | 'completed';
  createdAt: string;
}

export const mockVendors: Vendor[] = [
  {
    id: '1',
    name: 'Elegant Affairs Photography',
    category: 'Photography',
    priceRange: '$$$',
    rating: 4.9,
    reviewCount: 127,
    location: 'Los Angeles, CA',
    image: 'wedding photographer camera',
    featured: true,
    description: 'Award-winning wedding photographers specializing in romantic, timeless imagery. With over 10 years of experience, we capture your special moments with artistic elegance.',
    services: [
      'Full Day Coverage (10 hours)',
      'Engagement Session',
      'Online Gallery',
      'Print Release',
      'Second Photographer',
      'Drone Photography',
    ],
    faqs: [
      {
        question: 'How many weddings do you shoot per year?',
        answer: 'We limit ourselves to 30 weddings per year to ensure each couple receives personalized attention and service.',
      },
      {
        question: 'Do you travel for destination weddings?',
        answer: 'Yes! We love destination weddings and have photographed celebrations around the world.',
      },
      {
        question: 'When will we receive our photos?',
        answer: 'Your gallery will be ready within 6-8 weeks after your wedding day.',
      },
    ],
    gallery: [
      'wedding couple portrait',
      'wedding ceremony outdoor',
      'wedding reception details',
      'bride getting ready',
    ],
    availability: ['2026-05-15', '2026-06-20', '2026-07-10', '2026-08-14'],
  },
  {
    id: '2',
    name: 'Bloom & Petal Floral Design',
    category: 'Florist',
    priceRange: '$$$$',
    rating: 5.0,
    reviewCount: 89,
    location: 'San Francisco, CA',
    image: 'wedding flowers bouquet',
    featured: true,
    description: 'Luxury floral design studio creating breathtaking arrangements for discerning couples. We source seasonal blooms and rare botanicals.',
    services: [
      'Bridal Bouquet',
      'Bridesmaid Bouquets',
      'Ceremony Arrangements',
      'Reception Centerpieces',
      'Ceremony Arch Flowers',
      'Consultation & Design',
    ],
    faqs: [
      {
        question: 'How far in advance should we book?',
        answer: 'We recommend booking 9-12 months in advance, especially for peak wedding season.',
      },
      {
        question: 'Do you offer tastings?',
        answer: 'We offer design consultations where we show you samples and create mood boards.',
      },
    ],
    gallery: [
      'wedding centerpiece flowers',
      'bridal bouquet roses',
      'ceremony arch florals',
      'reception table flowers',
    ],
    availability: ['2026-04-18', '2026-05-22', '2026-09-12'],
  },
  {
    id: '3',
    name: 'Strings & Ivory Music Co.',
    category: 'Music',
    priceRange: '$$',
    rating: 4.8,
    reviewCount: 156,
    location: 'Austin, TX',
    image: 'wedding band live music',
    featured: false,
    description: 'Live wedding bands and string quartets for ceremonies and receptions. From classical elegance to modern party hits.',
    services: [
      'Ceremony Music',
      'Cocktail Hour',
      'Reception Entertainment',
      'DJ Services',
      'Custom Song Arrangements',
      'Sound System Included',
    ],
    faqs: [
      {
        question: 'Can you learn a special song for us?',
        answer: 'Absolutely! We love learning new songs for our couples. Just give us 4-6 weeks notice.',
      },
    ],
    gallery: [
      'live band wedding reception',
      'string quartet ceremony',
      'wedding dj equipment',
    ],
    availability: ['2026-03-14', '2026-06-06', '2026-10-03'],
  },
  {
    id: '4',
    name: 'Sweet Dreams Bakery',
    category: 'Cake',
    priceRange: '$$$',
    rating: 4.7,
    reviewCount: 203,
    location: 'Seattle, WA',
    image: 'wedding cake elegant',
    featured: true,
    description: 'Custom wedding cakes designed to match your wedding aesthetic. Specializing in modern designs and delicious flavors.',
    services: [
      'Custom Cake Design',
      'Tasting Session',
      'Delivery & Setup',
      'Dessert Tables',
      'Cake Toppers',
      'Dietary Accommodations',
    ],
    faqs: [
      {
        question: 'Do you offer tastings?',
        answer: 'Yes! Tastings are included with every wedding cake order.',
      },
    ],
    gallery: [
      'wedding cake three tier',
      'elegant wedding cake flowers',
      'modern wedding cake design',
    ],
    availability: ['2026-05-09', '2026-07-25', '2026-11-14'],
  },
  {
    id: '5',
    name: 'Timeless Moments Videography',
    category: 'Videography',
    priceRange: '$$$',
    rating: 4.9,
    reviewCount: 94,
    location: 'Miami, FL',
    image: 'wedding videographer filming',
    featured: false,
    description: 'Cinematic wedding films that tell your unique love story. We create films you\'ll treasure forever.',
    services: [
      'Full Day Coverage',
      'Highlight Film (5-8 min)',
      'Full Ceremony Edit',
      'Reception Edit',
      'Drone Footage',
      'Raw Footage Access',
    ],
    faqs: [],
    gallery: [
      'wedding video camera',
      'wedding film production',
      'drone wedding footage',
    ],
    availability: ['2026-04-25', '2026-08-08', '2026-09-19'],
  },
  {
    id: '6',
    name: 'Grand Ballroom Venues',
    category: 'Venue',
    priceRange: '$$$$',
    rating: 4.6,
    reviewCount: 178,
    location: 'New York, NY',
    image: 'elegant wedding venue ballroom',
    featured: true,
    description: 'Stunning ballroom venues in the heart of Manhattan. Perfect for elegant, grand celebrations.',
    services: [
      'Indoor Ballroom',
      'Ceremony Space',
      'Bridal Suite',
      'Catering Kitchen',
      'Tables & Chairs',
      'Event Coordinator',
    ],
    faqs: [
      {
        question: 'What is the maximum capacity?',
        answer: 'Our main ballroom can accommodate up to 300 guests for a seated dinner.',
      },
    ],
    gallery: [
      'wedding venue chandelier',
      'ballroom wedding reception',
      'elegant venue interior',
    ],
    availability: ['2026-06-13', '2026-10-10', '2026-11-21'],
  },
  {
    id: '7',
    name: 'Savory Celebrations Catering',
    category: 'Catering',
    priceRange: '$$$',
    rating: 4.8,
    reviewCount: 145,
    location: 'Chicago, IL',
    image: 'wedding catering food display',
    featured: false,
    description: 'Farm-to-table catering with seasonal menus. We create memorable dining experiences.',
    services: [
      'Plated Dinner Service',
      'Buffet Style',
      'Cocktail Hour Apps',
      'Bar Service',
      'Dietary Accommodations',
      'Tasting for 4',
    ],
    faqs: [],
    gallery: [
      'wedding dinner table setting',
      'catering appetizers display',
      'wedding food presentation',
    ],
    availability: ['2026-05-30', '2026-07-18', '2026-09-05'],
  },
  {
    id: '8',
    name: 'Perfect Day Planning Co.',
    category: 'Planning',
    priceRange: '$$$$',
    rating: 5.0,
    reviewCount: 67,
    location: 'Nashville, TN',
    image: 'wedding planner working',
    featured: true,
    description: 'Full-service wedding planning for stress-free celebrations. We handle every detail so you can enjoy your day.',
    services: [
      'Full Planning Service',
      'Partial Planning',
      'Month-of Coordination',
      'Vendor Management',
      'Budget Planning',
      'Timeline Creation',
    ],
    faqs: [
      {
        question: 'When should we hire a planner?',
        answer: 'Ideally 12-18 months before your wedding, but we can help at any stage!',
      },
    ],
    gallery: [
      'wedding planning details',
      'wedding coordinator clipboard',
      'wedding timeline schedule',
    ],
    availability: ['2026-03-01', '2026-04-15', '2026-05-20', '2026-06-25'],
  },
];

export const mockInquiries: Inquiry[] = [
  {
    id: 'inq-1',
    vendorId: '1',
    coupleName: 'Sarah & Michael Thompson',
    eventDate: '2026-09-12',
    message: 'We love your portfolio! We\'re getting married at Rosewood Estate and would love to discuss your packages.',
    status: 'new',
    createdAt: '2026-02-05T10:30:00',
    email: 'sarah.thompson@email.com',
    phone: '(555) 123-4567',
  },
  {
    id: 'inq-2',
    vendorId: '1',
    coupleName: 'Emily & James Chen',
    eventDate: '2026-07-18',
    message: 'Do you have availability for a destination wedding in Napa Valley?',
    status: 'responded',
    createdAt: '2026-02-03T14:20:00',
    email: 'emily.chen@email.com',
    phone: '(555) 234-5678',
  },
  {
    id: 'inq-3',
    vendorId: '1',
    coupleName: 'Jessica & David Martinez',
    eventDate: '2026-10-15',
    message: 'Interested in your engagement + wedding package. Can we schedule a call?',
    status: 'accepted',
    createdAt: '2026-01-28T09:15:00',
    email: 'jessica.m@email.com',
    phone: '(555) 345-6789',
  },
];

export const mockBookings: Booking[] = [
  {
    id: 'book-1',
    vendorId: '1',
    clientName: 'Amanda & Ryan Foster',
    eventDate: '2026-06-20',
    package: 'Premium Package - 10 Hour Coverage',
    amount: 4500,
    status: 'confirmed',
    createdAt: '2025-12-15T11:00:00',
  },
  {
    id: 'book-2',
    vendorId: '1',
    clientName: 'Lauren & Chris Williams',
    eventDate: '2026-08-14',
    package: 'Deluxe Package - Full Day + Engagement',
    amount: 5200,
    status: 'confirmed',
    createdAt: '2026-01-10T16:30:00',
  },
  {
    id: 'book-3',
    vendorId: '1',
    clientName: 'Nicole & Mark Johnson',
    eventDate: '2026-05-15',
    package: 'Classic Package - 8 Hour Coverage',
    amount: 3800,
    status: 'pending',
    createdAt: '2026-01-20T13:45:00',
  },
];

export const categories = [
  { id: 'photography', name: 'Photography', icon: 'Camera' },
  { id: 'videography', name: 'Videography', icon: 'Video' },
  { id: 'venue', name: 'Venues', icon: 'Home' },
  { id: 'catering', name: 'Catering', icon: 'UtensilsCrossed' },
  { id: 'florist', name: 'Florists', icon: 'Flower2' },
  { id: 'cake', name: 'Cakes', icon: 'Cake' },
  { id: 'music', name: 'Music & DJ', icon: 'Music' },
  { id: 'planning', name: 'Planners', icon: 'Calendar' },
];

export const testimonials = [
  {
    id: 1,
    name: 'Rachel & Tom',
    text: 'iTheeWed made finding our dream vendors so easy! We booked our photographer, florist, and venue all through the platform.',
    date: 'Married June 2025',
    rating: 5,
  },
  {
    id: 2,
    name: 'Sophia & Alex',
    text: 'The vendor profiles are so detailed and the messaging system made communication seamless. Highly recommend!',
    date: 'Married September 2025',
    rating: 5,
  },
  {
    id: 3,
    name: 'Maria & Daniel',
    text: 'As vendors ourselves, the platform has helped us connect with amazing couples. The lead management system is fantastic!',
    date: 'Vendor since 2024',
    rating: 5,
  },
];

// src/data/mockVendors.ts
export interface Vendor {
    id: string
    name: string
    price: string
    image: string
    category: string
    location: string
    rating: number
    reviewCount: number
  }
  
  export const mockVendors: Vendor[] = [
    // VENUES
    {
      id: '1',
      name: 'Rosevet Event Center',
      price: 'N187,000',
      image: '/images/rosevet.jpg',
      category: 'Venue',
      location: 'Ikeja, Lagos',
      rating: 4.8,
      reviewCount: 124
    },
    {
      id: '2',
      name: 'Charly Inn',
      price: 'N387,000',
      image: '/images/charly-inn.jpg',
      category: 'Venue',
      location: 'Victoria Island, Lagos',
      rating: 4.6,
      reviewCount: 89
    },
    {
      id: '3',
      name: 'Esther Suit',
      price: 'N132,000',
      image: '/images/esther-suit.jpg',
      category: 'Venue',
      location: 'Lekki, Lagos',
      rating: 4.9,
      reviewCount: 156
    },
    {
      id: '4',
      name: 'Okeiran Even Homes',
      price: 'N812,000',
      image: '/images/okeiran.jpg',
      category: 'Venue',
      location: 'Ikoyi, Lagos',
      rating: 4.7,
      reviewCount: 203
    },
    {
      id: '5',
      name: 'Master Event Place',
      price: 'N1,212,000',
      image: '/images/master-event.jpg',
      category: 'Venue',
      location: 'Banana Island, Lagos',
      rating: 4.9,
      reviewCount: 78
    },
  
    // PHOTOGRAPHERS
    {
      id: '6',
      name: 'Lens & Love Photography',
      price: 'N150,000',
      image: '/images/lens-love.jpg',
      category: 'Photography',
      location: 'Lagos',
      rating: 4.8,
      reviewCount: 95
    },
    {
      id: '7',
      name: 'Golden Moments Studio',
      price: 'N200,000',
      image: '/images/golden-moments.jpg',
      category: 'Photography',
      location: 'Lagos',
      rating: 4.9,
      reviewCount: 142
    },
    {
      id: '8',
      name: 'Wedding Lens Pro',
      price: 'N120,000',
      image: '/images/wedding-lens.jpg',
      category: 'Photography',
      location: 'Lagos',
      rating: 4.7,
      reviewCount: 67
    },
  
    // FLORISTS
    {
      id: '9',
      name: 'Bloom & Blossom',
      price: 'N80,000',
      image: '/images/bloom-blossom.jpg',
      category: 'Florist',
      location: 'Lagos',
      rating: 4.8,
      reviewCount: 112
    },
    {
      id: '10',
      name: 'Elegant Petals',
      price: 'N95,000',
      image: '/images/elegant-petals.jpg',
      category: 'Florist',
      location: 'Lagos',
      rating: 4.9,
      reviewCount: 89
    },
  
    // CAKE & DESSERTS
    {
      id: '11',
      name: 'Sweet Dreams Bakery',
      price: 'N45,000',
      image: '/images/sweet-dreams.jpg',
      category: 'Cake & Desserts',
      location: 'Lagos',
      rating: 4.6,
      reviewCount: 156
    },
    {
      id: '12',
      name: 'Royal Cakes Studio',
      price: 'N65,000',
      image: '/images/royal-cakes.jpg',
      category: 'Cake & Desserts',
      location: 'Lagos',
      rating: 4.8,
      reviewCount: 203
    },
  
    // CATERING
    {
      id: '13',
      name: 'Gourmet Delights',
      price: 'N120,000',
      image: '/images/gourmet-delights.jpg',
      category: 'Catering',
      location: 'Lagos',
      rating: 4.7,
      reviewCount: 134
    },
    {
      id: '14',
      name: 'Elite Catering Co',
      price: 'N150,000',
      image: '/images/elite-catering.jpg',
      category: 'Catering',
      location: 'Lagos',
      rating: 4.9,
      reviewCount: 178
    },
  
    // DRESS & APPAREL
    {
      id: '15',
      name: 'Bridal Elegance',
      price: 'N250,000',
      image: '/images/bridal-elegance.jpg',
      category: 'Dress & Apparel',
      location: 'Lagos',
      rating: 4.8,
      reviewCount: 95
    },
    {
      id: '16',
      name: 'Designer Dreams',
      price: 'N180,000',
      image: '/images/designer-dreams.jpg',
      category: 'Dress & Apparel',
      location: 'Lagos',
      rating: 4.6,
      reviewCount: 67
    }
  ]
  
  // Helper function to filter vendors by category
  export const getVendorsByCategory = (categories: string[]): Vendor[] => {
    return mockVendors.filter(vendor => categories.includes(vendor.category))
  }
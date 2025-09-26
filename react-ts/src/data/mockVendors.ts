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
      id: '1',
      name: 'Rosevet Event Center',
      price: 'N187,000',
      image: 'https://images.unsplash.com/photo-1519167758481-83f2946fead6?w=400&h=300&fit=crop&crop=center',
      category: 'Venue',
      location: 'Ikeja, Lagos',
      fullAddress: '123 Allen Avenue, Ikeja, Lagos State, Nigeria',
      fullAddress: '123 Allen Avenue, Ikeja, Lagos State, Nigeria',
      rating: 4.8,
      reviewCount: 124
    },
    {
      id: '2',
      name: 'Charly Inn',
      price: 'N387,000',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop&crop=center',
      category: 'Venue',
      location: 'Victoria Island, Lagos',
      fullAddress: '456 Ahmadu Bello Way, Victoria Island, Lagos State, Nigeria',
      fullAddress: '456 Ahmadu Bello Way, Victoria Island, Lagos State, Nigeria',
      rating: 4.6,
      reviewCount: 89
    },
    {
      id: '3',
      name: 'Esther Suit',
      price: 'N132,000',
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop&crop=center',
      category: 'Venue',
      location: 'Lekki, Lagos',
      fullAddress: '789 Admiralty Way, Lekki Phase 1, Lagos State, Nigeria',
      fullAddress: '789 Admiralty Way, Lekki Phase 1, Lagos State, Nigeria',
      rating: 4.9,
      reviewCount: 156
    },
    {
      id: '4',
      name: 'Okeiran Even Homes',
      price: 'N812,000',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center',
      category: 'Venue',
      location: 'Ikoyi, Lagos',
      fullAddress: '321 Bourdillon Road, Ikoyi, Lagos State, Nigeria',
      fullAddress: '321 Bourdillon Road, Ikoyi, Lagos State, Nigeria',
      rating: 4.7,
      reviewCount: 203
    },
    {
      id: '5',
      name: 'Master Event Place',
      price: 'N1,212,000',
      image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300&fit=crop&crop=center',
      category: 'Venue',
      location: 'Banana Island, Lagos',
      fullAddress: '654 Banana Island Road, Banana Island, Lagos State, Nigeria',
      fullAddress: '654 Banana Island Road, Banana Island, Lagos State, Nigeria',
      rating: 4.9,
      reviewCount: 78
    },
  
    // PHOTOGRAPHERS
    {
      id: '6',
      name: 'Lens & Love Photography',
      price: 'N150,000',
      image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400&h=300&fit=crop&crop=center',
      category: 'Photography',
      location: 'Lagos',
      fullAddress: '987 Marina Road, Lagos Island, Lagos State, Nigeria',
      fullAddress: '987 Ozumba Mbadiwe Avenue, Victoria Island, Lagos State, Nigeria',
      rating: 4.8,
      reviewCount: 95
    },
    {
      id: '7',
      name: 'Golden Moments Studio',
      price: 'N200,000',
      image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400&h=300&fit=crop&crop=center',
      category: 'Photography',
      location: 'Lagos',
      fullAddress: '987 Marina Road, Lagos Island, Lagos State, Nigeria',
      fullAddress: '987 Ozumba Mbadiwe Avenue, Victoria Island, Lagos State, Nigeria',
      rating: 4.9,
      reviewCount: 142
    },
    {
      id: '8',
      name: 'Wedding Lens Pro',
      price: 'N120,000',
      image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400&h=300&fit=crop&crop=center',
      category: 'Photography',
      location: 'Lagos',
      fullAddress: '987 Marina Road, Lagos Island, Lagos State, Nigeria',
      fullAddress: '987 Ozumba Mbadiwe Avenue, Victoria Island, Lagos State, Nigeria',
      rating: 4.7,
      reviewCount: 67
    },
  
    // FLORISTS
    {
      id: '9',
      name: 'Bloom & Blossom',
      price: 'N80,000',
      image: 'https://images.unsplash.com/photo-1563241527-3004b7be99c3?w=400&h=300&fit=crop&crop=center',
      category: 'Florist',
      location: 'Lagos',
      fullAddress: '987 Marina Road, Lagos Island, Lagos State, Nigeria',
      fullAddress: '987 Ozumba Mbadiwe Avenue, Victoria Island, Lagos State, Nigeria',
      rating: 4.8,
      reviewCount: 112
    },
    {
      id: '10',
      name: 'Elegant Petals',
      price: 'N95,000',
      image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop&crop=center',
      category: 'Florist',
      location: 'Lagos',
      fullAddress: '987 Marina Road, Lagos Island, Lagos State, Nigeria',
      fullAddress: '987 Ozumba Mbadiwe Avenue, Victoria Island, Lagos State, Nigeria',
      rating: 4.9,
      reviewCount: 89
    },
  
    // CAKE & DESSERTS
    {
      id: '11',
      name: 'Sweet Dreams Bakery',
      price: 'N45,000',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1c9587?w=400&h=300&fit=crop&crop=center',
      category: 'Cake & Desserts',
      location: 'Lagos',
      fullAddress: '987 Marina Road, Lagos Island, Lagos State, Nigeria',
      fullAddress: '987 Ozumba Mbadiwe Avenue, Victoria Island, Lagos State, Nigeria',
      rating: 4.6,
      reviewCount: 156
    },
    {
      id: '12',
      name: 'Royal Cakes Studio',
      price: 'N65,000',
      image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop&crop=center',
      category: 'Cake & Desserts',
      location: 'Lagos',
      fullAddress: '987 Marina Road, Lagos Island, Lagos State, Nigeria',
      fullAddress: '987 Ozumba Mbadiwe Avenue, Victoria Island, Lagos State, Nigeria',
      rating: 4.8,
      reviewCount: 203
    },
  
    // CATERING
    {
      id: '13',
      name: 'Gourmet Delights',
      price: 'N120,000',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&crop=center',
      category: 'Catering',
      location: 'Lagos',
      fullAddress: '987 Marina Road, Lagos Island, Lagos State, Nigeria',
      fullAddress: '987 Ozumba Mbadiwe Avenue, Victoria Island, Lagos State, Nigeria',
      rating: 4.7,
      reviewCount: 134
    },
    {
      id: '14',
      name: 'Elite Catering Co',
      price: 'N150,000',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&crop=center',
      category: 'Catering',
      location: 'Lagos',
      fullAddress: '987 Marina Road, Lagos Island, Lagos State, Nigeria',
      fullAddress: '987 Ozumba Mbadiwe Avenue, Victoria Island, Lagos State, Nigeria',
      rating: 4.9,
      reviewCount: 178
    },
  
    // DRESS & APPAREL
    {
      id: '15',
      name: 'Bridal Elegance',
      price: 'N250,000',
      image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=300&fit=crop&crop=center',
      category: 'Dress & Apparel',
      location: 'Lagos',
      fullAddress: '987 Marina Road, Lagos Island, Lagos State, Nigeria',
      fullAddress: '987 Ozumba Mbadiwe Avenue, Victoria Island, Lagos State, Nigeria',
      rating: 4.8,
      reviewCount: 95
    },
    {
      id: '16',
      name: 'Designer Dreams',
      price: 'N180,000',
      image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=300&fit=crop&crop=center',
      category: 'Dress & Apparel',
      location: 'Lagos',
      fullAddress: '987 Marina Road, Lagos Island, Lagos State, Nigeria',
      fullAddress: '987 Ozumba Mbadiwe Avenue, Victoria Island, Lagos State, Nigeria',
      rating: 4.6,
      reviewCount: 67
    }
  ]
  
  // Helper function to filter vendors by category
  export const getVendorsByCategory = (categories: string[]): Vendor[] => {
    return mockVendors.filter(vendor => categories.includes(vendor.category))
  }
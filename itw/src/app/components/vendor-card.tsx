import { Heart, MapPin } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Vendor } from '../data/mockData';
import { Rating } from './rating';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface VendorCardProps {
  vendor: Vendor;
}

export function VendorCard({ vendor }: VendorCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className="relative aspect-[4/3] overflow-hidden">
        <ImageWithFallback
          src={`https://source.unsplash.com/800x600/?${encodeURIComponent(vendor.image)}`}
          alt={vendor.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsFavorited(!isFavorited);
          }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-md"
        >
          <Heart
            className={`w-5 h-5 ${
              isFavorited ? 'fill-primary text-primary' : 'text-gray-600'
            }`}
          />
        </button>
        {vendor.featured && (
          <div className="absolute top-3 left-3 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-medium">
            Featured
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-serif text-lg text-gray-900 mb-1">
              {vendor.name}
            </h3>
            <p className="text-sm text-gray-600">{vendor.category}</p>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-primary-foreground">
              {vendor.priceRange}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <Rating rating={vendor.rating} size="sm" />
          <span className="text-xs text-gray-600">
            ({vendor.reviewCount} reviews)
          </span>
        </div>

        <div className="flex items-center text-xs text-gray-600 mb-4">
          <MapPin className="w-3.5 h-3.5 mr-1" />
          {vendor.location}
        </div>

        <Link to={`/vendor/${vendor.id}`}>
          <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors">
            View Details
          </Button>
        </Link>
      </div>
    </Card>
  );
}

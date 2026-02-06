import { Star } from 'lucide-react';

interface RatingProps {
  rating: number;
  showNumber?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function Rating({ rating, showNumber = false, size = 'md' }: RatingProps) {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, index) => (
        <Star
          key={index}
          className={`${sizeClasses[size]} ${
            index < Math.floor(rating)
              ? 'fill-accent text-accent'
              : 'fill-none text-gray-300'
          }`}
        />
      ))}
      {showNumber && (
        <span className={`ml-1 ${textSizeClasses[size]} text-gray-600`}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

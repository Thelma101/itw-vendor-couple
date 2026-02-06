import { Filter, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { CoupleNav } from '../components/couple-nav';
import { Button } from '../components/ui/button';
import { Checkbox } from '../components/ui/checkbox';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Slider } from '../components/ui/slider';
import { VendorCard } from '../components/vendor-card';
import { mockVendors } from '../data/mockData';

export function Search() {
  const location = useLocation();
  const initialCategory = location.state?.category || '';

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [priceRange, setPriceRange] = useState([1, 4]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);

  const filteredVendors = mockVendors.filter((vendor) => {
    if (selectedCategory && vendor.category.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }
    if (vendor.rating < minRating) {
      return false;
    }
    return true;
  });

  const sortedVendors = [...filteredVendors].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'reviews') return b.reviewCount - a.reviewCount;
    if (sortBy === 'price-low') {
      return a.priceRange.length - b.priceRange.length;
    }
    if (sortBy === 'price-high') {
      return b.priceRange.length - a.priceRange.length;
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-muted pb-20 md:pb-8">
      <CoupleNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-serif text-3xl md:text-4xl text-secondary mb-2">
            {selectedCategory
              ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Vendors`
              : 'All Vendors'}
          </h1>
          <p className="text-gray-600">
            {sortedVendors.length} vendors found
          </p>
        </div>

        <div className="flex gap-6">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg text-gray-900">Filters</h3>
                <Button variant="ghost" size="sm" onClick={() => {
                  setSelectedCategory('');
                  setPriceRange([1, 4]);
                  setMinRating(0);
                }}>
                  Clear
                </Button>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <Label className="mb-3 block">Category</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    <SelectItem value="photography">Photography</SelectItem>
                    <SelectItem value="videography">Videography</SelectItem>
                    <SelectItem value="venue">Venues</SelectItem>
                    <SelectItem value="catering">Catering</SelectItem>
                    <SelectItem value="florist">Florists</SelectItem>
                    <SelectItem value="cake">Cakes</SelectItem>
                    <SelectItem value="music">Music & DJ</SelectItem>
                    <SelectItem value="planning">Planners</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <Label className="mb-3 block">Price Range</Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Checkbox id="price1" />
                    <Label htmlFor="price1" className="cursor-pointer">
                      $ (Under $1,000)
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="price2" />
                    <Label htmlFor="price2" className="cursor-pointer">
                      $$ ($1,000 - $3,000)
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="price3" />
                    <Label htmlFor="price3" className="cursor-pointer">
                      $$$ ($3,000 - $5,000)
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="price4" />
                    <Label htmlFor="price4" className="cursor-pointer">
                      $$$$ ($5,000+)
                    </Label>
                  </div>
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <Label className="mb-3 block">Minimum Rating</Label>
                <div className="space-y-2">
                  {[5, 4.5, 4, 3.5].map((rating) => (
                    <div key={rating} className="flex items-center gap-2">
                      <Checkbox
                        id={`rating-${rating}`}
                        checked={minRating === rating}
                        onCheckedChange={(checked) => {
                          if (checked) setMinRating(rating);
                          else setMinRating(0);
                        }}
                      />
                      <Label htmlFor={`rating-${rating}`} className="cursor-pointer">
                        {rating}+ Stars
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Style Filter */}
              <div className="mb-6">
                <Label className="mb-3 block">Style</Label>
                <div className="space-y-2">
                  {['Modern', 'Classic', 'Rustic', 'Vintage', 'Bohemian'].map((style) => (
                    <div key={style} className="flex items-center gap-2">
                      <Checkbox id={style.toLowerCase()} />
                      <Label htmlFor={style.toLowerCase()} className="cursor-pointer">
                        {style}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div>
                <Label className="mb-3 block">Availability</Label>
                <div className="flex items-center gap-2">
                  <Checkbox id="available" />
                  <Label htmlFor="available" className="cursor-pointer">
                    Available on my date
                  </Label>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Sort & Filter Toggle */}
            <div className="flex items-center justify-between mb-6">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
              </Button>

              <div className="flex items-center gap-2 ml-auto">
                <span className="text-sm text-gray-600 hidden sm:inline">Sort by:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="reviews">Most Reviewed</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Mobile Filters */}
            {showFilters && (
              <div className="lg:hidden bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg text-gray-900">Filters</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedCategory('');
                      setPriceRange([1, 4]);
                      setMinRating(0);
                    }}
                  >
                    Clear All
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="mb-2 block">Category</Label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Categories</SelectItem>
                        <SelectItem value="photography">Photography</SelectItem>
                        <SelectItem value="videography">Videography</SelectItem>
                        <SelectItem value="venue">Venues</SelectItem>
                        <SelectItem value="catering">Catering</SelectItem>
                        <SelectItem value="florist">Florists</SelectItem>
                        <SelectItem value="cake">Cakes</SelectItem>
                        <SelectItem value="music">Music & DJ</SelectItem>
                        <SelectItem value="planning">Planners</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="mb-2 block">Minimum Rating</Label>
                    <Select
                      value={minRating.toString()}
                      onValueChange={(val) => setMinRating(Number(val))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Any Rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Any Rating</SelectItem>
                        <SelectItem value="5">5 Stars</SelectItem>
                        <SelectItem value="4.5">4.5+ Stars</SelectItem>
                        <SelectItem value="4">4+ Stars</SelectItem>
                        <SelectItem value="3.5">3.5+ Stars</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  className="w-full mt-4"
                  onClick={() => setShowFilters(false)}
                >
                  Apply Filters
                </Button>
              </div>
            )}

            {/* Vendor Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {sortedVendors.map((vendor) => (
                <VendorCard key={vendor.id} vendor={vendor} />
              ))}
            </div>

            {sortedVendors.length === 0 && (
              <div className="text-center py-16">
                <Filter className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl text-gray-900 mb-2">No vendors found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters to see more results
                </p>
                <Button
                  onClick={() => {
                    setSelectedCategory('');
                    setPriceRange([1, 4]);
                    setMinRating(0);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

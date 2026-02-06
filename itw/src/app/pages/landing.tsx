import {
  Calendar,
  Camera,
  Cake,
  Flower2,
  Heart,
  Home,
  MapPin,
  Music,
  Search,
  UtensilsCrossed,
  Video,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CoupleNav } from '../components/couple-nav';
import { Rating } from '../components/rating';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { categories, testimonials } from '../data/mockData';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const categoryIcons: { [key: string]: any } = {
  Camera,
  Video,
  Home,
  UtensilsCrossed,
  Flower2,
  Cake,
  Music,
  Calendar,
};

export function Landing() {
  const navigate = useNavigate();
  const [searchLocation, setSearchLocation] = useState('');
  const [searchCategory, setSearchCategory] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/search', {
      state: { location: searchLocation, category: searchCategory },
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <CoupleNav />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-white to-accent/10 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-secondary mb-6">
              Find Your Perfect Wedding Vendors
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-10">
              Connect with trusted professionals to bring your dream wedding to life
            </p>

            {/* Search Bar */}
            <form
              onSubmit={handleSearch}
              className="bg-white rounded-2xl shadow-xl p-4 md:p-6 max-w-4xl mx-auto"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Location"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="pl-10 h-12 bg-input-background border-0"
                  />
                </div>

                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                  <Input
                    type="date"
                    placeholder="Wedding Date"
                    className="pl-10 h-12 bg-input-background border-0"
                  />
                </div>

                <Select value={searchCategory} onValueChange={setSearchCategory}>
                  <SelectTrigger className="h-12 bg-input-background border-0">
                    <SelectValue placeholder="Vendor Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full md:w-auto mt-4 bg-secondary hover:bg-secondary/90 h-12 px-8"
              >
                <Search className="w-5 h-5 mr-2" />
                Search Vendors
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl text-secondary mb-4">
              Browse by Category
            </h2>
            <p className="text-gray-600">
              Find the perfect vendors for every aspect of your wedding
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category) => {
              const IconComponent = categoryIcons[category.icon];
              return (
                <Card
                  key={category.id}
                  onClick={() => navigate('/search', { state: { category: category.id } })}
                  className="p-6 md:p-8 hover:shadow-lg transition-all duration-300 cursor-pointer group text-center"
                >
                  <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <IconComponent className="w-7 h-7 md:w-8 md:h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-base md:text-lg text-gray-900">
                    {category.name}
                  </h3>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl text-secondary mb-4">
              How It Works
            </h2>
            <p className="text-gray-600">
              Finding your dream vendors is easy with iTheeWed
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-secondary text-white flex items-center justify-center text-2xl font-serif">
                1
              </div>
              <h3 className="text-xl mb-3 text-gray-900">Search & Browse</h3>
              <p className="text-gray-600">
                Discover vendors that match your style, budget, and location
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-secondary text-white flex items-center justify-center text-2xl font-serif">
                2
              </div>
              <h3 className="text-xl mb-3 text-gray-900">Connect & Compare</h3>
              <p className="text-gray-600">
                Message vendors directly and compare packages to find the perfect fit
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-secondary text-white flex items-center justify-center text-2xl font-serif">
                3
              </div>
              <h3 className="text-xl mb-3 text-gray-900">Book with Confidence</h3>
              <p className="text-gray-600">
                Secure your vendors and manage everything from your dashboard
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl text-secondary mb-4">
              Loved by Couples & Vendors
            </h2>
            <p className="text-gray-600">
              See what our community has to say
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="p-6 md:p-8">
                <Rating rating={testimonial.rating} size="sm" />
                <p className="text-gray-700 my-4 leading-relaxed">
                  "{testimonial.text}"
                </p>
                <div className="border-t border-border pt-4">
                  <p className="text-sm text-gray-900">{testimonial.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{testimonial.date}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-secondary to-secondary/90">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl md:text-4xl text-white mb-6">
            Ready to Start Planning?
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Join thousands of couples who have found their perfect vendors through iTheeWed
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate('/search')}
              className="bg-white text-secondary hover:bg-white/90"
            >
              Find Vendors
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/vendor-dashboard')}
              className="border-white text-white hover:bg-white/10"
            >
              List Your Business
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Heart className="w-5 h-5 text-primary mr-2 fill-primary" />
                <span className="font-serif text-xl">iTheeWed</span>
              </div>
              <p className="text-sm text-gray-400">
                Your trusted wedding vendor marketplace
              </p>
            </div>

            <div>
              <h4 className="mb-4">For Couples</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Find Vendors
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Planning Tools
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Real Weddings
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4">For Vendors</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    List Your Business
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Resources
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            © 2026 iTheeWed. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

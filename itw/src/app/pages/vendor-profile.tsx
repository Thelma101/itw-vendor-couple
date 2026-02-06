import {
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  Mail,
  MapPin,
  MessageSquare,
  Share2,
  Star,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CoupleNav } from '../components/couple-nav';
import { Rating } from '../components/rating';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { mockVendors } from '../data/mockData';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function VendorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const vendor = mockVendors.find((v) => v.id === id);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    eventDate: '',
    message: '',
    package: '',
  });

  if (!vendor) {
    return (
      <div className="min-h-screen bg-white">
        <CoupleNav />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl text-gray-900 mb-4">Vendor not found</h2>
          <Button onClick={() => navigate('/search')}>Back to Search</Button>
        </div>
      </div>
    );
  }

  const allImages = [vendor.image, ...vendor.gallery];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the inquiry to the backend
    alert('Inquiry sent successfully!');
    setIsInquiryModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-white pb-20 md:pb-8">
      <CoupleNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Search
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery Carousel */}
            <div className="relative aspect-[16/10] bg-gray-100 rounded-xl overflow-hidden group">
              <ImageWithFallback
                src={`https://source.unsplash.com/1200x800/?${encodeURIComponent(allImages[currentImageIndex])}`}
                alt={vendor.name}
                className="w-full h-full object-cover"
              />

              {/* Navigation Arrows */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-lg"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-lg"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Image Counter */}
              <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {allImages.length}
              </div>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
              {allImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`aspect-square rounded-lg overflow-hidden ${
                    index === currentImageIndex
                      ? 'ring-2 ring-primary'
                      : 'opacity-60 hover:opacity-100'
                  } transition-all`}
                >
                  <ImageWithFallback
                    src={`https://source.unsplash.com/300x300/?${encodeURIComponent(image)}`}
                    alt={`${vendor.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* About Section */}
            <Card className="p-6 md:p-8">
              <h2 className="text-2xl mb-4 text-gray-900">About</h2>
              <p className="text-gray-700 leading-relaxed">{vendor.description}</p>
            </Card>

            {/* Services */}
            <Card className="p-6 md:p-8">
              <h2 className="text-2xl mb-4 text-gray-900">Services Included</h2>
              <div className="grid md:grid-cols-2 gap-3">
                {vendor.services.map((service, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </div>
                    <span className="text-gray-700">{service}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* FAQs */}
            {vendor.faqs.length > 0 && (
              <Card className="p-6 md:p-8">
                <h2 className="text-2xl mb-6 text-gray-900">Frequently Asked Questions</h2>
                <div className="space-y-6">
                  {vendor.faqs.map((faq, index) => (
                    <div key={index}>
                      <h3 className="text-lg text-gray-900 mb-2">
                        {faq.question}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Reviews Section */}
            <Card className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl text-gray-900">Reviews</h2>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-3xl text-gray-900">{vendor.rating}</span>
                    <Star className="w-6 h-6 fill-accent text-accent" />
                  </div>
                  <p className="text-sm text-gray-600">
                    {vendor.reviewCount} reviews
                  </p>
                </div>
              </div>

              {/* Sample Reviews */}
              <div className="space-y-6">
                <div className="border-b border-border pb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary-foreground">
                      SM
                    </div>
                    <div>
                      <p className="text-sm text-gray-900">Sarah Mitchell</p>
                      <Rating rating={5} size="sm" />
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    Absolutely incredible work! We couldn't be happier with the results. Professional, creative, and so easy to work with.
                  </p>
                  <p className="text-xs text-gray-500 mt-2">Married June 2025</p>
                </div>

                <div className="border-b border-border pb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary-foreground">
                      JD
                    </div>
                    <div>
                      <p className="text-sm text-gray-900">Jessica Davis</p>
                      <Rating rating={5} size="sm" />
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    Exceeded all our expectations! Every detail was perfect and the quality is outstanding. Highly recommend!
                  </p>
                  <p className="text-xs text-gray-500 mt-2">Married September 2025</p>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary-foreground">
                      EM
                    </div>
                    <div>
                      <p className="text-sm text-gray-900">Emily Martinez</p>
                      <Rating rating={5} size="sm" />
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    Such a wonderful experience from start to finish. Talented, professional, and truly cared about making our day special.
                  </p>
                  <p className="text-xs text-gray-500 mt-2">Married August 2025</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-4">
              <Card className="p-6">
                <div className="mb-6">
                  <h1 className="font-serif text-2xl md:text-3xl text-secondary mb-2">
                    {vendor.name}
                  </h1>
                  <p className="text-gray-600 mb-2">{vendor.category}</p>
                  <div className="flex items-center text-gray-600 text-sm">
                    <MapPin className="w-4 h-4 mr-1" />
                    {vendor.location}
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-6 pb-6 border-b border-border">
                  <Rating rating={vendor.rating} showNumber size="md" />
                  <span className="text-sm text-gray-600">
                    ({vendor.reviewCount} reviews)
                  </span>
                </div>

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Starting Price</span>
                    <span className="text-xl text-secondary">
                      {vendor.priceRange}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={() => setIsInquiryModalOpen(true)}
                    className="w-full bg-secondary hover:bg-secondary/90"
                    size="lg"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Send Inquiry
                  </Button>

                  <Button
                    onClick={() => setIsSaved(!isSaved)}
                    variant="outline"
                    className="w-full"
                    size="lg"
                  >
                    <Heart
                      className={`w-4 h-4 mr-2 ${
                        isSaved ? 'fill-primary text-primary' : ''
                      }`}
                    />
                    {isSaved ? 'Saved' : 'Save to Shortlist'}
                  </Button>

                  <Button variant="outline" className="w-full" size="lg">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </Card>

              {/* Availability Preview */}
              <Card className="p-6">
                <h3 className="text-lg mb-4 text-gray-900">
                  Available Dates
                </h3>
                <div className="space-y-2">
                  {vendor.availability.slice(0, 3).map((date) => (
                    <div
                      key={date}
                      className="flex items-center gap-2 text-sm text-gray-600"
                    >
                      <Calendar className="w-4 h-4 text-primary-foreground" />
                      {new Date(date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                  ))}
                </div>
                <Button
                  variant="link"
                  className="mt-4 p-0 h-auto text-primary-foreground"
                >
                  View full calendar
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Inquiry Modal */}
      <Dialog open={isInquiryModalOpen} onOpenChange={setIsInquiryModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-secondary">
              Send Inquiry to {vendor.name}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleInquirySubmit} className="space-y-6 mt-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Your Name *</Label>
                <Input
                  id="name"
                  required
                  value={inquiryForm.name}
                  onChange={(e) =>
                    setInquiryForm({ ...inquiryForm, name: e.target.value })
                  }
                  placeholder="John & Jane Doe"
                />
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={inquiryForm.email}
                  onChange={(e) =>
                    setInquiryForm({ ...inquiryForm, email: e.target.value })
                  }
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={inquiryForm.phone}
                  onChange={(e) =>
                    setInquiryForm({ ...inquiryForm, phone: e.target.value })
                  }
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <Label htmlFor="eventDate">Event Date *</Label>
                <Input
                  id="eventDate"
                  type="date"
                  required
                  value={inquiryForm.eventDate}
                  onChange={(e) =>
                    setInquiryForm({ ...inquiryForm, eventDate: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <Label htmlFor="package">Package/Service Interest</Label>
              <Input
                id="package"
                value={inquiryForm.package}
                onChange={(e) =>
                  setInquiryForm({ ...inquiryForm, package: e.target.value })
                }
                placeholder="e.g., Full Day Coverage"
              />
            </div>

            <div>
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                required
                rows={5}
                value={inquiryForm.message}
                onChange={(e) =>
                  setInquiryForm({ ...inquiryForm, message: e.target.value })
                }
                placeholder="Tell us about your wedding day and what you're looking for..."
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsInquiryModalOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-secondary hover:bg-secondary/90">
                <Mail className="w-4 h-4 mr-2" />
                Send Inquiry
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

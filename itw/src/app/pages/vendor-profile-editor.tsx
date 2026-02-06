import {
  Camera,
  Check,
  MapPin,
  Plus,
  Save,
  Upload,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { VendorSidebar } from '../components/vendor-sidebar';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Checkbox } from '../components/ui/checkbox';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { mockVendors } from '../data/mockData';

export function VendorProfileEditor() {
  const vendor = mockVendors[0]; // Using first vendor as example

  const [businessName, setBusinessName] = useState(vendor.name);
  const [category, setCategory] = useState(vendor.category);
  const [location, setLocation] = useState(vendor.location);
  const [priceRange, setPriceRange] = useState(vendor.priceRange);
  const [description, setDescription] = useState(vendor.description);
  const [services, setServices] = useState(vendor.services);
  const [newService, setNewService] = useState('');
  const [faqs, setFaqs] = useState(vendor.faqs);
  const [newFaqQuestion, setNewFaqQuestion] = useState('');
  const [newFaqAnswer, setNewFaqAnswer] = useState('');

  const [availableDays, setAvailableDays] = useState({
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: true,
    sunday: false,
  });

  const handleAddService = () => {
    if (newService.trim()) {
      setServices([...services, newService.trim()]);
      setNewService('');
    }
  };

  const handleRemoveService = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const handleAddFaq = () => {
    if (newFaqQuestion.trim() && newFaqAnswer.trim()) {
      setFaqs([
        ...faqs,
        { question: newFaqQuestion.trim(), answer: newFaqAnswer.trim() },
      ]);
      setNewFaqQuestion('');
      setNewFaqAnswer('');
    }
  };

  const handleRemoveFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    alert('Profile saved successfully!');
  };

  return (
    <div className="min-h-screen bg-muted flex">
      <VendorSidebar />

      <div className="flex-1 lg:ml-64">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-serif text-3xl md:text-4xl text-secondary mb-2">
              Business Profile
            </h1>
            <p className="text-gray-600">
              Keep your profile up to date to attract more couples
            </p>
          </div>

          <div className="space-y-6">
            {/* Profile Photo */}
            <Card className="p-6 md:p-8">
              <h2 className="text-2xl mb-6 text-gray-900">Profile Photo & Logo</h2>
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="w-32 h-32 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <Camera className="w-12 h-12 text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-4">
                    Upload a professional photo or logo for your business. JPG, PNG, or
                    GIF. Max 5MB.
                  </p>
                  <Button variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Photo
                  </Button>
                </div>
              </div>
            </Card>

            {/* Basic Information */}
            <Card className="p-6 md:p-8">
              <h2 className="text-2xl mb-6 text-gray-900">Basic Information</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Your business name"
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Photography">Photography</SelectItem>
                      <SelectItem value="Videography">Videography</SelectItem>
                      <SelectItem value="Venue">Venue</SelectItem>
                      <SelectItem value="Catering">Catering</SelectItem>
                      <SelectItem value="Florist">Florist</SelectItem>
                      <SelectItem value="Cake">Cake</SelectItem>
                      <SelectItem value="Music">Music & DJ</SelectItem>
                      <SelectItem value="Planning">Planning</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="location">Location *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="City, State"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="priceRange">Price Range *</Label>
                  <Select value={priceRange} onValueChange={setPriceRange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="$">$ (Under $1,000)</SelectItem>
                      <SelectItem value="$$">$$ ($1,000 - $3,000)</SelectItem>
                      <SelectItem value="$$$">$$$ ($3,000 - $5,000)</SelectItem>
                      <SelectItem value="$$$$">$$$$ ($5,000+)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-6">
                <Label htmlFor="description">Business Description *</Label>
                <Textarea
                  id="description"
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell couples about your business, your style, and what makes you unique..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  {description.length} / 500 characters
                </p>
              </div>
            </Card>

            {/* Services */}
            <Card className="p-6 md:p-8">
              <h2 className="text-2xl mb-6 text-gray-900">Services Offered</h2>
              
              <div className="space-y-3 mb-4">
                {services.map((service, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted"
                  >
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary-foreground" />
                      <span className="text-gray-900">{service}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveService(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  placeholder="Add a new service..."
                  onKeyPress={(e) => e.key === 'Enter' && handleAddService()}
                />
                <Button onClick={handleAddService}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>
            </Card>

            {/* Gallery */}
            <Card className="p-6 md:p-8">
              <h2 className="text-2xl mb-6 text-gray-900">Photo Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {vendor.gallery.map((_, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center relative group"
                  >
                    <Camera className="w-8 h-8 text-gray-400" />
                    <button className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <Button variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Upload Photos
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                Upload up to 20 high-quality photos. Recommended size: 1200x800px
              </p>
            </Card>

            {/* FAQs */}
            <Card className="p-6 md:p-8">
              <h2 className="text-2xl mb-6 text-gray-900">
                Frequently Asked Questions
              </h2>

              <div className="space-y-4 mb-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="p-4 rounded-lg border border-border">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-gray-900">{faq.question}</h3>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveFaq(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600">{faq.answer}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="newQuestion">Question</Label>
                  <Input
                    id="newQuestion"
                    value={newFaqQuestion}
                    onChange={(e) => setNewFaqQuestion(e.target.value)}
                    placeholder="e.g., How far in advance should we book?"
                  />
                </div>
                <div>
                  <Label htmlFor="newAnswer">Answer</Label>
                  <Textarea
                    id="newAnswer"
                    rows={3}
                    value={newFaqAnswer}
                    onChange={(e) => setNewFaqAnswer(e.target.value)}
                    placeholder="Your answer..."
                  />
                </div>
                <Button onClick={handleAddFaq}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add FAQ
                </Button>
              </div>
            </Card>

            {/* Availability */}
            <Card className="p-6 md:p-8">
              <h2 className="text-2xl mb-6 text-gray-900">Availability Settings</h2>
              
              <div className="mb-6">
                <Label className="mb-3 block">Available Days</Label>
                <div className="space-y-3">
                  {Object.entries(availableDays).map(([day, checked]) => (
                    <div key={day} className="flex items-center gap-3">
                      <Checkbox
                        id={day}
                        checked={checked}
                        onCheckedChange={(value) =>
                          setAvailableDays({ ...availableDays, [day]: !!value })
                        }
                      />
                      <Label
                        htmlFor={day}
                        className="cursor-pointer capitalize"
                      >
                        {day}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="leadTime">Lead Time Required</Label>
                <Select defaultValue="3">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 month</SelectItem>
                    <SelectItem value="3">3 months</SelectItem>
                    <SelectItem value="6">6 months</SelectItem>
                    <SelectItem value="9">9 months</SelectItem>
                    <SelectItem value="12">12 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Card>

            {/* Contact Information */}
            <Card className="p-6 md:p-8">
              <h2 className="text-2xl mb-6 text-gray-900">Contact Information</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="email">Business Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="contact@yourbusiness.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://yourbusiness.com"
                  />
                </div>
                <div>
                  <Label htmlFor="instagram">Instagram Handle</Label>
                  <Input
                    id="instagram"
                    placeholder="@yourbusiness"
                  />
                </div>
              </div>
            </Card>

            {/* Save Button */}
            <div className="flex gap-4 sticky bottom-4 bg-white p-4 rounded-lg shadow-lg border border-border">
              <Button
                onClick={handleSave}
                className="flex-1 bg-secondary hover:bg-secondary/90"
                size="lg"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
              <Button variant="outline" size="lg">
                Preview Profile
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

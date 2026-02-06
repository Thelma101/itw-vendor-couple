import {
  Calendar,
  Check,
  CheckCircle2,
  Heart,
  MessageSquare,
  Star,
  Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { CoupleNav } from '../components/couple-nav';
import { Rating } from '../components/rating';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { mockVendors } from '../data/mockData';

export function CoupleDashboard() {
  const weddingDate = new Date('2026-09-12');
  const today = new Date();
  const daysUntilWedding = Math.ceil(
    (weddingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  const savedVendors = mockVendors.slice(0, 3);
  const bookedVendors = mockVendors.slice(0, 2);

  const checklist = [
    { task: 'Book Venue', completed: true },
    { task: 'Hire Photographer', completed: true },
    { task: 'Choose Florist', completed: false },
    { task: 'Book Catering', completed: false },
    { task: 'Order Cake', completed: false },
    { task: 'Hire Videographer', completed: false },
    { task: 'Book Music/DJ', completed: false },
    { task: 'Send Invitations', completed: false },
  ];

  const completedTasks = checklist.filter((item) => item.completed).length;
  const progress = (completedTasks / checklist.length) * 100;

  const messages = [
    {
      id: 1,
      vendor: 'Elegant Affairs Photography',
      message: 'Thanks for your inquiry! I have availability...',
      time: '2 hours ago',
      unread: true,
    },
    {
      id: 2,
      vendor: 'Bloom & Petal Floral Design',
      message: "I'd love to discuss your floral vision...",
      time: '1 day ago',
      unread: true,
    },
    {
      id: 3,
      vendor: 'Sweet Dreams Bakery',
      message: 'Your tasting is confirmed for next week!',
      time: '3 days ago',
      unread: false,
    },
  ];

  return (
    <div className="min-h-screen bg-muted pb-20 md:pb-8">
      <CoupleNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl md:text-4xl text-secondary mb-2">
            Welcome Back! 👋
          </h1>
          <p className="text-gray-600">
            Your wedding planning dashboard
          </p>
        </div>

        {/* Wedding Countdown */}
        <Card className="p-6 md:p-8 mb-8 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-2">Your Big Day</p>
              <h2 className="font-serif text-2xl md:text-3xl text-secondary mb-2">
                September 12, 2026
              </h2>
              <p className="text-gray-600">Rosewood Estate, Napa Valley</p>
            </div>
            <div className="text-center">
              <div className="text-5xl md:text-6xl text-primary-foreground mb-2">
                {daysUntilWedding}
              </div>
              <p className="text-sm text-gray-600">Days to Go!</p>
            </div>
          </div>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Vendors Booked</p>
                <p className="text-3xl text-secondary">{bookedVendors.length}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">New Messages</p>
                <p className="text-3xl text-secondary">2</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-secondary" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Tasks Completed</p>
                <p className="text-3xl text-secondary">
                  {completedTasks}/{checklist.length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Check className="w-6 h-6 text-accent-foreground" />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Booked Vendors */}
            <Card className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl text-gray-900">Booked Vendors</h2>
                <Link to="/search">
                  <Button variant="outline" size="sm">
                    Find More
                  </Button>
                </Link>
              </div>

              <div className="space-y-4">
                {bookedVendors.map((vendor) => (
                  <div
                    key={vendor.id}
                    className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg border border-border hover:shadow-md transition-shadow"
                  >
                    <img
                      src={`https://source.unsplash.com/200x200/?${encodeURIComponent(vendor.image)}`}
                      alt={vendor.name}
                      className="w-full sm:w-20 h-32 sm:h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg text-gray-900">{vendor.name}</h3>
                          <p className="text-sm text-gray-600">{vendor.category}</p>
                        </div>
                        <Badge className="bg-primary/10 text-primary-foreground hover:bg-primary/20">
                          Confirmed
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <Rating rating={vendor.rating} size="sm" />
                        <span className="text-xs text-gray-600">
                          ({vendor.reviewCount} reviews)
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm">
                          <MessageSquare className="w-3 h-3 mr-1" />
                          Message
                        </Button>
                        <Link to={`/vendor/${vendor.id}`}>
                          <Button variant="ghost" size="sm">
                            View Profile
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Saved Vendors */}
            <Card className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl text-gray-900">Shortlist</h2>
                <span className="text-sm text-gray-600">
                  {savedVendors.length} vendors
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {savedVendors.map((vendor) => (
                  <Link
                    key={vendor.id}
                    to={`/vendor/${vendor.id}`}
                    className="block group"
                  >
                    <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-3">
                      <img
                        src={`https://source.unsplash.com/600x400/?${encodeURIComponent(vendor.image)}`}
                        alt={vendor.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white">
                        <Heart className="w-4 h-4 fill-primary text-primary" />
                      </button>
                    </div>
                    <h3 className="text-gray-900 mb-1 group-hover:text-primary-foreground transition-colors">
                      {vendor.name}
                    </h3>
                    <p className="text-sm text-gray-600">{vendor.category}</p>
                  </Link>
                ))}
              </div>
            </Card>

            {/* Recent Messages */}
            <Card className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl text-gray-900">Recent Messages</h2>
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </div>

              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-4 rounded-lg border transition-colors cursor-pointer ${
                      msg.unread
                        ? 'bg-primary/5 border-primary/20'
                        : 'border-border hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-gray-900">{msg.vendor}</h3>
                      <span className="text-xs text-gray-500">{msg.time}</span>
                    </div>
                    <p className="text-sm text-gray-600">{msg.message}</p>
                    {msg.unread && (
                      <Badge className="mt-3 bg-primary text-primary-foreground">
                        New
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Planning Progress */}
            <Card className="p-6">
              <h3 className="text-lg mb-4 text-gray-900">Planning Progress</h3>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Overall Progress</span>
                  <span className="text-sm text-gray-900">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
              <p className="text-sm text-gray-600">
                {completedTasks} of {checklist.length} tasks completed
              </p>
            </Card>

            {/* Checklist Widget */}
            <Card className="p-6">
              <h3 className="text-lg mb-4 text-gray-900">Wedding Checklist</h3>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {checklist.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${
                        item.completed
                          ? 'bg-primary border-primary'
                          : 'border-gray-300'
                      }`}
                    >
                      {item.completed && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span
                      className={`text-sm ${
                        item.completed
                          ? 'text-gray-500 line-through'
                          : 'text-gray-700'
                      }`}
                    >
                      {item.task}
                    </span>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4" size="sm">
                View Full Checklist
              </Button>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-lg mb-4 text-gray-900">Quick Actions</h3>
              <div className="space-y-2">
                <Link to="/search">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    Find Vendors
                  </Button>
                </Link>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  View Timeline
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Heart className="w-4 h-4 mr-2" />
                  Browse Inspiration
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
import {
  Calendar,
  CheckCircle,
  DollarSign,
  Inbox,
  TrendingUp,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { VendorSidebar } from '../components/vendor-sidebar';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { mockBookings, mockInquiries } from '../data/mockData';

export function VendorDashboard() {
  const newInquiries = mockInquiries.filter((inq) => inq.status === 'new');
  const pendingBookings = mockBookings.filter((b) => b.status === 'pending');
  const monthlyEarnings = mockBookings.reduce((sum, b) => sum + b.amount, 0);

  const profileCompleteness = 85;

  const upcomingEvents = mockBookings
    .filter((b) => new Date(b.eventDate) > new Date())
    .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
    .slice(0, 3);

  const recentInquiries = mockInquiries.slice(0, 4);

  return (
    <div className="min-h-screen bg-muted flex">
      <VendorSidebar />

      <div className="flex-1 lg:ml-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-serif text-3xl md:text-4xl text-secondary mb-2">
              Dashboard
            </h1>
            <p className="text-gray-600">
              Manage your business and connect with couples
            </p>
          </div>

          {/* Profile Completeness Alert */}
          {profileCompleteness < 100 && (
            <Card className="p-6 mb-8 bg-accent/10 border-accent/20">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg text-gray-900 mb-2">
                    Complete Your Profile
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    A complete profile gets 3x more inquiries from couples
                  </p>
                  <div className="flex items-center gap-3">
                    <Progress value={profileCompleteness} className="h-2 flex-1 max-w-xs" />
                    <span className="text-sm text-gray-900">{profileCompleteness}%</span>
                  </div>
                </div>
                <Link to="/vendor-profile">
                  <Button className="bg-secondary hover:bg-secondary/90">
                    Complete Profile
                  </Button>
                </Link>
              </div>
            </Card>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Inbox className="w-6 h-6 text-primary-foreground" />
                </div>
                <Badge className="bg-primary text-primary-foreground">
                  {newInquiries.length} New
                </Badge>
              </div>
              <p className="text-3xl text-secondary mb-1">
                {mockInquiries.length}
              </p>
              <p className="text-sm text-gray-600">Total Leads</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-secondary" />
                </div>
                <Badge className="bg-secondary/10 text-secondary">
                  {pendingBookings.length} Pending
                </Badge>
              </div>
              <p className="text-3xl text-secondary mb-1">
                {mockBookings.length}
              </p>
              <p className="text-sm text-gray-600">Active Bookings</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-accent-foreground" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-3xl text-secondary mb-1">
                ${monthlyEarnings.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">This Month</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <p className="text-3xl text-secondary mb-1">4.9</p>
              <p className="text-sm text-gray-600">Average Rating</p>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Recent Inquiries */}
              <Card className="p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl text-gray-900">Recent Inquiries</h2>
                  <Link to="/vendor-leads">
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                  </Link>
                </div>

                <div className="space-y-4">
                  {recentInquiries.map((inquiry) => (
                    <div
                      key={inquiry.id}
                      className="p-4 rounded-lg border border-border hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col sm:flex-row items-start justify-between gap-3 mb-3">
                        <div>
                          <h3 className="text-gray-900 mb-1">
                            {inquiry.coupleName}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Event Date:{' '}
                            {new Date(inquiry.eventDate).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge
                          className={
                            inquiry.status === 'new'
                              ? 'bg-primary text-primary-foreground'
                              : inquiry.status === 'responded'
                              ? 'bg-secondary/10 text-secondary'
                              : inquiry.status === 'accepted'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }
                        >
                          {inquiry.status.charAt(0).toUpperCase() +
                            inquiry.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700 mb-4">
                        {inquiry.message}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" className="bg-secondary hover:bg-secondary/90">
                          Respond
                        </Button>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Upcoming Events */}
              <Card className="p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl text-gray-900">Upcoming Events</h2>
                  <Link to="/vendor-bookings">
                    <Button variant="outline" size="sm">
                      View Calendar
                    </Button>
                  </Link>
                </div>

                <div className="space-y-4">
                  {upcomingEvents.length > 0 ? (
                    upcomingEvents.map((booking) => (
                      <div
                        key={booking.id}
                        className="p-4 rounded-lg border border-border hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-gray-900 mb-1">
                              {booking.clientName}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {booking.package}
                            </p>
                          </div>
                          <Badge className="bg-green-100 text-green-800">
                            {booking.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(booking.eventDate).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-1" />
                            ${booking.amount.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No upcoming events scheduled
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <Card className="p-6">
                <h3 className="text-lg mb-4 text-gray-900">This Month</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-border">
                    <span className="text-sm text-gray-600">Profile Views</span>
                    <span className="text-lg text-gray-900">342</span>
                  </div>
                  <div className="flex items-center justify-between pb-4 border-b border-border">
                    <span className="text-sm text-gray-600">Inquiries</span>
                    <span className="text-lg text-gray-900">
                      {mockInquiries.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pb-4 border-b border-border">
                    <span className="text-sm text-gray-600">Conversion Rate</span>
                    <span className="text-lg text-green-600">68%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Avg Response Time</span>
                    <span className="text-lg text-gray-900">2.3 hrs</span>
                  </div>
                </div>
              </Card>

              {/* Quick Actions */}
              <Card className="p-6">
                <h3 className="text-lg mb-4 text-gray-900">Quick Actions</h3>
                <div className="space-y-2">
                  <Link to="/vendor-leads">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <Inbox className="w-4 h-4 mr-2" />
                      Check New Leads
                    </Button>
                  </Link>
                  <Link to="/vendor-bookings">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      View Calendar
                    </Button>
                  </Link>
                  <Link to="/vendor-profile">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </Link>
                </div>
              </Card>

              {/* Tips */}
              <Card className="p-6 bg-primary/5 border-primary/20">
                <h3 className="text-lg mb-3 text-gray-900">💡 Pro Tip</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Vendors who respond to inquiries within 2 hours are 80% more
                  likely to book the wedding!
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

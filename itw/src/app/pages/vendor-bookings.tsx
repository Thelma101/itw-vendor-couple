import {
  Calendar as CalendarIcon,
  DollarSign,
  Eye,
  Filter,
  Mail,
  MapPin,
  Phone,
  User,
} from 'lucide-react';
import { useState } from 'react';
import { VendorSidebar } from '../components/vendor-sidebar';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Booking, mockBookings } from '../data/mockData';
import { Calendar } from '../components/ui/calendar';

export function VendorBookings() {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const filteredBookings = mockBookings.filter((booking) => {
    return filterStatus === 'all' || booking.status === filterStatus;
  });

  const confirmedBookings = mockBookings.filter((b) => b.status === 'confirmed');
  const pendingBookings = mockBookings.filter((b) => b.status === 'pending');
  const completedBookings = mockBookings.filter((b) => b.status === 'completed');

  // Get bookings for calendar dates
  const bookingDates = mockBookings.map(b => new Date(b.eventDate));

  const BookingCard = ({ booking }: { booking: Booking }) => (
    <Card
      className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => setSelectedBooking(booking)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg text-gray-900 mb-1">{booking.clientName}</h3>
          <p className="text-sm text-gray-600 mb-2">{booking.package}</p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-600">
            <div className="flex items-center">
              <CalendarIcon className="w-4 h-4 mr-1" />
              {new Date(booking.eventDate).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </div>
            <span className="hidden sm:inline">•</span>
            <div className="flex items-center">
              <DollarSign className="w-4 h-4 mr-1" />
              ${booking.amount.toLocaleString()}
            </div>
          </div>
        </div>
        <Badge
          className={
            booking.status === 'confirmed'
              ? 'bg-green-100 text-green-800'
              : booking.status === 'pending'
              ? 'bg-secondary/10 text-secondary'
              : 'bg-gray-100 text-gray-800'
          }
        >
          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </Badge>
      </div>

      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedBooking(booking);
          }}
        >
          <Eye className="w-3 h-3 mr-1" />
          View Details
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            alert(`Contact ${booking.clientName}`);
          }}
        >
          <Mail className="w-3 h-3 mr-1" />
          Contact
        </Button>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-muted flex">
      <VendorSidebar />

      <div className="flex-1 lg:ml-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-serif text-3xl md:text-4xl text-secondary mb-2">
              Bookings & Events
            </h1>
            <p className="text-gray-600">
              Manage your confirmed and upcoming bookings
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
            <Card className="p-6">
              <p className="text-sm text-gray-600 mb-2">Confirmed</p>
              <p className="text-3xl text-green-600">{confirmedBookings.length}</p>
            </Card>
            <Card className="p-6">
              <p className="text-sm text-gray-600 mb-2">Pending</p>
              <p className="text-3xl text-secondary">{pendingBookings.length}</p>
            </Card>
            <Card className="p-6">
              <p className="text-sm text-gray-600 mb-2">Total Revenue</p>
              <p className="text-3xl text-secondary">
                ${mockBookings.reduce((sum, b) => sum + b.amount, 0).toLocaleString()}
              </p>
            </Card>
          </div>

          {/* View Toggle & Filter */}
          <Card className="p-6 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  List View
                </Button>
                <Button
                  variant={viewMode === 'calendar' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('calendar')}
                >
                  Calendar View
                </Button>
              </div>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Bookings</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* List View */}
          {viewMode === 'list' && (
            <Tabs defaultValue="all" className="space-y-6">
              <TabsList>
                <TabsTrigger value="all">
                  All ({filteredBookings.length})
                </TabsTrigger>
                <TabsTrigger value="confirmed">
                  Confirmed ({confirmedBookings.length})
                </TabsTrigger>
                <TabsTrigger value="pending">
                  Pending ({pendingBookings.length})
                </TabsTrigger>
                <TabsTrigger value="completed">
                  Completed ({completedBookings.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {filteredBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
                {filteredBookings.length === 0 && (
                  <Card className="p-12 text-center">
                    <p className="text-gray-500">No bookings found</p>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="confirmed" className="space-y-4">
                {confirmedBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
                {confirmedBookings.length === 0 && (
                  <Card className="p-12 text-center">
                    <p className="text-gray-500">No confirmed bookings</p>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="pending" className="space-y-4">
                {pendingBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
                {pendingBookings.length === 0 && (
                  <Card className="p-12 text-center">
                    <p className="text-gray-500">No pending bookings</p>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="completed" className="space-y-4">
                {completedBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
                {completedBookings.length === 0 && (
                  <Card className="p-12 text-center">
                    <p className="text-gray-500">No completed bookings</p>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          )}

          {/* Calendar View */}
          {viewMode === 'calendar' && (
            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 p-6">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="w-full"
                  modifiers={{
                    booked: bookingDates,
                  }}
                  modifiersStyles={{
                    booked: {
                      backgroundColor: '#E8B4B8',
                      color: '#722F37',
                      fontWeight: 'bold',
                    },
                  }}
                />
              </Card>

              <Card className="p-6">
                <h3 className="text-lg mb-4 text-gray-900">
                  {selectedDate?.toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </h3>
                
                {selectedDate && (
                  <div className="space-y-3">
                    {mockBookings
                      .filter(
                        (b) =>
                          new Date(b.eventDate).toDateString() ===
                          selectedDate.toDateString()
                      )
                      .map((booking) => (
                        <div
                          key={booking.id}
                          className="p-4 rounded-lg border border-border cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => setSelectedBooking(booking)}
                        >
                          <p className="text-sm text-gray-900 mb-1">
                            {booking.clientName}
                          </p>
                          <p className="text-xs text-gray-600">{booking.package}</p>
                          <Badge className="mt-2 bg-green-100 text-green-800">
                            {booking.status}
                          </Badge>
                        </div>
                      ))}
                    {mockBookings.filter(
                      (b) =>
                        new Date(b.eventDate).toDateString() ===
                        selectedDate.toDateString()
                    ).length === 0 && (
                      <p className="text-sm text-gray-500">
                        No events scheduled for this date
                      </p>
                    )}
                  </div>
                )}
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Booking Detail Modal */}
      <Dialog
        open={selectedBooking !== null}
        onOpenChange={(open) => !open && setSelectedBooking(null)}
      >
        <DialogContent className="max-w-2xl">
          {selectedBooking && (
            <>
              <DialogHeader>
                <DialogTitle className="font-serif text-2xl text-secondary">
                  Booking Details
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Status */}
                <div>
                  <Badge
                    className={
                      selectedBooking.status === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : selectedBooking.status === 'pending'
                        ? 'bg-secondary/10 text-secondary'
                        : 'bg-gray-100 text-gray-800'
                    }
                  >
                    {selectedBooking.status.charAt(0).toUpperCase() +
                      selectedBooking.status.slice(1)}
                  </Badge>
                </div>

                {/* Client Info */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-600 mb-1 block">Client Name</Label>
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2 text-gray-600" />
                      <p className="text-gray-900">{selectedBooking.clientName}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-600 mb-1 block">Event Date</Label>
                    <div className="flex items-center">
                      <CalendarIcon className="w-4 h-4 mr-2 text-gray-600" />
                      <p className="text-gray-900">
                        {new Date(selectedBooking.eventDate).toLocaleDateString(
                          'en-US',
                          {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          }
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Package & Amount */}
                <div>
                  <Label className="text-gray-600 mb-2 block">Package</Label>
                  <Card className="p-4 bg-muted">
                    <p className="text-gray-900 mb-2">{selectedBooking.package}</p>
                    <div className="flex items-center text-2xl text-secondary">
                      <DollarSign className="w-6 h-6" />
                      {selectedBooking.amount.toLocaleString()}
                    </div>
                  </Card>
                </div>

                {/* Booking Info */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-600 mb-1 block">Booked On</Label>
                    <p className="text-gray-900">
                      {new Date(selectedBooking.createdAt).toLocaleDateString(
                        'en-US',
                        {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        }
                      )}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-600 mb-1 block">Booking ID</Label>
                    <p className="text-gray-900 font-mono text-sm">
                      {selectedBooking.id}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button className="flex-1 bg-secondary hover:bg-secondary/90">
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Client
                  </Button>
                  {selectedBooking.status === 'pending' && (
                    <Button variant="outline" className="flex-1">
                      Confirm Booking
                    </Button>
                  )}
                  <Button variant="outline" className="flex-1">
                    View Contract
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

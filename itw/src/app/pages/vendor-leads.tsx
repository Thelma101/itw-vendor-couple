import {
  Calendar,
  Check,
  Mail,
  Phone,
  Search,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { VendorSidebar } from '../components/vendor-sidebar';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Textarea } from '../components/ui/textarea';
import { Inquiry, mockInquiries } from '../data/mockData';

export function VendorLeads() {
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  const filteredInquiries = mockInquiries.filter((inquiry) => {
    const matchesStatus = filterStatus === 'all' || inquiry.status === filterStatus;
    const matchesSearch =
      inquiry.coupleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const newLeads = mockInquiries.filter((inq) => inq.status === 'new');
  const respondedLeads = mockInquiries.filter((inq) => inq.status === 'responded');
  const convertedLeads = mockInquiries.filter((inq) => inq.status === 'accepted');

  const handleAccept = (inquiry: Inquiry) => {
    alert(`Accepted inquiry from ${inquiry.coupleName}`);
    setSelectedInquiry(null);
  };

  const handleDecline = (inquiry: Inquiry) => {
    alert(`Declined inquiry from ${inquiry.coupleName}`);
    setSelectedInquiry(null);
  };

  const handleSendResponse = () => {
    if (selectedInquiry && responseMessage) {
      alert(`Response sent to ${selectedInquiry.coupleName}`);
      setResponseMessage('');
      setSelectedInquiry(null);
    }
  };

  const LeadCard = ({ inquiry }: { inquiry: Inquiry }) => (
    <Card
      className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => setSelectedInquiry(inquiry)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg text-gray-900 mb-1">{inquiry.coupleName}</h3>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-600">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {new Date(inquiry.eventDate).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </div>
            <span className="hidden sm:inline">•</span>
            <span>
              Received{' '}
              {new Date(inquiry.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
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
          {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
        </Badge>
      </div>

      <p className="text-gray-700 mb-4 line-clamp-2">{inquiry.message}</p>

      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedInquiry(inquiry);
          }}
          className="bg-secondary hover:bg-secondary/90"
        >
          View Details
        </Button>
        {inquiry.status === 'new' && (
          <>
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                handleAccept(inquiry);
              }}
            >
              <Check className="w-3 h-3 mr-1" />
              Accept
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                handleDecline(inquiry);
              }}
            >
              <X className="w-3 h-3 mr-1" />
              Decline
            </Button>
          </>
        )}
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
              Leads & Inquiries
            </h1>
            <p className="text-gray-600">
              Manage incoming inquiries from couples
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
            <Card className="p-6">
              <p className="text-sm text-gray-600 mb-2">New Leads</p>
              <p className="text-3xl text-secondary">{newLeads.length}</p>
            </Card>
            <Card className="p-6">
              <p className="text-sm text-gray-600 mb-2">In Progress</p>
              <p className="text-3xl text-secondary">{respondedLeads.length}</p>
            </Card>
            <Card className="p-6">
              <p className="text-sm text-gray-600 mb-2">Converted</p>
              <p className="text-3xl text-green-600">{convertedLeads.length}</p>
            </Card>
          </div>

          {/* Filters */}
          <Card className="p-6 mb-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by couple name or message..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="responded">Responded</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="declined">Declined</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList>
              <TabsTrigger value="all">
                All ({filteredInquiries.length})
              </TabsTrigger>
              <TabsTrigger value="new">
                New ({newLeads.length})
              </TabsTrigger>
              <TabsTrigger value="responded">
                In Progress ({respondedLeads.length})
              </TabsTrigger>
              <TabsTrigger value="converted">
                Converted ({convertedLeads.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {filteredInquiries.map((inquiry) => (
                <LeadCard key={inquiry.id} inquiry={inquiry} />
              ))}
              {filteredInquiries.length === 0 && (
                <Card className="p-12 text-center">
                  <p className="text-gray-500">No inquiries found</p>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="new" className="space-y-4">
              {newLeads.map((inquiry) => (
                <LeadCard key={inquiry.id} inquiry={inquiry} />
              ))}
              {newLeads.length === 0 && (
                <Card className="p-12 text-center">
                  <p className="text-gray-500">No new inquiries</p>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="responded" className="space-y-4">
              {respondedLeads.map((inquiry) => (
                <LeadCard key={inquiry.id} inquiry={inquiry} />
              ))}
              {respondedLeads.length === 0 && (
                <Card className="p-12 text-center">
                  <p className="text-gray-500">No inquiries in progress</p>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="converted" className="space-y-4">
              {convertedLeads.map((inquiry) => (
                <LeadCard key={inquiry.id} inquiry={inquiry} />
              ))}
              {convertedLeads.length === 0 && (
                <Card className="p-12 text-center">
                  <p className="text-gray-500">No converted leads yet</p>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Lead Detail Modal */}
      <Dialog
        open={selectedInquiry !== null}
        onOpenChange={(open) => !open && setSelectedInquiry(null)}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedInquiry && (
            <>
              <DialogHeader>
                <DialogTitle className="font-serif text-2xl text-secondary">
                  Inquiry from {selectedInquiry.coupleName}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Status Badge */}
                <div>
                  <Badge
                    className={
                      selectedInquiry.status === 'new'
                        ? 'bg-primary text-primary-foreground'
                        : selectedInquiry.status === 'responded'
                        ? 'bg-secondary/10 text-secondary'
                        : selectedInquiry.status === 'accepted'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }
                  >
                    {selectedInquiry.status.charAt(0).toUpperCase() +
                      selectedInquiry.status.slice(1)}
                  </Badge>
                </div>

                {/* Couple Info */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-600 mb-1 block">Couple Name</Label>
                    <p className="text-gray-900">{selectedInquiry.coupleName}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600 mb-1 block">Event Date</Label>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-600" />
                      <p className="text-gray-900">
                        {new Date(selectedInquiry.eventDate).toLocaleDateString(
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
                  <div>
                    <Label className="text-gray-600 mb-1 block">Email</Label>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-gray-600" />
                      <a
                        href={`mailto:${selectedInquiry.email}`}
                        className="text-primary-foreground hover:underline"
                      >
                        {selectedInquiry.email}
                      </a>
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-600 mb-1 block">Phone</Label>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-gray-600" />
                      <a
                        href={`tel:${selectedInquiry.phone}`}
                        className="text-primary-foreground hover:underline"
                      >
                        {selectedInquiry.phone}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <Label className="text-gray-600 mb-2 block">Message</Label>
                  <Card className="p-4 bg-muted">
                    <p className="text-gray-700 leading-relaxed">
                      {selectedInquiry.message}
                    </p>
                  </Card>
                </div>

                {/* Response Form */}
                <div>
                  <Label htmlFor="response" className="mb-2 block">
                    Your Response
                  </Label>
                  <Textarea
                    id="response"
                    rows={5}
                    value={responseMessage}
                    onChange={(e) => setResponseMessage(e.target.value)}
                    placeholder="Type your response to the couple..."
                  />
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleSendResponse}
                    disabled={!responseMessage}
                    className="flex-1 bg-secondary hover:bg-secondary/90"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Send Response
                  </Button>
                  {selectedInquiry.status === 'new' && (
                    <>
                      <Button
                        onClick={() => handleAccept(selectedInquiry)}
                        variant="outline"
                        className="flex-1"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Accept
                      </Button>
                      <Button
                        onClick={() => handleDecline(selectedInquiry)}
                        variant="outline"
                        className="flex-1"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Decline
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

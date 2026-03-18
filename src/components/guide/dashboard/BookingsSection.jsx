import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  XCircle, 
  MessageSquare, 
  CheckCircle2, 
  Star, 
  Clock, 
  Circle,
  User 
} from 'lucide-react';

export default function BookingsSection({ 
  bookingStats, 
  loadingBookings, 
  bookingError, 
  bookings, 
  handleBookingAction,
  setActiveTab,
  getStatusColor,
  fetchBookings 
}) {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {bookingStats.pending || 0}
            </div>
            <p className="text-sm text-gray-600">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {bookingStats.confirmed || 0}
            </div>
            <p className="text-sm text-gray-600">Confirmed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {bookingStats.completed || 0}
            </div>
            <p className="text-sm text-gray-600">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {(bookingStats.cancelled || 0) + (bookingStats.declined || 0)}
            </div>
            <p className="text-sm text-gray-600">Cancelled/Declined</p>
          </CardContent>
        </Card>
      </div>

      {/* Loading State */}
      {loadingBookings && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your bookings...</p>
        </div>
      )}

      {/* Error State */}
      {bookingError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-600">❌ {bookingError}</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2"
            onClick={fetchBookings}
          >
            Try Again
          </Button>
        </div>
      )}

      {/* No Bookings State */}
      {!loadingBookings && !bookingError && bookings.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Bookings Yet</h3>
          <p className="text-gray-500 mb-4">
            Your booking requests will appear here once tourists start booking your tours.
          </p>
          <Button onClick={() => setActiveTab("profile")}>
            <User className="h-4 w-4 mr-2" />
            Complete Your Profile
          </Button>
        </div>
      )}

      {/* Bookings List */}
      {!loadingBookings && !bookingError && bookings.length > 0 && bookings.map((booking) => (
        <Card key={booking._id}>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Booking Details */}
              <div className="lg:col-span-2">
                <div className="flex items-start space-x-4 mb-6">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={booking.tourist?.profileImage || "/placeholder.svg"} />
                    <AvatarFallback>
                      {booking.tourist?.firstName?.[0]}{booking.tourist?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold">
                            {booking.tourist?.firstName} {booking.tourist?.lastName}
                          </h3>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                        </div>
                        {/* Payment status for guide */}
                        <div className="text-sm text-gray-600 mb-2">
                          {booking.paymentStatus === "partial" && booking.advanceAmount
                            ? `Advance paid: $${booking.advanceAmount} | Remaining: $${(booking.totalCost - booking.advanceAmount).toFixed(2)}`
                            : booking.paymentStatus === "processed"
                            ? `Payment: Fully paid`
                            : `Payment: Not paid yet`}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">${booking.totalCost}</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Date</p>
                        <p className="text-sm">{new Date(booking.date).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Duration</p>
                        <p className="text-sm">
                          {booking.duration === 21 ? "3 weeks" : 
                          booking.duration === 30 ? "1 month" : 
                          booking.duration === 60 ? "2 months" : 
                          booking.duration === 90 ? "3 months" : 
                          `${booking.duration} ${booking.duration === 1 ? "day" : "days"}`}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Group Size</p>
                        <p className="text-sm">{booking.groupSize} {booking.groupSize === 1 ? "person" : "people"}</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-600 mb-1">Destinations</p>
                      <div className="flex flex-wrap gap-1">
                        {booking.destinations?.map((destination, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {destination}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {booking.specialRequests && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-600 mb-1">Special Requests</p>
                        <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                          {booking.specialRequests}
                        </p>
                      </div>
                    )}
                    
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>Requested {new Date(booking.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {booking.status === "pending" && (
                  <div className="flex space-x-3">
                    <Button 
                      className="flex-1"
                      onClick={() => handleBookingAction(booking._id, 'accept')}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Accept Booking
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 bg-transparent"
                      onClick={() => {
                        const reason = prompt("Please provide a reason for declining this booking:");
                        if (reason) {
                          handleBookingAction(booking._id, 'decline', reason);
                        }
                      }}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Decline
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                  </div>
                )}

                {booking.status === "confirmed" && (
                  <div className="flex space-x-3">
                    <Button 
                      className="flex-1"
                      onClick={() => {
                        if (confirm("Mark this booking as completed? This action cannot be undone.")) {
                          handleBookingAction(booking._id, 'complete');
                        }
                      }}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Mark as Completed
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Message Tourist
                    </Button>
                  </div>
                )}

                {booking.status === "completed" && (
                  <div className="flex space-x-3">
                    <Button variant="outline" className="bg-transparent">
                      <Star className="h-4 w-4 mr-2" />
                      View Review
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Contact Tourist
                    </Button>
                  </div>
                )}

                {booking.status === "declined" && booking.declineReason && (
                  <div className="bg-red-50 border border-red-200 rounded p-3">
                    <p className="text-sm text-red-600">
                      <strong>Decline Reason:</strong> {booking.declineReason}
                    </p>
                  </div>
                )}
              </div>

              {/* Process Tracker */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-4">Booking Process</h4>
                  <div className="space-y-4">
                    {booking.processSteps?.map((step, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {step.completed ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          ) : index === booking.processSteps.findIndex(s => !s.completed) ? (
                            <Circle className="h-5 w-5 text-blue-500 fill-current" />
                          ) : (
                            <Circle className="h-5 w-5 text-gray-300" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${
                            step.completed ? "text-green-700" : 
                            index === booking.processSteps.findIndex(s => !s.completed) ? "text-blue-700" : 
                            "text-gray-500"
                          }`}>
                            {step.step}
                          </p>
                          {step.completedAt && (
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(step.completedAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
import { useRouter } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Search, MapPin, Calendar, MessageCircle, Star } from "lucide-react";
import toast from "react-hot-toast";
import { TabsContent } from "../../ui/tabs";

export default function BookingTab({bookings, loadingBookings, bookingError, fetchBookings, openReviewModal, openPaymentModal, handleCancelBooking, getStatusColor, getStatusIcon}) {

  const router = useRouter();

  return (
    <TabsContent value="bookings" className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">My Bookings</h2>
        <Button asChild>
          <Link href="/search">
            <Search className="mr-2 h-4 w-4" />
            Find New Guide
          </Link>
        </Button>
      </div>

      {/* Loading State */}
      {loadingBookings && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading your bookings...</p>
        </div>
      )}

      {/* Error State */}
      {bookingError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-600 dark:text-red-400">❌ {bookingError}</p>
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
          <div className="text-6xl mb-4">🌴</div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">No Bookings Yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Start exploring Sri Lanka by booking your first tour with a local guide!
          </p>
          <Button asChild>
            <Link href="/search">
              <Search className="mr-2 h-4 w-4" />
              Find a Guide
            </Link>
          </Button>
        </div>
      )}

      {/* Bookings List */}
      {!loadingBookings && !bookingError && bookings.map((booking) => (
        <Card key={booking._id}>
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
              <div className="flex gap-4">
                <Avatar>
                  <AvatarImage src={booking.guide?.profileImage || "/placeholder.svg"} alt={`${booking.guide?.firstName} ${booking.guide?.lastName}`} />
                  <AvatarFallback>
                    {booking.guide?.firstName?.[0]}{booking.guide?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {booking.guide?.firstName} {booking.guide?.lastName}
                </h3>
                <div className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{booking.guide?.location || "Location not specified"}</span>
                  </div>
                  <div className="text-gray-600 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(booking.date).toLocaleDateString()}</span>
                    • 
                    <span>
                      {booking.duration === 21 ? "3 weeks" : 
                      booking.duration === 30 ? "1 month" : 
                      booking.duration === 60 ? "2 months" : 
                      booking.duration === 90 ? "3 months" : 
                      `${booking.duration} ${booking.duration === 1 ? "day" : "days"}`}
                    </span>
                    • 
                    <span>{booking.groupSize} {booking.groupSize === 1 ? "person" : "people"}</span>
                  </div>
                  
                  {/* Destinations */}
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Destinations:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {booking.destinations?.map((destination, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {destination}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Special Requests */}
                  {booking.specialRequests && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Special Requests:</p>
                      <p className="text-sm text-gray-700 dark:text-gray-200">{booking.specialRequests}</p>
                    </div>
                  )}

                  {/* Decline Reason */}
                  {booking.status === 'declined' && booking.declineReason && (
                    <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
                    <p className="text-sm font-medium text-red-600 dark:text-red-400">Declined:</p>
                    <p className="text-sm text-red-700 dark:text-red-300">{booking.declineReason}</p>
                  </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col sm:items-end gap-1 sm:text-right">
                <Badge className={getStatusColor(booking.status)}>
                  {getStatusIcon(booking.status)}
                  <span className="ml-1 capitalize">{booking.status}</span>
                </Badge>
                <div className="text-blue-600 dark:text-blue-400 font-bold text-xl mt-2">${booking.totalCost}</div>

                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {booking.paymentStatus === "partial" && booking.advanceAmount
                    ? `Advance paid: $${booking.advanceAmount}`
                    : booking.paymentStatus === "processed"
                    ? `Fully paid`
                    : `Not paid yet`}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Booked on {new Date(booking.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-4">
              {/* Message Guide Button */}
              <Button 
                variant="outline" 
                size="sm"
                onClick={async () => {
                  try {
                    const currentUser = JSON.parse(localStorage.getItem("user"));
                    if (!currentUser?.id) {
                      router.push("/login");
                      return;
                    }
                    
                    const resChat = await fetch(
                      `/api/chat/conversations?user1=${currentUser.id}&user2=${booking.guide._id}`
                    );
                    if (!resChat.ok) throw new Error("Failed to create or fetch chat");
                    
                    const chat = await resChat.json();
                    router.push(`/chat?chatId=${chat._id}`);
                  } catch (err) {
                    console.error("Failed to start chat:", err);
                    toast.error("Could not open chat. Please try again.");
                  }
                }}
              >
                <MessageCircle className="mr-1 h-4 w-4" />
                Message Guide
              </Button>

              {/* Leave Review Button */}
              {booking.status === "completed" &&
              booking.paymentStatus === "processed" &&
              !booking.reviewed && (
                <Button
                  size="sm"
                  onClick={() => openReviewModal(booking)}
                >
                  <Star className="mr-1 h-4 w-4" />
                  Leave Review
                </Button>
              )}

              {/* Pay Advance Button */}
              {booking.status === "confirmed" && booking.paymentStatus === "pending" && (
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => openPaymentModal(booking, 'advance')}
                >
                  Pay Advance
                </Button>
              )}


              {/* Pay Remaining Button */}
              {booking.status === "completed" && booking.paymentStatus === "partial" && (
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => openPaymentModal(booking, 'remaining')}
                >
                  Pay Remaining
                </Button>
              )}
  
              {/* Cancel Booking Button */}
              {['pending', 'confirmed'].includes(booking.status) && (
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-red-600 border-red-300 hover:bg-red-50"
                  onClick={() => handleCancelBooking(booking._id)}
                >
                  Cancel Booking
                </Button>
              )}

              {/* View Details Button */}
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  toast.custom(
                    <div className="whitespace-pre-line p-3 rounded-lg max-w-sm shadow-lg bg-white dark:bg-gray-900">
                      Booking Details:
                        {`\nID: ${booking._id}\nStatus: ${booking.status}\nTotal: ${booking.totalCost}`}
                      </div>,
                      {
                        duration: 5000,
                        position: 'top-right',
                      }     
                  );
                }}
              >
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </TabsContent>
  )
}
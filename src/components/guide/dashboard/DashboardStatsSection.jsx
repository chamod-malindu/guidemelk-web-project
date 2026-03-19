import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, DollarSign, Star } from 'lucide-react';

export default function DashboardStatsSection({ stats, recentBookings }) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.totalBookings}</p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-full">
                <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="mt-4">
              <Progress value={75} className="h-2" />
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">+12% from last month</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Earnings</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">${stats.totalEarnings}</p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="mt-4">
              <Progress value={85} className="h-2" />
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">+28% from last month</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Rating</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.averageRating}</p>
              </div>
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-full">
                <Star className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
            <div className="mt-4">
              <Progress value={96} className="h-2" />
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Based on 47 reviews</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>Your most recent bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBookings && recentBookings.length > 0 ? (
                recentBookings.map((booking) => (
                  <div key={booking._id || booking.id} className="flex justify-between items-start p-4 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                    <div className="flex items-center gap-4 flex-1">
                      {/* Avatar for tourist (if available) */}
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={booking.tourist?.profileImage || "/placeholder.svg"} />
                        <AvatarFallback>
                          {(booking.tourist?.firstName?.[0] || "?").toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium dark:text-gray-100">
                          {booking.tourist?.firstName
                            ? `${booking.tourist.firstName} ${booking.tourist.lastName || ""}`
                            : "Unknown Tourist"}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {booking.date
                            ? new Date(booking.date).toLocaleDateString()
                            : "--"}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                          <span>
                            {booking.groupSize} {booking.groupSize === 1 ? "person" : "people"}
                          </span>
                          <span>•</span>
                          <span>
                            {booking.duration === 21 ? "3 weeks" : 
                            booking.duration === 30 ? "1 month" : 
                            booking.duration === 60 ? "2 months" : 
                            booking.duration === 90 ? "3 months" : 
                            `${booking.duration} ${booking.duration === 1 ? "day" : "days"}`}
                          </span>
                        </div>
                        {/* Destinations */}
                        {booking.destinations?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {booking.destinations.map((destination, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {destination}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <div className="text-blue-600 dark:text-blue-400 font-bold text-lg mb-1">
                        {booking.totalCost ? `$${booking.totalCost}` : "$0"}
                      </div>
                      <Badge
                        className="mb-2"
                        variant={
                          booking.status === "completed"
                            ? "default"
                            : booking.status === "confirmed"
                            ? "secondary"
                            : booking.status === "pending"
                            ? "outline"
                            : booking.status === "cancelled"
                            ? "destructive"
                            : "outline"
                        }
                      >
                        {booking.status || "Status"}
                      </Badge>
                      {/* Payment status */}
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-32">
                        {booking.paymentStatus === "partial" && booking.advanceAmount
                          ? `Advance: $${booking.advanceAmount} | Remaining: $${(booking.totalCost - booking.advanceAmount).toFixed(2)}`
                          : booking.paymentStatus === "processed"
                          ? `Fully paid`
                          : `Not paid yet`}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-4 text-center text-gray-500 dark:text-gray-400">
                  <div className="text-4xl mb-1">🗒️</div>
                  <p>No recent bookings</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium dark:text-gray-200">Completion Rate</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">{stats.completionRate}%</span>
              </div>
              <Progress value={stats.completionRate} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium dark:text-gray-200">Response Rate</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">{stats.responseRate}%</span>
              </div>
              <Progress value={stats.responseRate} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium dark:text-gray-200">Customer Satisfaction</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">4.8/5.0</span>
              </div>
              <Progress value={96} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
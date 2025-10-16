"use client"

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3,
  Calendar,
  DollarSign,
  Eye,
  MessageSquare,
  Settings,
  Star,
  Bell,
  HelpCircle,
  User,
  Clock,
  Upload,
  Mail,
  Award,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Shield,
  Lock,
  Trash2,
  Package,
  CheckCircle2,
  Circle,
} from "lucide-react"
import { useRouter } from "next/navigation";
import { io } from "socket.io-client"; 
import ProfileManagementSection from "@/components/guide/ProfileManagementSection";
import toast from "react-hot-toast";

export default function GuideDashboard() {
  const router = useRouter();
  const notificationSocketRef = useRef(null);
  const socketRef = useRef(null); // separate chat socket

  const [activeTab, setActiveTab] = useState("overview");
  const [isAvailable, setIsAvailable] = useState(true);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [chats, setChats] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [bookingStats, setBookingStats] = useState({});
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [unreadBookingsCount, setUnreadBookingsCount] = useState(0);


  const recentBookings = bookings
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [fiveStarPercentage, setFiveStarPercentage] = useState(0);
  const [unreadReviewsCount, setUnreadReviewsCount] = useState(0);

  const [earnings, setEarnings] = useState({
    thisMonth: 0,
    lastMonth: 0,
    totalEarnings: 0,
  });
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed.role === "guide") {
          setCurrentUser(parsed);
        }
      } catch {}
    }
  }, []);

  useEffect(() => {
    const fetchGuideReviews = async () => {
      try {
        const id = currentUser?._id || currentUser?.id;
        if (!id) return;
  
        const res = await fetch(`/api/reviews/guide/${id}`, { credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch guide reviews");
        const data = await res.json();
  
        setReviews(data.reviews || []);
        setAverageRating(data.averageRating || 0);
        setTotalReviews(data.totalReviews || 0);
  
        if (data.reviews.length) {
          const fiveStars = data.reviews.filter(r => r.rating === 5).length;
          setFiveStarPercentage(((fiveStars / data.reviews.length) * 100).toFixed(0));
        } else {
          setFiveStarPercentage(0);
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };
  
    fetchGuideReviews();
  }, [currentUser?._id, currentUser?.id]);
  
  

  useEffect(() => {
    if (!currentUser?._id && !currentUser?.id) return;
    const userId = currentUser._id || currentUser.id;
  
    notificationSocketRef.current = io("http://localhost:3000", {
      path: "/api/socket",
      transports: ["websocket", "polling"],
    });
  
    notificationSocketRef.current.on("connect", () => {
      console.log(`✅ Connected to notification server as ${userId}`);
      notificationSocketRef.current.emit("join-user-room", userId);
    });
  
    // Booking notifications
    notificationSocketRef.current.on("booking-notification", (notification) => {
      console.log("🔔 Booking Notification received:", notification);
    
      // Instant increment for booking tab if it's a new booking request
      if (notification.type === "new-booking") {
        setUnreadBookingsCount((prev) => prev + 1);
      }
    
      // For the bell dropdown
      setNotifications((prev) => [notification, ...prev].slice(0, 10));
      setUnreadCount((prev) => prev + 1);
    
      if (Notification.permission === "granted") {
        new Notification("GuideMeLK - New Update", {
          body: notification.message,
          icon: "/favicon.ico",
        });
      }
    
      fetchBookings();
    });
    
  
    // New review listener merged here
    notificationSocketRef.current.on("new-review", (review) => {
      // Update reviews list
      setReviews((prev) => {
        const exists = prev.some((r) => r._id === review._id);
        if (exists) return prev;
        const updated = [review, ...prev];
        return updated.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      });
    
      // Increment badge count for Reviews tab
      setUnreadReviewsCount((prev) => prev + 1);
    
      // Add to notifications dropdown & increment bell badge
      const notification = {
        type: "new-review",
        message: `You received a new review from ${review.tourist?.firstName || "a tourist"}`,
        timestamp: new Date(),
      };
      setNotifications((prev) => [notification, ...prev].slice(0, 10));
      setUnreadCount((prev) => prev + 1);
    
      // Show browser notification
      if (Notification.permission === "granted") {
        new Notification("GuideMeLK - New Review", {
          body: notification.message,
          icon: "/favicon.ico",
        });
      }
    
      // Refresh from backend
      fetchGuideReviews();
    });
    
    notificationSocketRef.current.on("disconnect", (reason) => {
      console.warn(`❌ Notification socket disconnected: ${reason}`);
    });
  
    return () => {
      if (notificationSocketRef.current) {
        notificationSocketRef.current.disconnect();
        notificationSocketRef.current = null;
      }
    };
  }, [currentUser?._id, currentUser?.id]);
  
  
  useEffect(() => {
    const total = reviews.length;
    setTotalReviews(total);
  
    if (total > 0) {
      const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / total;
      setAverageRating(parseFloat(avg.toFixed(1)));
  
      const fiveStars = reviews.filter(r => r.rating === 5).length;
      setFiveStarPercentage(((fiveStars / total) * 100).toFixed(0));
    } else {
      setAverageRating(0);
      setFiveStarPercentage(0);
    }
  }, [reviews]);
  
  

  useEffect(() => {
    if (!currentUser?._id && !currentUser?.id) return; // UPDATED guard
    fetchBookings();
  }, [currentUser?._id, currentUser?.id]); // UPDATED dep array

  useEffect(() => {
    async function fetchGuideProfile() {
      try {
        const res = await fetch("/api/auth/profile", { credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch guide profile");
        const data = await res.json();
        if (!data?.user || data.user.role !== "guide") {
          router.replace("/login");
          return;
        }
        setCurrentUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
      } catch (err) {
        console.error("Dashboard profile fetch error:", err);
        router.replace("/login");
      }
    }
    fetchGuideProfile();
  }, [router]);

  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const id = currentUser?._id || currentUser?.id; // UPDATED
    if (!id) return;
    async function fetchChats() {
      try {
        const res = await fetch(`/api/chat/userChats?userId=${id}`, { // UPDATED
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setChats(data);
        }
      } catch (err) {
        console.error("Error fetching chats:", err);
      }
    }
    fetchChats();
  }, [currentUser]);

  useEffect(() => {
    const id = currentUser?._id || currentUser?.id; // UPDATED
    if (!id || chats.length === 0) return;
    if (socketRef.current) return; // Prevent reconnect loops

    socketRef.current = io("http://localhost:3000", {
      path: "/api/socket",
      transports: ["websocket", "polling"],
    });

    socketRef.current.on("connect", () => {
      chats.forEach(chat => {
        socketRef.current.emit("join-chat", chat._id);
        console.log(`Guide joined chat room ${chat._id}`);
      });
    });

    socketRef.current.on("new-message", msg => {
      console.log("📨 Message in dashboard:", msg);
    });

    return () => {
      socketRef.current.disconnect();
      socketRef.current = null;
    };
  }, [chats, currentUser]);

  // fetch real earning data
  useEffect(() => {
    async function fetchEarnings() {
      if (!currentUser) return;
  
      const id = currentUser._id || currentUser.id;
      if (!id) return;
  
      try {
        const res = await fetch(`/api/earnings/guide/${id}`);
        if (!res.ok) throw new Error('Failed to fetch earnings');
  
        const data = await res.json();
        setEarnings(data);
      } catch (error) {
        console.error('Failed to fetch earnings:', error);
        setEarnings({
          thisMonth: 0,
          lastMonth: 0,
          totalEarnings: 0,
        });
      }
    }
  
    fetchEarnings();
  }, [currentUser]);

  // fetch real payment data
  useEffect(() => {
    async function fetchGuidePayments() {
      if (!currentUser?._id && !currentUser?.id) return;
      setLoadingPayments(true);
      setPaymentError("");
      try {
        const guideId = currentUser._id || currentUser.id;
        const res = await fetch(`/api/payments/guide/${guideId}`);
        if (!res.ok) throw new Error("Failed to fetch payment history");
        const data = await res.json();
        setPaymentHistory(data.payments || []);
      } catch (err) {
        setPaymentError(err.message);
      } finally {
        setLoadingPayments(false);
      }
    }
    fetchGuidePayments();
  }, [currentUser?._id, currentUser?.id]);
  
  

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading profile...</p>
      </div>
    );
  }

  const triggerBookingNotification = (bookingId, type, guideId, touristId) => {
    if (!notificationSocketRef.current?.connected) {
      console.warn("⚠️ Notification socket not connected");
      return;
    }
    if (type === "new-booking") {
      notificationSocketRef.current.emit("new-booking-notification", {
        bookingId, guideId, touristId
      });
    } else {
      notificationSocketRef.current.emit("booking-status-update", {
        bookingId, status: type, guideId, touristId
      });
    }
  };

  const fetchBookings = async () => {
    try {
      const id = currentUser?._id || currentUser?.id; 
      if (!id) return;
  
      setLoadingBookings(true);
      setBookingError("");
  
      const res = await fetch(`/api/bookings/guide/${id}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch bookings");
  
      const data = await res.json();
      setBookings(data.bookings || []);
      setBookingStats(data.statusCounts || {});
      
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setBookingError(err.message);
    } finally {
      setLoadingBookings(false);
    }
  }; 

  const handleBookingAction = async (bookingId, action, declineReason = "") => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, declineReason: declineReason || undefined }),
        credentials: 'include'
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to update booking');

      setBookings(prev =>
        prev.map(b => b._id === bookingId ? { ...b, ...data.booking } : b)
      );

      toast.success(`${data.message}`);

      if (notificationSocketRef.current?.connected) {
        notificationSocketRef.current.emit("booking-status-update", {
          bookingId,
          status: data.booking.status,
          guideId: currentUser._id || currentUser.id, 
          touristId: data.booking.tourist._id || data.booking.tourist
        });
      }

      await fetchBookings();
    } catch (error) {
      console.error('Booking action error:', error);
      toast.error(`Error: ${error.message}`);
    }
  };

  function getStatusColor(status) {
    switch (status) {
      case "confirmed": return "bg-blue-100 text-blue-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "completed": return "bg-green-100 text-green-800";
      case "cancelled":
      case "declined": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  }

  // NOTIFICATION DROPDOWN COMPONENT
const NotificationDropdown = () => {
  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          const willOpen = !showNotifications;
          setShowNotifications(willOpen);

          // Reset badge count when the dropdown is being opened
          if (willOpen && unreadCount > 0) {
            setUnreadCount(0);
          }
        }}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 text-xs flex items-center justify-center"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>

      {showNotifications && (
        <>
          {/* Overlay to close dropdown when clicking outside */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowNotifications(false)}
          />

          {/* Dropdown content */}
          <div
            className="absolute top-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50 w-80"
            style={{
              left: '100%',
              marginLeft: '8px',
              transform: 'translateX(-50px)',
            }}
          >
            <div className="p-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setUnreadCount(0); 
                    setNotifications([]);
                  }}
                >
                  Clear All
                </Button>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p>No notifications</p>
                </div>
              ) : (
                notifications.map((notification, index) => (
                  <div
                    key={index}
                    className="p-3 border-b border-gray-100 hover:bg-gray-50"
                  >
                    <p className="text-sm text-gray-800">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(notification.timestamp).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

  
const stats = {
  totalBookings: bookings.length,
  totalEarnings: earnings.totalEarnings || 0,
  averageRating: averageRating || 0,
  completionRate: bookingStats.completionRate || 0,  
  responseRate: bookingStats.responseRate || 0,     
};


  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-white shadow-sm border-r">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {currentUser ? `Welcome ${currentUser.firstName}!` : "Welcome!"}
              </h2>
            </div>
            <div className="flex items-center space-x-2">
              {/* ADD NOTIFICATION DROPDOWN */}
              <NotificationDropdown />
              <Button size="sm" variant="outline" onClick={() => setIsPreviewMode(true)}>
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch checked={isAvailable} onCheckedChange={setIsAvailable} id="availability" />
            <Label htmlFor="availability" className="text-sm">
              {isAvailable ? "Available" : "Unavailable"}
            </Label>
          </div>
        </div>

        <nav className="p-4 space-y-1">
        {[
          { id: "overview", label: "Overview", icon: BarChart3 },
          { id: "profile", label: "Profile Management", icon: User },
          {
            id: "bookings",
            label: "Booking Management",
            icon: Package,
            badge: unreadBookingsCount, 
          },
          { id: "messages", label: "Messages & Chat", icon: MessageSquare },
          { id: "earnings", label: "Earnings & Payments", icon: DollarSign },
          { id: "reviews", label: "Ratings & Reviews", icon: Star, badge: unreadReviewsCount },
          { id: "calendar", label: "Availability Calendar", icon: CalendarIcon },
          { id: "support", label: "Support & Disputes", icon: HelpCircle },
          { id: "settings", label: "Settings", icon: Settings },
        ].map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
              
                if (item.id === 'bookings' && unreadBookingsCount > 0) {
                  setUnreadBookingsCount(0);
                }                
                if (item.id === 'reviews' && unreadReviewsCount > 0) {
                  setUnreadReviewsCount(0);
                }
              }}
              
              className={`w-full flex items-center justify-between px-3 py-2 text-left rounded-lg transition-colors ${
                activeTab === item.id
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center">
                <Icon className="h-5 w-5 mr-3" />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              {item.badge && item.badge > 0 && (
                <Badge variant="destructive" className="h-5 text-xs">
                  {item.badge > 99 ? '99+' : item.badge}
                </Badge>
              )}
            </button>
          )
        })}
        </nav>
      </div>
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              {activeTab === "overview" && "Dashboard Overview"}
              {activeTab === "profile" && "Profile Management"}
              {activeTab === "bookings" && "Booking Management"}
              {activeTab === "messages" && "Messages & Chat"}
              {activeTab === "earnings" && "Earnings & Payments"}
              {activeTab === "reviews" && "Ratings & Reviews"}
              {activeTab === "calendar" && "Availability Calendar"}
              {activeTab === "support" && "Support & Disputes"}
              {activeTab === "settings" && "Settings"}
            </h1>
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.totalBookings}</p>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-full">
                        <Calendar className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <Progress value={75} className="h-2" />
                      <p className="text-xs text-gray-600 mt-2">+12% from last month</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                        <p className="text-3xl font-bold text-gray-900">${stats.totalEarnings}</p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-full">
                        <DollarSign className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <Progress value={85} className="h-2" />
                      <p className="text-xs text-gray-600 mt-2">+28% from last month</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Average Rating</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.averageRating}</p>
                      </div>
                      <div className="p-3 bg-yellow-50 rounded-full">
                        <Star className="h-6 w-6 text-yellow-600" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <Progress value={96} className="h-2" />
                      <p className="text-xs text-gray-600 mt-2">Based on 47 reviews</p>
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
                        <div key={booking._id || booking.id} className="flex justify-between items-start p-4 border rounded-lg hover:bg-gray-50 transition">
                          <div className="flex items-center gap-4 flex-1">
                            {/* Avatar for tourist (if available) */}
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={booking.tourist?.profileImage || "/placeholder.svg"} />
                              <AvatarFallback>
                                {(booking.tourist?.firstName?.[0] || "?").toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium">
                                {booking.tourist?.firstName
                                  ? `${booking.tourist.firstName} ${booking.tourist.lastName || ""}`
                                  : "Unknown Tourist"}
                              </p>
                              <p className="text-sm text-gray-500">
                                {booking.date
                                  ? new Date(booking.date).toLocaleDateString()
                                  : "--"}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
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
                            <div className="text-blue-600 font-bold text-lg mb-1">
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
                            <div className="text-xs text-gray-500 mt-1 max-w-32">
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
                      <div className="py-4 text-center text-gray-500">
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
                        <span className="text-sm font-medium">Completion Rate</span>
                        <span className="text-sm text-gray-600">{stats.completionRate}%</span>
                      </div>
                      <Progress value={stats.completionRate} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Response Rate</span>
                        <span className="text-sm text-gray-600">{stats.responseRate}%</span>
                      </div>
                      <Progress value={stats.responseRate} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Customer Satisfaction</span>
                        <span className="text-sm text-gray-600">4.8/5.0</span>
                      </div>
                      <Progress value={96} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Profile Management Tab */}
          {activeTab === "profile" && (
            <ProfileManagementSection
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
          /> 
          )}

          {/* Booking Management Tab */}
          {activeTab === "bookings" && (
            <div className="space-y-6">
              {/* Booking Statistics */}
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

                      {/* Action Buttons - keep the rest as is */}
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
          )}
          {/* Messages Tab */}
          {activeTab === "messages" && (
            <Card>
              <CardHeader>
                <CardTitle>Your Messages</CardTitle>
                <CardDescription>Communicate with tourists in real-time</CardDescription>
              </CardHeader>
              <CardContent>
                {currentUser && chats.length > 0 ? (
                  <div className="space-y-4">
                    {chats.map(chat => {
                      // 🔹 Use safe ID handling
                      const myId = currentUser?._id || currentUser?.id;
                      const otherUser = chat.participants?.find(
                        p => p._id !== myId
                      );

                      return (
                        <div
                          key={chat._id}
                          className="flex justify-between items-center p-4 border rounded-lg"
                        >
                          <div>
                            <p className="font-medium">
                              Chat with: {otherUser
                                ? `${otherUser.firstName} ${otherUser.lastName}`
                                : "Unknown"}
                            </p>
                            <p className="text-sm text-gray-500">
                              {chat.lastMessage || "No messages yet"}
                            </p>
                          </div>

                          <Button
                            size="sm"
                            onClick={() => router.push(`/chat?chatId=${chat._id}`)}
                          >
                            Open Chat
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500">No active chats found.</p>
                )}
              </CardContent>
            </Card>
          )}


          {/* Earnings Tab */}
          {activeTab === 'earnings' && (
            <div className="space-y-8">
              {/* Earnings Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">This Month</p>
                        <p className="text-3xl font-bold text-blue-600">${earnings.thisMonth.toFixed(2)}</p>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-full">
                        <DollarSign className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center text-xs text-gray-600">
                        <span className="text-green-600 mr-1">↗</span>
                        <span>+{earnings.thisMonth > earnings.lastMonth ? 
                          ((earnings.thisMonth - earnings.lastMonth) / Math.max(earnings.lastMonth, 1) * 100).toFixed(0) : 0}% from last month</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Last Month</p>
                        <p className="text-3xl font-bold text-gray-900">${earnings.lastMonth.toFixed(2)}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-full">
                        <Calendar className="h-6 w-6 text-gray-600" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <Progress value={earnings.lastMonth > 0 ? (earnings.lastMonth / Math.max(earnings.totalEarnings, 1)) * 100 : 0} className="h-2" />
                      <p className="text-xs text-gray-600 mt-2">Previous period earnings</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                        <p className="text-3xl font-bold text-green-600">${earnings.totalEarnings.toFixed(2)}</p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-full">
                        <Award className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <Progress value={100} className="h-2" />
                      <p className="text-xs text-gray-600 mt-2">All-time earnings</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              

              {/* Payment History Card */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                        Payment History
                      </CardTitle>
                      <CardDescription>Track all your earnings and payments</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {loadingPayments && (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading payment history...</p>
                    </div>
                  )}
                  
                  {paymentError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                      <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                      <p className="text-red-600 font-medium mb-2">Error Loading Payments</p>
                      <p className="text-red-500 text-sm mb-4">{paymentError}</p>
                      <Button variant="outline" size="sm" onClick={() => router.push(router.asPath)}>
                        Try Again
                      </Button>
                    </div>
                  )}
                  
                  {!loadingPayments && !paymentError && (
                    <>
                      {paymentHistory.length === 0 ? (
                        <div className="text-center py-12">
                          <div className="text-6xl mb-4">💰</div>
                          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Payments Yet</h3>
                          <p className="text-gray-500 mb-4">
                            Your payment history will appear here once you start receiving payments from bookings.
                          </p>
                          <Button onClick={() => setActiveTab("bookings")}>
                            <Package className="h-4 w-4 mr-2" />
                            View Bookings
                          </Button>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-gray-200">
                                <th className="text-left py-4 px-4 font-semibold text-gray-900">Date</th>
                                <th className="text-left py-4 px-4 font-semibold text-gray-900">Tourist</th>
                                <th className="text-left py-4 px-4 font-semibold text-gray-900">Amount</th>
                                <th className="text-left py-4 px-4 font-semibold text-gray-900">Commission</th>
                                <th className="text-left py-4 px-4 font-semibold text-gray-900">Net Earnings</th>
                                <th className="text-left py-4 px-4 font-semibold text-gray-900">Status</th>
                                <th className="text-left py-4 px-4 font-semibold text-gray-900">Method</th>
                              </tr>
                            </thead>
                            <tbody>
                              {paymentHistory.map((payment, index) => (
                                <tr key={payment._id || payment.id || index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                  <td className="py-4 px-4">
                                    <div className="text-sm font-medium text-gray-900">
                                      {new Date(payment.date).toLocaleDateString()}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {new Date(payment.date).toLocaleTimeString()}
                                    </div>
                                  </td>
                                  <td className="py-4 px-4">
                                    <div className="flex items-center">
                                      <Avatar className="h-8 w-8 mr-3">
                                        <AvatarImage src={payment.tourist?.profileImage || "/placeholder.svg"} />
                                        <AvatarFallback className="text-xs">
                                          {(payment.tourist?.firstName?.[0] || "") + (payment.tourist?.lastName?.[0] || "")}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <div className="text-sm font-medium text-gray-900">
                                          {payment.tourist?.firstName} {payment.tourist?.lastName}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                          ID: {payment.tourist?._id?.slice(-6) || "N/A"}
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="py-4 px-4">
                                    <div className="text-sm font-semibold text-gray-900">
                                      ${payment.amount.toFixed(2)}
                                    </div>
                                  </td>
                                  <td className="py-4 px-4">
                                    <div className="text-sm text-red-600">
                                      -${payment.commission?.toFixed(2) || "0.00"}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {payment.commission ? ((payment.commission / payment.amount) * 100).toFixed(1) : 0}%
                                    </div>
                                  </td>
                                  <td className="py-4 px-4">
                                    <div className="text-sm font-bold text-green-600">
                                      ${payment.netEarnings.toFixed(2)}
                                    </div>
                                  </td>
                                  <td className="py-4 px-4">
                                    <Badge 
                                      variant={payment.status === "completed" ? "default" : 
                                            payment.status === "pending" ? "secondary" : "outline"}
                                      className={payment.status === "completed" ? "bg-green-100 text-green-800" :
                                              payment.status === "pending" ? "bg-yellow-100 text-yellow-800" : ""}
                                    >
                                      {payment.status}
                                    </Badge>
                                  </td>
                                  <td className="py-4 px-4">
                                    <div className="flex items-center text-sm text-gray-700">
                                      <DollarSign className="h-3 w-3 mr-1" />
                                      {payment.method}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === "reviews" && (
            <div className="space-y-6">
              {/* Reviews Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-yellow-600 mb-2">
                      {averageRating || 0}
                    </div>
                    <p className="text-sm text-gray-600">Average Rating</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {totalReviews || 0}
                    </div>
                    <p className="text-sm text-gray-600">Total Reviews</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {fiveStarPercentage}%
                    </div>
                    <p className="text-sm text-gray-600">5-Star Reviews</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">156</div>
                    <p className="text-sm text-gray-600">Helpful Votes</p>
                  </CardContent>
                </Card>
              </div>

              {/* Reviews List */}
              <div className="space-y-6">
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <Card key={review._id}>
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <Avatar>
                            <AvatarImage src={review.tourist?.profileImage || "/placeholder.svg"} />
                            <AvatarFallback>
                              {(review.tourist?.firstName?.[0] || "") + (review.tourist?.lastName?.[0] || "")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <h4 className="font-semibold">
                                  {review.tourist?.firstName} {review.tourist?.lastName}
                                </h4>
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${i < review.rating 
                                        ? "text-yellow-400 fill-current" 
                                        : "text-gray-300"}`}
                                    />
                                  ))}
                                  <span className="text-sm text-gray-600 ml-2">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <p className="text-gray-700 mb-2">{review.comment}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">No reviews yet.</p>
                )}
              </div>
            </div>
          )}


          {/* Calendar Tab */}
          {activeTab === "calendar" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Availability Calendar</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-sm font-medium">January 2024</span>
                      <Button variant="outline" size="sm">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                      <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
                        {day}
                      </div>
                    ))}
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                      <div
                        key={day}
                        className={`text-center py-2 text-sm cursor-pointer rounded-lg ${
                          day % 7 === 0 || day % 7 === 6
                            ? "bg-red-50 text-red-600"
                            : day % 3 === 0
                              ? "bg-blue-50 text-blue-600"
                              : "hover:bg-gray-50"
                        }`}
                      >
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-blue-50 border border-blue-200 rounded mr-2"></div>
                      <span>Booked</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-red-50 border border-red-200 rounded mr-2"></div>
                      <span>Unavailable</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-white border border-gray-200 rounded mr-2"></div>
                      <span>Available</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Support Tab */}
          {activeTab === "support" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Submit a Dispute</CardTitle>
                  <CardDescription>Report issues or disputes with bookings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="disputeType">Dispute Type</Label>
                    <select className="w-full p-2 border rounded-lg">
                      <option>Payment Issue</option>
                      <option>Tourist Behavior</option>
                      <option>Booking Cancellation</option>
                      <option>Platform Issue</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="bookingId">Related Booking ID</Label>
                    <Input id="bookingId" placeholder="Enter booking ID (optional)" />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" rows={4} placeholder="Describe the issue in detail..." />
                  </div>
                  <div>
                    <Label htmlFor="evidence">Upload Evidence</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Click to upload files or drag and drop</p>
                      <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                    </div>
                  </div>
                  <Button>Submit Dispute</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Active Disputes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Disputes</h3>
                    <p className="text-gray-600">You don't have any ongoing disputes at the moment.</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Help</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Getting Started Guide</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Learn how to optimize your profile and attract more bookings
                      </p>
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        Read Guide
                      </Button>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Contact Support</h4>
                      <p className="text-sm text-gray-600 mb-3">Get help from our support team</p>
                      <Button variant="outline" size="sm">
                        <Mail className="h-4 w-4 mr-2" />
                        Email Support
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                  <Button>Update Password</Button>
                </CardContent>
              </Card>

              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-600">Danger Zone</CardTitle>
                  <CardDescription>These actions cannot be undone</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
                    <div>
                      <p className="font-medium text-red-600">Deactivate Account</p>
                      <p className="text-sm text-gray-600">Temporarily disable your account</p>
                    </div>
                    <Button variant="outline" className="border-red-200 text-red-600 bg-transparent">
                      <Lock className="h-4 w-4 mr-2" />
                      Deactivate
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
                    <div>
                      <p className="font-medium text-red-600">Delete Account</p>
                      <p className="text-sm text-gray-600">Permanently delete your account and all data</p>
                    </div>
                    <Button variant="destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
"use client"

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  BarChart3,
  DollarSign,
  Eye,
  MessageSquare,
  Settings,
  Star,
  Bell,
  HelpCircle,
  User,
  CalendarIcon,
  Package,
} from "lucide-react"
import { useRouter } from "next/navigation";
import { io } from "socket.io-client"; 
import ProfileManagementSection from "@/components/guide/dashboard/ProfileManagementSection";
import toast from "react-hot-toast";
import DashboardStatsSection from "@/components/guide/dashboard/DashboardStatsSection";
import BookingsSection from "@/components/guide/dashboard/BookingsSection";
import GuideMessagesCard from "@/components/guide/dashboard/GuideMessagesCard";
import EarningsSummary from "@/components/guide/dashboard/EarningsSummary";
import PaymentHistory from "@/components/guide/dashboard/PaymentHistory";
import ReviewsSection from "@/components/guide/dashboard/ReviewSection";
import AvailabilityCalendar from "@/components/guide/dashboard/AvailabilityCalendar";
import SupportSection from "@/components/guide/dashboard/SupportSection";
import SettingsSection from "@/components/guide/dashboard/SettingSection";

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
    if (!currentUser?._id && !currentUser?.id) return; 
    fetchBookings();
  }, [currentUser?._id, currentUser?.id]); 

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
    const id = currentUser?._id || currentUser?.id; 
    if (!id) return;
    async function fetchChats() {
      try {
        const res = await fetch(`/api/chat/userChats?userId=${id}`, { 
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
    const id = currentUser?._id || currentUser?.id; 
    if (!id || chats.length === 0) return;
    if (socketRef.current) return; 

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

const handleUpdatePassword = () => {
  console.log("Update password");
};

const handleDeactivateAccount = () => {
  if (confirm("Are you sure you want to deactivate your account?")) {
    console.log("Deactivate account");
  }
};

const handleDeleteAccount = () => {
  if (confirm("Are you sure you want to permanently delete your account? This cannot be undone!")) {
    console.log("Delete account");
  }
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
              <DashboardStatsSection 
                stats={stats} 
                recentBookings={recentBookings} 
              />
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
              <BookingsSection 
                bookingStats={bookingStats}
                loadingBookings={loadingBookings}
                bookingError={bookingError}
                bookings={bookings}
                handleBookingAction={handleBookingAction}
                setActiveTab={setActiveTab}
                getStatusColor={getStatusColor}
                fetchBookings={fetchBookings}
              />
 
            </div>
          )}
          {/* Messages Tab */}
          {activeTab === "messages" && (
            <div className="space-y-8">
            <GuideMessagesCard currentUser={currentUser} chats={chats} />
            </div>
          )}


          {/* Earnings Tab */}
          {activeTab === 'earnings' && (
            <div className="space-y-8">
              {/* Earnings Overview Cards */}
              <EarningsSummary earnings={earnings} />

              <PaymentHistory
                loadingPayments={loadingPayments}
                paymentError={paymentError}
                paymentHistory={paymentHistory}
                setActiveTab={setActiveTab}
                router={router}
              />

            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === "reviews" && (
              <ReviewsSection 
                averageRating={averageRating}
                totalReviews={totalReviews}
                fiveStarPercentage={fiveStarPercentage}
                reviews={reviews}
              />   
          )}


          {/* Calendar Tab */}
          {activeTab === "calendar" && (
            <div className="space-y-6">
              <AvailabilityCalendar />
            </div>
          )}

          {/* Support Tab */}
          {activeTab === "support" && (
            <div className="space-y-6">
              <SupportSection />
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <SettingsSection 
                onUpdatePassword={handleUpdatePassword}
                onDeactivateAccount={handleDeactivateAccount}
                onDeleteAccount={handleDeleteAccount}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
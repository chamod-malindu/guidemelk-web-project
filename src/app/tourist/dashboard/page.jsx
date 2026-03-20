"use client"

import { useEffect, useRef, useState } from "react";
import axios from "axios";

// UI components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";


// Icons
import {
  Clock,
  CheckCircle,
  XCircle,
  Bell,
  Sun,
  Moon,
  Menu,
  X,
} from "lucide-react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

// Use current origin in browser, otherwise fall back to env or localhost
const SOCKET_ORIGIN = typeof window !== "undefined"
  ? window.location.origin
  : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

// App wrappers / modals / subcomponents
import AuthWrapper from "@/components/AuthWrapper";
import PaymentModal from "@/components/PaymentModal";
import ReviewModal from "@/components/tourist/dashboard/ReviewModal";
import BookingTab from "@/components/tourist/dashboard/BookingTab";
import MessagesTab from "@/components/tourist/dashboard/MessagesTab";
import ReviewsTab from "@/components/tourist/dashboard/ReviewTab";
import ProfileTab from "@/components/tourist/dashboard/ProfileTab";

export default function TouristDashboard() {
  // ------------------------
  // Router
  // ------------------------
  const router = useRouter();

  // ------------------------
  // UI State
  // ------------------------
  const [activeTab, setActiveTab] = useState("bookings");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // ------------------------
  // User / Profile State
  // ------------------------
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
  });
  const fileInputRef = useRef();
  const [photoPreview, setPhotoPreview] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  // ------------------------
  // Bookings State
  // ------------------------
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [bookingError, setBookingError] = useState("");

  // ------------------------
  // Reviews State
  // ------------------------
  const [reviews, setReviews] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewBooking, setReviewBooking] = useState(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");

  // ------------------------
  // Chat State
  // ------------------------
  const [messages, setMessages] = useState([]);
  const [userDetails, setUserDetails] = useState(null);

  // ------------------------
  // Notifications State
  // ------------------------
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationSocketRef = useRef(null);

  // ------------------------
  // Payment State
  // ------------------------
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentBooking, setPaymentBooking] = useState(null);
  const [paymentType, setPaymentType] = useState(""); // 'advance' | 'remaining'

  // ------------------------
  // Helper: get user id (safe)
  // ------------------------
  const getUserId = () => user?._id || user?.id;

  // ------------------------
  // Handlers / Actions
  // ------------------------
  const handleEditToggle = async () => {
    if (isEditing) {
      try {
        let profileImageUrl = user.profileImage;

        if (selectedFile) {
          const formDataUpload = new FormData();
          formDataUpload.append("file", selectedFile);

          const uploadRes = await fetch("/api/tourist/profileImage", {
            method: "POST",
            body: formDataUpload,
          });
          const uploadData = await uploadRes.json();
          if (!uploadRes.ok) throw new Error(uploadData.error || "Image upload failed");
          profileImageUrl = uploadData.imageUrl;
        }

        const updateRes = await axios.put("/api/auth/profile", {
          ...formData,
          profileImage: profileImageUrl,
        });

        if (updateRes.data.success) {
          setUser(updateRes.data.user);
          setPhotoPreview("");
          setSelectedFile(null);
          toast.success("Profile updated successfully!");
        } else {
          toast.error("Failed to update profile.");
        }
      } catch (error) {
        console.error("Update failed:", error);
        toast.error(error.message || "Error updating profile.");
      }
    }

    setIsEditing(!isEditing);
  };

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await axios.post("/api/auth/logout");

      localStorage.removeItem("user");

      // Dispatch storage event to notify other windows/components
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "user",
          newValue: null,
          url: window.location.href,
          storageArea: localStorage,
        })
      );

      setUser(null);
      toast.success("Logged out successfully.", { duration: 2000 });
      setTimeout(() => {
        router.replace("/login");
      }, 2000);
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file || null);
    setPhotoPreview(file ? URL.createObjectURL(file) : "");
  };

  // ------------------------
  // Bookings: fetch / cancel
  // ------------------------
  const fetchBookings = async () => {
    if (!user) return;
    setLoadingBookings(true);
    setBookingError("");
    try {
      const touristId = getUserId();
      const res = await fetch(`/api/bookings/tourist/${touristId}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch bookings");
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setBookingError(err.message);
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!confirm("Are you sure you want to cancel this booking? This action cannot be undone.")) return;
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cancel" }),
        credentials: "include",
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to cancel booking");

      setBookings((prevBookings) => prevBookings.map((b) => (b._id === bookingId ? { ...b, status: "cancelled" } : b)));

      toast.success(`${data.message}`);

      // Emit to guide
      if (notificationSocketRef.current?.connected) {
        notificationSocketRef.current.emit("booking-status-update", {
          bookingId,
          status: "cancelled",
          guideId: data.booking.guide?._id || data.booking.guide,
          touristId: getUserId(),
        });
      }

      fetchBookings();
    } catch (error) {
      console.error("Cancel booking error:", error);
      toast.error(`Error: ${error.message}`);
    }
  };

  // ------------------------
  // Reviews: fetch / submit
  // ------------------------
  const fetchMyReviews = async () => {
    try {
      const id = getUserId();
      if (!id) return;
      const res = await fetch(`/api/reviews/tourist/${id}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch reviews");
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  const openReviewModal = (booking) => {
    setReviewBooking(booking);
    setReviewRating(0);
    setReviewComment("");
    setShowReviewModal(true);
  };

  const submitReview = async () => {
    try {
      if (!reviewRating) {
        toast.error("Please select a rating");
        return;
      }

      const res = await fetch("/api/reviews/tourist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          bookingId: reviewBooking._id,
          guideId: reviewBooking.guide._id,
          touristId: getUserId(),
          rating: reviewRating,
          comment: reviewComment,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success("Review submitted successfully!");

      // Optional real-time notify guide
      if (notificationSocketRef.current?.connected) {
        notificationSocketRef.current.emit("new-review", {
          guideId: reviewBooking.guide._id,
          review: data.review,
        });
      }

      // Refresh bookings and reviews
      await fetchBookings();
      await fetchMyReviews();
      setShowReviewModal(false);
    } catch (err) {
      toast.error(`Failed to submit review: ${err.message}`);
    }
  };

  // ------------------------
  // Chat: fetch chats
  // ------------------------
  const fetchMyChats = async () => {
    try {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          if (parsed.role === "tourist") setUserDetails(parsed);
        } catch {}
      }

      const id = getUserId();
      if (!id) return;

      const res = await fetch(`/api/chat/userChats?userId=${id}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch chats");
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error("Error fetching chats:", err);
    }
  };

  // ------------------------
  // Payment helpers
  // ------------------------
  const openPaymentModal = (booking, type) => {
    setPaymentBooking(booking);
    setPaymentType(type);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async (data) => {
    if (notificationSocketRef.current?.connected) {
      notificationSocketRef.current.emit("booking-status-update", {
        bookingId: paymentBooking._id,
        status: paymentType === "advance" ? "advance-paid" : "remaining-paid",
        guideId: paymentBooking.guide._id,
        touristId: getUserId(),
      });
    }

    await fetchBookings();

    setShowPaymentModal(false);
    setPaymentBooking(null);
    setPaymentType("");
  };

  // ------------------------
  // Notifications UI component
  // ------------------------
  const NotificationDropdown = () => (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          const willOpen = !showNotifications;
          setShowNotifications(willOpen);

          if (willOpen && unreadCount > 0) setUnreadCount(0);
        }}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 text-xs flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </Badge>
        )}
      </Button>

      {showNotifications && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Notifications</h3>
            <Button variant="ghost" size="sm" onClick={() => { setUnreadCount(0); setNotifications([]); setShowNotifications(false); }}>
              Clear All
            </Button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                <p>No notifications</p>
              </div>
            ) : (
              notifications.map((n, i) => (
                <div key={i} className="p-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <p className="text-sm text-gray-800 dark:text-gray-200">{n.message}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{new Date(n.timestamp).toLocaleString()}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );

  // ------------------------
  // Socket: connect & listeners
  // ------------------------
  useEffect(() => {
    if (!getUserId()) return;
    const userId = getUserId();

    notificationSocketRef.current = io(SOCKET_ORIGIN, {
      path: "/api/socket",
      transports: ["websocket", "polling"],
    });

    notificationSocketRef.current.on("connect", () => {
      notificationSocketRef.current.emit("join-user-room", userId);
      console.log(`✅ Connected to notifications for user ${userId}`);
    });

    notificationSocketRef.current.on("booking-notification", (notification) => {
      console.log("🔔 Received notification:", notification);
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

    notificationSocketRef.current.on("disconnect", () => {
      console.log("❌ Notification socket disconnected");
    });

    return () => {
      if (notificationSocketRef.current) {
        notificationSocketRef.current.disconnect();
        notificationSocketRef.current = null;
      }
    };
  }, [user?._id, user?.id]);

  // Listen for 'new-review' events
  useEffect(() => {
    if (!notificationSocketRef.current) return;

    notificationSocketRef.current.on("new-review", (payload) => {
      if (payload.review.tourist === getUserId()) {
        fetchMyReviews();
      }
    });

    return () => {
      if (notificationSocketRef.current) {
        notificationSocketRef.current.off("new-review");
      }
    };
  }, [user?._id, user?.id]);

  // ------------------------
  // Initial data fetches when user is available
  // ------------------------
  useEffect(() => {
    fetchMyReviews();
    fetchMyChats();
  }, [user?._id, user?.id]);

  // Request notification permission once
  useEffect(() => {
    if (Notification.permission === "default") Notification.requestPermission();
  }, []);

  // Fetch bookings when user id changes
  useEffect(() => {
    const userId = getUserId();
    if (!userId) return;
    fetchBookings();
  }, [user?._id, user?.id]);

  // ------------------------
  // Profile fetch
  // ------------------------
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get("/api/auth/profile");
        setUser(res.data.user);
        setFormData(res.data.user);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.error("Failed to load user:", err);
        if (err.response && err.response.status === 401) {
          setError("Your session has expired. Redirecting to login...");
          setTimeout(() => {
            router.replace("/login");
          }, 2000);
        } else {
          setError("Unable to load your dashboard. Please try again later.");
        }
      }
    };

    fetchUser();
  }, [router]);

  // Keep formData in sync with user
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        country: user.country || "",
      });
    }
  }, [user]);

  // ------------------------
  // Helpers
  // ------------------------
  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  // ------------------------
  // Loading / Error guards
  // ------------------------
  if (loading) return <div className="p-10 text-center">Loading dashboard...</div>;
  if (error) return <div className="p-10 text-center text-red-600">{error}</div>;
  if (!user) return null;

  // ------------------------
  // Notification-friendly UI helpers
  // ------------------------
  const NotificationUI = NotificationDropdown; // alias to pass into JSX if needed

  // ------------------------
  // Render
  // ------------------------
  return (
    <AuthWrapper requiredRole="tourist">
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Nav Bar */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center">
                <Link href="/" className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  GuideMeLK
                </Link>
              </div>

              {/* Centered Navigation Menu — Desktop */}
              <nav className="hidden md:flex space-x-6 absolute left-1/2 transform -translate-x-1/2">
                <Link href="/tourist" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">
                  Home
                </Link>
                <Link href="/findGuide" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">
                  Find a Guide
                </Link>
                <Link href="/about" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">
                  About Us
                </Link>
              </nav>

              {/* Right side */}
              <div className="flex items-center space-x-2 sm:space-x-3">
                {/* Dark Mode Toggle */}
                <button
                  onClick={() => {
                    const isDark = document.documentElement.classList.contains("dark");
                    if (isDark) {
                      document.documentElement.classList.remove("dark");
                      localStorage.setItem("theme", "light");
                    } else {
                      document.documentElement.classList.add("dark");
                      localStorage.setItem("theme", "dark");
                    }
                  }}
                  className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Toggle dark mode"
                >
                  <Sun className="h-5 w-5 hidden dark:block" />
                  <Moon className="h-5 w-5 block dark:hidden" />
                </button>

                {/* Notification Dropdown */}
                <NotificationUI />

                {/* User Profile Section — hidden on very small screens */}
                <div className="hidden sm:flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.profileImage || "/placeholder.svg"} />
                    <AvatarFallback>{user.firstName?.[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="hidden lg:inline text-sm font-medium text-gray-900 dark:text-gray-100">{user.firstName}</span>
                </div>

                {/* Hamburger Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300 focus:outline-none"
                  aria-label="Toggle menu"
                >
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <div
            className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
              isMobileMenuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <nav className="flex flex-col px-4 pb-4 space-y-1 border-t border-gray-200 dark:border-gray-700 pt-3">
              <Link href="/tourist" onClick={() => setIsMobileMenuOpen(false)} className="block py-2.5 px-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium">
                Home
              </Link>
              <Link href="/findGuide" onClick={() => setIsMobileMenuOpen(false)} className="block py-2.5 px-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium">
                Find a Guide
              </Link>
              <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="block py-2.5 px-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium">
                About Us
              </Link>
              {/* Mobile user info */}
              <div className="sm:hidden flex items-center space-x-3 px-3 py-2.5 border-t border-gray-200 dark:border-gray-700 mt-2 pt-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.profileImage || "/placeholder.svg"} />
                  <AvatarFallback>{user.firstName?.[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.firstName}</span>
              </div>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {showReviewModal && reviewBooking && (
            <ReviewModal
              reviewBooking={reviewBooking}
              reviewRating={reviewRating}
              setReviewRating={setReviewRating}
              reviewComment={reviewComment}
              setReviewComment={setReviewComment}
              submitReview={submitReview}
              setShowReviewModal={setShowReviewModal}
            />
          )}

          {/* Greeting Section */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome back, {user.firstName}!</h1>
            <p className="text-gray-600 dark:text-gray-300">Manage your bookings and explore Sri Lanka.</p>
          </div>

          {/* Tab Section */}
          <Tabs
            value={activeTab}
            onValueChange={(val) => {
              setActiveTab(val);

              // Reset unread count when going to bookings tab
              if (val === "bookings" && unreadCount > 0) setUnreadCount(0);
            }}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full mb-8 h-auto p-2">
              <TabsTrigger value="bookings" className="relative">
                My Bookings
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="ml-2 h-5 text-xs">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </Badge>
                )}
              </TabsTrigger>

              <TabsTrigger value="messages">Messages</TabsTrigger>
              <TabsTrigger value="reviews">My Reviews</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>

            {/* Bookings Tab */}
            <TabsContent value="bookings">
              <BookingTab
                bookings={bookings}
                loadingBookings={loadingBookings}
                bookingError={bookingError}
                fetchBookings={fetchBookings}
                openReviewModal={openReviewModal}
                openPaymentModal={openPaymentModal}
                handleCancelBooking={handleCancelBooking}
                getStatusColor={getStatusColor}
                getStatusIcon={getStatusIcon}
              />
            </TabsContent>

            {/* Messages Tab */}
            <TabsContent value="messages" className="space-y-4">
              <MessagesTab userDetails={userDetails} messages={messages} />
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="space-y-4">
              <ReviewsTab reviews={reviews} />
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <ProfileTab
                user={user}
                formData={formData}
                photoPreview={photoPreview}
                fileInputRef={fileInputRef}
                isEditing={isEditing}
                loggingOut={loggingOut}
                setFormData={setFormData}
                handleEditToggle={handleEditToggle}
                handlePhotoChange={handlePhotoChange}
                handleLogout={handleLogout}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Payment Modal */}
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          booking={paymentBooking}
          paymentType={paymentType}
          onSuccess={handlePaymentSuccess}
          touristId={getUserId()}
        />
      </div>
    </AuthWrapper>
  );
}

"use client"

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Star, MapPin, Calendar, MessageCircle, Search, Clock, CheckCircle, XCircle, Bell, Sun, Moon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthWrapper from "@/components/AuthWrapper";
import { io } from "socket.io-client";
import PaymentModal from '@/components/PaymentModal'; 
import toast from "react-hot-toast";

export default function TouristDashboard() {
  const [activeTab, setActiveTab] = useState("bookings")
  const [user, setUser] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", phone: "", country: ""
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [loggingOut, setLoggingOut] = useState(false);
  const router = useRouter()
  const fileInputRef = useRef();
  const [photoPreview, setPhotoPreview] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const notificationSocketRef = useRef(null);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentBooking, setPaymentBooking] = useState(null);
  const [paymentType, setPaymentType] = useState(''); // 'advance' or 'remaining'

  // State for review modal
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewBooking, setReviewBooking] = useState(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviews, setReviews] = useState([]);


  const handleEditToggle = async () => {
    if (isEditing) {
      try {
        let profileImageUrl = user.profileImage;
  
        if (selectedFile) {
          const formDataUpload = new FormData();
          formDataUpload.append("file", selectedFile);
  
          const uploadRes = await fetch('/api/tourist/profileImage', {
            method: 'POST',
            body: formDataUpload,
          });
          const uploadData = await uploadRes.json();
          if (!uploadRes.ok) throw new Error(uploadData.error || "Image upload failed");
          profileImageUrl = uploadData.imageUrl;
        }
  
        const updateRes = await axios.put('/api/auth/profile', {
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
  

  const messages = [
    {
      id: 1,
      guide: { name: "John Doe", image: "/placeholder.svg" },
      lastMessage: "Thank you for booking with me!",
      time: "2 hours ago",
      unread: true
    }
  ]

  const fetchBookings = async () => {
    if (!user) return;
    setLoadingBookings(true);
    setBookingError("");
    try {
      const touristId = user._id || user.id;
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

      const res = await fetch("/api/reviews/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          bookingId: reviewBooking._id,
          guideId: reviewBooking.guide._id,
          touristId: user._id || user.id,
          rating: reviewRating,
          comment: reviewComment
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success("Review submitted successfully!");

      // Optional real-time notify guide
      if (notificationSocketRef.current?.connected) {
        notificationSocketRef.current.emit("new-review", {
          guideId: reviewBooking.guide._id,
          review: data.review
        });
      }

      // Refresh bookings so "Leave Review" disappears
      await fetchBookings();
      await fetchMyReviews();
      setShowReviewModal(false);
    } catch (err) {
      toast.error(`Failed to submit review: ${err.message}`);
    }
  };


  // Persistent notification socket
  useEffect(() => {
    if (!user?._id && !user?.id) return;
    const userId = user._id || user.id;

    notificationSocketRef.current = io("http://localhost:3000", {
      path: "/api/socket",
      transports: ["websocket", "polling"],
    });

    notificationSocketRef.current.on("connect", () => {
      notificationSocketRef.current.emit("join-user-room", userId);
      console.log(`✅ Connected to notifications for user ${userId}`);
    });

    notificationSocketRef.current.on("booking-notification", (notification) => {
      console.log("🔔 Received notification:", notification);
      setNotifications(prev => [notification, ...prev].slice(0, 10));
      setUnreadCount(prev => prev + 1);

      if (Notification.permission === "granted") {
        new Notification("GuideMeLK - New Update", {
          body: notification.message,
          icon: "/favicon.ico"
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

  useEffect(() => {
    if (!notificationSocketRef.current) return;
  
    notificationSocketRef.current.on("new-review", (payload) => {
      if (payload.review.tourist === (user?._id || user?.id)) {
        fetchMyReviews();
      }
    });
  
    return () => {
      if (notificationSocketRef.current) {
        notificationSocketRef.current.off("new-review");
      }
    };
  }, [user?._id, user?.id]);
  
  

  useEffect(() => {
    fetchMyReviews();
  }, [user?._id, user?.id]);
  

  // Ask notification permission
  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Initial bookings
  const userId = user?._id || user?.id;
  useEffect(() => {
    if (!user?._id && !user?.id) return;  
    fetchBookings();
  }, [userId]);  


  // Cancel booking with socket emit
  const handleCancelBooking = async (bookingId) => {
    if (!confirm("Are you sure you want to cancel this booking? This action cannot be undone.")) return;
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cancel' }),
        credentials: 'include'
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to cancel booking');

      setBookings(prevBookings =>
        prevBookings.map(b => b._id === bookingId ? { ...b, status: 'cancelled' } : b)
      );

      toast.success(`${data.message}`);

      // Emit to guide
      if (notificationSocketRef.current?.connected) {
        notificationSocketRef.current.emit("booking-status-update", {
          bookingId,
          status: "cancelled",
          guideId: data.booking.guide?._id || data.booking.guide,
          touristId: user._id || user.id
        });
      }

      fetchBookings();

    } catch (error) {
      console.error('Cancel booking error:', error);
      toast.error(`Error: ${error.message}`);
    }
  };

  const fetchMyReviews = async () => {
    try {
      const id = user?._id || user?.id;
      if (!id) return;
      const res = await fetch(`/api//tourist/${id}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch reviews");
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  // Profile fetch
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
          setTimeout(() => { router.replace("/login"); }, 2000);
        } else {
          setError("Unable to load your dashboard. Please try again later.");
        }
      }
    };
    fetchUser();
  }, [router]);

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

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "completed": return "bg-blue-100 text-blue-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed": return <CheckCircle className="h-4 w-4" />
      case "pending": return <Clock className="h-4 w-4" />
      case "completed": return <CheckCircle className="h-4 w-4" />
      case "cancelled": return <XCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  if (loading) return <div className="p-10 text-center">Loading dashboard...</div>
  if (error) return <div className="p-10 text-center text-red-600">{error}</div>
  if (!user) return null

  const handleLogout = async () => {
    if (loggingOut) return; 
    setLoggingOut(true);
    try {
      await axios.post("/api/auth/logout");
      setUser(null);
      toast.success("Logged out successfully.", {duration: 2000});
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

  const NotificationDropdown = () => (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          const willOpen = !showNotifications;
          setShowNotifications(willOpen);

          // If opening the dropdown, clear the count
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
  
  // Open payment modal
  const openPaymentModal = (booking, type) => {
    setPaymentBooking(booking);
    setPaymentType(type);
    setShowPaymentModal(true);
  };

  // Handle payment success
  const handlePaymentSuccess = async (data) => {
    // Send real-time notification to guide
    if (notificationSocketRef.current?.connected) {
      notificationSocketRef.current.emit("booking-status-update", {
        bookingId: paymentBooking._id,
        status: paymentType === 'advance' ? 'advance-paid' : 'remaining-paid',
        guideId: paymentBooking.guide._id,
        touristId: user._id || user.id
      });
    }

    // Refresh bookings
    await fetchBookings();
    
    // Close modal
    setShowPaymentModal(false);
    setPaymentBooking(null);
    setPaymentType('');
  };
  

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
            
            {/* Centered Navigation Menu */}
            <nav className="/tourist md:flex space-x-6 absolute left-1/2 transform -translate-x-1/2">
            <Link href="/" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">
              Home
            </Link>
            <Link href="/findGuide" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">
              Find a Guide
            </Link>
            <Link href="/about" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">
              About Us
            </Link>
            </nav>
            
            {/* Right side - Dark Mode Toggle, Notifications and User Profile */}
            <div className="flex items-center space-x-3">
              {/* Dark Mode Toggle */}
              <button
                onClick={() => {
                  const isDark = document.documentElement.classList.contains('dark');
                  if (isDark) {
                    document.documentElement.classList.remove('dark');
                    localStorage.setItem('theme', 'light');
                  } else {
                    document.documentElement.classList.add('dark');
                    localStorage.setItem('theme', 'dark');
                  }
                }}
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Toggle dark mode"
              >
                <Sun className="h-5 w-5 hidden dark:block" />
                <Moon className="h-5 w-5 block dark:hidden" />
              </button>

              {/* Notification Dropdown */}
              <NotificationDropdown />
              
              {/* User Profile Section */}
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.profileImage || "/placeholder.svg"} />
                  <AvatarFallback>
                    {user.firstName?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.firstName}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {showReviewModal && reviewBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Leave a Review for {reviewBooking.guide?.firstName}</h3>
            
            {/* Rating stars */}
            <div className="flex gap-1 mb-4">
              {[1,2,3,4,5].map((star) => (
                <Star
                  key={star}
                  className={`h-6 w-6 cursor-pointer ${star <= reviewRating ? "text-yellow-400" : "text-gray-300"}`}
                  onClick={() => setReviewRating(star)}
                />
              ))}
            </div>
      
            {/* Comment */}
            <textarea
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Write your feedback..."
              className="w-full border border-gray-300 dark:border-gray-600 rounded p-2 mb-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
            />
      
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowReviewModal(false)}>Cancel</Button>
              <Button onClick={submitReview}>Submit Review</Button>
            </div>
          </div>
        </div>
      )}
        {/* Greeting Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome back, {user.firstName}!</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage your bookings and explore Sri Lanka.</p>
        </div>

        {/* Tab Section */}
        <Tabs value={activeTab} onValueChange={(val) => {
          setActiveTab(val);

          // Reset unread count when going to bookings tab
          if (val === "bookings" && unreadCount > 0) {
            setUnreadCount(0);
          }
        }} className="w-full">
          <TabsList className="grid grid-cols-4 w-full mb-6">
            <TabsTrigger value="bookings" className="relative">
              My Bookings
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2 h-5 text-xs">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="reviews">My Reviews</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>


            {/* Bookings Tab */}
            <TabsContent value="bookings" className="space-y-4">
              <div className="flex items-center justify-between">
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
                  <CardContent className="p-6">
                    <div className="flex justify-between">
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
                      <div className="text-right">
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
                    
                    <div className="flex gap-2 mt-4">
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

            {/* Messages Tab */}
            <TabsContent value="messages" className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Messages</h2>
              {messages.map((msg) => (
                <Card key={msg.id} className="hover:shadow-md">
                  <CardContent className="p-4 flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={msg.guide.image} alt={msg.guide.name} />
                      <AvatarFallback>{msg.guide.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{msg.guide.name}</h3>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{msg.time}</span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">{msg.lastMessage}</p>
                      
                      <Button
                        size="sm"
                        className="mt-2"
                        onClick={() => {
                          const currentUser = JSON.parse(localStorage.getItem("user"));
                          if (!currentUser) {
                            router.push("/login");
                            return;
                          }
                          router.push("/chat");
                        }}
                      >
                        <MessageCircle className="mr-1 h-4 w-4" />
                        Go to Chat
                      </Button>
                    </div>
                    {msg.unread && <div className="w-3 h-3 bg-blue-600 rounded-full" />}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">My Reviews</h2>
            {reviews.map((review) => (
              <Card key={review._id}>
                <CardContent className="p-6 flex gap-4">
                  <Avatar>
                    <AvatarImage 
                      src={review.guide?.profileImage || "/placeholder.svg"} 
                      alt={`${review.guide?.firstName || ""} ${review.guide?.lastName || ""}`} 
                    />
                    <AvatarFallback>
                      {(review.guide?.firstName?.[0] || "") + (review.guide?.lastName?.[0] || "")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {review.guide?.firstName} {review.guide?.lastName}
                    </h3>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                                        </div>
                    <div className="flex gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Profile Settings</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center mb-4 gap-4">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={photoPreview || user.profileImage || "/placeholder.svg"} />
                      <AvatarFallback>
                        {user.firstName?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      className="block"
                      onChange={handlePhotoChange}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      value={formData.email}
                      disabled
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input 
                      id="phone" 
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                      disabled={!isEditing} 
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input 
                      id="country" 
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })} 
                      disabled={!isEditing}
                    />
                  </div>
                </CardContent>
              </Card>
              <div className="mt-2">
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={handleEditToggle}
                >
                  {isEditing ? "Save Changes" : "Update Profile"}
                </Button>

                <Button
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-white m-1"
                  onClick={handleLogout}
                  disabled={loggingOut}
                >
                  {loggingOut ? "Logging out..." : "Log Out"}
                </Button>
              </div>
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
        touristId={user?._id || user?.id}
      />
    </div>
    </AuthWrapper>
  )
}
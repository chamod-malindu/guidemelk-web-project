"use client"

import React, { useEffect, useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Star, MapPin, Calendar, MessageCircle, Search, Clock, CheckCircle, XCircle, Sun, Moon, LogOut } from "lucide-react"

function Navbar({ user }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm py-4 px-6 md:px-12 flex justify-between items-center rounded-b-xl">
      <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">Guidemelk</div>
      <nav className="hidden md:flex space-x-6">
        <a href="/" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300">Home</a>
        <a href="/find-guide" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300">Find a Guide</a>
        <a href="/become-guide" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300">Become a Guide</a>
        <a href="/about" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300">About Us</a>
      </nav>
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        {user ? (
          <span className="text-gray-700 dark:text-gray-300">Hello, {user.firstName}</span>
        ) : (
          <a href="/login" className="px-5 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md">Login / Sign Up</a>
        )}
      </div>
    </header>
  );
}

const LocalInput = ({ className, type, ...props }) => {
  return (
    <input
      type={type}
      className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-indigo-400 ${className}`}
      {...props}
    />
  );
};

export default function TouristDashboard() {
  const [activeTab, setActiveTab] = useState("bookings")
  const [user, setUser] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: ""
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [loggingOut, setLoggingOut] = useState(false);

  const [bookings] = useState([
    {
      id: 1,
      guide: { name: "Kasun Perera", location: "Kandy", image: "https://placehold.co/40x40/E0F2FE/1E40AF?text=KP" },
      date: "2024-08-10",
      status: "confirmed",
      price: 80,
      groupSize: 2
    },
    {
      id: 2,
      guide: { name: "Nimali Silva", location: "Galle", image: "https://placehold.co/40x40/FFE4E6/BE185D?text=NS" },
      date: "2024-08-12",
      status: "pending",
      price: 90,
      groupSize: 1
    }
  ])

  const [messages] = useState([
    {
      id: 1,
      guide: { name: "Kasun Perera", image: "https://placehold.co/40x40/E0F2FE/1E40AF?text=KP" },
      lastMessage: "Excited to meet you!",
      time: "2 hours ago",
      unread: true
    }
  ])

  const [reviews] = useState([
    {
      id: 1,
      guide: { name: "Rohan Fernando", image: "https://placehold.co/40x40/D1FAE5/065F46?text=RF" },
      rating: 5,
      comment: "Very friendly and knowledgeable!",
      date: "2024-07-20"
    }
  ])

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true)
      setError("");
      try {
        const dummyUser = {
          firstName: "Tourist",
          lastName: "User",
          email: "tourist@example.com",
          phone: "0771234567",
          country: "Sri Lanka"
        };
        setUser(dummyUser);
        setFormData(dummyUser);
        setLoading(false);

      } catch (err) {
        setLoading(false);
        console.error("Failed to load user:", err)
        setError("Unable to load your dashboard. (Simulated error)");
      }
    }

    fetchUser()
  }, [])

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
      case "confirmed": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "completed": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "cancelled": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
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

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50">Loading dashboard...</div>
  if (error) return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-red-600 dark:text-red-400">{error}</div>
  if (!user) return null

  const handleEditToggle = async () => {
    if (isEditing) {
      try {
        alert("Profile update simulated successfully!");
        setUser(formData);
      } catch (err) {
        console.error("Update failed:", err)
        alert("Error updating profile. (Simulated error)");
      }
    }
    setIsEditing(!isEditing)
  }

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      setUser(null);
      alert("Logged out successfully.");
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again. (Simulated error)");
    } finally {
      setLoggingOut(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50 font-inter">
      <Navbar user={user} />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-2">Welcome back, {user.firstName}!</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage your bookings and explore Sri Lanka.</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 w-full mb-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm">
            <TabsTrigger value="bookings" className="data-[state=active]:bg-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-md dark:data-[state=active]:bg-indigo-600 dark:data-[state=active]:text-white">My Bookings</TabsTrigger>
            <TabsTrigger value="messages" className="data-[state=active]:bg-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-md dark:data-[state=active]:bg-indigo-600 dark:data-[state=active]:text-white">Messages</TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:bg-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-md dark:data-[state=active]:bg-indigo-600 dark:data-[state=active]:text-white">My Reviews</TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-md dark:data-[state=active]:bg-indigo-600 dark:data-[state=active]:text-white">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">My Bookings</h2>
                <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md">
                  <a href="/findGuide">
                    <Search className="mr-2 h-4 w-4" />
                    Find New Guide
                  </a>
                </Button>
              </div>

              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <Card key={booking.id} className="bg-gray-50 dark:bg-gray-700 border-none shadow-sm hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex gap-4">
                          <Avatar className="w-16 h-16 border-2 border-indigo-300 dark:border-indigo-600">
                            <AvatarImage src={booking.guide.image} alt={booking.guide.name} />
                            <AvatarFallback className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-lg">{booking.guide.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{booking.guide.name}</h3>
                            <div className="text-gray-600 dark:text-gray-300 flex items-center gap-2 text-sm">
                              <MapPin className="h-4 w-4 text-indigo-500" />
                              <span>{booking.guide.location}</span>
                            </div>
                            <div className="text-gray-600 dark:text-gray-300 flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4 text-indigo-500" />
                              <span>{booking.date}</span>
                              <span className="ml-2">• {booking.groupSize} {booking.groupSize === 1 ? "person" : "people"}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusColor(booking.status)}`}>
                            {getStatusIcon(booking.status)}
                            <span className="capitalize">{booking.status}</span>
                          </Badge>
                          <div className="text-green-600 dark:text-green-400 font-bold text-xl mt-2">LKR {booking.price.toLocaleString()}</div>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm" className="border-indigo-500 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-400 dark:text-indigo-300 dark:hover:bg-gray-700">
                          <MessageCircle className="mr-1 h-4 w-4" />
                          Message Guide
                        </Button>
                        {booking.status === "completed" && (
                          <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-white shadow-sm">
                            <Star className="mr-1 h-4 w-4" />
                            Leave Review
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-10">No bookings found.</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="messages" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="grid gap-4">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Messages</h2>
              {messages.length > 0 ? (
                messages.map((msg) => (
                  <Card key={msg.id} className="bg-gray-50 dark:bg-gray-700 border-none shadow-sm hover:shadow-md cursor-pointer">
                    <CardContent className="p-4 flex items-center gap-4">
                      <Avatar className="w-12 h-12 border-2 border-blue-300 dark:border-blue-600">
                        <AvatarImage src={msg.guide.image} alt={msg.guide.name} />
                        <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">{msg.guide.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <h3 className="font-semibold text-gray-800 dark:text-gray-100">{msg.guide.name}</h3>
                          <span className="text-sm text-gray-600 dark:text-gray-400">{msg.time}</span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">{msg.lastMessage}</p>
                      </div>
                      {msg.unread && <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse" />}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-10">No messages found.</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="grid gap-4">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">My Reviews</h2>
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <Card key={review.id} className="bg-gray-50 dark:bg-gray-700 border-none shadow-sm hover:shadow-md">
                    <CardContent className="p-6 flex gap-4">
                      <Avatar className="w-12 h-12 border-2 border-green-300 dark:border-green-600">
                        <AvatarImage src={review.guide.image} alt={review.guide.name} />
                        <AvatarFallback className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">{review.guide.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between mb-2">
                          <h3 className="font-semibold text-gray-800 dark:text-gray-100">{review.guide.name}</h3>
                          <span className="text-sm text-gray-600 dark:text-gray-400">{review.date}</span>
                        </div>
                        <div className="flex gap-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < review.rating ? "text-yellow-400" : "text-gray-300 dark:text-gray-500"}`}
                              fill={i < review.rating ? "currentColor" : "none"}
                              stroke={i < review.rating ? "currentColor" : "currentColor"}
                            />
                          ))}
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-10">No reviews found.</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="profile" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="grid gap-6">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Profile Settings</h2>
              <Card className="bg-gray-50 dark:bg-gray-700 border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-gray-800 dark:text-gray-100">Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-gray-700 dark:text-gray-300">First Name</Label>
                      <LocalInput
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        disabled={!isEditing}
                        className="dark:bg-gray-600 dark:border-gray-500 dark:text-gray-50"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-gray-700 dark:text-gray-300">Last Name</Label>
                      <LocalInput
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        disabled={!isEditing}
                        className="dark:bg-gray-600 dark:border-gray-500 dark:text-gray-50"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email</Label>
                    <LocalInput
                      id="email"
                      value={formData.email}
                      disabled
                      className="dark:bg-gray-600 dark:border-gray-500 dark:text-gray-50 cursor-not-allowed opacity-70"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300">Phone</Label>
                    <LocalInput
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={!isEditing}
                      className="dark:bg-gray-600 dark:border-gray-500 dark:text-gray-50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="country" className="text-gray-700 dark:text-gray-300">Country</Label>
                    <LocalInput
                      id="country"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      disabled={!isEditing}
                      className="dark:bg-gray-600 dark:border-gray-500 dark:text-gray-50"
                    />
                  </div>
                </CardContent>
              </Card>
              <div className="mt-2 flex gap-2">
                <Button
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-colors duration-200"
                  onClick={handleEditToggle}
                >
                  {isEditing ? "Save Changes" : "Update Profile"}
                </Button>

                <Button
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-white shadow-md transition-colors duration-200"
                  onClick={handleLogout}
                  disabled={loggingOut}
                >
                  {loggingOut ? "Logging out..." : "Log Out"}
                </Button>

              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
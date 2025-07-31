"use client"

import { useEffect, useRef, useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Star, MapPin, Calendar, MessageCircle, Search, Clock, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { useRouter } from "next/navigation"
import AuthWrapper from "@/components/AuthWrapper"


export default function TouristDashboard() {
  const [activeTab, setActiveTab] = useState("bookings") // Tracks selected tab
  const [user, setUser] = useState(null) // Holds current logged-in user profile
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
  const router = useRouter()
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef();
  const [photoPreview, setPhotoPreview] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);


  // Dummy bookings data
  const [bookings] = useState([
    {
      id: 1,
      guide: { name: "Kasun Perera", location: "Kandy", image: "/placeholder.svg" },
      date: "2024-08-10",
      status: "confirmed",
      price: 80,
      groupSize: 2
    },
    {
      id: 2,
      guide: { name: "Nimali Silva", location: "Galle", image: "/placeholder.svg" },
      date: "2024-08-12",
      status: "pending",
      price: 90,
      groupSize: 1
    }
  ])

  // Dummy messages data
  const [messages] = useState([
    {
      id: 1,
      guide: { name: "Kasun Perera", image: "/placeholder.svg" },
      lastMessage: "Excited to meet you!",
      time: "2 hours ago",
      unread: true
    }
  ])

  // Dummy reviews data
  const [reviews] = useState([
    {
      id: 1,
      guide: { name: "Rohan Fernando", image: "/placeholder.svg" },
      rating: 5,
      comment: "Very friendly and knowledgeable!",
      date: "2024-07-20"
    }
  ])

  // Get logged-in user's profile from /api/auth/profile
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true)
      setError("");
      try {
        const res = await axios.get("/api/auth/profile");
        setUser(res.data.user);
        setFormData(res.data.user);
        setLoading(false);

      } catch (err) {
        setLoading(false);
        console.error("Failed to load user:", err)

        if (err.response && err.response.status === 401) {
          setError("Your session has expired. Redirecting to login...");
          setTimeout(() => {
            router.replace("/login");
          }, 2000); // Delay lets user read message
        } else {
          setError("Unable to load your dashboard. Please try again later.");
        }
        
      }
    }

    fetchUser()
  }, [router])

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
  

  // Status color for each booking
  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800"
      case "pending": return "bg-yellow-100 text-yellow-800"
      case "completed": return "bg-blue-100 text-blue-800"
      case "cancelled": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  // Icon based on booking status
  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed": return <CheckCircle className="h-4 w-4" />
      case "pending": return <Clock className="h-4 w-4" />
      case "completed": return <CheckCircle className="h-4 w-4" />
      case "cancelled": return <XCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  // Render nothing until user is fetched
  if (loading) return <div className="p-10 text-center">Loading dashboard...</div>
  if (error) return <div className="p-10 text-center text-red-600">{error}</div>
  if (!user) return null

  const handleEditToggle = async () => {
    if (isEditing) {
      // Save Changes to backend
      try {
        let profileImageUrl = user.profileImage;

        if (selectedFile) {
          const formData = new FormData();
          formData.append("file", selectedFile);
  
          const res = await fetch('/api/tourist/profileImage', {
            method: 'POST',
            body: formData,
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Image upload failed");
          profileImageUrl = data.imageUrl;
        }
        const response = await axios.put('/api/auth/profile', {
          ...formData,
          profileImage: profileImageUrl,
        });
  
        if (response.data.success) {
          setUser(response.data.user);
          setPhotoPreview("");
          setSelectedFile(null);
          alert("Profile updated successfully!");
        } else {
          alert("Failed to update profile.");
        }
      } catch (err) {
        console.error("Update failed:", err);
        alert(err.message || "Error updating profile.");
      }
    }
  
    setIsEditing(!isEditing)
  }

  const handleLogout = async () => {
    if (loggingOut) return; 
    setLoggingOut(true);
    try {
      await axios.post("/api/auth/logout");
      // Clear user data immediately for fast UI feedback
      setUser(null);
      alert("Logged out successfully.");
      router.replace("/login"); // Redirect cleanly to login
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  };
  
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file || null);
    setPhotoPreview(file ? URL.createObjectURL(file) : "");
  };
  
  const handlePhotoUpload = async () => {
    const file = fileInputRef.current.files[0];
    if (!file) return;
    setUploading(true);
    setUploadError("");
  
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const res = await fetch('/api/tourist/profileImage', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setUser({ ...user, profileImage: data.imageUrl }); // update local profile
      setPhotoPreview("");
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <AuthWrapper requiredRole="tourist">
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <Navbar user={user} />

      <div className="container mx-auto px-4 py-8">
        {/* Greeting Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user.firstName}!</h1>
          <p className="text-gray-600">Manage your bookings and explore Sri Lanka.</p>
        </div>

        {/* Tab Section */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full mb-6">
            <TabsTrigger value="bookings">My Bookings</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="reviews">My Reviews</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">My Bookings</h2>
                <Button asChild>
                  <Link href="/search">
                    <Search className="mr-2 h-4 w-4" />
                    Find New Guide
                  </Link>
                </Button>
              </div>

              {bookings.map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between">
                      <div className="flex gap-4">
                        <Avatar>
                          <AvatarImage src={booking.guide.image} alt={booking.guide.name} />
                          <AvatarFallback>{booking.guide.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-lg font-semibold">{booking.guide.name}</h3>
                          <div className="text-gray-600 flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{booking.guide.location}</span>
                          </div>
                          <div className="text-gray-600 flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{booking.date}</span>
                            • {booking.groupSize} {booking.groupSize === 1 ? "person" : "people"}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(booking.status)}>
                          {getStatusIcon(booking.status)}
                          <span className="ml-1 capitalize">{booking.status}</span>
                        </Badge>
                        <div className="text-blue-600 font-bold text-xl mt-2">${booking.price}</div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm">
                        <MessageCircle className="mr-1 h-4 w-4" />
                        Message Guide
                      </Button>
                      {booking.status === "completed" && (
                        <Button size="sm">
                          <Star className="mr-1 h-4 w-4" />
                          Leave Review
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages">
            <div className="grid gap-4">
              <h2 className="text-2xl font-semibold">Messages</h2>
              {messages.map((msg) => (
                <Card key={msg.id} className="hover:shadow-md cursor-pointer">
                  <CardContent className="p-4 flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={msg.guide.image} alt={msg.guide.name} />
                      <AvatarFallback>{msg.guide.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold">{msg.guide.name}</h3>
                        <span className="text-sm text-gray-600">{msg.time}</span>
                      </div>
                      <p className="text-gray-700">{msg.lastMessage}</p>
                    </div>
                    {msg.unread && <div className="w-3 h-3 bg-blue-600 rounded-full" />}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <div className="grid gap-4">
              <h2 className="text-2xl font-semibold">My Reviews</h2>
              {reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-6 flex gap-4">
                    <Avatar>
                      <AvatarImage src={review.guide.image} alt={review.guide.name} />
                      <AvatarFallback>{review.guide.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-semibold">{review.guide.name}</h3>
                        <span className="text-sm text-gray-600">{review.date}</span>
                      </div>
                      <div className="flex gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                      <p>{review.comment}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="grid gap-6">
              <h2 className="text-2xl font-semibold">Profile Settings</h2>
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
                      disabled={!isEditing} // Only editable when editing
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
                disabled={loggingOut} // Disable while logout in progress
              >
                {loggingOut ? "Logging out..." : "Log Out"}
              </Button>

              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </AuthWrapper>
  )
}

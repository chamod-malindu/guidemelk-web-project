"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import {Star, MapPin, Languages, Users, Calendar, MessageCircle, Award, Clock, ChevronDown,X,} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import AuthWrapper from "@/components/AuthWrapper";
import { getCurrentUser } from "@/utils/getCurrentUser";
import { useRef } from "react";
import toast from "react-hot-toast";


// Destination list
const DESTINATIONS = [
  "Colombo", "Gampaha", "Kalutara", "Kandy", "Matale", "Nuwara Eliya", 
  "Galle", "Matara", "Hambantota", "Jaffna", "Kilinochchi", "Mannar", 
  "Mullaitivu", "Vavuniya", "Trincomalee", "Batticaloa", "Ampara", 
  "Kurunegala", "Puttalam", "Anuradhapura", "Polonnaruwa", "Badulla", 
  "Monaragala", "Ratnapura", "Kegalle"
];

function GuideProfile() {
  const notificationSocketRef = useRef(null);
  const { id } = useParams();
  const router = useRouter();

  // States for fetched guide data
  const [guide, setGuide] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [groupSize, setGroupSize] = useState(1);
  const [specialRequests, setSpecialRequests] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [creatingChat, setCreatingChat] = useState(false);

  // New states for destination and duration
  const [selectedDestinations, setSelectedDestinations] = useState([]);
  const [duration, setDuration] = useState(1);
  const [destinationDropdownOpen, setDestinationDropdownOpen] = useState(false);

  // Fetch guide data on mount and when id changes
  useEffect(() => {
    if (!id) return;

    async function fetchGuide() {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(`/api/guides/${id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch guide data");
        }
        const data = await res.json();
        setGuide(data.guide);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchGuide();
  }, [id]);

  // Handlers
  const handleBooking = async (e) => {
    e.preventDefault();
    if (!guide) return;
  
    // Validate form data
    if (selectedDestinations.length === 0) {
      toast.error("Please select at least one destination");
      return;
    }
    if (!selectedDate) {
      toast.error("Please select a date for your tour");
      return;
    }
  
    const currentUser = await getCurrentUser("tourist");
    if (!currentUser?.id) {
      toast.error("Please log in to book a tour", {duration: 2000});
      setTimeout(() => {
        router.push("/login");
      }, 2000)
      return;
    }
  
    const bookingData = {
      guideId: guide._id,
      date: selectedDate,
      duration: duration,
      groupSize: groupSize,
      destinations: selectedDestinations,
      specialRequests: specialRequests,
      totalCost: (guide.pricePerDay || 0) * groupSize * duration
    };
  
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
        credentials: 'include'
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create booking');
      }
  
      const durationText =
        duration === 21 ? "3 weeks" :
        duration === 30 ? "1 month" :
        duration === 60 ? "2 months" :
        duration === 90 ? "3 months" :
        `${duration} ${duration === 1 ? "day" : "days"}`;
  
      toast.custom(
        <div className="whitespace-pre-line p-3 rounded-lg max-w-sm bg-white shadow-lg">
        {`✅ Booking request sent successfully!

        Details:
        - Guide: ${guide.firstName} ${guide.lastName}
        - Date: ${selectedDate}
        - Duration: ${durationText}
        - Group Size: ${groupSize}
        - Destinations: ${selectedDestinations.join(', ')}
        - Total Cost: ${bookingData.totalCost}

        The guide will respond within 24 hours. You can check the status in your dashboard.`}
          </div>
        );
  
      // Redirect to tourist dashboard to see the booking
      router.push('/tourist/dashboard?tab=bookings');
      
    } catch (error) {
      console.error('Booking error:', error);
      toast.error(`Booking failed: ${error.message}`);
    }
  };
  

  const handleMessageGuide = async () => {
    if (!guide || !guide._id) return;
    setCreatingChat(true);
  
    try {
      const currentUser = await getCurrentUser("tourist"); // optional role check
      if (!currentUser?.id) {
        router.push("/login");
        return;
      }
  
      const resChat = await fetch(
        `/api/chat/conversations?user1=${currentUser.id}&user2=${guide._id}`
      );
      if (!resChat.ok) throw new Error("Failed to create or fetch chat");
  
      const chat = await resChat.json();
      router.push(`/chat?chatId=${chat._id}`);
    } catch (err) {
      console.error("Failed to start chat:", err);
      toast.error("Could not open chat. Please try again.");
    } finally {
      setCreatingChat(false);
    }
  };

  // Destination handling functions
  const toggleDestination = (destination) => {
    setSelectedDestinations(prev => {
      if (prev.includes(destination)) {
        return prev.filter(d => d !== destination);
      } else {
        return [...prev, destination];
      }
    });
  };

  const removeDestination = (destination) => {
    setSelectedDestinations(prev => prev.filter(d => d !== destination));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading guide profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white rounded-lg shadow-lg p-8 max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white rounded-lg shadow-lg p-8 max-w-md">
          <div className="text-gray-400 text-5xl mb-4">🔍</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Guide Not Found</h2>
          <p className="text-gray-600">The guide you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Enhanced Cover Section */}
      <div className="relative h-64 md:h-80 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Enhanced Profile Header */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                <div className="relative">
                <Image
                  src={guide.profileImage && guide.profileImage.length > 0
                    ? guide.profileImage
                    : "/placeholder.svg"}
                  alt={`${guide.firstName} ${guide.lastName}`}
                  width={96}
                  height={96}
                  className="rounded-full border-4 border-white shadow-lg object-cover"
                />

                  <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white rounded-full p-1">
                    <Award className="h-4 w-4" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                      {guide.firstName} {guide.lastName}
                    </h1>
                  </div>
                  <div className="mb-3">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        guide.isEmailVerified
                          ? "bg-green-100 text-green-800 border border-green-200"
                          : "bg-red-100 text-red-800 border border-red-200"
                      }`}
                    >
                      {guide.isEmailVerified ? (
                        <>
                          <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                          Verified Guide
                        </>
                      ) : (
                        <>
                          <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
                          Not Verified
                        </>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                    <span className="font-medium">{guide.location || "Location not specified"}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center bg-gray-50 px-3 py-1 rounded-lg">
                      <Users className="h-4 w-4 mr-2 text-blue-500" />
                      <span className="font-medium">{guide.experience || 0} years experience</span>
                    </div>
                    <div className="flex items-center bg-gray-50 px-3 py-1 rounded-lg">
                      <Languages className="h-4 w-4 mr-2 text-green-500" />
                      <span className="font-medium">
                        {guide.languages && guide.languages.length > 0 
                          ? guide.languages.join(", ") 
                          : "Languages not specified"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-green-600">
                    ${guide.pricePerDay || 0}
                    <span className="text-lg text-gray-500">/day</span>
                  </div>
                  <div className="text-sm text-gray-500">Starting price</div>
                </div>
              </div>
            </div>

            {/* Enhanced About Section */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <div className="w-1 h-6 bg-blue-600 rounded mr-3"></div>
                About Me
              </h2>
              {guide.bio ? (
                <p className="text-gray-700 leading-relaxed">{guide.bio}</p>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">📝</div>
                  <p>This guide hasn't added a bio yet.</p>
                </div>
              )}
            </div>

            {/* Enhanced Specialties */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <div className="w-1 h-6 bg-purple-600 rounded mr-3"></div>
                Specialties
              </h2>
              {guide.specialties && guide.specialties.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {guide.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium border border-blue-200"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">🎯</div>
                  <p>This guide hasn't added specialties yet.</p>
                </div>
              )}
            </div>

            {/* Photo Gallery */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <div className="w-1 h-6 bg-green-600 rounded mr-3"></div>
                Photo Gallery
              </h2>
              {guide.gallery && guide.gallery.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {guide.gallery.map((photo, index) => (
                    <div key={index} className="relative group cursor-pointer">
                      <Image
                          src={photo.url}
                          alt={photo.title || 'Tour photo'}
                          width={400}
                          height={200}
                          className="w-full h-32 object-cover rounded-lg transition-transform group-hover:scale-105"
                        />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg"></div>
                      {photo.description && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-2 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-xs truncate">{photo.description}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-6xl mb-4">📸</div>
                  <h3 className="text-lg font-medium mb-2">Photos Coming Soon!</h3>
                  <p>This guide is working on adding beautiful photos to showcase their tours.</p>
                </div>
              )}
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <div className="w-1 h-6 bg-yellow-500 rounded mr-3"></div>
                  Reviews
                </h2>
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="font-medium text-gray-900">
                    {guide.rating || "No rating"}
                  </span>
                  <span className="text-gray-500">
                    ({guide.totalReviews || 0} reviews)
                  </span>
                </div>
              </div>

              {guide.reviews && guide.reviews.length > 0 ? (
                <div className="space-y-6">
                  {guide.reviews.map((review, index) => (
                    <div
                      key={index}
                      className="border-b border-gray-200 pb-6 last:border-b-0"
                    >
                      <div className="flex items-start space-x-4">
                        <Image
                          src={review.avatar || "/placeholder.svg"}
                          alt={review.name}
                          width={48} // equals w-12
                          height={48} // equals h-12
                          className="rounded-full object-cover border-2 border-gray-200"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {review.name}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {review.date}
                              </p>
                            </div>
                            <div className="flex items-center space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating
                                      ? "text-yellow-400 fill-current"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-700 leading-relaxed">{review.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-6xl mb-4">⭐</div>
                  <h3 className="text-lg font-medium mb-2">Be the First to Review!</h3>
                  <p>This guide is new and waiting for their first review. Book a tour and share your experience!</p>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8 border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                Book Your Adventure
              </h3>

              <form onSubmit={handleBooking} className="space-y-5">
                <div>
                  <label
                    htmlFor="date"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Select Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="date"
                      id="date"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                </div>

                {/* Duration Field */}
                <div>
                  <label
                    htmlFor="duration"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Duration
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <select
                      id="duration"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      value={duration}
                      onChange={(e) => setDuration(Number.parseInt(e.target.value))}
                    >
                      {/* Days 1-14 */}
                      {[...Array(14)].map((_, i) => (
                        <option key={`day-${i + 1}`} value={i + 1}>
                          {i + 1} {i === 0 ? "day" : "days"}
                        </option>
                      ))}
                      {/* Weeks and Months */}
                      <option value={21}>3 weeks</option>
                      <option value={30}>1 month</option>
                      <option value={60}>2 months</option>
                      <option value={90}>3 months</option>
                    </select>
                  </div>
                </div>

                {/* Destinations Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Destinations
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setDestinationDropdownOpen(!destinationDropdownOpen)}
                      className="w-full flex items-center justify-between pl-4 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                    >
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-500">
                          {selectedDestinations.length === 0 
                            ? "Select destinations..." 
                            : `${selectedDestinations.length} selected`
                          }
                        </span>
                      </div>
                      <ChevronDown 
                        className={`h-4 w-4 text-gray-400 transform transition-transform ${
                          destinationDropdownOpen ? 'rotate-180' : ''
                        }`} 
                      />
                    </button>
                    
                    {destinationDropdownOpen && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {DESTINATIONS.map((destination) => (
                          <label
                            key={destination}
                            className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              className="mr-3 text-blue-600 focus:ring-blue-500"
                              checked={selectedDestinations.includes(destination)}
                              onChange={() => toggleDestination(destination)}
                            />
                            <span className="text-gray-700">{destination}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Selected destinations tags */}
                  {selectedDestinations.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedDestinations.map((destination) => (
                        <span
                          key={destination}
                          className="inline-flex items-center bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                        >
                          {destination}
                          <button
                            type="button"
                            onClick={() => removeDestination(destination)}
                            className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="groupSize"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Group Size
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <select
                      id="groupSize"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      value={groupSize}
                      onChange={(e) => setGroupSize(Number.parseInt(e.target.value))}
                    >
                      {[...Array(10)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1} {i === 0 ? "person" : "people"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="requests"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Special Requests (Optional)
                  </label>
                  <textarea
                    id="requests"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    placeholder="Any special requirements or preferences..."
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                  />
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Base price:</span>
                    <span className="font-medium text-gray-900">${guide.pricePerDay || 0}/day</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium text-gray-900">
                      {duration === 21 ? "3 weeks" : 
                       duration === 30 ? "1 month" : 
                       duration === 60 ? "2 months" : 
                       duration === 90 ? "3 months" : 
                       `${duration} ${duration === 1 ? "day" : "days"}`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Group size:</span>
                    <span className="font-medium text-gray-900">
                      {groupSize} {groupSize === 1 ? "person" : "people"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-semibold border-t border-gray-200 pt-3">
                    <span className="text-gray-900">Total:</span>
                    <span className="text-green-600">${(guide.pricePerDay || 0) * groupSize * duration}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={selectedDestinations.length === 0}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg transition-all font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
                >
                  {selectedDestinations.length === 0 ? "Select Destinations First" : "Request Booking"}
                </button>
              </form>

              <div className="mt-4 pt-4 border-t border-gray-200">
              <Button
                onClick={handleMessageGuide}
                disabled={creatingChat}
                className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 
                          text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center shadow-md hover:shadow-lg"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                {creatingChat ? "Opening..." : "Message Guide"}
              </Button>
              </div>

              <div className="mt-4 text-center text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
                <p className="flex items-center justify-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Free cancellation up to 24 hours before the tour
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GuideProfilePageWrapper() {
  return (
    <AuthWrapper requiredRole="tourist">
      <GuideProfile />
    </AuthWrapper>
  );
}
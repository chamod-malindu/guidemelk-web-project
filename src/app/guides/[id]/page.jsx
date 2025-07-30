"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Star,
  MapPin,
  Languages,
  Users,
  Calendar,
  MessageCircle,
  Award,
  Clock,
} from "lucide-react";
import Image from "next/image";

export default function GuideProfilePage() {
  const { id } = useParams();

  // States for fetched guide data
  const [guide, setGuide] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [groupSize, setGroupSize] = useState(1);
  const [specialRequests, setSpecialRequests] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
  const handleBooking = (e) => {
    e.preventDefault();
    if (!guide) return;
    alert(
      `Booking request sent! ${guide.firstName} ${guide.lastName} will respond within 2 hours.`
    );
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
                    src={guide.profileImage || "/placeholder.svg"}
                    alt={`${guide.firstName} ${guide.lastName}`}
                    width={96} // w-24 = 96px
                    height={96} // h-24 = 96px
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
                    <span className="text-gray-600">Group size:</span>
                    <span className="font-medium text-gray-900">
                      {groupSize} {groupSize === 1 ? "person" : "people"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-semibold border-t border-gray-200 pt-3">
                    <span className="text-gray-900">Total:</span>
                    <span className="text-green-600">${(guide.pricePerDay || 0) * groupSize}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-lg transition-all font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Request Booking
                </button>
              </form>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <button className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white py-2 px-4 rounded-lg transition-all font-medium flex items-center justify-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact Guide
                </button>
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
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Filter, Star, MapPin, Languages, Users, Calendar, DollarSign, ImageIcon } from "lucide-react";
import Image from "next/image";

// Sri Lankan districts data (from your registration form)
const sriLankanDistricts = [
  "All Locations",
  "Colombo", "Gampaha", "Kalutara", "Kandy", "Matale", "Nuwara Eliya", 
  "Galle", "Matara", "Hambantota", "Jaffna", "Kilinochchi", "Mannar", 
  "Mullaitivu", "Vavuniya", "Trincomalee", "Batticaloa", "Ampara", 
  "Kurunegala", "Puttalam", "Anuradhapura", "Polonnaruwa", "Badulla", 
  "Monaragala", "Ratnapura", "Kegalle"
];

// Languages (from your registration form)
const worldLanguages = [
  "All Languages",
  "English", "Sinhala", "Tamil", "Spanish", "French", "German", "Italian", 
  "Portuguese", "Russian", "Chinese (Mandarin)", "Japanese", "Korean", 
  "Arabic", "Hindi", "Dutch", "Swedish", "Norwegian", "Danish", "Finnish", 
  "Polish", "Czech", "Hungarian", "Greek", "Turkish", "Hebrew", "Thai", 
  "Vietnamese", "Indonesian", "Malay", "Swahili", "Romanian", "Bulgarian", 
  "Croatian", "Serbian", "Ukrainian", "Lithuanian", "Latvian", "Estonian"
];

// Tour specialties (from your registration form)
const tourSpecialties = [
  "All Specialties",
  "Cultural Tours", "Historical Tours", "Nature Tours", "Adventure Tours", 
  "Food Tours", "Religious Tours", "Beach Tours", "Mountain Tours", 
  "Wildlife Tours", "Photography Tours", "Cycling Tours", "Hiking Tours", 
  "City Tours", "Village Tours", "Tea Plantation Tours", "Spice Garden Tours", 
  "Archaeological Tours", "Temple Tours", "Ayurveda Tours", "Surf Tours", 
  "Bird Watching", "Whale Watching", "Gem Mining Tours", "Train Journey Tours"
];

// Price ranges
const priceRanges = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "$20-50/day", min: 20, max: 50 },
  { label: "$51-100/day", min: 51, max: 100 },
  { label: "$101-150/day", min: 101, max: 150 },
  { label: "$151+/day", min: 151, max: Infinity }
];

// Default placeholder image
const DEFAULT_PLACEHOLDER = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMjUgNzVDMTM2LjA0NiA3NSAxNDUgODMuOTU0MyAxNDUgOTVDMTQ1IDEwNi4wNDYgMTM2LjA0NiAxMTUgMTI1IDExNUMxMTMuOTU0IDExNSAxMDUgMTA2LjA0NiAxMDUgOTVDMTA1IDgzLjk1NDMgMTEzLjk1NCA3NSAxMjUgNzVaTTEyNSAxMjVIMTc1QzE4MC41MjMgMTI1IDE4NSAxMjkuNDc3IDE4NSAxMzVWMTQ1QzE4NSAxNTAuNTIzIDE4MC41MjMgMTU1IDE3NSAxNTVIOTVDODkuNDc3MSAxNTUgODUgMTUwLjUyMyA4NSAxNDVWMTM1Qzg1IDEyOS40NzcgODkuNDc3MSAxMjUgOTUgMTI1SDEyNVoiIGZpbGw9IiM5Q0E0QUYiLz4KPC9zdmc+";

// Image component with error handling
function GuideImage({ src, alt, className, guide }) {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(!!src);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Optimize Cloudinary URL for faster loading
  const optimizeCloudinaryUrl = (url) => {
    if (!url || !url.includes('cloudinary.com')) return url;
    
    // Add transformations for faster loading: resize, auto format, auto quality
    if (url.includes('/upload/')) {
      return url.replace('/upload/', '/upload/w_400,h_300,c_fill,f_auto,q_auto,fl_progressive/');
    }
    return url;
  };

  // Generate fallback avatar URL
  const getFallbackAvatar = (guide) => {
    const name = `${guide?.firstName || 'Tour'} ${guide?.lastName || 'Guide'}`;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3B82F6&color=fff&size=400&bold=true`;
  };

  const handleError = () => {
    console.log('Image failed to load:', imgSrc, 'Retry count:', retryCount);
    
    // Try fallback avatar on first error
    if (retryCount === 0 && guide) {
      setRetryCount(1);
      setImgSrc(getFallbackAvatar(guide));
      setIsLoading(true);
      setHasError(false);
      return;
    }
    
    // If everything fails, show placeholder
    setHasError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  // Use optimized URL or fallback
  const imageUrl = imgSrc ? optimizeCloudinaryUrl(imgSrc) : null;

  // Don't show loading if no image source
  useEffect(() => {
    if (!src) {
      setIsLoading(false);
      setHasError(true);
    }
  }, [src]);

  return (
    <div className="relative w-full h-48 bg-gradient-to-br from-blue-100 to-blue-200 overflow-hidden">
      {isLoading && imageUrl && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
      
      {!imageUrl || hasError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
          <div className="bg-white rounded-full p-4 mb-3 shadow-lg">
            <ImageIcon className="h-8 w-8 text-blue-500" />
          </div>
          <p className="text-sm font-medium text-blue-700 text-center px-2">
            {guide?.firstName} {guide?.lastName}
          </p>
          <p className="text-xs text-blue-500 text-center px-2 mt-1">
            Tour Guide
          </p>
        </div>
      ) : (
        <Image
          src={imageUrl}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
          onError={handleError}
          onLoad={handleLoad}
          priority={false}
          quality={75}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyb0JIubVvUj/q98a0g8SX1EM6f3FsbUqpWPevayFOr/eoWZnDW9v8AjKRK3DuqQ9q58vk3LRYhq2cQlKJJSaJBOWOWrVLWSoaFqcLqpqWkBKqlTObBNb3hvYhfE8AAAz/TQ/1dj2A7y/qvg7B9gfjzJr3AFvI4kNs5eSH/xAAbEQADAAMBAQAAAAAAAAAAAAABAgMABBESE//aAAgBAgEBPwC+THjSWq3UtVCQUEJkjZIBMoq0fKv7s5dGKHmLnKZLExXLGLJx1N+CQ45t7GWJxzAB9XQMZ/s6rC98AX1xj/1r4="
        />
      )}
      
      {/* Retry button for failed images (only show on hover) */}
      {hasError && retryCount > 0 && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <button
            onClick={() => {
              setRetryCount(0);
              setImgSrc(src);
              setIsLoading(true);
              setHasError(false);
            }}
            className="bg-white text-blue-600 px-3 py-1 rounded text-sm font-medium hover:bg-blue-50"
          >
            Retry Image
          </button>
        </div>
      )}
    </div>
  );
}

export default function FindGuidePage() {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedLanguage, setSelectedLanguage] = useState("All Languages");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties");
  const [selectedPriceRange, setSelectedPriceRange] = useState("All Prices");
  const [travelDate, setTravelDate] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    async function fetchGuides() {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // Increased to 15 seconds
        
        const res = await fetch("/api/guides", {
          signal: controller.signal,
          headers: {
            'Cache-Control': 'no-cache',
            'Accept': 'application/json',
          }
        });
        
        clearTimeout(timeoutId);
        
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Failed to fetch guides: ${res.status} ${res.statusText}. ${errorText}`);
        }
        
        const data = await res.json();
        
        // Process guides to ensure image URLs are valid
        const processedGuides = (data.guides || []).map(guide => ({
          ...guide,
          profileImage: guide.profileImage && 
                       guide.profileImage !== '/placeholder.svg' && 
                       guide.profileImage.trim() !== '' 
            ? guide.profileImage 
            : null
        }));
        
        console.log(`Loaded ${processedGuides.length} guides`);
        setGuides(processedGuides);
      } catch (err) {
        console.error('Error fetching guides:', err);
        if (err.name === 'AbortError') {
          setError('Request timed out. Please check your internet connection and try again.');
        } else if (err.message.includes('MongooseServerSelectionError')) {
          setError('Database connection error. Please check your MongoDB Atlas IP whitelist settings.');
        } else {
          setError(`Failed to load guides: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    }
    
    fetchGuides();
  }, []);

  // Filter function
  const filteredGuides = guides.filter((guide) => {
    // Search term filter
    const matchesSearch =
      !searchTerm ||
      guide.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.specialties?.some(specialty => 
        specialty.toLowerCase().includes(searchTerm.toLowerCase())
      );

    // Location filter
    const matchesLocation =
      selectedLocation === "All Locations" || 
      guide.location === selectedLocation;

    // Language filter
    const matchesLanguage =
      selectedLanguage === "All Languages" ||
      guide.languages?.includes(selectedLanguage);

    // Specialty filter
    const matchesSpecialty =
      selectedSpecialty === "All Specialties" ||
      guide.specialties?.includes(selectedSpecialty);

    // Price filter
    const selectedPrice = priceRanges.find(range => range.label === selectedPriceRange);
    const matchesPrice =
      selectedPriceRange === "All Prices" ||
      (guide.pricePerDay >= selectedPrice.min && guide.pricePerDay <= selectedPrice.max);

    // Available guides filter (only verified guides)
    const isAvailable = guide.isEmailVerified;

    return matchesSearch && matchesLocation && matchesLanguage && matchesSpecialty && matchesPrice && isAvailable;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedLocation("All Locations");
    setSelectedLanguage("All Languages");
    setSelectedSpecialty("All Specialties");
    setSelectedPriceRange("All Prices");
    setTravelDate("");
  };

  if (loading) 
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading guides...</p>
        </div>
      </div>
    );

  if (error) 
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600 max-w-md mx-auto p-6">
          <p className="text-xl mb-2">Error loading guides</p>
          <p className="text-sm mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Find Your Perfect Guide</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Browse through our verified professional tour guides and find the perfect match for your Sri Lankan adventure
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          {/* Main search bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search guides, locations, or specialties..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter toggle button */}
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Filter className="h-4 w-4 mr-2" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
            
            {(searchTerm || selectedLocation !== "All Locations" || selectedLanguage !== "All Languages" || 
              selectedSpecialty !== "All Specialties" || selectedPriceRange !== "All Prices") && (
              <button
                onClick={clearFilters}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>

          {/* Filter options */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 pt-4 border-t">
              {/* Location filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                >
                  {sriLankanDistricts.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>

              {/* Language filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                >
                  {worldLanguages.map((language) => (
                    <option key={language} value={language}>
                      {language}
                    </option>
                  ))}
                </select>
              </div>

              {/* Specialty filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                >
                  {tourSpecialties.map((specialty) => (
                    <option key={specialty} value={specialty}>
                      {specialty}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price range filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  value={selectedPriceRange}
                  onChange={(e) => setSelectedPriceRange(e.target.value)}
                >
                  {priceRanges.map((range) => (
                    <option key={range.label} value={range.label}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Travel date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Travel Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
          )}
        </div>

        {/* Results count */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600">
            Showing {filteredGuides.length} verified guide{filteredGuides.length !== 1 ? "s" : ""}
          </p>
          <div className="flex items-center text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            Only verified guides shown
          </div>
        </div>

        {/* Guides Grid */}
        {filteredGuides.length === 0 ? (
          <div className="text-center py-12">
            <div className="mb-4">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No verified guides found matching your criteria.</p>
              <p className="text-gray-400 mt-2">Try adjusting your search or filters.</p>
            </div>
            {(searchTerm || selectedLocation !== "All Locations" || selectedLanguage !== "All Languages" || 
              selectedSpecialty !== "All Specialties" || selectedPriceRange !== "All Prices") && (
              <button
                onClick={clearFilters}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {filteredGuides.map((guide) => (
              <div
                key={guide._id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative">
                  <GuideImage
                    src={guide.profileImage}
                    alt={`${guide.firstName} ${guide.lastName}`}
                    className="object-cover"
                    guide={guide}
                  />
                  <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold text-green-600 shadow-md">
                    ${guide.pricePerDay || 'N/A'}/day
                  </div>
                  <div className="absolute top-4 left-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Verified
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {guide.firstName} {guide.lastName}
                    </h3>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm font-medium">4.8</span>
                      <span className="ml-1 text-sm text-gray-500">(12)</span>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{guide.location || "Location not specified"}</span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {guide.bio || "No description available"}
                  </p>

                  {/* Specialties */}
                  {guide.specialties && guide.specialties.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1 mb-2">
                        {guide.specialties.slice(0, 2).map((specialty, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            {specialty}
                          </span>
                        ))}
                        {guide.specialties.length > 2 && (
                          <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                            +{guide.specialties.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Guide info */}
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Languages className="h-4 w-4 mr-1" />
                      <span>{guide.languages?.length || 0} languages</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{guide.experience || 0} years</span>
                    </div>
                  </div>

                  <Link
                    href={`/guides/${guide._id}`}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center block font-medium"
                  >
                    View Profile & Book
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Star, MapPin, Languages, Users, Heart, Eye, Calendar, Info} from "lucide-react";
import Link from "next/link";
import TouristNavbar from '@/components/TouristNavbar';

export default function TouristHomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [likedGuides, setLikedGuides] = useState(new Set());

  const [isDarkMode, setIsDarkMode] = useState(false);

  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/profile", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    fetchUser();
  }, []);


  const guides = [
    {
      id: 1,
      name: "Kasun Perera",
      location: "Colombo & Western Province",
      rating: 4.9,
      reviews: 127,
      price: 45,
      image: "/img/depositphotos_312917418-stock-photo-young-handsome-indian-businessman-isolated.jpg",
      specialties: ["Cultural Tours", "City Tours", "Food Tours"],
      languages: ["English", "Sinhala", "Tamil"],
      experience: "8 years",
      description: "Experienced guide specializing in cultural and city tours around Colombo.",
      verified: true,
      responseTime: "Within 2 hours",
      totalBookings: 245,
    },
    {
      id: 2,
      name: "Nimal Silva",
      location: "Kandy & Central Province",
      rating: 4.8,
      reviews: 89,
      price: 40,
      image: "/img/360_F_367709239_wWNdUSrtEvG6psATqu1sO9AkKUXALpR8.jpg",
      specialties: ["Temple Tours", "Nature Walks", "Tea Plantation"],
      languages: ["English", "Sinhala", "German"],
      experience: "6 years",
      description: "Nature enthusiast with deep knowledge of Kandy's temples and tea culture.",
      verified: true,
      responseTime: "Within 4 hours",
      totalBookings: 156,
    },
    {
      id: 3,
      name: "Priya Fernando",
      location: "Galle & Southern Province",
      rating: 5.0,
      reviews: 156,
      price: 50,
      image: "/img/360_F_612738927_LIcFCiKHQhHq9R1QhkVRKvT6RelYUmgv.jpg",
      specialties: ["Beach Tours", "Historical Sites", "Wildlife"],
      languages: ["English", "Sinhala", "French"],
      experience: "10 years",
      description: "Expert in southern coast attractions, history, and wildlife experiences.",
      verified: true,
      responseTime: "Within 1 hour",
      totalBookings: 312,
    },
    {
      id: 4,
      name: "Rajesh Kumar",
      location: "Sigiriya & North Central",
      rating: 4.7,
      reviews: 73,
      price: 42,
      image: "img/cheerful-indian-businessman-smiling-closeup-portrait-jobs-career-campaign_53876-129416 (1).avif",
      specialties: ["Archaeological Sites", "Adventure Tours", "Photography"],
      languages: ["English", "Hindi", "Sinhala"],
      experience: "5 years",
      description: "Adventure guide specializing in ancient sites and photography tours.",
      verified: false,
      responseTime: "Within 6 hours",
      totalBookings: 98,
    },
    {
      id: 5,
      name: "Chaminda Wickramasinghe",
      location: "Ella & Hill Country",
      rating: 4.9,
      reviews: 134,
      price: 48,
      image: "/img/smiling-young-male-professional-standing-with-arms-crossed-while-making-eye-contact-against-isolated-background_662251-838.avif",
      specialties: ["Hiking", "Tea Tours", "Scenic Views"],
      languages: ["English", "Sinhala", "Japanese"],
      experience: "7 years",
      description: "Mountain guide with expertise in hill country attractions and hiking trails.",
      verified: true,
      responseTime: "Within 3 hours",
      totalBookings: 203,
    },
    {
      id: 6,
      name: "Amara Jayawardena",
      location: "Anuradhapura & Ancient Cities",
      rating: 4.6,
      reviews: 67,
      price: 38,
      image: "/img/young-indian-male-blue-dress-600nw-2071805621.webp",
      specialties: ["Ancient History", "Archaeological Tours", "Buddhist Sites"],
      languages: ["English", "Sinhala"],
      experience: "4 years",
      description: "History enthusiast specializing in ancient Sri Lankan civilization and Buddhist heritage.",
      verified: true,
      responseTime: "Within 5 hours",
      totalBookings: 89,
    },
  ];

  const locations = [
    "All Locations",
    "Colombo & Western Province",
    "Kandy & Central Province",
    "Galle & Southern Province",
    "Sigiriya & North Central",
    "Ella & Hill Country",
    "Anuradhapura & Ancient Cities",
  ];

  const specialties = [
    "All Specialties",
    "Cultural Tours",
    "City Tours",
    "Food Tours",
    "Temple Tours",
    "Nature Walks",
    "Tea Plantation",
    "Beach Tours",
    "Historical Sites",
    "Wildlife",
    "Adventure Tours",
    "Photography",
    "Archaeological Sites",
    "Hiking",
    "Tea Tours",
    "Scenic Views",
    "Ancient History",
    "Buddhist Sites",
  ];

  const priceRanges = ["All Prices", "Under $40", "$40 - $50", "Over $50"];

  const sortOptions = [
    { value: "rating", label: "Highest Rated" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "reviews", label: "Most Reviews" },
    { value: "experience", label: "Most Experienced" },
  ];

  const toggleLike = (guideId) => {
    setLikedGuides((prevLikedGuides) => {
      const newLikedGuides = new Set(prevLikedGuides);
      if (newLikedGuides.has(guideId)) {
        newLikedGuides.delete(guideId);
      } else {
        newLikedGuides.add(guideId);
      }
      return newLikedGuides;
    });
  };

  const filteredAndSortedGuides = guides
    .filter((guide) => {
      const matchesSearch =
        guide.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guide.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guide.specialties.some((specialty) => specialty.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesLocation =
        selectedLocation === "" || selectedLocation === "All Locations" || guide.location === selectedLocation;

      const matchesSpecialty =
        selectedSpecialty === "" || selectedSpecialty === "All Specialties" || guide.specialties.includes(selectedSpecialty);

      const matchesPrice = (() => {
        if (priceRange === "" || priceRange === "All Prices") return true;
        if (priceRange === "Under $40") return guide.price < 40;
        if (priceRange === "$40 - $50") return guide.price >= 40 && guide.price <= 50;
        if (priceRange === "Over $50") return guide.price > 50;
        return true;
      })();

      return matchesSearch && matchesLocation && matchesSpecialty && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "reviews":
          return b.reviews - a.reviews;
        case "experience":
          const aExperience = Number.parseInt(a.experience);
          const bExperience = Number.parseInt(b.experience);
          return bExperience - aExperience;
        default:
          return 0;
      }
    });

  const touristDestinations = [
    {
      name: "Sigiriya Rock Fortress",
      description: "An ancient rock fortress and palace ruin, a UNESCO World Heritage Site.",
      image: "/img/sigiriya.webp",
      link: "https://sigiriyafortress.com/",
    },
    {
      name: "Temple of the Sacred Tooth Relic, Kandy",
      description: "One of the most sacred Buddhist pilgrimage sites, housing a relic of the Buddha's tooth.",
      image: "/img/kandy.jpg",
      link: "https://sridaladamaligawa.lk/?lang=si",
    },
    {
      name: "Galle Fort",
      description: "A historic fort with Dutch colonial architecture, a UNESCO World Heritage Site.",
      image: "/img/galle.jpg",
      link: "https://us.lakpura.com/pages/galle-fort?srsltid=AfmBOorLWa8HgfKrKD4fGE1ca5FJ2XCupvdHxaRxNukq81EQGtdc9Qz",
    },
    {
      name: "Yala National Park",
      description: "Famous for its diverse wildlife, including leopards and elephants.",
      image: "/img/yala.jpg",
      link: "https://www.yalasrilanka.lk/",
    },
    {
      name: "Ella & Hill Country",
      description: "Scenic area known for hiking trails, waterfalls, and tea plantations.",
      image: "/img/ella.avif",
      link: "https://www.thecommonwanderer.com/blog/things-to-do-ella-sri-lanka",
    },
    {
      name: "Anuradhapura",
      description: "Ancient capital with well-preserved ruins and sacred Buddhist sites.",
      image: "/img/anuradhapura.jpg",
      link: "https://www.britannica.com/place/Anuradhapura-Sri-Lanka",
    },
  ];

  const upcomingEvents = [
    {
      name: "Kandy Esala Perahera",
      date: "July 30th - August 9th, 2025",
      description: "A grand procession honoring the Sacred Tooth Relic of the Buddha.",
      location: "Kandy",
    },
    {
      name: "Kataragama Esala Festival",
      date: "Expected late July - early August 2025 (Exact dates vary annually)",
      description: "A multi-faith pilgrimage drawing thousands of devotees to the Kataragama shrine.",
      location: "Kataragama",
    },
    {
      name: "The Great Elephant Gathering",
      date: "July - September 2025 (Peak in August)",
      description: "Witness hundreds of Asian elephants converge at Minneriya and Kaudulla National Parks, a truly spectacular wildlife event.",
      location: "Minneriya & Kaudulla National Parks",
    },
    {
      name: "Sinhala & Tamil New Year",
      date: "April 13-14, 2026",
      description: "Traditional New Year for Sinhalese and Tamil communities, celebrated with rituals and games.",
      location: "Nationwide",
    },
    {
      name: "Vesak Festival",
      date: "May 12-13, 2026",
      description: "Commemorates the birth, enlightenment, and passing of the Buddha, with colorful lanterns and devotion.",
      location: "Nationwide (major celebrations in Colombo, Kandy)",
    },
  ];

  const essentialTravelTips = [
    "Dress respectfully, especially when visiting religious sites (shoulders and knees covered).",
    "It's polite to ask permission before taking photos of people.",
    "Use your right hand for giving, taking, eating, or shaking hands (left is considered unclean).",
    "Stay hydrated – drink plenty of bottled water.",
    "Bargaining is common in markets, start around 50% of the asking price.",
    "Consider hiring a private driver for inter-city travel; public transport can be challenging.",
    "Book popular train journeys (e.g., Kandy to Ella) in advance.",
    "Apply for your visa online before arrival to save time and money.",
    "Be cautious of unsolicited help or offers from strangers, especially in crowded tourist areas.",
    "Learn a few basic Sinhala or Tamil phrases (e.g., 'Ayubowan' - hello/may you live long).",
  ];

  return (
    <div className={`${isDarkMode ? 'dark' : ''} min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50 font-sans`}>
      <TouristNavbar 
        user={user}
        notifications={notifications}
        unreadCount={unreadCount}
        onNotificationClick={() => setUnreadCount(0)}
        onClearNotifications={() => {
          setUnreadCount(0);
          setNotifications([]);
        }}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            Discover Sri Lanka
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto">
            Your ultimate guide to exploring the Pearl of the Indian Ocean. Find top destinations, upcoming events,
            and connect with expert local guides for an unforgettable journey.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">Top Rated Local Guides</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              <div className="sm:col-span-2 lg:col-span-2 xl:col-span-2 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search guides, locations, or specialties..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <select
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>

              <select
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
              >
                {specialties.map((specialty) => (
                  <option key={specialty} value={specialty}>
                    {specialty}
                  </option>
                ))}
              </select>

              <select
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
              >
                {priceRanges.map((range) => (
                  <option key={range} value={range}>
                    {range}
                  </option>
                ))}
              </select>

              <select
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
            <p className="text-gray-600 dark:text-gray-300">
              Showing {filteredAndSortedGuides.length} guide{filteredAndSortedGuides.length !== 1 ? "s" : ""}
            </p>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Sorted by: {sortOptions.find((option) => option.value === sortBy)?.label}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {filteredAndSortedGuides.map((guide) => (
              <div
                key={guide.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="relative">
                  <img src={guide.image || "/placeholder.svg"} alt={guide.name} className="w-full h-64 object-cover" />
                  <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 px-3 py-1 rounded-full text-lg font-semibold text-green-600 dark:text-green-400">
                    ${guide.price}/day
                  </div>
                  <div className="absolute top-4 left-4 flex space-x-2">
                    {guide.verified && (
                      <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">Verified</div>
                    )}
                  </div>
                  <div className="absolute bottom-4 right-4 flex space-x-2">
                    <button
                      onClick={() => toggleLike(guide.id)}
                      className={`p-2 rounded-full ${
                        likedGuides.has(guide.id)
                          ? "bg-red-500 text-white"
                          : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                      } hover:scale-110 transition-transform`}
                    >
                      <Heart className={`h-4 w-4 ${likedGuides.has(guide.id) ? "fill-current" : ""}`} />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{guide.name}</h3>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm font-medium">{guide.rating}</span>
                      <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">({guide.reviews})</span>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-600 dark:text-gray-300 mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{guide.location}</span>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">{guide.description}</p>

                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1 mb-2">
                      {guide.specialties.slice(0, 2).map((specialty, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full"
                        >
                          {specialty}
                        </span>
                      ))}
                      {guide.specialties.length > 2 && (
                        <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-1 rounded-full">
                          +{guide.specialties.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300 mb-4">
                    <div className="flex items-center">
                      <Languages className="h-4 w-4 mr-1" />
                      <span>{guide.languages.length} languages</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{guide.experience} experience</span>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex justify-between">
                      <span>Response time: {guide.responseTime}</span>
                      <span>{guide.totalBookings} bookings</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Link
                      href={`/details/${guide.id}`} // Corrected path to point to /details/[id]
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center text-sm font-medium"
                    >
                      <Eye className="h-4 w-4 inline mr-1" />
                      View Profile
                    </Link>
                    <Link
                      href={`/messages?guide=${guide.id}`}
                      className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white py-2 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-center text-sm font-medium"
                    >
                      Message
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredAndSortedGuides.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <Search className="h-16 w-16 mx-auto" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">No guides found matching your criteria.</p>
              <p className="text-gray-400 dark:text-gray-500">Try adjusting your search or filters.</p>
            </div>
          )}
        </section>

        <section className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Top Sri Lanka Tourist Destinations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {touristDestinations.map((destination, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {destination.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                    {destination.description}
                  </p>
                  <Link
                    href={destination.link}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 font-medium text-sm"
                  >
                    Explore More &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Upcoming Events & Cultural Festivals
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingEvents.map((event, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-start space-x-4"
              >
                <Calendar className="h-6 w-6 text-blue-500 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                    {event.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">
                    <span className="font-medium">Date:</span> {event.date}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                    <span className="font-medium">Location:</span> {event.location}
                  </p>
                  <p className="text-gray-700 dark:text-gray-400 text-sm">
                    {event.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Essential Travel Tips for Sri Lanka
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
              {essentialTravelTips.map((tip, index) => (
                <li key={index} className="flex items-start">
                  <Info className="h-5 w-5 mr-2 text-green-500 flex-shrink-0 mt-1" />
                  <span className="text-base">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 dark:bg-gray-950 text-gray-300 py-8 px-4 sm:px-6 md:px-12 rounded-t-xl">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Guidemelk</h3>
            <p className="text-gray-400">Your gateway to authentic Sri Lankan experiences.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-indigo-400 transition-colors duration-300">Home</Link></li>
              <li><Link href="/findGuide" className="hover:text-indigo-400 transition-colors duration-300">Find a Guide</Link></li>
              <li><Link href="/become-guide" className="hover:text-indigo-400 transition-colors duration-300">Become a Guide</Link></li>
              <li><Link href="/about" className="hover:text-indigo-400 transition-colors duration-300">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Connect</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-indigo-400 transition-colors duration-300">Facebook</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors duration-300">Instagram</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors duration-300">Twitter</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-500">
          &copy; {new Date().getFullYear()} Guidemelk. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
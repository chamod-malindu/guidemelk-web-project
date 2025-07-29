"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sun, Moon, Star, MapPin, CalendarDays, UserCheck } from 'lucide-react'; // Added UserCheck icon

export default function TouristDashboard() {
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

  // --- Sample Data for Dashboard ---

  const specialEvents = [
    {
      id: 1,
      name: 'Duruthu Perahera',
      month: 'January',
      location: 'Kelaniya Raja Maha Vihara, Colombo',
      description: 'Commemorates the Buddha\'s first visit to Sri Lanka. Features vibrant processions.',
      link: 'https://www.sltda.gov.lk/en/duruthu-perahera' // Example external link
    },
    {
      id: 2,
      name: 'Navam Perahera',
      month: 'February',
      location: 'Gangaramaya Temple, Colombo',
      description: 'A grand procession showcasing various cultural performances and decorated elephants.',
      link: 'https://www.sltda.gov.lk/en/navam-perahera'
    },
    {
      id: 3,
      name: 'Sri Lankan New Year (Aluth Avuruddu)',
      month: 'April',
      location: 'Nationwide',
      description: 'Celebrated by Sinhalese and Tamil communities with traditional rituals, games, and food.',
      link: 'https://www.srilanka.travel/new-year'
    },
    {
      id: 4,
      name: 'Vesak Poya',
      month: 'May',
      location: 'Nationwide',
      description: 'Commemorates the birth, enlightenment, and passing of Lord Buddha. Marked by lanterns and alms-giving.',
      link: 'https://www.srilanka.travel/vesak-poya'
    },
    {
      id: 5,
      name: 'Kandy Esala Perahera',
      month: 'July/August', // Exact dates vary
      location: 'Kandy',
      description: 'Sri Lanka\'s grandest Buddhist festival with elaborate processions, dancers, and decorated elephants.',
      link: 'https://kandyesalaperahera.com/'
    },
    {
      id: 6,
      name: 'Kataragama Esala Festival',
      month: 'July/August', // Exact dates vary
      location: 'Kataragama',
      description: 'A multi-religious festival known for its devotional practices, including firewalking.',
      link: 'https://rmkd.lk/kataragama-esala-festival/'
    },
    {
      id: 7,
      name: 'Vel Festival',
      month: 'July/August', // Exact dates vary
      location: 'Colombo',
      description: 'A Hindu festival dedicated to Lord Murugan, featuring a colorful chariot procession.',
      link: 'https://www.sltda.gov.lk/en/vel-festival'
    },
    {
      id: 8,
      name: 'Maharagama Esala Perahera',
      month: 'August',
      location: 'Maharagama',
      description: 'A traditional Perahera with cultural dances and a display of reverence.',
      link: 'https://www.sltda.gov.lk/en/maharagama-esala-perahera'
    },
    {
      id: 9,
      name: 'Deepavali (Diwali)',
      month: 'October/November', // Exact dates vary
      location: 'Nationwide (Tamil communities)',
      description: 'The Festival of Lights, celebrated with fireworks, sweets, and family gatherings.',
      link: 'https://www.srilanka.travel/deepavali'
    },
    {
      id: 10,
      name: 'Unduwap Poya',
      month: 'December',
      location: 'Nationwide',
      description: 'Marks the arrival of the Bodhi tree sapling in Sri Lanka, bringing Buddhism to the island.',
      link: 'https://www.srilanka.travel/unduwap-poya'
    },
  ];

  const topTravelingPlaces = [
    {
      id: 1,
      name: 'Sigiriya Rock Fortress',
      description: 'An ancient rock fortress and palace, a UNESCO World Heritage Site with stunning frescoes and gardens.',
      image: '/img/sigiriya.jpg',
      link: '/find-guide?location=sigiriya'
    },
    {
      id: 2,
      name: 'Ella',
      description: 'A small town in the highlands known for its breathtaking views, hiking trails, and the iconic Nine Arch Bridge.',
      image: '/img/ella.jpg',
      link: '/find-guide?location=ella'
    },
    {
      id: 3,
      name: 'Mirissa',
      description: 'A beautiful coastal town famous for its crescent-shaped beach, whale watching, and vibrant nightlife.',
      image: '/img/mirissa.jpg',
      link: '/find-guide?location=mirissa'
    },
    {
      id: 4,
      name: 'Anuradhapura',
      description: 'An ancient capital filled with well-preserved ruins, colossal stupas, and sacred Buddhist sites.',
      image: '/img/anuradhapura.jpg',
      link: '/find-guide?location=anuradhapura'
    },
    {
      id: 5,
      name: 'Yala National Park',
      description: 'Sri Lanka\'s most visited and second-largest national park, renowned for its high leopard concentration.',
      image: '/img/yala.jpg',
      link: '/find-guide?location=yala'
    },
    {
      id: 6,
      name: 'Galle Fort',
      description: 'A historic fortified city built by the Portuguese and extensively fortified by the Dutch, a UNESCO World Heritage Site.',
      image: '/img/galle.jpg',
      link: '/find-guide?location=galle'
    },
  ];

  const topRatedGuides = [
    {
      id: 1,
      name: 'Kasun Perera',
      rating: 5,
      specialties: ['Cultural Tours', 'Kandy', 'History'],
      image: '/img/guide-kasun.jpg', // Placeholder image
      link: '/guide/kasun-perera'
    },
    {
      id: 2,
      name: 'Amara Fernando',
      rating: 4.8,
      specialties: ['Wildlife Safaris', 'Yala', 'Nature Photography'],
      image: '/img/guide-amara.jpg', // Placeholder image
      link: '/guide/amara-fernando'
    },
    {
      id: 3,
      name: 'Nimal Bandara',
      rating: 4.9,
      specialties: ['Hiking', 'Ella', 'Tea Plantations'],
      image: '/img/guide-nimal.jpg', // Placeholder image
      link: '/guide/nimal-bandara'
    },
    {
      id: 4,
      name: 'Priya Sharma',
      rating: 4.7,
      specialties: ['Ancient Cities', 'Anuradhapura', 'Polonnaruwa'],
      image: '/img/guide-priya.jpg', // Placeholder image
      link: '/guide/priya-sharma'
    },
  ];

  return (
    <div className={`${isDarkMode ? 'dark' : ''} min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50 font-inter`}>
      {/* Header Section */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm py-4 px-6 md:px-12 flex justify-between items-center rounded-b-xl">
        <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">Guidemelk</div>
        <nav className="hidden md:flex space-x-6">
          <Link href="/tourist-dashboard" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300 font-semibold">Dashboard</Link>
          <Link href="/find-guide" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300">Find a Guide</Link>
          <Link href="/my-bookings" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300">My Bookings</Link>
          <Link href="/profile" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300">Profile</Link>
        </nav>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <Link href="/logout" className="px-5 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md">Logout</Link>
        </div>
      </header>

      <main className="p-6 md:p-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center text-gray-800 dark:text-gray-100 mb-10 animate-fade-in-down">
          Welcome, Adventurer!
        </h1>

        {/* Quick Actions / Featured Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Link href="/find-guide" className="group bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-102 flex items-center space-x-4">
            <MapPin size={48} className="text-white group-hover:rotate-6 transition-transform" />
            <div>
              <h2 className="text-2xl font-bold mb-1">Find Your Perfect Guide</h2>
              <p className="text-indigo-100">Discover local experts for your next adventure.</p>
            </div>
          </Link>

          <Link href="/my-bookings" className="group bg-gradient-to-r from-green-500 to-teal-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-102 flex items-center space-x-4">
            <CalendarDays size={48} className="text-white group-hover:scale-110 transition-transform" />
            <div>
              <h2 className="text-2xl font-bold mb-1">Manage Your Bookings</h2>
              <p className="text-green-100">View upcoming tours and past experiences.</p>
            </div>
          </Link>

          <Link href="/profile" className="group bg-gradient-to-r from-red-500 to-orange-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-102 flex items-center space-x-4">
            <UserCheck size={48} className="text-white group-hover:animate-pulse transition-transform" />
            <div>
              <h2 className="text-2xl font-bold mb-1">Update Your Profile</h2>
              <p className="text-red-100">Keep your preferences fresh and discover new features.</p>
            </div>
          </Link>
        </section>

        ---

        {/* Special Events Section */}
        <section className="py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-xl mb-16">
          <h2 className="text-4xl font-bold text-center mb-10 text-gray-800 dark:text-gray-100 animate-fade-in">
            Special Events in Sri Lanka (All Months)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6">
            {specialEvents.map(event => (
              <div key={event.id} className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1">
                <div className="flex items-center mb-3">
                  <CalendarDays size={24} className="text-purple-500 dark:text-purple-400 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{event.name}</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  <span className="font-medium">Month:</span> {event.month}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  <span className="font-medium">Location:</span> {event.location}
                </p>
                <p className="text-gray-700 dark:text-gray-200 text-sm mb-4">
                  {event.description}
                </p>
                {event.link && (
                  <a href={event.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:underline text-sm font-medium">
                    Learn More <span className="ml-1 text-xs">&rarr;</span>
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>

        ---

        {/* Top Traveling Places Section */}
        <section className="py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-xl mb-16">
          <h2 className="text-4xl font-bold text-center mb-10 text-gray-800 dark:text-gray-100 animate-fade-in">
            Top Traveling Places in Sri Lanka
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6">
            {topTravelingPlaces.map(place => (
              <div key={place.id} className="bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md overflow-hidden transform hover:scale-102 transition-transform duration-300">
                <img src={place.image} alt={place.name} className="w-full h-48 object-cover" />
                <div className="p-5">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">{place.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{place.description}</p>
                  <Link href={place.link} className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors duration-300 text-sm font-medium">
                    Find Guides <span className="ml-1 text-xs">&rarr;</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        ---

        {/* Top Rated Guides Section */}
        <section className="py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-xl mb-16">
          <h2 className="text-4xl font-bold text-center mb-10 text-gray-800 dark:text-gray-100 animate-fade-in">
            Top Rated Guides
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-6">
            {topRatedGuides.map(guide => (
              <div key={guide.id} className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1">
                <img src={guide.image} alt={guide.name} className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-2 border-indigo-500" />
                <h3 className="text-xl font-semibold mb-1 text-gray-800 dark:text-gray-100">{guide.name}</h3>
                <div className="flex items-center justify-center mb-3">
                  <Star size={18} className="text-yellow-400 mr-1" fill="currentColor" />
                  <span className="text-gray-700 dark:text-gray-200 font-medium">{guide.rating}</span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  {guide.specialties.join(', ')}
                </p>
                <Link href={guide.link} className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors duration-300 text-sm font-medium">
                  View Profile <span className="ml-1 text-xs">&rarr;</span>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action for more exploration */}
        <section className="py-10 px-6 bg-indigo-50 dark:bg-gray-700 rounded-xl text-center shadow-inner">
          <h2 className="text-3xl font-bold text-indigo-800 dark:text-indigo-200 mb-4">
            Ready for Your Next Adventure?
          </h2>
          <p className="text-lg text-indigo-700 dark:text-indigo-300 mb-8">
            Explore more guides, destinations, and events tailored just for you.
          </p>
          <Link href="/find-guide" className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out transform hover:scale-105">
            Start Your Journey
          </Link>
        </section>

      </main>

      {/* Footer Section (similar to your existing footer) */}
      <footer className="bg-gray-800 dark:bg-gray-950 text-gray-300 py-8 px-6 md:px-12 rounded-t-xl mt-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Guidemelk</h3>
            <p className="text-gray-400">Your gateway to authentic Sri Lankan experiences.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/tourist-dashboard" className="hover:text-indigo-400 transition-colors duration-300">Dashboard</Link></li>
              <li><Link href="/find-guide" className="hover:text-indigo-400 transition-colors duration-300">Find a Guide</Link></li>
              <li><Link href="/my-bookings" className="hover:text-indigo-400 transition-colors duration-300">My Bookings</Link></li>
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
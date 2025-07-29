"use client"; 
import { useState, useEffect } from 'react';
import { Sun, Moon, Search, MapPin, Globe, Award, Sparkles, User, LogOut, CreditCard } from 'lucide-react'; // Importing icons
import axios from 'axios'; 

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
    setIsDarkMode(prevIsDarkMode => {
      const newIsDarkMode = !prevIsDarkMode;
      if (newIsDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return newIsDarkMode;
    });
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm py-4 px-6 md:px-12 flex justify-between items-center rounded-b-xl">
      <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">Guidemelk</div>
      <nav className="hidden md:flex space-x-6">
        <a href="/" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300">Home</a>
        <a href="/tourist/Findguide/findguide" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300">Find a Guide</a>
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


export default function FindGuidePage() {
  const [location, setLocation] = useState('');
  const [language, setLanguage] = useState('');
  const [experience, setExperience] = useState('');
  const [specialty, setSpecialty] = useState('');

  const [guides] = useState([
    {
      id: 'G001',
      name: 'Nimal Perera',
      location: 'Colombo',
      languages: ['English', 'Sinhala'],
      experience: '5+ years',
      specialties: ['Cultural Tours', 'City Walks'],
      rating: 4.8,
      price: 'LKR 8,000/day',
      imageUrl: 'https://placehold.co/150x150/E0F2FE/1E40AF?text=Nimal',
      description: 'Experienced guide specializing in historical and cultural tours around Colombo. Passionate about sharing Sri Lanka\'s rich heritage.',
      contact: 'nimal.p@example.com'
    },
    {
      id: 'G002',
      name: 'Priya Sharma',
      location: 'Kandy',
      languages: ['English', 'Tamil'],
      experience: '7+ years',
      specialties: ['Temple Tours', 'Nature Hikes'],
      rating: 4.9,
      price: 'LKR 9,500/day',
      imageUrl: 'https://placehold.co/150x150/FFE4E6/BE185D?text=Priya',
      description: 'Local expert in Kandy, offering immersive experiences in ancient temples and breathtaking nature trails. Fluent in English and Tamil.',
      contact: 'priya.s@example.com'
    },
    {
      id: 'G003',
      name: 'Kamal Silva',
      location: 'Galle',
      languages: ['English', 'Sinhala', 'German'],
      experience: '3+ years',
      specialties: ['Beach Activities', 'Fort History'],
      rating: 4.5,
      price: 'LKR 7,000/day',
      imageUrl: 'https://placehold.co/150x150/D1FAE5/065F46?text=Kamal',
      description: 'Galle Fort enthusiast and beach activity organizer. Enjoy personalized tours and water sports with a friendly guide.',
      contact: 'kamal.s@example.com'
    },
    {
      id: 'G004',
      name: 'Aisha Khan',
      location: 'Ella',
      languages: ['English', 'Sinhala', 'French'],
      experience: '6+ years',
      specialties: ['Hiking', 'Tea Plantations'],
      rating: 4.7,
      price: 'LKR 8,800/day',
      imageUrl: 'https://placehold.co/150x150/FEE2E2/991B1B?text=Aisha',
      description: 'Adventure seeker and tea plantation expert in Ella. Guides memorable hikes and offers insights into tea production.',
      contact: 'aisha.k@example.com'
    },
    {
      id: 'G005',
      name: 'Ravi Fernando',
      location: 'Sigiriya',
      languages: ['English', 'Sinhala'],
      experience: '4+ years',
      specialties: ['Ancient Sites', 'Wildlife Safaris'],
      rating: 4.6,
      price: 'LKR 8,200/day',
      imageUrl: 'https://placehold.co/150x150/DBEAFE/1E3A8A?text=Ravi',
      description: 'Specialist in ancient Sri Lankan history and wildlife safaris. Explore Sigiriya and national parks with an experienced guide.',
      contact: 'ravi.f@example.com'
    },
  ]);

  const [filteredGuides, setFilteredGuides] = useState(guides);

  useEffect(() => {
    const applyFilters = () => {
      let tempGuides = guides;

      if (location) {
        tempGuides = tempGuides.filter(guide =>
          guide.location.toLowerCase().includes(location.toLowerCase())
        );
      }
      if (language) {
        tempGuides = tempGuides.filter(guide =>
          guide.languages.some(lang => lang.toLowerCase().includes(language.toLowerCase()))
        );
      }
      if (experience) {
        tempGuides = tempGuides.filter(guide =>
          guide.experience.toLowerCase().includes(experience.toLowerCase())
        );
      }
      if (specialty) {
        tempGuides = tempGuides.filter(guide =>
          guide.specialties.some(spec => spec.toLowerCase().includes(specialty.toLowerCase()))
        );
      }
      setFilteredGuides(tempGuides);
    };

    applyFilters();
  }, [location, language, experience, specialty, guides]); 

  const [user, setUser] = useState({ firstName: "Tourist" });
  useEffect(() => {
    const fetchNavbarUser = async () => {
      try {
      } catch (error) {
        console.error("Failed to fetch user for Navbar:", error);
      }
    };
    fetchNavbarUser();
  }, []);


  return (

    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-50 font-inter flex flex-col">
      {/* Header */}
      <Navbar user={user} />

      {/* Main Content Area */}
      <main className="flex-1 p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md mx-4 my-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100 flex items-center">
          <Search size={30} className="mr-3 text-indigo-500" />
          Find Your Perfect Guide
        </h2>

        {/* Filter Section */}
        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-inner mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
            <div className="relative">
              <LocalInput 
                id="location"
                type="text"
                placeholder="e.g., Kandy"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
            </div>
          </div>
          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Language</label>
            <div className="relative">
              <LocalInput 
                id="language"
                type="text"
                placeholder="e.g., English"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              />
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
            </div>
          </div>
          <div>
            <label htmlFor="experience" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Experience</label>
            <div className="relative">
              <LocalInput 
                id="experience"
                type="text"
                placeholder="e.g., 5+ years"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              />
              <Award className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
            </div>
          </div>
          <div>
            <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Specialty</label>
            <div className="relative">
              <LocalInput 
                id="specialty"
                type="text"
                placeholder="e.g., Hiking"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
              />
              <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
            </div>
          </div>
        </div>

        {/* Guide Listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuides.length > 0 ? (
            filteredGuides.map(guide => (
              <div key={guide.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow duration-300">
                <img
                  src={guide.imageUrl}
                  alt={guide.name}
                  className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-indigo-300 dark:border-indigo-600"
                />
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">{guide.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-1 flex items-center">
                  <MapPin size={16} className="mr-1 text-indigo-500" /> {guide.location}
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-1 flex items-center">
                  <Globe size={16} className="mr-1 text-indigo-500" /> {guide.languages.join(', ')}
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-1 flex items-center">
                  <Award size={16} className="mr-1 text-indigo-500" /> {guide.experience}
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-2 flex items-center">
                  <Sparkles size={16} className="mr-1 text-indigo-500" /> {guide.specialties.join(', ')}
                </p>
                <div className="text-yellow-500 dark:text-yellow-400 mb-3">
                  {'★'.repeat(Math.floor(guide.rating))}{'☆'.repeat(5 - Math.floor(guide.rating))} ({guide.rating})
                </div>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400 mb-4">{guide.price}</p>
                <a
                  href={`/details?guideId=${guide.id}`}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md"
                >
                  View Details
                </a>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500 dark:text-gray-400 text-xl py-10">
              No guides found matching your criteria. Try adjusting your filters!
            </p>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 dark:bg-gray-950 text-gray-300 py-4 px-6 md:px-12 text-center rounded-t-xl mt-auto">
        &copy; {new Date().getFullYear()} Guidemelk. All rights reserved.
      </footer>
    </div>
  );
}
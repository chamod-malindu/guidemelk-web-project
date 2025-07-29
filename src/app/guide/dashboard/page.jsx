// src/app/guide/GuideDashboard/page.jsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import { Sun, Moon, LayoutDashboard, BarChart, LineChart, Users, Settings, User, LogOut } from 'lucide-react'; // Importing icons

export default function GuideDashboard() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    // 1. Check for saved theme preference in localStorage
    const savedTheme = localStorage.getItem('theme');

    // 2. Apply the saved theme or default to light mode
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark'); // Add 'dark' class to html element
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark'); // Ensure 'dark' class is removed
    }

    // IMPORTANT: Remove the CDN loading for Tailwind CSS in a Next.js project.
    // Tailwind should be configured via tailwind.config.js and postcss.config.js
    // and imported through your global CSS file (e.g., globals.css).
    // This block is removed:
    /*
    if (!document.querySelector('script[src="https://cdn.tailwindcss.com"]')) {
      const script = document.createElement('script');
      script.src = 'https://cdn.tailwindcss.com';
      script.async = true;
      script.onload = () => console.log('Tailwind CSS CDN loaded successfully.');
      script.onerror = (e) => console.error('Failed to load Tailwind CSS CDN:', e);
      document.head.appendChild(script);
    }
    */
  }, []); // Empty dependency array ensures this runs only once on component mount

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(prevIsDarkMode => {
      const newIsDarkMode = !prevIsDarkMode; // Calculate the toggled state

      if (newIsDarkMode) {
        // If switching to dark mode
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        // If switching to light mode
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return newIsDarkMode; // Return the new state
    });
  };

  // Function to handle logout
  const handleLogout = () => {
    // In a real application, you would also clear authentication tokens/sessions here
    // e.g., localStorage.removeItem('authToken');
    router.push('/'); // Redirect to the home page
  };

  // Renders the content based on the active sidebar section
  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Overview</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Welcome to your Guide Dashboard! Here you can see a summary of your bookings, earnings, and upcoming tours.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              <div className="bg-indigo-100 dark:bg-indigo-900 p-4 rounded-lg shadow-sm">
                <p className="text-sm text-indigo-700 dark:text-indigo-300">Total Bookings</p>
                <p className="text-3xl font-bold text-indigo-800 dark:text-indigo-100">12</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900 p-4 rounded-lg shadow-sm">
                <p className="text-sm text-green-700 dark:text-green-300">Earnings (This Month)</p>
                <p className="text-3xl font-bold text-green-800 dark:text-green-100">LKR 50,000</p>
              </div>
              <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-lg shadow-sm">
                <p className="text-sm text-yellow-700 dark:text-yellow-300">Upcoming Tours</p>
                <p className="text-3xl font-bold text-yellow-800 dark:text-yellow-100">3</p>
              </div>
            </div>
            {/* Placeholder for a simple chart or recent activity */}
            <div className="mt-8">
              <h4 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-100">Recent Activity</h4>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>- New booking for Kandy tour on July 28th.</li>
                <li>- Profile updated by you.</li>
                <li>- Payment received for Galle tour.</li>
              </ul>
            </div>
          </div>
        );
      case 'reports':
        return (
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Reports</h3>
            <p className="text-gray-700 dark:text-gray-300">
              View detailed reports on your performance, earnings, and tour history.
            </p>
            {/* Placeholder for report generation options */}
            <div className="mt-4">
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">Generate Monthly Report</button>
            </div>
          </div>
        );
      case 'analysis':
        return (
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Analysis</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Gain insights into your most popular tours, peak booking times, and tourist demographics.
            </p>
            {/* Placeholder for charts/graphs */}
            <div className="mt-4 h-48 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center text-gray-500 dark:text-gray-400">
              [Placeholder for analytics charts]
            </div>
          </div>
        );
      case 'users':
        return (
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">My Tourists</h3>
            <p className="text-gray-700 dark:text-gray-300">
              View information about the tourists you have guided.
            </p>
            {/* Placeholder for a list of tourists */}
            <ul className="mt-4 space-y-2 text-gray-700 dark:text-gray-300">
              <li>- John Doe (Booking ID: #12345)</li>
              <li>- Jane Smith (Booking ID: #12346)</li>
            </ul>
          </div>
        );
      case 'profile':
        return (
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Edit Profile</h3>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                <input
                  type="text"
                  id="name"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  placeholder="Your Name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <input
                  type="email"
                  id="email"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  placeholder="your.email@example.com"
                  disabled
                />
              </div>
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bio / About Me</label>
                <textarea
                  id="bio"
                  rows="4"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  placeholder="Tell tourists about yourself and your expertise..."
                ></textarea>
              </div>
              <div>
                <label htmlFor="languages" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Languages Spoken (comma-separated)</label>
                <input
                  type="text"
                  id="languages"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  placeholder="English, Sinhala, Tamil, German"
                />
              </div>
              <div>
                <label htmlFor="specialties" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Specialties (e.g., Hiking, History, Wildlife)</label>
                <input
                  type="text"
                  id="specialties"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  placeholder="Cultural Tours, Wildlife Safaris, Beach Holidays"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 transition-colors duration-300"
              >
                Save Profile
              </button>
            </form>
          </div>
        );
      case 'settings':
        return (
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Settings</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Manage your account settings, notifications, and preferences.
            </p>
            {/* Placeholder for settings options */}
            <div className="mt-4 space-y-3">
              <label className="flex items-center text-gray-700 dark:text-gray-300">
                <input type="checkbox" className="form-checkbox h-5 w-5 text-indigo-600 rounded" />
                <span className="ml-2">Email Notifications</span>
              </label>
              <label className="flex items-center text-gray-700 dark:text-gray-300">
                <input type="checkbox" className="form-checkbox h-5 w-5 text-indigo-600 rounded" defaultChecked />
                <span className="ml-2">SMS Alerts</span>
              </label>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-50 font-inter flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm py-4 px-6 md:px-12 flex justify-between items-center rounded-b-xl">
        <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">Guidemelk</div>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Toggle dark mode"
          >
            {/* Display Sun icon in dark mode, Moon icon in light mode */}
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            onClick={handleLogout} // Add onClick handler here
            className="px-5 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md flex items-center space-x-2"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 pt-4 px-4 md:px-8">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mr-6 hidden md:block">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Guide Panel</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Welcome, Guide Name!</p>
          </div>
          <nav className="space-y-2">
            <button
              onClick={() => setActiveSection('overview')}
              className={`flex items-center w-full px-4 py-2 rounded-md transition-colors duration-200 ${activeSection === 'overview' ? 'bg-indigo-500 text-white shadow-md' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
            >
              <LayoutDashboard size={20} className="mr-3" />
              Overview
            </button>
            <button
              onClick={() => setActiveSection('reports')}
              className={`flex items-center w-full px-4 py-2 rounded-md transition-colors duration-200 ${activeSection === 'reports' ? 'bg-indigo-500 text-white shadow-md' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
            >
              <BarChart size={20} className="mr-3" />
              Reports
            </button>
            <button
              onClick={() => setActiveSection('analysis')}
              className={`flex items-center w-full px-4 py-2 rounded-md transition-colors duration-200 ${activeSection === 'analysis' ? 'bg-indigo-500 text-white shadow-md' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
            >
              <LineChart size={20} className="mr-3" />
              Analysis
            </button>
            <button
              onClick={() => setActiveSection('users')}
              className={`flex items-center w-full px-4 py-2 rounded-md transition-colors duration-200 ${activeSection === 'users' ? 'bg-indigo-500 text-white shadow-md' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
            >
              <Users size={20} className="mr-3" />
              My Tourists
            </button>
            <button
              onClick={() => setActiveSection('profile')}
              className={`flex items-center w-full px-4 py-2 rounded-md transition-colors duration-200 ${activeSection === 'profile' ? 'bg-indigo-500 text-white shadow-md' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
            >
              <User size={20} className="mr-3" />
              Profile
            </button>
            <button
              onClick={() => setActiveSection('settings')}
              className={`flex items-center w-full px-4 py-2 rounded-md transition-colors duration-200 ${activeSection === 'settings' ? 'bg-indigo-500 text-white shadow-md' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
            >
              <Settings size={20} className="mr-3" />
              Settings
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md mb-4">
          {renderContent()}
        </main>
      </div>

      {/* Footer (Optional, could be shared component) */}
      <footer className="bg-gray-800 dark:bg-gray-950 text-gray-300 py-4 px-6 md:px-12 text-center rounded-t-xl mt-auto">
        &copy; {new Date().getFullYear()} Guidemelk. All rights reserved.
      </footer>
    </div>
  );
}
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sun, Moon, LayoutDashboard, BarChart, LineChart, Users, Settings, User, LogOut } from 'lucide-react';
import AuthWrapper from '@/components/AuthWrapper';

export default function GuideDashboard() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const router = useRouter();

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

  const handleLogout = async () => {
    try {
      // Show loading state (optional)
      // setIsLoading(true);
      
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include', // Include cookies
      });
  
      // Always redirect regardless of API response
      // This ensures user is logged out even if API fails
      router.push('/login');
      
    } catch (error) {
      console.error('Logout error:', error);
      // Always redirect on error too
      router.push('/');
    }
  };

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

  // This is the missing part - the actual JSX return statement
  return (
    <AuthWrapper requiredRole="guide">
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 shadow-lg">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Guide Dashboard</h2>
        </div>
        
        <nav className="mt-6">
          <button
            onClick={() => setActiveSection('overview')}
            className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
              activeSection === 'overview' ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Overview
          </button>
          
          <button
            onClick={() => setActiveSection('reports')}
            className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
              activeSection === 'reports' ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            <BarChart className="w-5 h-5 mr-3" />
            Reports
          </button>
          
          <button
            onClick={() => setActiveSection('analysis')}
            className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
              activeSection === 'analysis' ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            <LineChart className="w-5 h-5 mr-3" />
            Analysis
          </button>
          
          <button
            onClick={() => setActiveSection('users')}
            className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
              activeSection === 'users' ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            <Users className="w-5 h-5 mr-3" />
            My Tourists
          </button>
          
          <button
            onClick={() => setActiveSection('profile')}
            className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
              activeSection === 'profile' ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            <User className="w-5 h-5 mr-3" />
            Edit Profile
          </button>
          
          <button
            onClick={() => setActiveSection('settings')}
            className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
              activeSection === 'settings' ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </button>
        </nav>
        
        <div className="absolute bottom-0 w-64 p-6 border-t dark:border-gray-700">
          <button
            onClick={toggleDarkMode}
            className="flex items-center w-full px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors mb-2"
          >
            {isDarkMode ? <Sun className="w-5 h-5 mr-3" /> : <Moon className="w-5 h-5 mr-3" />}
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
          
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {renderContent()}
        </div>
      </div>
    </div>
    </AuthWrapper>
  );
}
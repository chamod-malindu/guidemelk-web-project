// src/app/admin/dashboard/page.jsx
"use client"; // This directive marks the component as a Client Component

import { useState, useEffect } from 'react';
import { Sun, Moon, LayoutDashboard, BarChart, LineChart, Users, Settings, User, LogOut, FileText, TrendingUp } from 'lucide-react'; // Importing icons

export default function AdminDashboard() {
  // State to manage dark mode
  const [isDarkMode, setIsDarkMode] = useState(false);
  // State to manage which section is active
  const [activeSection, setActiveSection] = useState('overview');

  // Effect to initialize dark mode from local storage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark'); // Apply dark class to html element
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark'); // Remove dark class from html element
    }

    // Dynamically load Tailwind CSS CDN script if not already present.
    // In a typical Next.js setup with Tailwind, you usually don't need to manually load the CDN.
    if (!document.querySelector('script[src="https://cdn.tailwindcss.com"]')) {
      const script = document.createElement('script');
      script.src = 'https://cdn.tailwindcss.com';
      script.async = true; // Load script asynchronously
      script.onload = () => console.log('Tailwind CSS CDN loaded successfully.');
      script.onerror = (e) => console.error('Failed to load Tailwind CSS CDN:', e);
      document.head.appendChild(script);
    }
  }, []); // Empty dependency array ensures this runs once on mount

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark'); // Save dark theme preference
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light'); // Save light theme preference
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Overview</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Welcome to the Admin Dashboard! Here you can see a high-level summary of the platform's performance.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg shadow-sm">
                <p className="text-sm text-blue-700 dark:text-blue-300">Total Users</p>
                <p className="text-3xl font-bold text-blue-800 dark:text-blue-100">1,250</p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900 p-4 rounded-lg shadow-sm">
                <p className="text-sm text-purple-700 dark:text-purple-300">Active Guides</p>
                <p className="text-3xl font-bold text-purple-800 dark:text-purple-100">150</p>
              </div>
              <div className="bg-red-100 dark:bg-red-900 p-4 rounded-lg shadow-sm">
                <p className="text-sm text-red-700 dark:text-red-300">Pending Verifications</p>
                <p className="text-3xl font-bold text-red-800 dark:text-red-100">5</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900 p-4 rounded-lg shadow-sm">
                <p className="text-sm text-green-700 dark:text-green-300">Total Bookings</p>
                <p className="text-3xl font-bold text-green-800 dark:text-green-100">345</p>
              </div>
              <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-lg shadow-sm">
                <p className="text-sm text-yellow-700 dark:text-yellow-300">Revenue (Last 30 Days)</p>
                <p className="text-3xl font-bold text-yellow-800 dark:text-yellow-100">LKR 1.2M</p>
              </div>
              <div className="bg-teal-100 dark:bg-teal-900 p-4 rounded-lg shadow-sm">
                <p className="text-sm text-teal-700 dark:text-teal-300">New Signups (Today)</p>
                <p className="text-3xl font-bold text-teal-800 dark:text-teal-100">15</p>
              </div>
            </div>
          </div>
        );
      case 'reports':
        return (
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Reports</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Generate detailed reports on user activity, guide performance, and financial data.
            </p>
            <div className="mt-6 space-y-4">
              <button className="px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center space-x-2">
                <FileText size={18} />
                <span>Generate User Report</span>
              </button>
              <button className="px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center space-x-2">
                <FileText size={18} />
                <span>Generate Guide Performance Report</span>
              </button>
              <button className="px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center space-x-2">
                <FileText size={18} />
                <span>Generate Financial Report</span>
              </button>
            </div>
          </div>
        );
      case 'analysis':
        return (
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Analysis</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Analyze platform trends, user engagement, and growth metrics.
            </p>
            {/* Placeholder for charts/graphs */}
            <div className="mt-4 h-64 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center text-gray-500 dark:text-gray-400">
              [Placeholder for advanced analytics charts and graphs]
            </div>
            <div className="mt-4 space-y-2 text-gray-700 dark:text-gray-300">
              <li>- Top performing guides</li>
              <li>- Most popular tour categories</li>
              <li>- User retention rates</li>
            </div>
          </div>
        );
      case 'users':
        return (
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">User Management</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Manage all users (tourists, guides, and other admins) on the platform.
            </p>
            <div className="mt-6">
              <input
                type="text"
                placeholder="Search users..."
                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 text-left">
                      <th className="py-2 px-4 rounded-tl-lg">Name</th>
                      <th className="py-2 px-4">Email</th>
                      <th className="py-2 px-4">Role</th>
                      <th className="py-2 px-4 rounded-tr-lg">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200 dark:border-gray-600">
                      <td className="py-3 px-4 text-gray-800 dark:text-gray-100">Alice Smith</td>
                      <td className="py-3 px-4 text-gray-800 dark:text-gray-100">alice@example.com</td>
                      <td className="py-3 px-4 text-gray-800 dark:text-gray-100">Tourist</td>
                      <td className="py-3 px-4">
                        <button className="text-blue-600 hover:underline text-sm mr-2">View</button>
                        <button className="text-red-600 hover:underline text-sm">Delete</button>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-600">
                      <td className="py-3 px-4 text-gray-800 dark:text-gray-100">Bob Johnson</td>
                      <td className="py-3 px-4 text-gray-800 dark:text-gray-100">bob@example.com</td>
                      <td className="py-3 px-4 text-gray-800 dark:text-gray-100">Guide</td>
                      <td className="py-3 px-4">
                        <button className="text-blue-600 hover:underline text-sm mr-2">View</button>
                        <button className="text-red-600 hover:underline text-sm">Delete</button>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-600">
                      <td className="py-3 px-4 text-gray-800 dark:text-gray-100">Charlie Brown</td>
                      <td className="py-3 px-4 text-gray-800 dark:text-gray-100">charlie@example.com</td>
                      <td className="py-3 px-4 text-gray-800 dark:text-gray-100">Admin</td>
                      <td className="py-3 px-4">
                        <button className="text-blue-600 hover:underline text-sm mr-2">View</button>
                        <button className="text-red-600 hover:underline text-sm">Delete</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Platform Settings</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Configure global platform settings, payment gateways, and moderation rules.
            </p>
            <form className="mt-6 space-y-4">
              <div>
                <label htmlFor="commission-rate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Commission Rate (%)</label>
                <input
                  type="number"
                  id="commission-rate"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  placeholder="e.g., 10"
                />
              </div>
              <div>
                <label htmlFor="payment-gateway" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Primary Payment Gateway</label>
                <select
                  id="payment-gateway"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                >
                  <option>Stripe</option>
                  <option>PayPal</option>
                  <option>Local Bank Transfer</option>
                </select>
              </div>
              <label className="flex items-center text-gray-700 dark:text-gray-300">
                <input type="checkbox" className="form-checkbox h-5 w-5 text-indigo-600 rounded" defaultChecked />
                <span className="ml-2">Enable Guide Verification</span>
              </label>
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 transition-colors duration-300"
              >
                Save Settings
              </button>
            </form>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`${isDarkMode ? 'dark' : ''} min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-50 font-inter flex flex-col`}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm py-4 px-6 md:px-12 flex justify-between items-center rounded-b-xl">
        <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">Guidemelk Admin</div>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button className="px-5 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md flex items-center space-x-2">
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
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Admin Panel</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Welcome, Admin!</p>
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
              <TrendingUp size={20} className="mr-3" />
              Analysis
            </button>
            <button
              onClick={() => setActiveSection('users')}
              className={`flex items-center w-full px-4 py-2 rounded-md transition-colors duration-200 ${activeSection === 'users' ? 'bg-indigo-500 text-white shadow-md' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
            >
              <Users size={20} className="mr-3" />
              Users
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

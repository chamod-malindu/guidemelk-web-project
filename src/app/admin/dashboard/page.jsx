"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sun, Moon, LayoutDashboard, BarChart, LineChart, Users, Settings, User, LogOut } from 'lucide-react';
import AuthWrapper from '@/components/AuthWrapper';

export default function AdminDashboard() {
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

  const handleLogout = () => {
    router.push('/');
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Admin Overview</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Welcome to your Admin Dashboard! Here you can manage users, monitor system performance, and oversee all platform activities.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
              <div className="bg-indigo-100 dark:bg-indigo-900 p-4 rounded-lg shadow-sm">
                <p className="text-sm text-indigo-700 dark:text-indigo-300">Total Users</p>
                <p className="text-3xl font-bold text-indigo-800 dark:text-indigo-100">1,245</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900 p-4 rounded-lg shadow-sm">
                <p className="text-sm text-green-700 dark:text-green-300">Active Guides</p>
                <p className="text-3xl font-bold text-green-800 dark:text-green-100">87</p>
              </div>
              <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-lg shadow-sm">
                <p className="text-sm text-yellow-700 dark:text-yellow-300">Total Bookings</p>
                <p className="text-3xl font-bold text-yellow-800 dark:text-yellow-100">456</p>
              </div>
              <div className="bg-red-100 dark:bg-red-900 p-4 rounded-lg shadow-sm">
                <p className="text-sm text-red-700 dark:text-red-300">Revenue (This Month)</p>
                <p className="text-3xl font-bold text-red-800 dark:text-red-100">LKR 2.5M</p>
              </div>
            </div>
            <div className="mt-8">
              <h4 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-100">Recent System Activity</h4>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>- New guide registered: John Smith</li>
                <li>- Payment processed for booking #12345</li>
                <li>- User reported issue resolved</li>
                <li>- System backup completed successfully</li>
              </ul>
            </div>
          </div>
        );
      case 'reports':
        return (
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">System Reports</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Generate and view comprehensive reports on platform performance, user activity, and financial metrics.
            </p>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                Generate User Report
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                Generate Financial Report
              </button>
              <button className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors">
                Generate Guide Performance
              </button>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">
                Generate System Analytics
              </button>
            </div>
          </div>
        );
      case 'analysis':
        return (
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Platform Analytics</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Analyze platform trends, user behavior, guide performance, and revenue patterns.
            </p>
            <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center text-gray-500 dark:text-gray-400">
                [User Growth Chart]
              </div>
              <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center text-gray-500 dark:text-gray-400">
                [Revenue Trends]
              </div>
              <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center text-gray-500 dark:text-gray-400">
                [Guide Performance]
              </div>
              <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center text-gray-500 dark:text-gray-400">
                [Booking Patterns]
              </div>
            </div>
          </div>
        );
      case 'users':
        return (
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">User Management</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Manage all platform users including tourists, guides, and administrators.
            </p>
            <div className="mt-4">
              <div className="flex justify-between items-center mb-4">
                <input
                  type="text"
                  placeholder="Search users..."
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                  Add New User
                </button>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="grid grid-cols-5 gap-4 font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  <span>Name</span>
                  <span>Email</span>
                  <span>Role</span>
                  <span>Status</span>
                  <span>Actions</span>
                </div>
                <div className="space-y-2">
                  <div className="grid grid-cols-5 gap-4 text-gray-600 dark:text-gray-400 py-2 border-b border-gray-200 dark:border-gray-600">
                    <span>John Doe</span>
                    <span>john@example.com</span>
                    <span>Tourist</span>
                    <span className="text-green-600">Active</span>
                    <span>
                      <button className="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
                      <button className="text-red-600 hover:text-red-800">Delete</button>
                    </span>
                  </div>
                  <div className="grid grid-cols-5 gap-4 text-gray-600 dark:text-gray-400 py-2 border-b border-gray-200 dark:border-gray-600">
                    <span>Jane Smith</span>
                    <span>jane@example.com</span>
                    <span>Guide</span>
                    <span className="text-green-600">Active</span>
                    <span>
                      <button className="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
                      <button className="text-red-600 hover:text-red-800">Delete</button>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Admin Profile</h3>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                <input
                  type="text"
                  id="name"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  placeholder="Admin Name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <input
                  type="email"
                  id="email"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  placeholder="admin@example.com"
                  disabled
                />
              </div>
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Department</label>
                <select
                  id="department"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                >
                  <option>System Administration</option>
                  <option>Customer Support</option>
                  <option>Operations</option>
                  <option>Finance</option>
                </select>
              </div>
              <div>
                <label htmlFor="permissions" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Permissions Level</label>
                <select
                  id="permissions"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                >
                  <option>Super Admin</option>
                  <option>Admin</option>
                  <option>Moderator</option>
                </select>
              </div>
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 transition-colors duration-300"
              >
                Update Profile
              </button>
            </form>
          </div>
        );
      case 'settings':
        return (
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">System Settings</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Configure system-wide settings and preferences.
            </p>
            <div className="mt-6 space-y-6">
              <div>
                <h4 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-3">Notifications</h4>
                <div className="space-y-3">
                  <label className="flex items-center text-gray-700 dark:text-gray-300">
                    <input type="checkbox" className="form-checkbox h-5 w-5 text-indigo-600 rounded" defaultChecked />
                    <span className="ml-2">Email Notifications for New Users</span>
                  </label>
                  <label className="flex items-center text-gray-700 dark:text-gray-300">
                    <input type="checkbox" className="form-checkbox h-5 w-5 text-indigo-600 rounded" defaultChecked />
                    <span className="ml-2">SMS Alerts for Critical Issues</span>
                  </label>
                  <label className="flex items-center text-gray-700 dark:text-gray-300">
                    <input type="checkbox" className="form-checkbox h-5 w-5 text-indigo-600 rounded" />
                    <span className="ml-2">Daily Reports</span>
                  </label>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-3">System Maintenance</h4>
                <div className="space-y-3">
                  <button className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors">
                    Schedule Maintenance
                  </button>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                    Run System Backup
                  </button>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
                    Clear Cache
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Main component return - THIS WAS MISSING IN YOUR ORIGINAL CODE!
  return (
    <AuthWrapper requiredRole="admin">
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex">
        {/* Sidebar */}
        <div className="w-64 bg-white dark:bg-gray-800 shadow-lg">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Admin Panel</h2>
          </div>
          
          <nav className="mt-6">
            <button
              onClick={() => setActiveSection('overview')}
              className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
                activeSection === 'overview'
                  ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 border-r-4 border-indigo-500'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <LayoutDashboard className="mr-3 h-5 w-5" />
              Overview
            </button>
            
            <button
              onClick={() => setActiveSection('users')}
              className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
                activeSection === 'users'
                  ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 border-r-4 border-indigo-500'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Users className="mr-3 h-5 w-5" />
              User Management
            </button>
            
            <button
              onClick={() => setActiveSection('reports')}
              className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
                activeSection === 'reports'
                  ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 border-r-4 border-indigo-500'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <BarChart className="mr-3 h-5 w-5" />
              Reports
            </button>
            
            <button
              onClick={() => setActiveSection('analysis')}
              className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
                activeSection === 'analysis'
                  ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 border-r-4 border-indigo-500'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <LineChart className="mr-3 h-5 w-5" />
              Analytics
            </button>
            
            <button
              onClick={() => setActiveSection('profile')}
              className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
                activeSection === 'profile'
                  ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 border-r-4 border-indigo-500'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <User className="mr-3 h-5 w-5" />
              Profile
            </button>
            
            <button
              onClick={() => setActiveSection('settings')}
              className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
                activeSection === 'settings'
                  ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 border-r-4 border-indigo-500'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Settings className="mr-3 h-5 w-5" />
              Settings
            </button>
          </nav>
          
          <div className="absolute bottom-0 w-64 p-6">
            <button
              onClick={toggleDarkMode}
              className="w-full flex items-center justify-center px-4 py-2 mb-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              <LogOut className="mr-2 h-5 w-5" />
              Logout
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {renderContent()}
        </div>
      </div>
    </AuthWrapper>
  );
}
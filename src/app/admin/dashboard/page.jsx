"use client";

import { useState, useEffect } from 'react';
import { Sun, Moon, LayoutDashboard, BarChart, LineChart, Users, User, LogOut, Search, UserCheck, UserX, Shield, ShieldOff } from 'lucide-react';

export default function AdminDashboard() {
  // State variables for theme, navigation, logout status, tab selection, and search
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [loggingOut, setLoggingOut] = useState(false);
  const [userTab, setUserTab] = useState('tourists');
  const [searchTerm, setSearchTerm] = useState('');

  // Dummy data for tourists
  const [tourists, setTourists] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active', isBlocked: false, joinDate: '2024-01-15' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', status: 'active', isBlocked: false, joinDate: '2024-02-20' },
    { id: 3, name: 'Mike Chen', email: 'mike@example.com', status: 'inactive', isBlocked: true, joinDate: '2024-01-30' },
    { id: 4, name: 'Emma Wilson', email: 'emma@example.com', status: 'active', isBlocked: false, joinDate: '2024-03-05' },
    { id: 5, name: 'David Brown', email: 'david@example.com', status: 'inactive', isBlocked: false, joinDate: '2024-02-10' },
  ]);

  // Dummy data for guides
  const [guides, setGuides] = useState([
    { id: 1, name: 'Jane Smith', email: 'jane@example.com', status: 'active', isBlocked: false, joinDate: '2024-01-10', rating: 4.8, totalBookings: 45 },
    { id: 2, name: 'Alex Rodriguez', email: 'alex@example.com', status: 'active', isBlocked: false, joinDate: '2024-01-25', rating: 4.6, totalBookings: 32 },
    { id: 3, name: 'Lisa Wong', email: 'lisa@example.com', status: 'inactive', isBlocked: true, joinDate: '2024-02-15', rating: 4.2, totalBookings: 18 },
    { id: 4, name: 'Robert Taylor', email: 'robert@example.com', status: 'active', isBlocked: false, joinDate: '2024-03-01', rating: 4.9, totalBookings: 67 },
    { id: 5, name: 'Maria Garcia', email: 'maria@example.com', status: 'inactive', isBlocked: false, joinDate: '2024-02-28', rating: 4.4, totalBookings: 23 },
  ]);

  // Load saved theme from localStorage on first render
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

  // Toggle between dark and light mode + save preference
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


  // Handles logout with simulated delay
  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    // Simulate logout process
    setTimeout(() => {
      localStorage.removeItem('user');
      localStorage.removeItem('theme');
      setLoggingOut(false);
      alert('Logged out successfully');
    }, 1000);
  };
// Handles logout with simulated delay
  const handleUserAction = (userId, action, userType) => {
    const updateUsers = userType === 'tourist' ? setTourists : setGuides;
    const users = userType === 'tourist' ? tourists : guides;

    updateUsers(users.map(user => {
      if (user.id === userId) {
        switch (action) {
          case 'block':
            return { ...user, isBlocked: true, status: 'inactive' };
          case 'unblock':
            return { ...user, isBlocked: false };
          case 'activate':
            return { ...user, status: 'active' };
          case 'deactivate':
            return { ...user, status: 'inactive' };
          default:
            return user;
        }
      }
      return user;
    }));
  };

    // Search filter for tourists and guides

  const filteredTourists = tourists.filter(tourist =>
    tourist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tourist.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredGuides = guides.filter(guide =>
    guide.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guide.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // User table UI generator for tourists/guides
  const renderUserTable = (users, userType) => (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
      <div className={`grid gap-4 font-semibold text-gray-700 dark:text-gray-300 mb-3 ${
        userType === 'guide' ? 'grid-cols-7' : 'grid-cols-6'
      }`}>
        <span>Name</span>
        <span>Email</span>
        <span>Status</span>
        <span>Blocked</span>
        {userType === 'guide' && <span>Rating</span>}
        <span>Join Date</span>
        <span>Actions</span>
      </div>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {users.map((user) => (
          <div
            key={user.id}
            className={`grid gap-4 text-gray-600 dark:text-gray-400 py-3 px-2 border-b border-gray-200 dark:border-gray-600 rounded-md ${
              user.isBlocked ? 'bg-red-50 dark:bg-red-900/20' : 'bg-white dark:bg-gray-800'
            } ${userType === 'guide' ? 'grid-cols-7' : 'grid-cols-6'}`}
          >
            <span className="font-medium">{user.name}</span>
            <span className="text-sm">{user.email}</span>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              user.status === 'active' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
            }`}>
              {user.status === 'active' ? 'Active' : 'Inactive'}
            </span>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              user.isBlocked 
                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' 
                : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
            }`}>
              {user.isBlocked ? 'Blocked' : 'Active'}
            </span>
            {userType === 'guide' && (
              <span className="text-sm">
                ⭐ {user.rating} ({user.totalBookings})
              </span>
            )}
            <span className="text-sm">{user.joinDate}</span>
            <div className="flex space-x-1">
              {user.isBlocked ? (
                <button
                  onClick={() => handleUserAction(user.id, 'unblock', userType)}
                  className="p-1 text-green-600 hover:text-green-800 hover:bg-green-100 dark:hover:bg-green-900 rounded transition-colors"
                  title="Unblock User"
                >
                  <UserCheck className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={() => handleUserAction(user.id, 'block', userType)}
                  className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-colors"
                  title="Block User"
                >
                  <UserX className="h-4 w-4" />
                </button>
              )}
              
              {user.status === 'active' ? (
                <button
                  onClick={() => handleUserAction(user.id, 'deactivate', userType)}
                  className="p-1 text-orange-600 hover:text-orange-800 hover:bg-orange-100 dark:hover:bg-orange-900 rounded transition-colors"
                  title="Deactivate User"
                >
                  <ShieldOff className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={() => handleUserAction(user.id, 'activate', userType)}
                  className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900 rounded transition-colors"
                  title="Activate User"
                >
                  <Shield className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

    // Dynamically render content for selected section

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

      case 'users':
        return (
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">User Management</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Manage all platform users including tourists and guides. You can block, unblock, activate, and deactivate users.
            </p>

            {/* Search and Add User Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors whitespace-nowrap">
                Add New User
              </button>
            </div>

            {/* User Type Tabs */}
            <div className="mb-6">
              <div className="border-b border-gray-200 dark:border-gray-600">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setUserTab('tourists')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      userTab === 'tourists'
                        ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    Tourists ({filteredTourists.length})
                  </button>
                  <button
                    onClick={() => setUserTab('guides')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      userTab === 'guides'
                        ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    Guides ({filteredGuides.length})
                  </button>
                </nav>
              </div>
            </div>

            {/* User Tables */}
            <div className="mt-4">
              {userTab === 'tourists' && (
                <div>
                  <div className="mb-4 flex justify-between items-center">
                    <h4 className="text-lg font-medium text-gray-800 dark:text-gray-100">Tourist Management</h4>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Active: {filteredTourists.filter(t => t.status === 'active').length} | 
                      Blocked: {filteredTourists.filter(t => t.isBlocked).length}
                    </div>
                  </div>
                  {renderUserTable(filteredTourists, 'tourist')}
                </div>
              )}

              {userTab === 'guides' && (
                <div>
                  <div className="mb-4 flex justify-between items-center">
                    <h4 className="text-lg font-medium text-gray-800 dark:text-gray-100">Guide Management</h4>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Active: {filteredGuides.filter(g => g.status === 'active').length} | 
                      Blocked: {filteredGuides.filter(g => g.isBlocked).length}
                    </div>
                  </div>
                  {renderUserTable(filteredGuides, 'guide')}
                </div>
              )}
            </div>

            {/* Legend */}
            <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <h5 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">Action Legend:</h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div className="flex items-center">
                  <UserX className="h-4 w-4 text-red-600 mr-1" />
                  <span className="text-gray-600 dark:text-gray-300">Block User</span>
                </div>
                <div className="flex items-center">
                  <UserCheck className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-gray-600 dark:text-gray-300">Unblock User</span>
                </div>
                <div className="flex items-center">
                  <ShieldOff className="h-4 w-4 text-orange-600 mr-1" />
                  <span className="text-gray-600 dark:text-gray-300">Deactivate</span>
                </div>
                <div className="flex items-center">
                  <Shield className="h-4 w-4 text-blue-600 mr-1" />
                  <span className="text-gray-600 dark:text-gray-300">Activate</span>
                </div>
              </div>
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

      case 'profile':
        return (
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Admin Profile</h3>
            
            {/* Profile Information Section */}
            <div className="mb-8">
              <h4 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-600 pb-2">
                Profile Information
              </h4>
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
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 opacity-60"
                    placeholder="admin@example.com"
                    disabled
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Email cannot be changed</p>
                </div>
                
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 transition-colors duration-300"
                >
                  Update Profile
                </button>
              </form>
            </div>

            {/* Password Change Section */}
            <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
              <h4 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-600 pb-2">
                Change Password
              </h4>
              <form className="space-y-4">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                    placeholder="Enter current password"
                  />
                </div>
                
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                    placeholder="Enter new password"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Password must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters
                  </p>
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                    placeholder="Confirm new password"
                  />
                </div>
                
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md shadow-md hover:bg-green-700 transition-colors duration-300"
                  >
                    Update Password
                  </button>
                  <button
                    type="button"
                    className="px-6 py-2 bg-gray-500 text-white font-semibold rounded-md shadow-md hover:bg-gray-600 transition-colors duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
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
            disabled={loggingOut}
            className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogOut className="mr-2 h-5 w-5" />
            {loggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {renderContent()}
      </div>
    </div>
  );
}
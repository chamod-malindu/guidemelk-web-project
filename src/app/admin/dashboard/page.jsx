"use client"

import { useState, useEffect } from 'react';
import { Sun, Moon, LayoutDashboard, BarChart, LineChart, Users, User, LogOut, Search, UserCheck, UserX, Shield, ShieldOff, HelpCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  // State variables for theme, navigation, logout status, tab selection, and search
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [loggingOut, setLoggingOut] = useState(false);
  const [userTab, setUserTab] = useState('tourists');
  const [searchTerm, setSearchTerm] = useState('');

  const [stats, setStats] = useState({
    totalUsers: 0,
    activeGuides: 0,
    totalBookings: 0,
    thisMonthRevenue: 0,
    loading: true,
    error: ''
  });

  const [activity, setActivity] = useState([]); // Recent activity log, loaded on mount

  const [transactions, setTransactions] = useState([]); // Start empty, fetched from API
  const [loadingTransactions, setLoadingTransactions] = useState(true); 
  const [transactionError, setTransactionError] = useState('');

  const [tourists, setTourists] = useState([]);
  const [guides, setGuides] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [usersError, setUsersError] = useState('');


  useEffect(() => {
    if (loggingOut) {
      router.replace('/login');
      return;
    } 
  }, [loggingOut]);

  // Fetch dashboard stats from backend API on initial render
  useEffect(() => {
    async function fetchStats() {
      setStats(s => ({ ...s, loading: true, error: '' }));
      try {
        const [
          userRes,
          guideRes,
          bookingsRes,
          revenueRes
        ] = await Promise.all([
          fetch('/api/user/count'),                              // Total users
          fetch('/api/user/count?role=guide&active=true'),       // Active guides
          fetch('/api/bookings/count'),                          // Total bookings
          fetch('/api/payments/sum?status=completed&period=thisMonth') // Revenue
        ]);
        setStats({
          totalUsers: (await userRes.json()).total || 0,
          activeGuides: (await guideRes.json()).total || 0,
          totalBookings: (await bookingsRes.json()).total || 0,
          thisMonthRevenue: (await revenueRes.json()).amount || 0,
          loading: false,
          error: ''
        });
      } catch (err) {
        setStats(s => ({ ...s, loading: false, error: 'Failed to load dashboard stats.' }));
      }
    }
    fetchStats();
  }, []);

  // Fetch recent system activity log from backend API on initial render
  useEffect(() => {
    async function fetchActivity() {
      try {
        const res = await fetch('/api/admin/activity');
        if (res.ok) {
          setActivity(await res.json());
        } else {
          setActivity([{ message: "Unable to load recent system activity." }]);
        }
      } catch {
        setActivity([{ message: "Unable to load recent system activity." }]);
      }
    }
    fetchActivity();
  }, []);

  useEffect(() => {
    if (activeSection === 'transactions') {
      async function fetchTransactions() {
        setLoadingTransactions(true);
        setTransactionError('');
        try {
          const res = await fetch('/api/payments');
          if (!res.ok) throw new Error('Failed to fetch transactions');
          const data = await res.json();
          if (data.success) {
            setTransactions(data.payments);
          } else {
            setTransactionError(data.error || 'Unknown error');
          }
        } catch (error) {
          setTransactionError(error.message);
        } finally {
          setLoadingTransactions(false);
        }
      }
      fetchTransactions();
    }
  }, [activeSection]);

  useEffect(() => {
    if (activeSection === 'users') {
      setLoadingUsers(true);
      setUsersError('');
      Promise.all([
        fetch('/api/user?role=tourist').then(r => r.json()),
        fetch('/api/user?role=guide').then(r => r.json()),
      ])
        .then(([touristData, guideData]) => {
          if (touristData.success) setTourists(touristData.users);
          else setUsersError('Failed to load tourists');
          if (guideData.success) setGuides(guideData.users);
          else setUsersError('Failed to load guides');
        })
        .catch(() => setUsersError('Failed to fetch users'))
        .finally(() => setLoadingUsers(false));
    }
  }, [activeSection]);
  
  
  // Dummy disputes data
  const [disputes, setDisputes] = useState([
    {
      id: 1,
      disputeId: 'DSP-2024-001',
      guide: { name: 'Jane Smith', email: 'jane@example.com', id: 1, rating: 4.8 },
      tourist: { name: 'John Doe', email: 'john@example.com', id: 1 },
      booking: { id: 'BK-001', date: '2024-03-15', amount: 450 },
      type: 'Payment Issue',
      title: 'Payment not received for completed booking',
      description: 'I completed the 3-day tour to Kandy and Sigiriya on March 15th, but I have not received the payment yet. The tourist confirmed the tour was completed successfully.',
      status: 'open',
      priority: 'high',
      createdAt: '2024-03-18T10:30:00Z',
      lastUpdated: '2024-03-18T10:30:00Z',
      adminNotes: '',
      attachments: ['receipt-001.pdf', 'tour-completion-photo.jpg']
    },
    {
      id: 2,
      disputeId: 'DSP-2024-002',
      guide: { name: 'Alex Rodriguez', email: 'alex@example.com', id: 2, rating: 4.6 },
      tourist: { name: 'Sarah Johnson', email: 'sarah@example.com', id: 2 },
      booking: { id: 'BK-002', date: '2024-03-20', amount: 300 },
      type: 'Tourist Behavior',
      title: 'Tourist was disrespectful and demanding',
      description: 'The tourist was extremely rude throughout the tour, made unreasonable demands, and left a false negative review. This has affected my rating unfairly.',
      status: 'in-review',
      priority: 'medium',
      createdAt: '2024-03-21T14:15:00Z',
      lastUpdated: '2024-03-22T09:30:00Z',
      adminNotes: 'Reviewing chat logs and tourist feedback. Will investigate further.',
      attachments: ['chat-screenshots.pdf']
    },
    {
      id: 3,
      disputeId: 'DSP-2024-003',
      guide: { name: 'Lisa Wong', email: 'lisa@example.com', id: 3, rating: 4.2 },
      tourist: { name: 'Mike Chen', email: 'mike@example.com', id: 3 },
      booking: { id: 'BK-003', date: '2024-03-18', amount: 520 },
      type: 'Booking Cancellation',
      title: 'Tourist cancelled last minute without valid reason',
      description: 'Tourist cancelled the booking 2 hours before the tour start time without any valid reason. According to the cancellation policy, I should receive partial payment.',
      status: 'resolved',
      priority: 'low',
      createdAt: '2024-03-18T07:45:00Z',
      lastUpdated: '2024-03-19T16:20:00Z',
      adminNotes: 'Resolved - Partial payment (50%) released to guide as per cancellation policy.',
      attachments: ['cancellation-policy.pdf']
    },
    {
      id: 4,
      disputeId: 'DSP-2024-004',
      guide: { name: 'Robert Taylor', email: 'robert@example.com', id: 4, rating: 4.9 },
      tourist: { name: 'Emma Wilson', email: 'emma@example.com', id: 4 },
      booking: { id: 'BK-004', date: '2024-03-25', amount: 380 },
      type: 'Platform Issue',
      title: 'Commission rate calculated incorrectly',
      description: 'The platform charged 15% commission instead of the agreed 10% rate for guides with rating above 4.5. This has happened multiple times.',
      status: 'open',
      priority: 'high',
      createdAt: '2024-03-26T11:20:00Z',
      lastUpdated: '2024-03-26T11:20:00Z',
      adminNotes: '',
      attachments: ['commission-calculation.xlsx']
    },
    {
      id: 5,
      disputeId: 'DSP-2024-005',
      guide: { name: 'Maria Garcia', email: 'maria@example.com', id: 5, rating: 4.4 },
      tourist: { name: 'David Brown', email: 'david@example.com', id: 5 },
      booking: { id: 'BK-005', date: '2024-03-22', amount: 250 },
      type: 'Other',
      title: 'Inappropriate review content',
      description: 'Tourist left a review with inappropriate personal comments that are not related to the tour service. The review should be removed.',
      status: 'in-review',
      priority: 'low',
      createdAt: '2024-03-23T13:45:00Z',
      lastUpdated: '2024-03-24T10:15:00Z',
      adminNotes: 'Content moderation team reviewing the review for policy violations.',
      attachments: []
    }
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
    if (loggingOut) {
      navigation.replace('/login');
      return;
    } 
    setLoggingOut(true);
    // Simulate logout process
    setTimeout(() => {
      localStorage.removeItem('user');
      localStorage.removeItem('theme');
      setLoggingOut(false);
      toast.success('Logged out successfully');
    }, 1000);
  };

  // Handles user actions (block, unblock, activate, deactivate)
  const handleUserAction = async (userId, action, userType) => {
    setLoadingUsers(true);
    setUsersError('');
    try {
      const res = await fetch(`/api/user/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
  
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Action failed');
      }
  
      // Refresh user lists after action success
      if (userType === 'tourist') {
        const usersRes = await fetch('/api/user?role=tourist').then(r => r.json());
        if (usersRes.success) setTourists(usersRes.users);
      } else {
        const usersRes = await fetch('/api/user?role=guide').then(r => r.json());
        if (usersRes.success) setGuides(usersRes.users);
      }
    } catch (error) {
      setUsersError(error.message);
    } finally {
      setLoadingUsers(false);
    }
  };
  

  // Search filter for tourists and guides
  const filteredTourists = tourists.filter(tourist =>
    (
      ((tourist.firstName || '') + ' ' + (tourist.lastName || '')).toLowerCase().includes(searchTerm.toLowerCase())
    ) ||
    (tourist.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );
  

  const filteredGuides = guides.filter(guide =>
    (
      ((guide.firstName || '') + ' ' + (guide.lastName || '')).toLowerCase().includes(searchTerm.toLowerCase())
    ) ||
    (guide.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );
  

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
            <span className="font-medium">
              {`${user.firstName || ''} ${user.lastName || ''}`.trim()}
            </span>
            <span className="text-sm">{user.email || ''}</span>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              user.status === 'active' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
            }`}>{user.status === 'active' ? 'Active' : 'Inactive'}</span>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              user.isBlocked 
                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' 
                : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
            }`}>{user.isBlocked ? 'Blocked' : 'Active'}</span>

            {userType === 'guide' && (
              <span className="text-sm">
                ⭐ {user.rating} ({user.totalBookings})
              </span>
            )}
            <span className="text-sm">
              {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''}
            </span>
            <div className="flex space-x-1">
            {user.isBlocked ? (
              <button
                onClick={() => handleUserAction(user._id, 'unblock', userType)}
                className="p-1 text-green-600 hover:text-green-800 hover:bg-green-100 dark:hover:bg-green-900 rounded transition-colors"
                title="Unblock User"
              >
                <UserCheck className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={() => handleUserAction(user._id, 'block', userType)}
                className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-colors"
                title="Block User"
              >
                <UserX className="h-4 w-4" />
              </button>
            )}

            {user.status === 'active' ? (
              <button
                onClick={() => handleUserAction(user._id, 'deactivate', userType)}
                className="p-1 text-orange-600 hover:text-orange-800 hover:bg-orange-100 dark:hover:bg-orange-900 rounded transition-colors"
                title="Deactivate User"
              >
                <ShieldOff className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={() => handleUserAction(user._id, 'activate', userType)}
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
                <p className="text-3xl font-bold text-indigo-800 dark:text-indigo-100">
                  {stats.loading ? '...' : stats.totalUsers}
                </p>
              </div>
              <div className="bg-green-100 dark:bg-green-900 p-4 rounded-lg shadow-sm">
                <p className="text-sm text-green-700 dark:text-green-300">Active Guides</p>
                <p className="text-3xl font-bold text-green-800 dark:text-green-100">
                  {stats.loading ? '...' : stats.activeGuides}
                </p>
              </div>
              <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-lg shadow-sm">
                <p className="text-sm text-yellow-700 dark:text-yellow-300">Total Bookings</p>
                <p className="text-3xl font-bold text-yellow-800 dark:text-yellow-100">
                  {stats.loading ? '...' : stats.totalBookings}
                </p>
              </div>
              <div className="bg-red-100 dark:bg-red-900 p-4 rounded-lg shadow-sm">
                <p className="text-sm text-red-700 dark:text-red-300">Revenue (This Month)</p>
                <p className="text-3xl font-bold text-red-800 dark:text-red-100">
                  {stats.loading ? '...' : `$ ${stats.thisMonthRevenue.toLocaleString()}`}
                </p>
              </div>
            </div>
            <div className="mt-8">
              <h4 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-100">Recent System Activity</h4>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                {activity.length === 0 && <li>No recent activity.</li>}
                {activity.map((item, idx) => (
                  <li key={idx}>
                    {item.date && <span className="text-xs text-gray-400 mr-2">{new Date(item.date).toLocaleString()} -</span>}
                    {item.message}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );

        case 'transactions':
          return (
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                Transaction History
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Monitor all financial transactions between tourists and guides on the platform.
              </p>

              {loadingTransactions && (
                <p>Loading transactions...</p>
              )}

              {transactionError && (
                <p className="text-red-600 mb-4">
                  Error loading transactions: {transactionError}
                </p>
              )}

              {!loadingTransactions && !transactionError && transactions.length === 0 && (
                <p>No transactions found.</p>
              )}

              {!loadingTransactions && !transactionError && transactions.length > 0 && (
                <>
                  {/* Transaction Statistics */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg shadow-sm">
                      <p className="text-sm text-blue-700 dark:text-blue-300">Total Transactions</p>
                      <p className="text-3xl font-bold text-blue-800 dark:text-blue-100">
                        {transactions.length}
                      </p>
                    </div>
                    <div className="bg-green-100 dark:bg-green-900 p-4 rounded-lg shadow-sm">
                      <p className="text-sm text-green-700 dark:text-green-300">Total Volume</p>
                      <p className="text-3xl font-bold text-green-800 dark:text-green-100">
                        ${transactions.reduce((sum, t) => sum + (t.amount || 0), 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-purple-100 dark:bg-purple-900 p-4 rounded-lg shadow-sm">
                      <p className="text-sm text-purple-700 dark:text-purple-300">Platform Revenue</p>
                      <p className="text-3xl font-bold text-purple-800 dark:text-purple-100">
                        ${transactions.reduce((sum, t) => sum + (t.commission || 0), 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-orange-100 dark:bg-orange-900 p-4 rounded-lg shadow-sm">
                      <p className="text-sm text-orange-700 dark:text-orange-300">Success Rate</p>
                      <p className="text-3xl font-bold text-orange-800 dark:text-orange-100">
                        {transactions.length > 0
                          ? Math.round(
                              (transactions.filter(t => t.status === 'completed').length / transactions.length) * 100
                            )
                          : 0}
                        %
                      </p>
                    </div>
                  </div>

                  {/* Filter and Search */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <div className="flex gap-4">
                      <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white">
                        <option value="">All Status</option>
                        <option value="completed">Completed</option>
                        <option value="pending">Pending</option>
                        <option value="failed">Failed</option>
                      </select>
                      <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white">
                        <option value="">All Methods</option>
                        <option value="card">Card</option>
                        <option value="bank">Bank</option>
                        <option value="paypal">PayPal</option>
                      </select>
                    </div>
                  </div>

                  {/* Transactions Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full table-auto">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Transaction ID</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tourist</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Guide</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Commission</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {transactions.map(transaction => (
                          <tr key={transaction._id || transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-3 py-3 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {(transaction.transactionId || transaction._id)?.substring(0, 10)}...
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {transaction.paymentMethod?.toUpperCase() || '-'}
                              </div>
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {transaction.tourist
                                  ? `${transaction.tourist.firstName || ''} ${transaction.tourist.lastName || ''}`.trim() || transaction.tourist.email?.split('@')[0]
                                  : '-'}
                              </div>
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {transaction.guide
                                  ? `${transaction.guide.firstName || ''} ${transaction.guide.lastName || ''}`.trim() || transaction.guide.email?.split('@')[0]
                                  : '-'}
                              </div>
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap">
                              <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
                                ${transaction.amount?.toFixed(2) || 0}
                              </div>
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap">
                              <div className="text-sm font-medium text-red-600 dark:text-red-400">
                                ${transaction.commission?.toFixed(2) || 0}
                              </div>
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                transaction.status === 'completed'
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                  : transaction.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                              }`}>
                                {transaction.status
                                  ? transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)
                                  : '-'}
                              </span>
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {transaction.date ? new Date(transaction.date).toLocaleDateString() : '-'}
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap text-sm font-medium">
                              <button className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          );



          case 'disputes':
            return (
              <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Support & Disputes</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  Manage guide disputes and support requests from the platform.
                </p>
          
                {/* Dispute Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-red-100 dark:bg-red-900 p-4 rounded-lg shadow-sm">
                    <p className="text-sm text-red-700 dark:text-red-300">Open Disputes</p>
                    <p className="text-3xl font-bold text-red-800 dark:text-red-100">
                      {disputes.filter(d => d.status === 'open').length}
                    </p>
                  </div>
                  <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-lg shadow-sm">
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">In Review</p>
                    <p className="text-3xl font-bold text-yellow-800 dark:text-yellow-100">
                      {disputes.filter(d => d.status === 'in-review').length}
                    </p>
                  </div>
                  <div className="bg-green-100 dark:bg-green-900 p-4 rounded-lg shadow-sm">
                    <p className="text-sm text-green-700 dark:text-green-300">Resolved</p>
                    <p className="text-3xl font-bold text-green-800 dark:text-green-100">
                      {disputes.filter(d => d.status === 'resolved').length}
                    </p>
                  </div>
                  <div className="bg-purple-100 dark:bg-purple-900 p-4 rounded-lg shadow-sm">
                    <p className="text-sm text-purple-700 dark:text-purple-300">Avg. Resolution Time</p>
                    <p className="text-3xl font-bold text-purple-800 dark:text-purple-100">2.4d</p>
                  </div>
                </div>
          
                {/* Filter Tabs */}
                <div className="mb-6">
                  <div className="border-b border-gray-200 dark:border-gray-600">
                    <nav className="-mb-px flex space-x-8">
                      {['all', 'open', 'in-review', 'resolved'].map((status) => (
                        <button
                          key={status}
                          className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                            'all' === status
                              ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                          }`}
                        >
                          {status} ({status === 'all' ? disputes.length : disputes.filter(d => d.status === status).length})
                        </button>
                      ))}
                    </nav>
                  </div>
                </div>
          
                {/* Disputes List */}
                <div className="space-y-6">
                  {disputes.map((dispute) => (
                    <div key={dispute.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 shadow-sm">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                              {dispute.title}
                            </h4>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              dispute.status === 'resolved' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                : dispute.status === 'in-review'
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                            }`}>
                              {dispute.status.replace('-', ' ').toUpperCase()}
                            </span>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              dispute.priority === 'high' 
                                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                : dispute.priority === 'medium'
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                            }`}>
                              {dispute.priority.toUpperCase()} PRIORITY
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            <strong>Dispute ID:</strong> {dispute.disputeId} | <strong>Type:</strong> {dispute.type}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            <strong>Created:</strong> {new Date(dispute.createdAt).toLocaleDateString()} | 
                            <strong> Last Updated:</strong> {new Date(dispute.lastUpdated).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            Booking: {dispute.booking.id}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            ${dispute.booking.amount}
                          </div>
                        </div>
                      </div>
          
                      {/* Guide and Tourist Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                          <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Guide Information</h5>
                          <div className="text-sm">
                            <p><strong>Name:</strong> {dispute.guide.name}</p>
                            <p><strong>Email:</strong> {dispute.guide.email}</p>
                            <p><strong>Rating:</strong> ⭐ {dispute.guide.rating}</p>
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                          <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Tourist Information</h5>
                          <div className="text-sm">
                            <p><strong>Name:</strong> {dispute.tourist.name}</p>
                            <p><strong>Email:</strong> {dispute.tourist.email}</p>
                            <p><strong>Booking Date:</strong> {new Date(dispute.booking.date).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
          
                      {/* Description */}
                      <div className="mb-4">
                        <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Description</h5>
                        <p className="text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 p-3 rounded">
                          {dispute.description}
                        </p>
                      </div>
          
                      {/* Admin Notes */}
                      {dispute.adminNotes && (
                        <div className="mb-4">
                          <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Admin Notes</h5>
                          <p className="text-sm text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900 p-3 rounded">
                            {dispute.adminNotes}
                          </p>
                        </div>
                      )}
          
                      {/* Attachments */}
                      {dispute.attachments.length > 0 && (
                        <div className="mb-4">
                          <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Attachments</h5>
                          <div className="flex flex-wrap gap-2">
                            {dispute.attachments.map((attachment, index) => (
                              <span key={index} className="inline-flex items-center px-3 py-1 text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full">
                                📎 {attachment}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
          
                      {/* Action Buttons */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-600">
                        <div className="flex gap-3">
                          {dispute.status === 'open' && (
                            <>
                              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm">
                                Assign to Review
                              </button>
                              <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm">
                                Reject Dispute
                              </button>
                            </>
                          )}
                          {dispute.status === 'in-review' && (
                            <>
                              <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm">
                                Resolve Dispute
                              </button>
                              <button className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors text-sm">
                                Request More Info
                              </button>
                            </>
                          )}
                          {dispute.status === 'resolved' && (
                            <button className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm">
                              Reopen Dispute
                            </button>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button className="px-3 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors text-sm">
                            Contact Guide
                          </button>
                          <button className="px-3 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors text-sm">
                            View Booking
                          </button>
                          <button className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm">
                            Add Note
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
          
                {/* Empty State */}
                {disputes.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🛡️</div>
                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No Disputes Found</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      All disputes have been resolved or no disputes have been submitted yet.
                    </p>
                  </div>
                )}
              </div>
            );    

      case 'users':
        return (
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">User Management</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Manage all platform users including tourists and guides. You can block, unblock, activate, and deactivate users.
            </p>

            {activeSection === "transactions" && "Transaction History"}
            {activeSection === "disputes" && "Support & Disputes"}

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
            onClick={() => setActiveSection('transactions')}
            className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
              activeSection === 'transactions'
                ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 border-r-4 border-indigo-500'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <BarChart className="mr-3 h-5 w-5" />
            Transaction History
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
            onClick={() => setActiveSection('disputes')}
            className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
              activeSection === 'disputes'
                ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 border-r-4 border-indigo-500'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <HelpCircle className="mr-3 h-5 w-5" />
            Support & Disputes
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
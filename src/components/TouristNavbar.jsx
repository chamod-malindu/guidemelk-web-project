"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Sun, Moon } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { io } from "socket.io-client";
import axios from "axios";

export default function TouristNavbar() {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const notificationSocketRef = useRef(null);

  // Fetch user profile
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/auth/profile");
        setUser(res.data.user);
      } catch (err) {
        console.error("Failed to load user:", err);
        // Don't redirect here, let individual pages handle auth
      }
    };
    fetchUser();
  }, []);

  // Dark mode setup
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

  // Notification socket setup
  useEffect(() => {
    if (!user?._id && !user?.id) return;
    const userId = user._id || user.id;

    notificationSocketRef.current = io("http://localhost:3000", {
      path: "/api/socket",
      transports: ["websocket", "polling"],
    });

    notificationSocketRef.current.on("connect", () => {
      notificationSocketRef.current.emit("join-user-room", userId);
      console.log(`✅ Connected to notifications for user ${userId}`);
    });

    notificationSocketRef.current.on("booking-notification", (notification) => {
      console.log("🔔 Received notification:", notification);
      setNotifications(prev => [notification, ...prev].slice(0, 10));
      setUnreadCount(prev => prev + 1);

      if (Notification.permission === "granted") {
        new Notification("GuideMeLK - New Update", {
          body: notification.message,
          icon: "/favicon.ico"
        });
      }
    });

    notificationSocketRef.current.on("disconnect", () => {
      console.log("❌ Notification socket disconnected");
    });

    return () => {
      if (notificationSocketRef.current) {
        notificationSocketRef.current.disconnect();
        notificationSocketRef.current = null;
      }
    };
  }, [user?._id, user?.id]);

  // Ask notification permission
  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const NotificationDropdown = () => (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          const willOpen = !showNotifications;
          setShowNotifications(willOpen);
          if (willOpen && unreadCount > 0) {
            setUnreadCount(0);
          }
        }}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 text-xs flex items-center justify-center"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>
      {showNotifications && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Notifications</h3>
            <Button variant="ghost" size="sm" onClick={() => { setUnreadCount(0); setNotifications([]); setShowNotifications(false); }}>
              Clear All
            </Button>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                <p>No notifications</p>
              </div>
            ) : (
              notifications.map((n, i) => (
                <div key={i} className="p-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                <p className="text-sm text-gray-800 dark:text-gray-200">{n.message}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{new Date(n.timestamp).toLocaleString()}</p>
              </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
          <Link href="/" className="text-xl font-bold text-blue-600 dark:text-blue-400">
            GuideMeLK
          </Link>
          </div>
          
          {/* Centered Navigation Menu */}
          <nav className="hidden md:flex space-x-6 absolute left-1/2 transform -translate-x-1/2">
          <Link href="/tourist" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">
            Home
          </Link>
          <Link href="/findGuide" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">
            Find a Guide
          </Link>
          <Link href="/about" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">
            About Us
          </Link>
          <Link href="/tourist/dashboard" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">
            Dashboard
          </Link>
          </nav>
          
          {/* Right side - Dark Mode Toggle, Notifications and User Profile */}
          <div className="flex items-center space-x-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Notification Dropdown - only show if user is logged in */}
            {user && <NotificationDropdown />}
            
            {/* User Profile Section - only show if user is logged in */}
            {user ? (
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.profileImage || "/placeholder.svg"} />
                  <AvatarFallback>
                    {user.firstName?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.firstName}</span>
              </div>
            ) : (
              <Link href="/login" className="px-5 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-full hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md">
                Login / Sign Up
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
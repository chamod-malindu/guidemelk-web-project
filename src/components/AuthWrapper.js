"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserFromToken } from '@/lib/auth';

export default function AuthWrapper({ children, requiredRole }) {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user data exists in localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          
          // Check if user has the required role
          if (requiredRole && userData.role !== requiredRole) {
            router.push('/login');
            return;
          }
          
          setUser(userData);
          setIsLoading(false);
          return;
        }

        // If no stored user, redirect to login
        router.push('/login');
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/login');
      }
    };

    checkAuth();
  }, [router, requiredRole]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return <>{children}</>;
}
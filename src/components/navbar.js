"use client"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import Link from "next/link"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) setIsMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <nav className="py-4 px-6 bg-white dark:bg-gray-800 shadow dark:shadow-gray-700 mb-8 rounded-lg border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          GuidMeLK
        </Link>
        {/* Desktop links */}
        <div className="hidden sm:flex space-x-4">
          <Link href="/login" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Login
          </Link>
          <Link href="/register" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Register
          </Link>
        </div>
        {/* Hamburger */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="sm:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {/* Mobile Menu */}
      <div
        className={`sm:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-40 opacity-100 mt-3' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="flex flex-col space-y-1 border-t border-gray-100 dark:border-gray-700 pt-3">
          <Link
            href="/login"
            onClick={() => setIsMenuOpen(false)}
            className="block py-2 px-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
          >
            Login
          </Link>
          <Link
            href="/register"
            onClick={() => setIsMenuOpen(false)}
            className="block py-2 px-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
          >
            Register
          </Link>
        </div>
      </div>
    </nav>
  )
}
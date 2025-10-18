"use client";

import { useState, useEffect } from 'react';
import { Sun, Moon, Link as LucideLink, Image } from 'lucide-react';
import HomeNavbar from '@/components/HomeNavbar';

export default function About() {
  // State to manage dark mode
  const [isDarkMode, setIsDarkMode] = useState(false);

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
  }, []);

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

  return (
    // Main container with dynamic dark mode class and default font
    <div className={`${isDarkMode ? 'dark' : ''} min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50 font-inter`}>
      
      {/* Header Section */}
      <HomeNavbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />

      <main>
        {/* Hero Section - About Us */}
        <section className="relative h-[50vh] flex items-center justify-center text-center overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-800 dark:to-purple-900 shadow-lg rounded-b-3xl mx-4 mt-4">
          <div className="absolute inset-0 z-0 opacity-20 bg-black/30 dark:bg-black/50">
            <div className="absolute w-64 h-64 bg-white rounded-full mix-blend-overlay animate-blob top-0 left-1/4"></div>
            <div className="absolute w-96 h-96 bg-yellow-300 rounded-full mix-blend-overlay animate-blob animation-delay-2000 bottom-0 right-1/3"></div>
          </div>
          <div className="relative z-10 p-6 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-4 animate-fade-in-up">
              About Guidemelk
            </h1>
            <p className="text-xl text-indigo-100 mb-8 animate-fade-in-up animation-delay-300">
              Connecting travelers with authentic local experiences in Sri Lanka.
            </p>
          </div>
        </section>

        {/* Our Mission Section */}
        <section className="py-16 px-6 md:px-12 bg-white dark:bg-gray-900">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-8 animate-fade-in">Our Mission</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto animate-fade-in animation-delay-200">
              At Guidemelk, our mission is to empower travelers to discover the true essence of Sri Lanka through the eyes of its local experts. We believe that the most memorable journeys are those guided by genuine connections and authentic insights, fostering cultural exchange and sustainable tourism.
            </p>
          </div>
        </section>

        {/* Our Values Section */}
        <section className="py-16 px-6 md:px-12 bg-gray-50 dark:bg-gray-800">
          <h2 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-12 animate-fade-in">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {/* Value Card 1: Authenticity */}
            <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2 animate-fade-in animation-delay-200">
              <div className="flex justify-center mb-4">
                <span className="text-5xl" role="img" aria-label="Authenticity">🌟</span>
              </div>
              <h3 className="text-2xl font-semibold text-center mb-3 text-gray-800 dark:text-gray-100">Authenticity</h3>
              <p className="text-center text-gray-600 dark:text-gray-300">
                We champion genuine local experiences that go beyond typical tourist traps.
              </p>
            </div>
            {/* Value Card 2: Community */}
            <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2 animate-fade-in animation-delay-400">
              <div className="flex justify-center mb-4">
                <span className="text-5xl" role="img" aria-label="Community">🤝</span>
              </div>
              <h3 className="text-2xl font-semibold text-center mb-3 text-gray-800 dark:text-gray-100">Community</h3>
              <p className="text-center text-gray-600 dark:text-gray-300">
                We build a supportive network for both travelers and local guides.
              </p>
            </div>
            {/* Value Card 3: Sustainability */}
            <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2 animate-fade-in animation-delay-600">
              <div className="flex justify-center mb-4">
                <span className="text-5xl" role="img" aria-label="Sustainability">🌿</span>
              </div>
              <h3 className="text-2xl font-semibold text-center mb-3 text-gray-800 dark:text-gray-100">Sustainability</h3>
              <p className="text-center text-gray-600 dark:text-gray-300">
                We are committed to responsible tourism that benefits local communities and preserves Sri Lanka's heritage.
              </p>
            </div>
          </div>
        </section>

        {/* Our Team Section */}
        <section className="py-16 px-6 md:px-12 bg-white dark:bg-gray-900">
          <h2 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-12 animate-fade-in">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {/* Team Member 1 */}
            <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center transform hover:scale-105 transition-transform duration-300 animate-fade-in animation-delay-200">
            <img
                src="/team/chamod.jpg"
                alt="Chamod"
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-indigo-500"
              />
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Chamod Malindu</h3>
              <p className="text-indigo-600 dark:text-indigo-400 font-medium mb-3">Developre</p>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Passionate about connecting people and showcasing the beauty of Sri Lanka.
              </p>
            </div>
            {/* Team Member 2 */}
            <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center transform hover:scale-105 transition-transform duration-300 animate-fade-in animation-delay-400">
              <img
                src="/team/thisara.jpg"
                alt="Thisara"
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-pink-500"
              />
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Thisara Randima</h3>
              <p className="text-pink-600 dark:text-pink-400 font-medium mb-3">Developer</p>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Ensuring seamless experiences for both guides and travelers.
              </p>
            </div>
            {/* Team Member 3 */}
            <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center transform hover:scale-105 transition-transform duration-300 animate-fade-in animation-delay-600">
              <img
                src="/team/poojani.jpg"
                alt="Poojani"
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-green-500"
              />
              <h3 className="text-2xl font-semibold text-center mb-3 text-gray-800 dark:text-gray-100">Poojani Ranasinghe</h3>
              <p className="text-green-600 dark:text-green-400 font-medium mb-3">Developer</p>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Building a vibrant community of passionate local guides.
              </p>
            </div>
            {/* Team Member 4 */}
            <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center transform hover:scale-105 transition-transform duration-300 animate-fade-in animation-delay-800">
              <img
                src="/team/aponsu.jpg"
                alt="Chamodi"
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-orange-500"
              />
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Chamodi Aponsu</h3>
              <p className="text-orange-600 dark:text-orange-400 font-medium mb-3">Developer</p>
              <p className="text-center text-gray-600 dark:text-gray-300 text-sm">
                Promoting authentic Sri Lankan experiences to a global audience.
              </p>
            </div>
            {/* Team Member 5 */}
            <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center transform hover:scale-105 transition-transform duration-300 animate-fade-in animation-delay-1000">
              <img
                src="/team/hiruni.jpg"
                alt="Hiruni"
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-cyan-500"
              />
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Hiruni Pramudika</h3>
              <p className="text-cyan-600 dark:text-cyan-400 font-medium mb-3">Developer</p>
              <p className="text-center text-gray-600 dark:text-gray-300 text-sm">
                Building and maintaining the platform for seamless connections.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Us / Call to Action Section */}
        <section className="py-16 px-6 md:px-12 bg-indigo-50 dark:bg-gray-800 rounded-t-3xl mx-4 mb-4 shadow-inner">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-indigo-800 dark:text-indigo-200 mb-6 animate-fade-in">
              Have Questions? We're Here to Help!
            </h2>
            <p className="text-xl text-indigo-700 dark:text-indigo-300 mb-8 animate-fade-in animation-delay-200">
              Whether you're a traveler or a guide, feel free to reach out to us.
            </p>
            <a href="/contact" className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out transform hover:scale-105">
              Contact Us
            </a>
          </div>
        </section>
      </main>

      {/* Footer Section */}
      <footer className="bg-gray-800 dark:bg-gray-950 text-gray-300 py-8 px-6 md:px-12 rounded-t-xl">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Footer Column 1: Site Info */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Guidemelk</h3>
            <p className="text-gray-400">Your gateway to authentic Sri Lankan experiences.</p>
          </div>
          {/* Footer Column 2: Quick Links */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="hover:text-indigo-400 transition-colors duration-300">Home</a></li>
              <li><a href="/find-guide" className="hover:text-indigo-400 transition-colors duration-300">Find a Guide</a></li>
              <li><a href="/become-guide" className="hover:text-indigo-400 transition-colors duration-300">Become a Guide</a></li>
              <li><a href="/about" className="hover:text-indigo-400 transition-colors duration-300">About Us</a></li>
            </ul>
          </div>
          {/* Footer Column 3: Social Media Links */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Connect</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-indigo-400 transition-colors duration-300">Facebook</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors duration-300">Instagram</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors duration-300">Twitter</a></li>
            </ul>
          </div>
        </div>
        {/* Copyright Information */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-500">
          &copy; {new Date().getFullYear()} Guidemelk. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

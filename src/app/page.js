"use client";
/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from 'react';
import { MapPin, BookOpen, ShieldCheck, CalendarDays } from 'lucide-react';
import Link from 'next/link';
import HomeNavbar from '@/components/HomeNavbar.jsx';

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  return (
    <div className={`${isDarkMode ? 'dark' : ''} min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50 font-inter`}>

      <HomeNavbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />

      <main>
        <section
          className="bg-hero-bg relative h-[50vh] sm:h-[60vh] md:h-[70vh] flex items-center justify-center text-center overflow-hidden from-indigo-500 to-purple-600 dark:from-indigo-800 dark:to-purple-900 shadow-lg rounded-b-3xl mx-2 sm:mx-4 mt-2 sm:mt-4 bg-cover bg-left"
        >
          <div className="relative z-10 p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4 animate-fade-in-up">
              Explore Sri Lanka with Local Experts
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white font-semibold mb-6 sm:mb-8 animate-fade-in-up animation-delay-300 mt-6 sm:mt-[48px]">
              Connect with passionate local guides for authentic and unforgettable experiences.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 animate-fade-in-up animation-delay-600">
              <Link href="/login?type=tourist" className="px-8 py-3 bg-white text-indigo-600 font-semibold rounded-full shadow-lg hover:bg-gray-100 transition-all duration-300 ease-in-out transform hover:scale-105 flex justify-center items-center">
                Find Your Guide
              </Link>
              <Link href="/login?type=guide" className="px-8 py-3 border-2 border-white text-white font-semibold rounded-full shadow-lg hover:bg-white hover:text-indigo-600 transition-all duration-300 ease-in-out transform hover:scale-105">
                Become a Guide
              </Link>
            </div>
          </div>
        </section>

        <section className="py-10 sm:py-16 px-4 sm:px-6 md:px-12 bg-white dark:bg-gray-900">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 text-gray-800 dark:text-gray-100 animate-fade-in">
            Why Choose Guidemelk?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-10 max-w-6xl mx-auto">
            <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2 animate-fade-in animation-delay-200">
              <div className="flex justify-center mb-4">
                <MapPin size={48} className="text-indigo-500 dark:text-indigo-400" />
              </div>
              <h3 className="text-2xl font-semibold text-center mb-3 text-gray-800 dark:text-gray-100">Local Expertise</h3>
              <p className="text-center text-gray-600 dark:text-gray-300">
                Discover hidden gems and authentic experiences with guides who know Sri Lanka inside out.
              </p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2 animate-fade-in animation-delay-400">
              <div className="flex justify-center mb-4">
                <BookOpen size={48} className="text-green-500 dark:text-green-400" />
              </div>
              <h3 className="text-2xl font-semibold text-center mb-3 text-gray-800 dark:text-gray-100">Tailored Experiences</h3>
              <p className="text-center text-gray-600 dark:text-gray-300">
                Customize your tours based on your interests, language, and pace.
              </p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2 animate-fade-in animation-delay-600">
              <div className="flex justify-center mb-4">
                <ShieldCheck size={48} className="text-red-500 dark:text-red-400" />
              </div>
              <h3 className="text-2xl font-semibold text-center mb-3 text-gray-800 dark:text-gray-100">Secure & Verified</h3>
              <p className="text-center text-gray-600 dark:text-gray-300">
                All guides are verified, ensuring your safety and peace of mind.
              </p>
            </div>
          </div>
        </section>

        <section className="py-10 sm:py-16 px-4 sm:px-6 md:px-12 bg-gray-50 dark:bg-gray-900">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 text-gray-800 dark:text-gray-100 animate-fade-in">
            Explore Sri Lanka&apos;s Most Popular Destinations
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-6xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 animate-fade-in animation-delay-200">
              <img src="/img/kandy.jpg" alt="Kandy, Sri Lanka" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-gray-100">Kandy</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  The cultural capital, home to the sacred Temple of the Tooth Relic and beautiful botanical gardens.
                </p>
                <Link href="/login?type=tourist&location=kandy" className="mt-4 inline-block text-indigo-600 dark:text-indigo-400 hover:underline">Find Guides in Kandy &rarr;</Link>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 animate-fade-in animation-delay-400">
              <img src="/img/galle.jpg" alt="Galle, Sri Lanka" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-gray-100">Galle</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  A historic city with a well-preserved 17th-century Dutch Fort, a UNESCO World Heritage Site.
                </p>
                <Link href="/login?type=tourist&location=galle" className="mt-4 inline-block text-indigo-600 dark:text-indigo-400 hover:underline">Find Guides in Galle &rarr;</Link>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 animate-fade-in animation-delay-600">
              <img src="/img/nuwaraeliya.jpg" alt="Nuwara Eliya, Sri Lanka" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-gray-100">Nuwara Eliya</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  &quot;Little England&quot; of Sri Lanka, known for its picturesque tea plantations and cool climate.
                </p>
                <Link href="/login?type=tourist&location=nuwaraeliya" className="mt-4 inline-block text-indigo-600 dark:text-indigo-400 hover:underline">Find Guides in Nuwara Eliya &rarr;</Link>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 animate-fade-in animation-delay-800">
              <img src="/img/anuradhapura.jpg" alt="Anuradhapura, Sri Lanka" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-gray-100">Anuradhapura</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  An ancient capital filled with well-preserved ruins and sacred Buddhist sites.
                </p>
                <Link href="/login?type=tourist&location=anuradhapura" className="mt-4 inline-block text-indigo-600 dark:text-indigo-400 hover:underline">Find Guides in Anuradhapura &rarr;</Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-10 sm:py-16 px-4 sm:px-6 md:px-12 bg-white dark:bg-gray-900">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 text-gray-800 dark:text-gray-100 animate-fade-in">
            Upcoming Events in Sri Lanka (August 2025)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2 animate-fade-in animation-delay-200">
              <div className="flex justify-center mb-4">
                <CalendarDays size={48} className="text-purple-500 dark:text-purple-400" />
              </div>
              <h3 className="text-2xl font-semibold text-center mb-3 text-gray-800 dark:text-gray-100">Kandy Esala Perahera</h3>
              <p className="text-center text-gray-600 dark:text-gray-300 text-sm mb-2">
                **Dates:** July 30th - August 9th, 2025
              </p>
              <p className="text-center text-gray-600 dark:text-gray-300">
                Sri Lanka&apos;s grandest Buddhist festival, featuring elaborate processions of dancers, musicians, and decorated elephants, culminating in the magnificent Randoli Perahera.
              </p>
              <div className="flex justify-center space-x-2 mt-4">
                <Link href="https://kandyesalaperahera.com/" className="px-4 py-2 border border-indigo-600 text-indigo-600 dark:text-indigo-400 rounded-full hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-400 dark:hover:text-gray-900 transition-colors duration-300 text-sm">
                  Learn More
                </Link>
              </div>
            </div>

            <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2 animate-fade-in animation-delay-400">
              <div className="flex justify-center mb-4">
                <CalendarDays size={48} className="text-orange-500 dark:text-orange-400" />
              </div>
              <h3 className="text-2xl font-semibold text-center mb-3 text-gray-800 dark:text-gray-100">Kataragama Esala Festival</h3>
              <p className="text-center text-gray-600 dark:text-gray-300 text-sm mb-2">
                **Dates:** Expected late July - early August 2025 (Exact dates vary annually)
              </p>
              <p className="text-center text-gray-600 dark:text-gray-300">
                A unique multi-religious festival at the sacred Kataragama shrine, known for its devotional practices including firewalking.
              </p>
              <div className="flex justify-center space-x-2 mt-4">
                <Link href="https://rmkd.lk/kataragama-esala-festival/" className="px-4 py-2 border border-indigo-600 text-indigo-600 dark:text-indigo-400 rounded-full hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-400 dark:hover:text-gray-900 transition-colors duration-300 text-sm">
                  Learn More
                </Link>
              </div>
            </div>

            <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2 animate-fade-in animation-delay-600">
              <div className="flex justify-center mb-4">
                <CalendarDays size={48} className="text-teal-500 dark:text-teal-400" />
              </div>
              <h3 className="text-2xl font-semibold text-center mb-3 text-gray-800 dark:text-gray-100">The Great Elephant Gathering</h3>
              <p className="text-center text-gray-600 dark:text-gray-300 text-sm mb-2">
                **Dates:** July - September (Peak in August)
              </p>
              <p className="text-center text-gray-600 dark:text-gray-300">
                Witness hundreds of Asian elephants converge at Minneriya and Kaudulla National Parks, a truly spectacular wildlife event.
              </p>
              <div className="flex justify-center space-x-2 mt-4">
                <Link href="https://www.lovesrilanka.org/all-about-the-gathering/" className="px-4 py-2 border border-indigo-600 text-indigo-600 dark:text-indigo-400 rounded-full hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-400 dark:hover:text-gray-900 transition-colors duration-300 text-sm">
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-10 sm:py-16 px-4 sm:px-6 md:px-12 bg-indigo-50 dark:bg-gray-800 rounded-t-3xl mx-2 sm:mx-4 mb-2 sm:mb-4 shadow-inner">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-indigo-800 dark:text-indigo-200 mb-6 animate-fade-in">
              Ready to Explore or Share Your Knowledge?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-indigo-700 dark:text-indigo-300 mb-8 animate-fade-in animation-delay-200">
              Join the Guidemelk community today and unlock amazing opportunities.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 animate-fade-in animation-delay-400">
              <Link href="/login?type=tourist" className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out transform hover:scale-105">
                Sign Up as Tourist
              </Link>
              <Link href="/login?type=guide" className="px-8 py-3 border-2 border-indigo-600 text-indigo-600 dark:text-indigo-300 font-semibold rounded-full shadow-lg hover:bg-indigo-600 hover:text-white transition-all duration-300 ease-in-out transform hover:scale-105">
                Sign Up as Guide
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 dark:bg-gray-950 text-gray-300 py-8 px-4 sm:px-6 md:px-12 rounded-t-xl">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Guidemelk</h3>
            <p className="text-gray-400">Your gateway to authentic Sri Lankan experiences.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-indigo-400 transition-colors duration-300">Home</Link></li>
              <li><Link href="/find-guide" className="hover:text-indigo-400 transition-colors duration-300">Find a Guide</Link></li>
              <li><Link href="/become-guide" className="hover:text-indigo-400 transition-colors duration-300">Become a Guide</Link></li>
              <li><Link href="/about" className="hover:text-indigo-400 transition-colors duration-300">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Connect</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-indigo-400 transition-colors duration-300">Facebook</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors duration-300">Instagram</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors duration-300">Twitter</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-500">
          &copy; {new Date().getFullYear()} Guidemelk. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
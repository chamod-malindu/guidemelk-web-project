"use client"; // This directive makes this a Client Component

import React, { useState, useEffect } from 'react';
import { MapPin, Globe, Award, Sparkles, CreditCard, ArrowLeft, Sun, Moon } from 'lucide-react'; // Importing icons

// DarkModeToggle component (Client Component)
function DarkModeToggle() {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        // Check local storage for theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
            setIsDarkMode(true);
        } else {
            document.documentElement.classList.remove('dark');
            setIsDarkMode(false);
        }
    }, []);

    const toggleDarkMode = () => {
        setIsDarkMode(prevMode => {
            const newMode = !prevMode;
            if (newMode) {
                document.documentElement.classList.add('dark');
                localStorage.setItem('theme', 'dark');
            } else {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');
            }
            return newMode;
        });
    };

    return (
        <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300"
            aria-label="Toggle dark mode"
        >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
    );
}

// Navbar component (can be part of the Client Component or a separate one)
function Navbar({ user }) {
    return (
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm py-4 px-6 md:px-12 flex justify-between items-center rounded-b-xl">
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">Guidemelk</div>
            <nav className="hidden md:flex space-x-6">
                <a href="/" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300">Home</a>
                <a href="/tourist/Findguide/findguide" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300">Find a Guide</a>
                <a href="/become-guide" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300">Become a Guide</a>
                <a href="/about" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300">About Us</a>
            </nav>
            <div className="flex items-center space-x-4">
                <DarkModeToggle /> {/* Include the DarkModeToggle component */}
                {user ? (
                    <span className="text-gray-700 dark:text-gray-300">Hello, {user.firstName}</span>
                ) : (
                    <a href="/login" className="px-5 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md">Login / Sign Up</a>
                )}
            </div>
        </header>
    );
}

export default function GuideDetailsPage({ searchParams }) {
    const guideId = searchParams.guideId;

    const allGuides = [
        {
            id: 'G001',
            name: 'Nimal Perera',
            location: 'Colombo',
            languages: ['English', 'Sinhala'],
            experience: '5+ years',
            specialties: ['Cultural Tours', 'City Walks'],
            rating: 4.8,
            price: 'LKR 8,000/day',
            imageUrl: 'https://placehold.co/150x150/E0F2FE/1E40AF?text=Nimal',
            description: 'Experienced guide specializing in historical and cultural tours around Colombo. Passionate about sharing Sri Lanka\'s rich heritage.',
            contact: 'nimal.p@example.com'
        },
        {
            id: 'G002',
            name: 'Priya Sharma',
            location: 'Kandy',
            languages: ['English', 'Tamil'],
            experience: '7+ years',
            specialties: ['Temple Tours', 'Nature Hikes'],
            rating: 4.9,
            price: 'LKR 9,500/day',
            imageUrl: 'https://placehold.co/150x150/FFE4E6/BE185D?text=Priya',
            description: 'Local expert in Kandy, offering immersive experiences in ancient temples and breathtaking nature trails. Fluent in English and Tamil.',
            contact: 'priya.s@example.com'
        },
        {
            id: 'G003',
            name: 'Kamal Silva',
            location: 'Galle',
            languages: ['English', 'Sinhala', 'German'],
            experience: '3+ years',
            specialties: ['Beach Activities', 'Fort History'],
            rating: 4.5,
            price: 'LKR 7,000/day',
            imageUrl: 'https://placehold.co/150x150/D1FAE5/065F46?text=Kamal',
            description: 'Galle Fort enthusiast and beach activity organizer. Enjoy personalized tours and water sports with a friendly guide.',
            contact: 'kamal.s@example.com'
        },
        {
            id: 'G004',
            name: 'Aisha Khan',
            location: 'Ella',
            languages: ['English', 'Sinhala', 'French'],
            experience: '6+ years',
            specialties: ['Hiking', 'Tea Plantations'],
            rating: 4.7,
            price: 'LKR 8,800/day',
            imageUrl: 'https://placehold.co/150x150/FEE2E2/991B1B?text=Aisha',
            description: 'Adventure seeker and tea plantation expert in Ella. Guides memorable hikes and offers insights into tea production.',
            contact: 'aisha.k@example.com'
        },
        {
            id: 'G005',
            name: 'Ravi Fernando',
            location: 'Sigiriya',
            languages: ['English', 'Sinhala'],
            experience: '4+ years',
            specialties: ['Ancient Sites', 'Wildlife Safaris'],
            rating: 4.6,
            price: 'LKR 8,200/day',
            imageUrl: 'https://placehold.co/150x150/DBEAFE/1E3A8A?text=Ravi',
            description: 'Specialist in ancient Sri Lankan history and wildlife safaris. Explore Sigiriya and national parks with an experienced guide.',
            contact: 'ravi.f@example.com'
        },
    ];

    const guide = allGuides.find(g => g.id === guideId);

    if (!guide) {
        return (
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-50 flex flex-col items-center justify-center p-6">
                <h1 className="text-4xl font-bold text-red-500 mb-4">Guide Not Found</h1>
                <p className="text-lg text-gray-700 dark:text-gray-300">The requested guide could not be found. Please check the ID and try again.</p>
                <a href="/findguide" className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all duration-300 ease-in-out">
                    Back to Find Guide
                </a>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-50 font-inter flex flex-col">
            <Navbar user={null} />

            <main className="flex-1 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md mx-4 my-8 max-w-4xl w-full self-center">
                <a
                    href="/tourist/Findguide/findguide"
                    className="inline-flex items-center gap-2 mb-6 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-200 transition-colors duration-200"
                >
                    <ArrowLeft size={18} /> Back to Find Guides
                </a>

                <h2 className="text-4xl font-bold mb-8 text-gray-800 dark:text-gray-100 text-center">{guide.name} - Guide Details</h2>

                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                    <img
                        src={guide.imageUrl}
                        alt={guide.name}
                        className="w-48 h-48 rounded-full object-cover border-4 border-indigo-400 dark:border-indigo-600 shadow-lg"
                    />
                    <div className="flex-1 text-center md:text-left">
                        <h3 className="text-3xl font-semibold text-indigo-600 dark:text-indigo-400 mb-3">{guide.name}</h3>
                        <p className="text-gray-700 dark:text-gray-300 mb-2 flex items-center justify-center md:justify-start">
                            <MapPin size={20} className="mr-2 text-indigo-500" /> <span className="font-medium">Location:</span> {guide.location}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 mb-2 flex items-center justify-center md:justify-start">
                            <Globe size={20} className="mr-2 text-indigo-500" /> <span className="font-medium">Languages:</span> {guide.languages.join(', ')}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 mb-2 flex items-center justify-center md:justify-start">
                            <Award size={20} className="mr-2 text-indigo-500" /> <span className="font-medium">Experience:</span> {guide.experience}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 mb-2 flex items-center justify-center md:justify-start">
                            <Sparkles size={20} className="mr-2 text-indigo-500" /> <span className="font-medium">Specialties:</span> {guide.specialties.join(', ')}
                        </p>
                        <div className="text-yellow-500 dark:text-yellow-400 mb-4 flex items-center justify-center md:justify-start">
                            <span className="font-medium mr-2">Rating:</span> {'★'.repeat(Math.floor(guide.rating))}{'☆'.repeat(5 - Math.floor(guide.rating))} ({guide.rating})
                        </div>
                        <p className="text-gray-800 dark:text-gray-200 mb-4 text-lg leading-relaxed">{guide.description}</p>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400 mb-6 flex items-center justify-center md:justify-start">
                            <CreditCard size={24} className="mr-2 text-green-500" /> <span className="font-medium">Price:</span> {guide.price}
                        </p>
                        <a
                            href={`/payment?guideId=${guide.id}`}
                            className="w-full md:w-auto px-8 py-3 bg-indigo-600 text-white rounded-full text-lg font-semibold hover:bg-indigo-700 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-xl block text-center"
                        >
                            Book {guide.name} Now
                        </a>
                        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                            Contact: <a href={`mailto:${guide.contact}`} className="text-indigo-500 hover:underline">{guide.contact}</a>
                        </p>
                    </div>
                </div>
            </main>

            <footer className="bg-gray-800 dark:bg-gray-950 text-gray-300 py-4 px-6 md:px-12 text-center rounded-t-xl mt-auto">
                &copy; {new Date().getFullYear()} Guidemelk. All rights reserved.
            </footer>
        </div>
    );
}
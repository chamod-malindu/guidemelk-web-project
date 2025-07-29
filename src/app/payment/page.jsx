// src/app/payment/page.jsx
"use client"; // This directive marks the component as a Client Component

import { useState, useEffect } from 'react';
import { Sun, Moon, CreditCard, Lock, Calendar, Loader2 } from 'lucide-react'; // Importing icons

// Define a simple Input component directly within this file
// This replaces the assumed import from "@/components/ui/input"
const Input = ({ className, type, ...props }) => {
  return (
    <input
      type={type}
      className={`flex h-10 w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-indigo-400 ${className}`}
      {...props}
    />
  );
};


export default function PaymentPage() {
  // State to manage dark mode
  const [isDarkMode, setIsDarkMode] = useState(false);
  // Form states
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVC, setCardCVC] = useState('');
  const [cardName, setCardName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Effect to initialize dark mode from local storage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }

    // Dynamically load Tailwind CSS CDN script if not already present.
    if (!document.querySelector('script[src="https://cdn.tailwindcss.com"]')) {
      const script = document.createElement('script');
      script.src = 'https://cdn.tailwindcss.com';
      script.async = true;
      script.onload = () => console.log('Tailwind CSS CDN loaded successfully.');
      script.onerror = (e) => console.error('Failed to load Tailwind CSS CDN:', e);
      document.head.appendChild(script);
    }
  }, []);

  // Function to toggle dark mode
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

  // Handle card number formatting
  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    value = value.replace(/(\d{4})(?=\d)/g, '$1 '); // Add space every 4 digits
    setCardNumber(value.trim());
  };

  // Handle expiry date formatting (MM/YY)
  const handleCardExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length > 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    setCardExpiry(value.trim());
  };

  // Handle CVC formatting
  const handleCardCVCChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    setCardCVC(value.trim());
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Basic client-side validation
    if (!cardNumber || !cardExpiry || !cardCVC || !cardName) {
      setError('Please fill in all payment details.');
      return;
    }
    if (cardNumber.replace(/\s/g, '').length !== 16) {
      setError('Card number must be 16 digits.');
      return;
    }
    if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
      setError('Expiry date must be in MM/YY format.');
      return;
    }
    if (cardCVC.length < 3 || cardCVC.length > 4) {
      setError('CVC must be 3 or 4 digits.');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call to a payment gateway
      // In a real application, you would send these details (securely!)
      // to your backend, which then communicates with the actual payment gateway (e.g., Stripe, PayPal).
      console.log('Processing payment with:', { cardNumber, cardExpiry, cardCVC, cardName });

      // Simulate a delay for payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate a successful payment
      setSuccess('Payment successful! Your booking is confirmed.');
      // Clear form fields on success
      setCardNumber('');
      setCardExpiry('');
      setCardCVC('');
      setCardName('');

      // In a real app, you'd redirect to a confirmation page or the user's dashboard
      // router.push('/booking-confirmation');

    } catch (err) {
      console.error('Payment error:', err);
      setError('Payment failed. Please try again or use a different card.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`${isDarkMode ? 'dark' : ''} min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-50 font-inter flex flex-col`}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm py-4 px-6 md:px-12 flex justify-between items-center rounded-b-xl">
        <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">Guidemelk Payments</div>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <a href="/" className="px-5 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md">Back to Home</a>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100 flex items-center justify-center">
            <CreditCard size={30} className="mr-3 text-indigo-500" />
            Complete Your Payment
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
            Securely pay for your amazing Sri Lankan experience.
          </p>

          {error && (
            <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded-md relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          {success && (
            <div className="bg-green-100 dark:bg-green-900 border border-green-400 text-green-700 dark:text-green-300 px-4 py-3 rounded-md relative mb-4" role="alert">
              <span className="block sm:inline">{success}</span>
            </div>
          )}

          <form onSubmit={handlePayment} className="space-y-6">
            <div>
              <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Card Number</label>
              <div className="relative">
                <Input
                  id="cardNumber"
                  type="text"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  maxLength="19" // 16 digits + 3 spaces
                  placeholder="XXXX XXXX XXXX XXXX"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 pl-10"
                  disabled={isLoading}
                />
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
              </div>
            </div>

            <div>
              <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cardholder Name</label>
              <Input
                id="cardName"
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="John Doe"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="cardExpiry" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expiry Date (MM/YY)</label>
                <div className="relative">
                  <Input
                    id="cardExpiry"
                    type="text"
                    value={cardExpiry}
                    onChange={handleCardExpiryChange}
                    maxLength="5" // MM/YY
                    placeholder="MM/YY"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 pl-10"
                    disabled={isLoading}
                  />
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                </div>
              </div>
              <div>
                <label htmlFor="cardCVC" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CVC</label>
                <div className="relative">
                  <Input
                    id="cardCVC"
                    type="password"
                    value={cardCVC}
                    onChange={handleCardCVCChange}
                    maxLength="4"
                    placeholder="CVC"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 pl-10"
                    disabled={isLoading}
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md shadow-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                'Pay Now'
              )}
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 dark:bg-gray-950 text-gray-300 py-4 px-6 md:px-12 text-center rounded-t-xl mt-auto">
        &copy; {new Date().getFullYear()} Guidemelk. All rights reserved.
      </footer>
    </div>
  );
}

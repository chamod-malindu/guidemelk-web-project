"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import HomeNavbar from "@/components/HomeNavbar";
import toast from "react-hot-toast";

export default function SiteReviewsPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Review form state
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Dark mode initialization
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  // Check login status
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        if (user && user.id && user.email) {
          setIsLoggedIn(true);
          setCurrentUser(user);
        }
      } catch {
        setIsLoggedIn(false);
      }
    }
  }, []);

  // Fetch approved reviews
  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch("/api/site-reviews");
        const data = await res.json();
        if (data.success) {
          setReviews(data.reviews);
        }
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    if (!comment.trim()) {
      toast.error("Please write a comment");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/site-reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ rating, comment: comment.trim() }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Review submitted! It will appear after admin approval.");
        setHasSubmitted(true);
        setRating(0);
        setComment("");
      } else {
        toast.error(data.error || "Failed to submit review");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (count, size = "h-5 w-5") => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`${size} ${
          i < count
            ? "text-yellow-400 fill-current"
            : "text-gray-300 dark:text-gray-600"
        }`}
      />
    ));
  };

  return (
    <div
      className={`${isDarkMode ? "dark" : ""} min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50 font-inter`}
    >
      <HomeNavbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />

      <main>
        {/* Hero Section */}
        <section className="relative h-[35vh] sm:h-[40vh] flex items-center justify-center text-center overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-800 dark:to-purple-900 shadow-lg rounded-b-3xl mx-2 sm:mx-4 mt-2 sm:mt-4">
          <div className="absolute inset-0 z-0 opacity-20 bg-black/30 dark:bg-black/50">
            <div className="absolute w-64 h-64 bg-white rounded-full mix-blend-overlay animate-blob top-0 left-1/4"></div>
            <div className="absolute w-96 h-96 bg-yellow-300 rounded-full mix-blend-overlay animate-blob animation-delay-2000 bottom-0 right-1/3"></div>
          </div>
          <div className="relative z-10 p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4 animate-fade-in-up">
              What Our Users Say
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-indigo-100 animate-fade-in-up animation-delay-300">
              Read reviews from our community and share your experience with
              Guidemelk.
            </p>
          </div>
        </section>

        {/* Top Reviews Section */}
        <section className="py-10 sm:py-16 px-4 sm:px-6 md:px-12 bg-white dark:bg-gray-900">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8 text-center">
              ⭐ Top Reviews
            </h2>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">
                  Loading reviews...
                </p>
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  No Reviews Yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Be the first to share your experience with Guidemelk!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reviews.map((review) => (
                  <div
                    key={review._id}
                    className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1"
                  >
                    <div className="flex items-center mb-4">
                      {review.user?.profileImage ? (
                        <img
                          src={review.user.profileImage}
                          alt={review.user.firstName}
                          className="w-12 h-12 rounded-full object-cover border-2 border-indigo-400 mr-4"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-lg mr-4">
                          {review.user?.firstName?.[0]?.toUpperCase() || "U"}
                        </div>
                      )}
                      <div>
                        <h4 className="font-semibold text-gray-800 dark:text-gray-100">
                          {review.user?.firstName} {review.user?.lastName}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                          {review.user?.role || "User"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center mb-3">
                      {renderStars(review.rating)}
                      <span className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                        {review.rating}/5
                      </span>
                    </div>

                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-3">
                      &ldquo;{review.comment}&rdquo;
                    </p>

                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Submit Review Section */}
        <section className="py-10 sm:py-16 px-4 sm:px-6 md:px-12 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8 text-center">
              Share Your Experience
            </h2>

            {!isLoggedIn ? (
              <div className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-md text-center">
                <div className="text-5xl mb-4">🔒</div>
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Sign in to Leave a Review
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  You need to be logged in to share your experience with
                  Guidemelk.
                </p>
                <a
                  href="/login"
                  className="inline-block px-8 py-3 bg-indigo-600 text-white font-semibold rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105"
                >
                  Sign In
                </a>
              </div>
            ) : hasSubmitted ? (
              <div className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-md text-center">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Thank You for Your Review!
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Your review has been submitted and is pending admin approval.
                  It will appear on this page once approved.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-md"
              >
                {/* User Info */}
                <div className="flex items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-lg mr-3">
                    {currentUser?.firstName?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-100">
                      {currentUser?.firstName} {currentUser?.lastName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Posting as{" "}
                      {currentUser?.role === "guide" ? "a Guide" : "a Tourist"}
                    </p>
                  </div>
                </div>

                {/* Star Rating */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Rating
                  </label>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="focus:outline-none transition-transform hover:scale-110"
                      >
                        <Star
                          className={`h-8 w-8 transition-colors ${
                            star <= (hoverRating || rating)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300 dark:text-gray-600"
                          }`}
                        />
                      </button>
                    ))}
                    {rating > 0 && (
                      <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">
                        {rating === 1
                          ? "Poor"
                          : rating === 2
                            ? "Fair"
                            : rating === 3
                              ? "Good"
                              : rating === 4
                                ? "Very Good"
                                : "Excellent"}
                      </span>
                    )}
                  </div>
                </div>

                {/* Comment */}
                <div className="mb-6">
                  <label
                    htmlFor="review-comment"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Your Review
                  </label>
                  <textarea
                    id="review-comment"
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us about your experience with Guidemelk..."
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none transition-colors"
                    maxLength={500}
                  />
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 text-right">
                    {comment.length}/500
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>

                <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 text-center">
                  Your review will be published after admin approval.
                </p>
              </form>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 dark:bg-gray-950 text-gray-300 py-8 px-4 sm:px-6 md:px-12 rounded-t-xl">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Guidemelk</h3>
            <p className="text-gray-400">
              Your gateway to authentic Sri Lankan experiences.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/"
                  className="hover:text-indigo-400 transition-colors duration-300"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/findGuide"
                  className="hover:text-indigo-400 transition-colors duration-300"
                >
                  Find a Guide
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="hover:text-indigo-400 transition-colors duration-300"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/site-reviews"
                  className="hover:text-indigo-400 transition-colors duration-300"
                >
                  Reviews
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Connect</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="hover:text-indigo-400 transition-colors duration-300"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-indigo-400 transition-colors duration-300"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-indigo-400 transition-colors duration-300"
                >
                  Twitter
                </a>
              </li>
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

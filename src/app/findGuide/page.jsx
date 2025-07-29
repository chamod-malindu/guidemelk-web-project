"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, Users, Languages } from "lucide-react";

export default function FindGuidePage() {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchGuides() {
      try {
        const res = await fetch("/api/guides");
        if (!res.ok) throw new Error(`Failed to fetch guides: ${res.statusText}`);
        const data = await res.json();
        setGuides(data.guides || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchGuides();
  }, []);

  if (loading) 
    return <div className="p-10 text-center">Loading guides...</div>;

  if (error) 
    return <div className="p-10 text-center text-red-600">{error}</div>;

  if (guides.length === 0) 
    return <div className="p-10 text-center">No guides have registered yet.</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-10">Find a Guide</h1>
      <div className="max-w-7xl mx-auto grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {guides.map(guide => (
          <Link
            key={guide._id}
            href={`/guides/${guide._id}`}
            className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col items-center text-center cursor-pointer"
          >
            <img
              src={guide.profileImage || "/placeholder.svg"}
              alt={`${guide.firstName} ${guide.lastName}`}
              className="w-28 h-28 rounded-full object-cover mb-4 border-2 border-blue-600"
              loading="lazy"
            />
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              {guide.firstName} {guide.lastName}
            </h2>
            <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-600 mb-2">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{guide.location || "Location not specified"}</span>
              </div>
              {guide.languages && guide.languages.length > 0 && (
                <div className="flex items-center gap-1">
                  <Languages className="w-4 h-4" />
                  <span>{guide.languages.join(", ")}</span>
                </div>
              )}
              {typeof guide.experience === "number" && (
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>
                    {guide.experience} {guide.experience === 1 ? "year" : "years"}
                  </span>
                </div>
              )}
            </div>
            <div className={`text-sm font-semibold ${guide.isEmailVerified ? "text-green-600" : "text-red-600"}`}>
              {guide.isEmailVerified ? "Verified Guide" : "Not Verified"}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

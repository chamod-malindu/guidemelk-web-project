"use client";
import { useState } from "react";

export default function GuideProfileImageUploader({ currentImage, onImageChange }) {
  const [preview, setPreview] = useState(currentImage || "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  // Handle file selection & instant preview (without uploading yet)
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Optional: Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    setError("");
    // Create local preview
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    // Automatically upload after selection
    handleUpload(file);
  };

  // Upload to backend
  const handleUpload = async (file) => {
    try {
      setUploading(true);
      setError("");

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/guide/profileImage", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to upload");
        return;
      }

      // Update preview with final Cloudinary URL
      setPreview(data.imageUrl);

      // Also notify parent component (to sync with full profile page)
      if (onImageChange) {
        onImageChange(data.imageUrl);
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Profile Image Preview */}
      <div className="w-32 h-32 rounded-full overflow-hidden border">
        <img
          src={preview || "/default-avatar.png"}
          alt="Profile Preview"
          className="object-cover w-full h-full"
        />
      </div>

      {/* File Input */}
      <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm">
        {uploading ? "Uploading..." : "Change Photo"}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />
      </label>

      {/* Error Message */}
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}

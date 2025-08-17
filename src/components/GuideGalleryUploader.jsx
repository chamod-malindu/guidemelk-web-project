"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Upload } from "lucide-react";

export default function GuideGalleryUploader({ guideId }) {
  const [gallery, setGallery] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    async function fetchGallery() {
      try {
        const res = await fetch(`/api/guides/${guideId}/gallery`);
        const data = await res.json();
        setGallery(data.images || []);
      } catch {
        setGallery([]);
      }
    }
    if (guideId) fetchGallery();
  }, [guideId]);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`/api/guides/${guideId}/gallery`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setGallery((prev) => [data.image, ...prev]);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {gallery.length === 0
          ? [1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center"
              >
                <Camera className="h-8 w-8 text-gray-400" />
              </div>
            ))
          : gallery.map((img, idx) => (
              <div key={idx} className="aspect-square rounded-lg overflow-hidden">
                <img
                  src={img.url}
                  alt={img.description || "Guide gallery"}
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={uploading}
      />
      <Button
        variant="outline"
        disabled={uploading}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="h-4 w-4 mr-2" />
        {uploading ? "Uploading..." : "Upload Photos"}
      </Button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}

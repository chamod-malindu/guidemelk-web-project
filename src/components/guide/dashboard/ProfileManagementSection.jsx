"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ProfilePhotoCard from "../ProfilePhotoCard";
import BasicInfoCard from "../BasicInfoCard";
import ProfessionalDetailsCard from "../ProfessionalDetailsCard";
import PhotoGalleryCard from "../PhotoGalleryCard";
import toast from "react-hot-toast";

export default function ProfileManagementSection({ currentUser, setCurrentUser }) {
  const [formValues, setFormValues] = useState({
    firstName: currentUser.firstName || "",
    lastName: currentUser.lastName || "",
    email: currentUser.email || "",
    phone: currentUser.phone || "",
    location: currentUser.location || "",
    languages: currentUser.languages?.join(", ") || "",
    experience: currentUser.experience || "",
    pricePerDay: currentUser.pricePerDay || "",
    specialties: currentUser.specialties?.join(", ") || "",
    bio: currentUser.bio || ""
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = async () => {
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formValues,
          languages: formValues.languages.split(",").map((l) => l.trim()),
          specialties: formValues.specialties.split(",").map((s) => s.trim())
        }),
        credentials: "include"
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");

      setCurrentUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success("Profile updated successfully!");
      
    } catch (err) {
      toast.error("Error: " + err.message);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <ProfilePhotoCard currentUser={currentUser} setCurrentUser={setCurrentUser} />
        <BasicInfoCard formValues={formValues} handleChange={handleChange} />
      </div>
      <ProfessionalDetailsCard formValues={formValues} handleChange={handleChange} />
      <PhotoGalleryCard guideId={currentUser.id || currentUser._id} />
      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
}

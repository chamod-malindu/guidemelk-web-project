"use client";
import GuideProfileImageUploader from "@/components/GuideProfileImageUploader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfilePhotoCard({ currentUser, setCurrentUser }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Photo</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <GuideProfileImageUploader
          currentImage={currentUser?.profileImage}
          onImageChange={(newUrl) => {
            setCurrentUser(prev => ({ ...prev, profileImage: newUrl }));
            localStorage.setItem(
              "user",
              JSON.stringify({ ...currentUser, profileImage: newUrl })
            );
          }}
        />
        <p className="text-xs text-gray-600 mt-2">JPG, PNG up to 5MB</p>
      </CardContent>
    </Card>
  );
}

"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import GuideGalleryUploader from "@/components/GuideGalleryUploader";

export default function PhotoGalleryCard({ guideId }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Photo Gallery</CardTitle>
        <CardDescription>Add photos of your tours and destinations</CardDescription>
      </CardHeader>
      <CardContent>
        <GuideGalleryUploader guideId={guideId} />
      </CardContent>
    </Card>
  );
}

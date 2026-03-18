"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";

export default function ReviewsTab({ reviews }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
        My Reviews
      </h2>

      {reviews.length === 0 && (
        <p className="text-gray-500 text-center py-6">
          You haven't left any reviews yet.
        </p>
      )}

      {reviews.map((review) => (
        <Card key={review._id}>
          <CardContent className="p-6 flex gap-4">
            <Avatar>
              <AvatarImage
                src={review.guide?.profileImage || "/placeholder.svg"}
                alt={`${review.guide?.firstName || ""} ${review.guide?.lastName || ""}`}
              />
              <AvatarFallback>
                {(review.guide?.firstName?.[0] || "") +
                  (review.guide?.lastName?.[0] || "")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              {/* Header */}
              <div className="flex justify-between mb-2">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {review.guide?.firstName} {review.guide?.lastName}
                </h3>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < review.rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>

              {/* Comment */}
              <p className="text-gray-700 dark:text-gray-300">
                {review.comment}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

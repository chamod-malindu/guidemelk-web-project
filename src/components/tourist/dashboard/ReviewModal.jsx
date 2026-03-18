"use client";

import { Star } from "lucide-react";
import { Button } from "../../ui/button";


export default function ReviewModal({reviewBooking, reviewRating, setReviewRating, reviewComment,setReviewComment, submitReview, setShowReviewModal,}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Leave a Review for {reviewBooking.guide?.firstName}</h3>
        
        {/* Rating stars */}
        <div className="flex gap-1 mb-4">
          {[1,2,3,4,5].map((star) => (
            <Star
              key={star}
              className={`h-6 w-6 cursor-pointer ${star <= reviewRating ? "text-yellow-400" : "text-gray-300"}`}
              onClick={() => setReviewRating(star)}
            />
          ))}
        </div>
  
        {/* Comment */}
        <textarea
          value={reviewComment}
          onChange={(e) => setReviewComment(e.target.value)}
          placeholder="Write your feedback..."
          className="w-full border border-gray-300 dark:border-gray-600 rounded p-2 mb-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
        />
  
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setShowReviewModal(false)}>Cancel</Button>
          <Button onClick={submitReview}>Submit Review</Button>
        </div>
      </div>
    </div>
  )
}
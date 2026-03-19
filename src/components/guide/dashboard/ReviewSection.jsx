import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';

export default function ReviewsSection({ 
  averageRating, 
  totalReviews, 
  fiveStarPercentage, 
  reviews 
}) {
  return (
    <div className="space-y-6">
      {/* Reviews Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">
              {averageRating || 0}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Average Rating</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {totalReviews || 0}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Reviews</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
              {fiveStarPercentage}%
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">5-Star Reviews</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">156</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Helpful Votes</p>
          </CardContent>
        </Card>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <Card key={review._id}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Avatar>
                    <AvatarImage src={review.tourist?.profileImage || "/placeholder.svg"} />
                    <AvatarFallback>
                      {(review.tourist?.firstName?.[0] || "") + (review.tourist?.lastName?.[0] || "")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-semibold dark:text-gray-100">
                          {review.tourist?.firstName} {review.tourist?.lastName}
                        </h4>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < review.rating 
                                ? "text-yellow-400 fill-current" 
                                : "text-gray-300 dark:text-gray-600"}`}
                            />
                          ))}
                          <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-2">{review.comment}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">No reviews yet.</p>
        )}
      </div>
    </div>
  );
}
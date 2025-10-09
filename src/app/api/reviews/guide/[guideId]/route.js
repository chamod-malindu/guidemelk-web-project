import dbConnect from "@/lib/mongodb.js";
import Review from "@/models/Review.js";

export async function GET(req, context) {
  const { guideId } = context.params; 
  await dbConnect();

  try {
    if (!guideId) {
      return new Response(JSON.stringify({ error: "Missing guideId parameter" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Fetch reviews and populate tourist user info
    const reviews = await Review.find({ guide: guideId })
      .populate("tourist", "firstName lastName profileImage")
      .sort({ createdAt: -1 })
      .lean();

    // Calculate average rating
    const averageRating = reviews.length
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

    return new Response(
      JSON.stringify({
        guideId,
        averageRating: parseFloat(averageRating),
        totalReviews: reviews.length,
        reviews
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("Error fetching guide reviews:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch reviews" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

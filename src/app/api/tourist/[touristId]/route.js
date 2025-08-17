import dbConnect from "@/lib/mongodb.js";
import Review from "@/models/Review";

export async function GET(req, context) {
  const { touristId } = context.params; 
  await dbConnect();

  try {
    if (!touristId) {
      return new Response(JSON.stringify({ error: "Missing touristId parameter" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Find all reviews by this tourist, populate guide's basic info
    const reviews = await Review.find({ tourist: touristId })
      .populate("guide", "firstName lastName profileImage")
      .sort({ createdAt: -1 })
      .lean();

    return new Response(JSON.stringify({ reviews }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching tourist reviews:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch reviews" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

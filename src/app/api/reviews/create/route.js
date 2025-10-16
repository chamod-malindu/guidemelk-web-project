import dbConnect from "@/lib/mongodb.js";
import Review from "@/models/Review.js";
import Booking from "@/models/Booking.js";

export async function POST(req) {
  await dbConnect();

  try {
    const { bookingId, guideId, touristId, rating, comment } = await req.json();

    // Validate required fields
    if (!bookingId || !guideId || !touristId || !rating) {
      return Response.json({ error: "Missing required fields." }, { status: 400 });
    }

    // Validate rating value
    if (rating < 1 || rating > 5) {
      return Response.json({ error: "Rating must be 1-5." }, { status: 400 });
    }

    // Find booking and check eligibility
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return Response.json({ error: "Booking not found." }, { status: 404 });
    }
    if (String(booking.tourist) !== String(touristId)) {
      return Response.json({ error: "You are not authorized for this booking." }, { status: 403 });
    }
    if (booking.status !== "completed" || booking.paymentStatus !== "processed") {
      return Response.json({ error: "You may only review completed and paid bookings." }, { status: 400 });
    }
    if (booking.reviewed) {
      return Response.json({ error: "Review already submitted for this booking." }, { status: 400 });
    }

    // Check if review already exists for this booking
    const existing = await Review.findOne({ booking: bookingId });
    if (existing) {
      return Response.json({ error: "Review already exists for this booking." }, { status: 400 });
    }

    // Save review
    const reviewDoc = await Review.create({
      booking: bookingId,
      guide: guideId,
      tourist: touristId,
      rating,
      comment: comment || ""
    });

    // Mark booking as reviewed
    booking.reviewed = true;
    await booking.save();

    return Response.json({
      success: true,
      review: reviewDoc
    });
  } catch (error) {
    console.error("Review API error:", error);
    return Response.json({ error: "Failed to submit review." }, { status: 500 });
  }
}

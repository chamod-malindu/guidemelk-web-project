import dbConnect from "@/lib/mongodb";
import SiteReview from "@/models/SiteReview";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// GET: Return top 5 approved site reviews (public, no auth needed)
export async function GET() {
  try {
    await dbConnect();

    const reviews = await SiteReview.find({ status: "approved" })
      .sort({ rating: -1, createdAt: -1 })
      .limit(5)
      .populate("user", "firstName lastName profileImage role")
      .lean();

    return NextResponse.json({ success: true, reviews });
  } catch (error) {
    console.error("Error fetching site reviews:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

// POST: Submit a new site review (auth required)
export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "You must be logged in to submit a review" },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid or expired session" },
        { status: 401 }
      );
    }

    const { rating, comment } = await request.json();

    if (!rating || !comment) {
      return NextResponse.json(
        { success: false, error: "Rating and comment are required" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if user already submitted a review
    const existingReview = await SiteReview.findOne({ user: decoded.userId });
    if (existingReview) {
      return NextResponse.json(
        { success: false, error: "You have already submitted a site review" },
        { status: 409 }
      );
    }

    const review = await SiteReview.create({
      user: decoded.userId,
      rating: Number(rating),
      comment: comment.trim(),
    });

    return NextResponse.json({ success: true, review }, { status: 201 });
  } catch (error) {
    console.error("Error creating site review:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit review" },
      { status: 500 }
    );
  }
}

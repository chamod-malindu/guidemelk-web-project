import dbConnect from "@/lib/mongodb";
import Review from "@/models/Review";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// GET: Return all guide reviews for admin management
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (decoded.role !== "admin") {
      return NextResponse.json({ success: false, error: "Admin access required" }, { status: 403 });
    }

    await dbConnect();

    const reviews = await Review.find({})
      .sort({ createdAt: -1 })
      .populate("guide", "firstName lastName email")
      .populate("tourist", "firstName lastName email")
      .populate("booking", "date amount")
      .lean();

    return NextResponse.json({ success: true, reviews });
  } catch (error) {
    console.error("Error fetching admin guide reviews:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch guide reviews" },
      { status: 500 }
    );
  }
}

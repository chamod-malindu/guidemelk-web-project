import dbConnect from "@/lib/mongodb";
import SiteReview from "@/models/SiteReview";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// PATCH: Update review status (approve/reject)
export async function PATCH(request, { params }) {
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

    const { id } = await params;
    const { status } = await request.json();

    if (!["approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { success: false, error: "Status must be 'approved' or 'rejected'" },
        { status: 400 }
      );
    }

    await dbConnect();

    const review = await SiteReview.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate("user", "firstName lastName email profileImage role");

    if (!review) {
      return NextResponse.json(
        { success: false, error: "Review not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error("Error updating site review:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update review" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a review
export async function DELETE(request, { params }) {
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

    const { id } = await params;

    await dbConnect();

    const review = await SiteReview.findByIdAndDelete(id);

    if (!review) {
      return NextResponse.json(
        { success: false, error: "Review not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Review deleted" });
  } catch (error) {
    console.error("Error deleting site review:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete review" },
      { status: 500 }
    );
  }
}

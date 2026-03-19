import dbConnect from "@/lib/mongodb";
import Review from "@/models/Review";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// DELETE: Delete a guide review (Admin)
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

    const review = await Review.findByIdAndDelete(id);

    if (!review) {
      return NextResponse.json(
        { success: false, error: "Guide review not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Guide review deleted" });
  } catch (error) {
    console.error("Error deleting guide review:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete guide review" },
      { status: 500 }
    );
  }
}

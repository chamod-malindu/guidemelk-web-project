import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";

// GET /api/guide/unavailable-dates — fetch guide's unavailable dates
export async function GET(request) {
  try {
    await dbConnect();

    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("unavailableDates role");

    if (!user || user.role !== "guide") {
      return NextResponse.json({ error: "Guide not found" }, { status: 404 });
    }

    return NextResponse.json({ unavailableDates: user.unavailableDates || [] });
  } catch (error) {
    console.error("Error fetching unavailable dates:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// PUT /api/guide/unavailable-dates — update guide's unavailable dates
export async function PUT(request) {
  try {
    await dbConnect();

    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { unavailableDates } = await request.json();

    if (!Array.isArray(unavailableDates)) {
      return NextResponse.json({ error: "unavailableDates must be an array" }, { status: 400 });
    }

    const user = await User.findById(decoded.userId);
    if (!user || user.role !== "guide") {
      return NextResponse.json({ error: "Guide not found" }, { status: 404 });
    }

    user.unavailableDates = unavailableDates;
    await user.save();

    return NextResponse.json({
      success: true,
      unavailableDates: user.unavailableDates,
    });
  } catch (error) {
    console.error("Error updating unavailable dates:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

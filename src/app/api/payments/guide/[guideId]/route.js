import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Payment from "@/models/Payment";

export async function GET(req, { params }) {
  await dbConnect();
  try {
    const { guideId } = params;
    const payments = await Payment.find({ guide: guideId })
      .sort({ date: -1 })
      .populate("tourist", "firstName lastName profileImage") 
      .lean();
    return NextResponse.json({ success: true, payments }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

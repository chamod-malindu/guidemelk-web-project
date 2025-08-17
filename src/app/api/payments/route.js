import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Payment from "@/models/Payment";

export async function POST(req) {
  await dbConnect();
  try {
    const body = await req.json();
    // Debug: show exactly what is being received
    console.log("PAYMENT PAYLOAD:", body);
    const payment = await Payment.create(body);
    return NextResponse.json({ success: true, payment }, { status: 201 });
  } catch (error) {
    // Debug: log the full error to terminal
    console.error("PAYMENT CREATION ERROR:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Otp from '@/models/Otp';

export async function POST(request) {
  try {
    const { email, otp } = await request.json();

    // Validate input
    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Find the OTP record
    const otpRecord = await Otp.findOne({
      email: email.toLowerCase().trim(),
      otp: otp,
      verified: false
    });

    if (!otpRecord) {
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    // Mark OTP as verified
    otpRecord.verified = true;
    await otpRecord.save();

    console.log('✅ OTP verified successfully for:', email);

    return NextResponse.json({
      success: true,
      message: "OTP verified successfully"
    });

  } catch (error) {
    console.error('OTP verification error:', error);
    return NextResponse.json(
      { error: "Failed to verify OTP. Please try again." },
      { status: 500 }
    );
  }
}
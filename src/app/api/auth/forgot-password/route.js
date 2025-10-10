import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Otp from '@/models/Otp';
import { sendOTPEmail } from '@/lib/email';

// Generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request) {
  try {
    const { email } = await request.json();

    // Validate email
    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if user exists
    const user = await User.findOne({ 
      email: email.toLowerCase().trim() 
    });

    if (!user) {
      return NextResponse.json(
        { error: "No account found with this email address" },
        { status: 404 }
      );
    }

    // Check if user registered with Google
    if (user.googleId && !user.password) {
      return NextResponse.json(
        { error: "This account was created with Google. Please use Google Sign-In." },
        { status: 400 }
      );
    }

    // Delete any existing OTPs for this email
    await Otp.deleteMany({ email: email.toLowerCase().trim() });

    // Generate new OTP
    const otp = generateOTP();

    // Save OTP to database
    await Otp.create({
      email: email.toLowerCase().trim(),
      otp: otp,
      verified: false
    });

    // Send OTP email
    await sendOTPEmail(email, otp);

    console.log('✅ OTP generated and sent for:', email);

    return NextResponse.json({
      success: true,
      message: "OTP has been sent to your email address"
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: "Failed to process request. Please try again." },
      { status: 500 }
    );
  }
}
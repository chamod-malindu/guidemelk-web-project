import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  
  if (!token) {
    return NextResponse.json(
      { error: "Verification token is required" },
      { status: 400 }
    );
  }

  try {
    const { userId } = verifyToken(token);
    await dbConnect();
    
    const user = await User.findById(userId);
    
    if (!user) {
      return NextResponse.json(
        { error: "User account not found" },
        { status: 404 }
      );
    }

    if (user.isEmailVerified) {
      return NextResponse.json({
        message: "Email already verified",
        success: true,
        role: user.role,
        alreadyVerified: true
      });
    }

    await User.findByIdAndUpdate(
      userId,
      { 
        isEmailVerified: true,
        emailVerifiedAt: new Date()
      }
    );

    return NextResponse.json({ 
      message: "Email verified successfully",
      success: true,
      role: user.role
    });

  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: "Invalid or expired verification link" },
      { status: 400 }
    );
  }
}
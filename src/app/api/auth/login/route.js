import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { createToken } from '@/lib/auth';

export async function POST(request) {
  try {
    // Parse the request body
    const { email, password, role } = await request.json();

    // Validate required fields
    if (!email || !password || !role) {
      return NextResponse.json(
        { error: "Email, password, and role are required" },
        { status: 400 }
      );
    }

    // Validate role
    if (!['tourist', 'guide', 'admin'].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role specified" },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();

    // Find user by email and role
    const user = await User.findOne({ 
      email: email.toLowerCase().trim(),
      role: role
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials or user not found" },
        { status: 401 }
      );
    }

    // Check if user is blocked
    if (user.isBlocked) {
      return NextResponse.json(
        { error: "Your account has been blocked. Please contact support." },
        { status: 403 }
      );
    }

    // Check if user has a password (for non-Google users)
    if (!user.password) {
      return NextResponse.json(
        { error: "This account was created with Google. Please use Google Sign-In." },
        { status: 400 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return NextResponse.json(
        { 
          error: "Please verify your email before logging in",
          needsVerification: true,
          userId: user._id
        },
        { status: 403 }
      );
    }

    // Create JWT token with additional user info
    const tokenPayload = {
      userId: user._id,
      email: user.email,
      role: user.role,
      emailVerified: user.isEmailVerified,
      firstName: user.firstName,
      lastName: user.lastName
    };

    const token = createToken(tokenPayload);

    // Prepare user data for response (excluding sensitive info)
    const userData = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
      isEmailVerified: user.isEmailVerified,
      phone: user.phone,
      location: user.location,
      languages: user.languages,
      experience: user.experience,
      specialties: user.specialties,
      pricePerDay: user.pricePerDay,
      bio: user.bio,
      country: user.country
    };

    // Create response with user data
    const response = NextResponse.json({
      message: "Login successful",
      success: true,
      user: userData,
      redirectTo: `/${role}/dashboard`
    });

    // Set HTTP-only cookie with the token
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 // 24 hours
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { verifyToken, createToken } from '@/lib/auth';

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
    // Decode and verify the token from the verification link
    const { userId } = verifyToken(token);
    
    await dbConnect();

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { error: "User account not found" },
        { status: 404 }
      );
    }

    // If already verified, issue fresh token and set cookie
    if (user.isEmailVerified) {
      const newToken = createToken(user);
      const response = NextResponse.redirect(new URL('/after-email-verification?role=' + user.role, request.url));
      response.cookies.set('token', newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
      });
      return response;
    }

    // Update user to mark email as verified
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        isEmailVerified: true,
        emailVerifiedAt: new Date(),
      },
      { new: true }
    );

    // Create JWT token for authenticated session
    const newToken = createToken(updatedUser);

    // Redirect with token cookie set to after-email-verification page
    const response = NextResponse.redirect(new URL('/after-email-verification?role=' + updatedUser.role, request.url));
    response.cookies.set('token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: "Invalid or expired verification link" },
      { status: 400 }
    );
  }
}

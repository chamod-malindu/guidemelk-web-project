import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { createToken } from '@/lib/auth';

export async function GET(req) {
  try {
    // Get session from NextAuth
    const session = await auth();

    if (!session || !session.user || !session.user.email) {
      // Redirect to login if no valid session
      return NextResponse.redirect(new URL('/login', req.url));
    }

    console.log("🌐 Session user:", session.user);

    const email = session.user.email;
    // Initial role from session token (fallback to tourist)
    let role = session.user.usertype || 'tourist';

    // Connect to DB
    await dbConnect();

    // Check if user already exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user with the role passed from session JWT
      user = await User.create({
        firstName: session.user.name?.split(" ")[0] || '',
        lastName: session.user.name?.split(" ").slice(1).join(" ") || '',
        email,
        role,
        phone: "Not Provided",
        isEmailVerified: true,
        emailVerifiedAt: new Date(),
        profileImage: session.user.image || '',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log("✅ New user created via Google:", user._id);
    } else {
      console.log("✅ Existing user logged in:", user._id);
      // Override role from DB record to ensure correctness
      role = user.role;
    }

    // Create JWT token
    const token = createToken(user);

    // Determine redirect path strictly from the resolved role
    let redirectTo;
    switch (role) {
      case 'tourist':
        redirectTo = '/tourist';
        break;
      case 'guide':
        redirectTo = '/guide/dashboard';
        break;
      case 'admin':
        redirectTo = '/admin/dashboard';
        break;
      default:
        redirectTo = `/${role}/dashboard`;
    }

    console.log(`➡️ Redirecting to ${redirectTo}`);

    // Create response with redirect and set token cookie
    const response = NextResponse.redirect(new URL(redirectTo, req.url));
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return response;

  } catch (error) {
    console.error("🔥 Google callback error:", error);
    // Redirect to login on error
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

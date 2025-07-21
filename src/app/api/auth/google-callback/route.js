import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { createToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET(req) {
  try {
    // Get session from NextAuth
    const session = await auth();

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: 'No session found' }, { status: 401 });
    }

    console.log("🌐 Session user:", session.user);

    const email = session.user.email;
    const role = session.user.usertype || 'tourist'; // role comes from session.jwt -> token.usertype

    // Connect to DB
    await dbConnect();

    // Check if user already exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user
      user = await User.create({
        firstName: session.user.name?.split(" ")[0] || '',
        lastName: session.user.name?.split(" ")[1] || '',
        email,
        role,
        phone: "Not Provided", // ✅ <-- this line fixes it!
        isEmailVerified: true,
        emailVerifiedAt: new Date(),
        profileImage: session.user.image || '',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log("✅ New user created via Google:", user._id);
    } else {
      console.log("✅ Existing user logged in:", user._id);
    }

    // Create token
    const token = createToken(user);

    // Set token cookie
    const response = NextResponse.redirect(new URL(`/${role}/dashboard`, req.url));
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return response;

    // Redirect to role-based dashboard
    const redirectTo = `/${role}/dashboard`;
    console.log(`➡️ Redirecting to ${redirectTo}`);
    return NextResponse.redirect(new URL(redirectTo, req.url));

  } catch (error) {
    console.error("🔥 Google callback error:", error);
    return NextResponse.json({ error: 'Server error', details: error.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

export async function GET(request) {
  try {
    // Get token from cookies
    const cookieStore = await cookies(request);
    const token = cookieStore.get("token")?.value;

    console.log('Profile API: Token exists:', !!token);

    if (!token) {
      console.log('Profile API: No token found');
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = verifyToken(token);
    console.log("Profile API: Decoded token userId:", decoded.userId);
    console.log("Profile API: Decoded token email:", decoded.email);
    
    // Connect to database
    await dbConnect();
    console.log('Profile API: Connected to database');
    
    // Find user in database - try multiple approaches
    let user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      console.log('Profile API: User not found by _id, trying by email...');
      // Fallback: try finding by email and role
      user = await User.findOne({ 
        email: decoded.email,
        role: decoded.role 
      }).select('-password');
      
      if (user) {
        console.log('Profile API: Found user by email:', user._id);
      }
    } else {
      console.log('Profile API: Found user by ID:', user._id);
    }
    
    if (!user) {
      console.log('Profile API: User not found in database');
      console.log('Profile API: Searched for userId:', decoded.userId);
      console.log('Profile API: Searched for email:', decoded.email);
      
      // List all users for debugging (remove in production)
      const allUsers = await User.find({}).select('_id email role').limit(10);
      console.log('Profile API: Available users:', allUsers);
      
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if user is blocked
    if (user.isBlocked) {
      console.log('Profile API: User is blocked');
      return NextResponse.json(
        { error: "Account is blocked" },
        { status: 403 }
      );
    }

    console.log('Profile API: Returning user data for:', user._id);

    // Return user profile data
    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        isEmailVerified: user.isEmailVerified,
        emailVerifiedAt: user.emailVerifiedAt,
        phone: user.phone,
        location: user.location,
        languages: user.languages,
        experience: user.experience,
        specialties: user.specialties,
        pricePerDay: user.pricePerDay,
        bio: user.bio,
        country: user.country,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: "Failed to fetch profile", details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    // Get token from cookies
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify token and get user
    const decoded = verifyToken(token)

    // Parse updated data
    const body = await request.json()

    // Connect to DB
    await dbConnect()

    // Update user info in MongoDB
    const updatedUser = await User.findByIdAndUpdate(
      decoded.userId,
      { ...body },
      { new: true }
    ).select("-password")

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, user: updatedUser })

  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ error: "Update failed" }, { status: 500 })
  }
}
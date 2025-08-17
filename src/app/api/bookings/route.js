import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

// CREATE new booking
export async function POST(request) {
  try {
    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = verifyToken(token);
    
    // Parse request body
    const body = await request.json();
    const { guideId, date, duration, destinations, groupSize, specialRequests, totalCost } = body;

    // Validate required fields
    if (!guideId || !date || !duration || !destinations || !groupSize || !totalCost) {
      return NextResponse.json(
        { error: "Missing required booking information" },
        { status: 400 }
      );
    }

    // Validate destinations array
    if (!Array.isArray(destinations) || destinations.length === 0) {
      return NextResponse.json(
        { error: "At least one destination must be selected" },
        { status: 400 }
      );
    }

    // Validate date is in future
    const bookingDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (bookingDate < today) {
      return NextResponse.json(
        { error: "Booking date must be in the future" },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();

    // Verify tourist exists
    const tourist = await User.findById(decoded.userId);
    if (!tourist || tourist.role !== 'tourist') {
      return NextResponse.json(
        { error: "Tourist account not found" },
        { status: 404 }
      );
    }

    // Verify guide exists and is available
    const guide = await User.findById(guideId);
    if (!guide || guide.role !== 'guide') {
      return NextResponse.json(
        { error: "Guide not found" },
        { status: 404 }
      );
    }

    // Check if guide is blocked
    if (guide.isBlocked) {
      return NextResponse.json(
        { error: "This guide is currently unavailable" },
        { status: 403 }
      );
    }

    // Check for existing booking conflict (same guide, same date)
    const existingBooking = await Booking.findOne({
      guide: guideId,
      date: bookingDate,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingBooking) {
      return NextResponse.json(
        { error: "Guide is not available on this date" },
        { status: 409 }
      );
    }

    // Create new booking
    const booking = new Booking({
      tourist: decoded.userId,
      guide: guideId,
      date: bookingDate,
      duration,
      destinations,
      groupSize,
      specialRequests: specialRequests || '',
      totalCost,
      status: 'pending'
    });

    await booking.save();

    // Populate the booking with user details for response
    await booking.populate([
      {
        path: 'tourist',
        select: 'firstName lastName profileImage email'
      },
      {
        path: 'guide',
        select: 'firstName lastName profileImage email location'
      }
    ]);

    console.log('✅ New booking created:', booking._id);

    try {
      // Only run in server environment (not SSR)
      if (global.io) {
        global.io.to(`user-${guide._id}`).emit("booking-notification", {
          type: "new-booking",
          bookingId: booking._id,
          message: `New booking request from ${tourist.firstName} ${tourist.lastName}`,
          timestamp: new Date(),
          booking,
        });
        console.log(`📨 [API] Emitted booking-notification to guide user-${guide._id}`);
      } else {
        console.warn("⚠️ [API] global.io is not defined, cannot emit booking-notification");
      }
    } catch (emitErr) {
      console.error("❌ [API] Error emitting booking-notification:", emitErr);
    }

    return NextResponse.json({
      success: true,
      message: "Booking request sent successfully!",
      booking
    }, { status: 201 });

  } catch (error) {
    console.error('Booking creation error:', error);
    return NextResponse.json(
      { error: "Failed to create booking. Please try again." },
      { status: 500 }
    );
  }
}

// GET all bookings (with filtering)
export async function GET(request) {
  try {
    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = verifyToken(token);
    
    // Connect to database
    await dbConnect();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const role = searchParams.get('role') || decoded.role;

    // Build filter based on user role
    let filter = {};
    
    if (role === 'tourist') {
      filter.tourist = decoded.userId;
    } else if (role === 'guide') {
      filter.guide = decoded.userId;
    } else {
      // Admin can see all bookings
      // No additional filter needed
    }

    // Add status filter if provided
    if (status) {
      filter.status = status;
    }

    // Fetch bookings with populated data
    const bookings = await Booking.getBookingsWithDetails(filter);

    return NextResponse.json({
      success: true,
      bookings
    });

  } catch (error) {
    console.error('Failed to fetch bookings:', error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
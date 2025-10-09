import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { verifyToken } from '@/lib/auth';

// GET bookings for a specific guide
export async function GET(request, { params }) {
  try {
    // Await params
    const { guideId } = await params;
    
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
    
    // Authorization check - only the guide themselves or admin can view
    if (decoded.userId !== guideId && decoded.role !== 'admin') {
      return NextResponse.json(
        { error: "Unauthorized to view these bookings" },
        { status: 403 }
      );
    }

    // Connect to database
    await dbConnect();

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = parseInt(searchParams.get('skip') || '0');

    // Build filter with ObjectId
    const filter = { guide: new mongoose.Types.ObjectId(guideId) }; 
    if (status) {
      filter.status = status;
    }

    // Fetch bookings with populated tourist data
    const bookings = await Booking.find(filter)
      .populate('tourist', 'firstName lastName profileImage email phone country')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    // Get total count for pagination
    const totalCount = await Booking.countDocuments(filter);

    // Calculate statistics
    const stats = await Booking.aggregate([
      { $match: { guide: new mongoose.Types.ObjectId(guideId) } }, 
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const statusCounts = {
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0,
      declined: 0
    };

    stats.forEach(stat => {
      statusCounts[stat._id] = stat.count;
    });

    return NextResponse.json({
      success: true,
      bookings,
      totalCount,
      statusCounts,
      pagination: {
        limit,
        skip,
        hasMore: skip + limit < totalCount
      }
    });

  } catch (error) {
    console.error('Failed to fetch guide bookings:', error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import mongoose from 'mongoose';           
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { verifyToken } from '@/lib/auth';

// GET bookings for a specific tourist
export async function GET(request, { params }) {
  try {
    // Await params in App Router
    const { touristId } = await params;
    
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
    
    // Authorization check - only the tourist themselves or admin can view
    if (decoded.userId !== touristId && decoded.role !== 'admin') {
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

    // Build filter
    const filter = { tourist: new mongoose.Types.ObjectId(touristId) }; 
    if (status) {
      filter.status = status;
    }

    // Fetch bookings with populated guide data
    const bookings = await Booking.find(filter)
      .populate('guide', 'firstName lastName profileImage email phone location languages experience pricePerDay')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    // Get total count for pagination
    const totalCount = await Booking.countDocuments(filter);

    // Calculate statistics
    const stats = await Booking.aggregate([
      { $match: { tourist: new mongoose.Types.ObjectId(touristId) } }, 
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalSpent: { $sum: '$totalCost' }
        }
      }
    ]);

    // Prepare status counts
    const statusCounts = {
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0,
      declined: 0
    };

    let totalSpent = 0;

    stats.forEach(stat => {
      statusCounts[stat._id] = stat.count;
      if (stat._id === 'completed') {
        totalSpent = stat.totalSpent || 0;
      }
    });

    return NextResponse.json({
      success: true,
      bookings,
      totalCount,
      statusCounts,
      totalSpent,
      pagination: {
        limit,
        skip,
        hasMore: skip + limit < totalCount
      }
    });

  } catch (error) {
    console.error('Failed to fetch tourist bookings:', error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

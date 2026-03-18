import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';

export async function GET(req, { params }) {
  const { guideId } = await params;
  await dbConnect();

  try {
    // Fetch all 'completed' bookings for the guide
    const bookings = await Booking.find({ guide: guideId, status: 'completed' });

    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
    const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

    let totalEarnings = 0;
    let thisMonthTotal = 0;
    let lastMonthTotal = 0;

    bookings.forEach(booking => {
      const amount = booking.totalCost || 0;
      totalEarnings += amount;

      const createdAt = booking.createdAt || booking.updatedAt;
      const date = createdAt ? new Date(createdAt) : null;

      if (date) {
        if (date.getMonth() === thisMonth && date.getFullYear() === thisYear) {
          thisMonthTotal += amount;
        } else if (date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear) {
          lastMonthTotal += amount;
        }
      }
    });

    return NextResponse.json({
      thisMonth: thisMonthTotal,
      lastMonth: lastMonthTotal,
      totalEarnings
    });
  } catch (error) {
    console.error('Earnings API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch earnings.' }, { status: 500 });
  }
}

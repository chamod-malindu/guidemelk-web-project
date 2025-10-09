import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Booking from '@/models/Booking';
import Payment from '@/models/Payment';
import { NextResponse } from 'next/server';

export async function GET() {
  await dbConnect();

  // Get recent users (could be guides or tourists)
  const recentUsers = await User.find({})
    .sort({ createdAt: -1 })
    .limit(5)
    .lean()
    .select('firstName lastName role createdAt');
  const userEvents = recentUsers.map(u => ({
    date: u.createdAt,
    message: `New ${u.role} registered: ${u.firstName} ${u.lastName}`
  }));

  // Get recent bookings
  const recentBookings = await Booking.find({})
    .sort({ createdAt: -1 })
    .limit(5)
    .lean()
    .select('createdAt _id');
  const bookingEvents = recentBookings.map(b => ({
    date: b.createdAt,
    message: `Booking created: #${b._id.toString().slice(-6)}`
  }));

  // Get recent payments
  const recentPayments = await Payment.find({ status: 'completed' })
    .sort({ date: -1 })
    .limit(5)
    .lean()
    .select('date booking');
  const paymentEvents = recentPayments.map(p => ({
    date: p.date,
    message: `Payment processed for booking #${p.booking?.toString().slice(-6) || ''}`
  }));

  // Combine and sort by date descending
  const allEvents = [...userEvents, ...bookingEvents, ...paymentEvents];
  allEvents.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Return top N events
  return NextResponse.json(allEvents.slice(0, 10));
}

import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { NextResponse } from 'next/server';

export async function GET() {
  await dbConnect();
  const total = await Booking.countDocuments();
  return NextResponse.json({ total });
}

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  try {
    await dbConnect();

    // Find all users with role 'guide' - using correct field names from your schema
    const guides = await User.find({ role: 'guide' }).select(
      'firstName lastName profileImage location languages experience isEmailVerified specialties pricePerDay bio'
    );

    return NextResponse.json({ guides }, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch guides:', error);
    return NextResponse.json({ error: 'Failed to fetch guides' }, { status: 500 });
  }
}
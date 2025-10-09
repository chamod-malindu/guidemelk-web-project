import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { NextResponse } from 'next/server';

export async function GET(request) {
  await dbConnect();
  const url = new URL(request.url);
  const role = url.searchParams.get('role');
  const active = url.searchParams.get('active');

  const filter = {};
  if (role) filter.role = role;
  if (active === 'true') filter.isBlocked = false;

  const total = await User.countDocuments(filter);
  return NextResponse.json({ total });
}

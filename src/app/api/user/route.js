import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request) {
  await dbConnect();

  try {
    const url = new URL(request.url);
    const role = url.searchParams.get('role'); // e.g. 'tourist' or 'guide'

    if (!role) {
      return NextResponse.json({ success: false, error: '"role" query param is required' }, { status: 400 });
    }

    const users = await User.find({ role }).lean();

    return NextResponse.json({ success: true, users }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

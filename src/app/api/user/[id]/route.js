import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function PATCH(request, { params }) {
  await dbConnect();
  const userId = params.id;

  try {
    const body = await request.json();
    const { action } = body;

    const updateFields = {};

    if (action === 'block') {
      updateFields.isBlocked = true;
      updateFields.status = 'inactive';
    } else if (action === 'unblock') {
      updateFields.isBlocked = false;
      updateFields.status = 'active';
    } else if (action === 'activate') {
      updateFields.status = 'active';
    } else if (action === 'deactivate') {
      updateFields.status = 'inactive';
    } else {
      return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }

    const user = await User.findByIdAndUpdate(userId, updateFields, { new: true }).lean();
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

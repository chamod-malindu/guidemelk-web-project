import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    await dbConnect();

    // Auth: get token from cookie
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Decode token
    const decoded = verifyToken(token);
    if (decoded.role !== "guide") {
      return NextResponse.json({ error: 'Forbidden: Only guides can update profile image' }, { status: 403 });
    }

    const userId = decoded.userId;

    // Read file from form-data
    const formData = await request.formData();
    const file = formData.get('file');
    if (!file) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary
    let imageUrl;
    try {
      imageUrl = await uploadToCloudinary(buffer, `guide_${userId}_${Date.now()}`);
    } catch (err) {
      console.error('Profile image upload failed:', err);
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }

    // Update User profileImage
    await User.findByIdAndUpdate(userId, { profileImage: imageUrl });

    return NextResponse.json({ success: true, imageUrl });

  } catch (error) {
    console.error('Error in POST /api/guide/profileImage:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

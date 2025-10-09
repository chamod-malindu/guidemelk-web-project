import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

/**
 * POST /api/guide/profileImage
 * Uploads guide profile image to Cloudinary and updates MongoDB
 */
export async function POST(request) {
  try {
    // Connect to database
    await dbConnect();

    // Get token from cookies for authentication
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Decode token and check role
    const decoded = verifyToken(token);
    if (decoded.role !== 'guide') {
      return NextResponse.json({ error: 'Only guides can upload here' }, { status: 403 });
    }
    const userId = decoded.userId;

    // Read incoming form-data
    const formData = await request.formData();
    const file = formData.get('file');
    if (!file) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }

    // Convert to buffer for Cloudinary upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary
    let imageUrl;
    try {
      imageUrl = await uploadToCloudinary(
        buffer,
        `guide_${userId}_${Date.now()}`
      );
    } catch (err) {
      console.error('Guide profile image upload failed:', err);
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }

    // Save profileImage URL in DB
    await User.findByIdAndUpdate(userId, { profileImage: imageUrl });

    // Respond with new image URL
    return NextResponse.json({ success: true, imageUrl });

  } catch (error) {
    console.error('Error in POST /api/guide/profileImage:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

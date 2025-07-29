import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  await dbConnect();

  // Auth: get user from cookie
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const decoded = verifyToken(token);
  const userId = decoded.userId;

  // Read image from form-data
  const formData = await request.formData();
  const file = formData.get('file');
  if (!file) {
    return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
  }

  // Convert file (Blob) to buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Upload to Cloudinary
  let imageUrl;
  try {
    imageUrl = await uploadToCloudinary(
      buffer,
      `tourist_${userId}_${Date.now()}`
    );
  } catch (err) {
    console.error('Upload failed', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }

  // Update user profileImage in MongoDB
  await User.findByIdAndUpdate(userId, { profileImage: imageUrl });

  return NextResponse.json({ imageUrl });
}

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import GuideImage from '@/models/GuideImage';

export async function GET(request, { params }) {
  try {
    await dbConnect();

    const images = await GuideImage.find({ guide: params.id }).select('url description').sort({ uploadedAt: -1 });

    return NextResponse.json({ images });
  } catch (error) {
    console.error('Failed to fetch guide gallery:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

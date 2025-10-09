import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Review from '@/models/Review';

export async function GET(request, { params }) {
  try {
    await dbConnect();

    const reviews = await Review.find({ guide: params.id })
      .sort({ createdAt: -1 })
      .populate('tourist', 'firstName') // optional, to get tourist's name
      .lean();

    // Map reviews with touristName
    const reviewsWithNames = reviews.map((rev) => ({
      ...rev,
      touristName: rev.tourist?.firstName || "Tourist"
    }));

    return NextResponse.json({ reviews: reviewsWithNames });
  } catch (error) {
    console.error('Failed to fetch guide reviews:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

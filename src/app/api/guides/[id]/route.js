import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import GuideImage from '@/models/GuideImage';
import Review from '@/models/Review';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

export async function GET(request, context) {
  try {
    await dbConnect();

    const params = await context.params;  // <-- KEY LINE
    const { id } = params;

    let objectId;
    try {
      objectId = new mongoose.Types.ObjectId(id);
    } catch (err) {
      return NextResponse.json({ error: 'Invalid guide ID' }, { status: 400 });
    }

    const guide = await User.findOne({ _id: objectId, role: 'guide' }).select(
      'firstName lastName profileImage location languages experience isEmailVerified specialties pricePerDay bio'
    );

    if (!guide) {
      return NextResponse.json({ error: 'Guide not found' }, { status: 404 });
    }

    const images = await GuideImage.find({ guide: objectId }).sort({ uploadedAt: -1 }).catch(() => []);
    const reviews = await Review.find({ guide: objectId })
      .populate('tourist', 'firstName lastName profileImage')
      .sort({ createdAt: -1 })
      .catch(() => []);

    const averageRating = reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

    return NextResponse.json({
      guide: {
        ...guide.toObject(),
        gallery: images.map(img => ({
          url: img.url,
          description: img.description,
          title: img.description || 'Tour Photo',
        })),
        reviews: reviews.map(review => ({
          name: `${review.tourist.firstName} ${review.tourist.lastName}`,
          avatar: review.tourist.profileImage,
          rating: review.rating,
          text: review.text,
          date: new Date(review.createdAt).toLocaleDateString(),
          tourType: 'General Tour',
        })),
        rating: averageRating,
        totalReviews: reviews.length,
      },
    });
  } catch (error) {
    console.error('Error in GET /api/guides/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

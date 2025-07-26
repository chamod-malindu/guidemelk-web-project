import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import GuideImage from '@/models/GuideImage';
import Review from '@/models/Review';
import mongoose from 'mongoose';

export async function GET(request, { params }) {
  try {
    await dbConnect();

    // Convert string ID to ObjectId
    let objectId;
    try {
      objectId = new mongoose.Types.ObjectId(params.id);
    } catch (err) {
      return NextResponse.json({ error: 'Invalid guide ID' }, { status: 400 });
    }

    // Fetch guide data with correct field names from your schema
    const guide = await User.findOne({ _id: objectId, role: 'guide' }).select(
      'firstName lastName profileImage location languages experience isEmailVerified specialties pricePerDay bio'
    );

    if (!guide) {
      return NextResponse.json({ error: 'Guide not found' }, { status: 404 });
    }

    // Fetch guide images (if GuideImage collection exists)
    let images = [];
    try {
      images = await GuideImage.find({ guide: objectId }).sort({ uploadedAt: -1 });
    } catch (err) {
      console.log('GuideImage collection not found or error fetching images:', err.message);
    }

    // Fetch reviews with tourist details (if Review collection exists)
    let reviews = [];
    try {
      reviews = await Review.find({ guide: objectId })
        .populate('tourist', 'firstName lastName profileImage')
        .sort({ createdAt: -1 });
    } catch (err) {
      console.log('Review collection not found or error fetching reviews:', err.message);
    }

    // Calculate average rating
    const averageRating = reviews.length > 0 
      ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
      : 0;

    // Format the response
    const guideData = {
      ...guide.toObject(),
      gallery: images.map(img => ({
        url: img.url,
        description: img.description,
        title: img.description || 'Tour Photo'
      })),
      reviews: reviews.map(review => ({
        name: `${review.tourist.firstName} ${review.tourist.lastName}`,
        avatar: review.tourist.profileImage,
        rating: review.rating,
        text: review.text,
        date: new Date(review.createdAt).toLocaleDateString(),
        tourType: 'General Tour' // You can add this field to Review schema if needed
      })),
      rating: averageRating,
      totalReviews: reviews.length
    };

    return NextResponse.json({ guide: guideData });
  } catch (error) {
    console.error('Failed to fetch guide profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
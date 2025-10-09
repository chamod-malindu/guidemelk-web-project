import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import GuideImage from "@/models/GuideImage";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";
import mongoose from "mongoose";

// Force dynamic rendering - prevents static generation and caching
export const dynamic = "force-dynamic";

export const maxDuration = 30; // Set 30 second timeout for file upload operations
export const runtime = 'nodejs'; // Use Node.js runtime (supports file operations and Buffer)

// GET: Fetch guide's gallery images
export async function GET(request, context) {
  try {
    // Connect to MongoDB database
    await dbConnect();

    // Extract guide ID from dynamic route parameters [id]
    const { id } = await context.params;

    // Query all images for this guide, sorted by most recent first
    const images = await GuideImage.find({ guide: id }).sort({ uploadedAt: -1 });
    
    // Return images as JSON response
    return NextResponse.json({ images });
  } catch (error) {
    // Log error for debugging purposes
    console.error("Error fetching gallery:", error);
    // Return 500 Internal Server Error response
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST: Upload new image to guide's gallery
export async function POST(request, context) {
  try {
    // Connect to MongoDB database
    await dbConnect();

    // Extract guide ID from dynamic route parameters [id]
    const { id } = await context.params;

    // Convert string ID to MongoDB ObjectId format
    let guideObjectId;
    try {
      guideObjectId = new mongoose.Types.ObjectId(id);
    } catch {
      // Return 400 Bad Request if ID format is invalid
      return NextResponse.json({ error: "Invalid guide ID" }, { status: 400 });
    }

    // Authentication: Get JWT token from HTTP-only cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      // Return 401 Unauthorized if no token found
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify and decode JWT token to get user information
    const decoded = verifyToken(token);

    // Authorization: Only allow admins or the guide owner to upload images
    if (decoded.role !== "admin" && decoded.userId !== id) {
      // Return 403 Forbidden if user lacks permission
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Verify the guide exists in database and has role "guide"
    const guide = await User.findOne({ _id: guideObjectId, role: "guide" });
    if (!guide) {
      // Return 404 Not Found if guide doesn't exist
      return NextResponse.json({ error: "Guide not found" }, { status: 404 });
    }

    // Parse multipart form data (Next.js handles large files in App Router)
    const formData = await request.formData();
    const file = formData.get("file");
    const description = formData.get("description") || "";

    // Validate that a file was provided
    if (!file) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }

    // Manual file size validation (8MB limit)
    const MAX_FILE_SIZE = 8 * 1024 * 1024; // Convert 8MB to bytes
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ 
        error: `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB` 
      }, { status: 400 });
    }

    // Validate file type - only allow common image formats
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: "Invalid file type. Only JPEG, PNG, and WebP are allowed" 
      }, { status: 400 });
    }

    // Convert File object to Buffer for Cloudinary upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload image to Cloudinary with unique filename
    let imageUrl;
    try {
      // Generate unique filename using guide ID and timestamp
      const uniqueFilename = `guide_gallery_${id}_${Date.now()}`;
      imageUrl = await uploadToCloudinary(buffer, uniqueFilename);
    } catch (err) {
      // Log Cloudinary upload error for debugging
      console.error("Cloudinary upload failed:", err);
      // Return 500 Internal Server Error if upload fails
      return NextResponse.json({ error: "Image upload failed" }, { status: 500 });
    }

    // Save image metadata to database
    const guideImage = new GuideImage({
      guide: guideObjectId,        // Reference to guide document
      url: imageUrl,               // Cloudinary URL
      description,                 // Optional description from form
      uploadedAt: new Date(),      // Timestamp for sorting/tracking
    });

    // Save to MongoDB database
    await guideImage.save();

    // Return success response with image details
    return NextResponse.json({
      success: true,
      image: {
        url: guideImage.url,
        description: guideImage.description,
        uploadedAt: guideImage.uploadedAt,
      },
    });
  } catch (error) {
    // Log any unexpected errors for debugging
    console.error("Error in POST /api/guides/[id]/gallery:", error);
    // Return 500 Internal Server Error for any unhandled exceptions
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
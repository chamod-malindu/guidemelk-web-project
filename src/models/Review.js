// src/models/Review.js
import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  guideId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  touristId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  rating: { type: Number, 
    required: true 
  },
  review: { 
    type: String 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

export default mongoose.models.Review || mongoose.model("Review", reviewSchema);

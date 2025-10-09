const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  booking: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Booking", 
    required: true,
    unique: true // One review per booking
  },
  guide: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  tourist: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  rating: { 
    type: Number, 
    required: true,
    min: 1,
    max: 5
  },
  comment: { 
    type: String, 
    default: "" 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, { 
  toJSON: { virtuals: true }, 
  toObject: { virtuals: true } 
});


module.exports = mongoose.models.Review || mongoose.model("Review", ReviewSchema);

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstName : { 
    type: String,
    required: true,
    trim: true 
  },
  lastName : { 
    type: String,
    required: true,
    trim: true 
  },
  email : { 
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), // Validate email format with regex
      message: "Invalid email format"
    } 
  },
  password : {
     type: String
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  role : {
    type: String,
    enum: ['guide', 'tourist', 'admin'],
    required: true
  },
  googleId : {
    type: String
  },
  isEmailVerified : {
    type: Boolean,
    default: false
  },
  emailVerifiedAt: {
    type: Date,
    default: null
  },  
  profileImage : {
    type: String,
    default: 'https://cdn-icons-png.flaticon.com/512/147/147144.png'
  },
  location: String,
  languages: [String],
  experience: Number,
  specialties: [String],
  pricePerDay: Number,
  bio: String,
  status: { 
    type: String, 
    enum: ['active', 'inactive'], 
    default: 'active' 
  },  
  country: String,
  unavailableDates: [String], // YYYY-MM-DD strings for guide unavailability
  isBlocked : {
    type: Boolean,
    default: false 
  }
},
  {
    timestamps: true // Automatically adds createdAt and updatedAt fields
  });


export default mongoose.models.User || mongoose.model('User', userSchema);

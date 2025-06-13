import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstName : { 
    type: String,
    required: true 
  },
  lastName : { 
    type: String,
    required: true 
  },
  email : { 
    type: String,
    required: true,
    unique: true 
  },
  password : {
     type: String
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
  country: String,
  isBlocked : {
    type: Boolean,
    default: false 
  },
  createdAt : {
    type: Date,
    default: Date.now
  },
  updatedAt : {type: Date,
    default: Date.now
  }
});

export default mongoose.models.User || mongoose.model('User', userSchema);

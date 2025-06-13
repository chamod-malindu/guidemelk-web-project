import mongoose from 'mongoose';

const guideImageSchema = new mongoose.Schema({
  guide : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  url : {
    type: String,
    required: true
  },
  description : String,
  uploadedAt : {
    type : Date,
    default : Date.now
  }
});

export default mongoose.models.GuideImage || mongoose.model('GuideImage', guideImageSchema);

import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  tourist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  guide: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    required: true,
    min: 1
  },
  destinations: [{
    type: String,
    required: true
  }],
  groupSize: {
    type: Number,
    required: true,
    min: 1,
    max: 20
  },
  specialRequests: {
    type: String,
    default: ''
  },
  totalCost: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'declined'],
    default: 'pending'
  },
  declineReason: {
    type: String,
    default: ''
  },
  completedAt: Date,
  cancelledAt: Date,

  // Process tracking fields
  processSteps: [{
    step: {
      type: String,
      enum: ['Request Received', 'Under Review', 'Confirmed', 'Tour Completed', 'Payment Processed']
    },
    completed: {
      type: Boolean,
      default: false
    },
    completedAt: Date
  }],

  // Internal notes by guide
  notes: {
    type: String,
    default: ''
  },

  /**
   * === ADVANCE PAYMENT FIELDS ===
   */
  advanceAmount: {
    type: Number,
    default: 0 // e.g. 20% of totalCost
  },
  advancePaidAt: {
    type: Date
  },
  paymentTransactionId: { // advance payment transaction id
    type: String
  },

  /**
   * === REMAINING PAYMENT FIELDS ===
   */
  remainingAmount: {
    type: Number,
    default: 0 // totalCost - advanceAmount
  },
  remainingPaidAt: {
    type: Date
  },
  remainingPaymentTransactionId: {
    type: String 
  },

  /**
   * Payment status for the whole booking
   * 'pending'   - nothing paid yet
   * 'partial'   - advance paid but not full
   * 'processed' - full payment received
   * 'refunded'  - refunded
   */
  paymentStatus: {
    type: String,
    enum: ['pending', 'partial', 'processed', 'refunded'],
    default: 'pending'
  }

}, {
  timestamps: true
});

// Initialize process steps when booking is created
BookingSchema.pre('save', function (next) {
  if (this.isNew && (!this.processSteps || this.processSteps.length === 0)) {
    this.processSteps = [
      {
        step: 'Request Received',
        completed: true,
        completedAt: new Date()
      },
      {
        step: 'Under Review',
        completed: false
      },
      {
        step: 'Confirmed',
        completed: false
      },
      {
        step: 'Tour Completed',
        completed: false
      },
      {
        step: 'Payment Processed',
        completed: false
      }
    ];
  }
  next();
});

// Method to update process step
BookingSchema.methods.updateProcessStep = function (stepName, completed = true) {
  const step = this.processSteps.find(s => s.step === stepName);
  if (step) {
    step.completed = completed;
    if (completed) {
      step.completedAt = new Date();
    }
  }
};

// Static method to get bookings with populated data
BookingSchema.statics.getBookingsWithDetails = function (filter = {}) {
  return this.find(filter)
    .populate('tourist', 'firstName lastName profileImage email phone country')
    .populate('guide', 'firstName lastName profileImage email phone location languages experience')
    .sort({ createdAt: -1 });
};

export default mongoose.models.Booking || mongoose.model('Booking', BookingSchema);

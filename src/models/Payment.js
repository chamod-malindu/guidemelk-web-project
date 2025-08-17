import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
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
    booking: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Booking", 
      required: true 
    },
    date: { 
      type: Date, 
      default: Date.now 
    },
    amount: { 
      type: Number, 
      required: true 
    },
    commission: { 
      type: Number, 
      default: 0 
    },
    netEarnings: { 
      type: Number, 
      required: true 
    },
    status: { 
      type: String, 
      enum: ["pending", "completed", "failed"], 
      default: "pending" 
    },
    method: { 
      type: String, 
      enum: ["card", "bank", "paypal"], 
      required: true 
    },
    transactionId: { 
      type: String 
    },
    currency: { 
      type: String, 
      default: "USD" 
    }
  },
  { timestamps: true }
);

export default mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);

const mongoose = require("mongoose");

// Records every payment so you have an audit trail.
const paymentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["single", "package"], required: true },
    college: { type: mongoose.Schema.Types.ObjectId, ref: "College" }, // only for "single"
    amount: { type: Number, required: true }, // in paise
    razorpayOrderId: { type: String, required: true },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    status: {
      type: String,
      enum: ["created", "paid", "failed"],
      default: "created",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);

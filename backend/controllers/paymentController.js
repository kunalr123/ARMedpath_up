const crypto = require("crypto");
const Razorpay = require("razorpay");
const Payment = require("../models/Payment");
const User = require("../models/User");
const College = require("../models/College");

// Create a Razorpay instance only if keys are configured.
const keysConfigured =
  process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET;

const razorpay = keysConfigured
  ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  : null;

const SINGLE_PRICE = Number(process.env.SINGLE_COLLEGE_PRICE || 6500); // 65 INR
const PACKAGE_PRICE = Number(process.env.FULL_PACKAGE_PRICE || 60000); // 600 INR

// POST /api/payment/create-order
// body: { type: "single" | "package", collegeId?: string }
const createOrder = async (req, res) => {
  try {
    const { type, collegeId } = req.body;
    if (!["single", "package"].includes(type)) {
      return res.status(400).json({ message: "Invalid payment type" });
    }

    let amount = type === "single" ? SINGLE_PRICE : PACKAGE_PRICE;

    // Validate college for single purchase.
    if (type === "single") {
      if (!collegeId) {
        return res.status(400).json({ message: "collegeId is required" });
      }
      const college = await College.findById(collegeId);
      if (!college) {
        return res.status(404).json({ message: "College not found" });
      }
      // Already unlocked? No need to pay again.
      const already = req.user.unlockedColleges.some(
        (id) => id.toString() === collegeId
      );
      if (already || req.user.hasFullPackage) {
        return res.status(400).json({ message: "You already have access" });
      }
    }

    if (type === "package" && req.user.hasFullPackage) {
      return res.status(400).json({ message: "You already own the package" });
    }

    // ---- DEMO MODE (no Razorpay keys) ----
    // Lets you test the whole flow without real payments.
    if (!razorpay) {
      const payment = await Payment.create({
        user: req.user._id,
        type,
        college: type === "single" ? collegeId : undefined,
        amount,
        razorpayOrderId: "demo_" + Date.now(),
        status: "created",
      });
      return res.json({
        demo: true,
        orderId: payment.razorpayOrderId,
        amount,
        currency: "INR",
        paymentRecordId: payment._id,
      });
    }

    // ---- REAL MODE ----
    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: "rcpt_" + Date.now(),
    });

    const payment = await Payment.create({
      user: req.user._id,
      type,
      college: type === "single" ? collegeId : undefined,
      amount,
      razorpayOrderId: order.id,
      status: "created",
    });

    res.json({
      demo: false,
      key: process.env.RAZORPAY_KEY_ID,
      orderId: order.id,
      amount,
      currency: "INR",
      paymentRecordId: payment._id,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// POST /api/payment/verify
// Real mode body: { razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentRecordId }
// Demo mode body: { paymentRecordId, demo: true }
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      paymentRecordId,
      demo,
    } = req.body;

    const payment = await Payment.findById(paymentRecordId);
    if (!payment || payment.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Payment record not found" });
    }

    // ---- DEMO MODE ----
    if (demo || !razorpay) {
      payment.status = "paid";
      await payment.save();
      await grantAccess(req.user._id, payment);
      return res.json({ success: true, message: "Demo payment successful" });
    }

    // ---- REAL MODE: verify signature ----
    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (expected !== razorpay_signature) {
      payment.status = "failed";
      await payment.save();
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature;
    payment.status = "paid";
    await payment.save();

    await grantAccess(req.user._id, payment);
    res.json({ success: true, message: "Payment verified successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Grants the purchased access to the user.
const grantAccess = async (userId, payment) => {
  const user = await User.findById(userId);
  if (payment.type === "package") {
    user.hasFullPackage = true;
  } else if (payment.type === "single" && payment.college) {
    const has = user.unlockedColleges.some(
      (id) => id.toString() === payment.college.toString()
    );
    if (!has) user.unlockedColleges.push(payment.college);
  }
  await user.save();
};

module.exports = { createOrder, verifyPayment };

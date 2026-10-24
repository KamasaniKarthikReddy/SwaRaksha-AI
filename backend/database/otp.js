const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    index: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // Document expires automatically in MongoDB after 5 minutes
  },
  attempts: {
    type: Number,
    default: 0,
  },
});

const OTP = mongoose.model("OTP", otpSchema);
module.exports = OTP;

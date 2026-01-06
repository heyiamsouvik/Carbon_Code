const mongoose = require("mongoose");

const HistorySchema = new mongoose.Schema({
  language: String,
  code: String,
  metrics: Object,
  optimizedCode: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  isVerified: { type: Boolean, default: false },
  otp: String,
  otpExpiry: Date,
  resetOtp: String,
  resetOtpExpiry: Date,

  
  history: {
    type: [HistorySchema],
    default: []
  }
});

module.exports = mongoose.model("User", userSchema);
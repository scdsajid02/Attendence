import mongoose from "mongoose";

const adminOtpSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true},
  otp: {
    type: String,
    required: true,
  },
  expireAt: {
    type: Date,
    required: true,
  },
});

// TTL index to auto-delete OTP documents once expired
adminOtpSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

const AdminOtpModel =
  mongoose.models.AdminOtp || mongoose.model("AdminOtp", adminOtpSchema);

export default AdminOtpModel;

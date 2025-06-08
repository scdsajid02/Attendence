import mongoose from "mongoose";

const employeeOtpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  otp: {
    type: String,
    required: true,
  },
  expireAt: {
    type: Date,
    required: true,
  },
});

// TTL index: auto-delete OTPs after expiry
employeeOtpSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

const EmployeeOtpModel =
  mongoose.models.EmployeeOtp ||
  mongoose.model("EmployeeOtp", employeeOtpSchema);

export default EmployeeOtpModel;

import employeeModel from "../models/EmployeeModel.js";
import transporter from "../config/nodemailer.js";
import EmployeeOtpModel from "../models/Employeelogin.js";
import jwt from "jsonwebtoken";
export const sendEmployeeOtp = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if email exists in employeeModel
    const employee = await employeeModel.findOne({ email });
    if (!employee) {
      return res.json({ success: false, message: "Email not found please contact admin" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const expireAt = Date.now() + 10 * 60 * 1000;

    await EmployeeOtpModel.findOneAndUpdate(
      { email },
      { otp, expireAt },
      { upsert: true, new: true }
    );

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Employee Login OTP",
      html: `Your OTP is <b>${otp}</b>. It will expire in 10 minutes.`,
    });

    res.json({ success: true, message: "OTP sent to email" });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

export const EmployeeVerifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.json({ success: false, message: "Email and OTP required" });
    }

    // Find OTP record for this email
    const otpRecord = await EmployeeOtpModel.findOne({ email });

    if (!otpRecord) {
      return res.json({
        success: false,
        message: "OTP not found, request a new one",
      });
    }

    // Check if OTP matches
    if (otpRecord.otp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    // Check if OTP expired
    if (otpRecord.expireAt < Date.now()) {
      return res.json({
        success: false,
        message: "OTP expired, request a new one",
      });
    }

    // OTP valid, generate JWT token
    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET
      // token valid for 7 days or choose no expiry if you want
    );

    // Optionally, clear OTP from DB after verification
    await EmployeeOtpModel.deleteOne({ email });

    res.json({
      success: true,
      message: "OTP verified successfully",
      token,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getEmployeeDetails = async (req, res) => {
  try {
    const email = req.email; // This should come from JWT via verifyToken middleware

    const employee = await employeeModel.findOne({ email });

    if (!employee) {
      return res.json({ success: false, message: "Employee not found" });
    }

    res.json({ success: true, data: employee });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
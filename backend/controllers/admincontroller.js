import jwt from "jsonwebtoken";
import transporter from "../config/nodemailer.js";
import AdminOtpModel from "../models/AdminLogin.js";

export const sendVerifyOtp = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if entered email matches admin email in env
    if (email !== process.env.ADMIN_EMAIL) {
      return res.json({ success: false, message: "Unauthorized email" });
    }

    // Here, instead of userModel, you might have an in-memory store or DB collection for OTP
    // For simplicity, let's assume you have an AdminOtp model or an object to save OTPs
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const expireAt = Date.now() + 10 * 60 * 1000; // OTP valid for 10 mins

    // Save OTP and expiry — example with a hypothetical model or cache
    await AdminOtpModel.findOneAndUpdate(
      { email },
      { otp, expireAt },
      { upsert: true, new: true }
    );

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Admin Verification OTP",
      html: `Your OTP is <b>${otp}</b>. It will expire in 10 minutes.`,
    };

    await transporter.sendMail(mailOption);

    res.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.json({ success: false, message: "Email and OTP required" });
    }

    // Find OTP record for this email
    const otpRecord = await AdminOtpModel.findOne({ email });

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
      process.env.JWT_SECRET,
      // token valid for 7 days or choose no expiry if you want
    );

    // Optionally, clear OTP from DB after verification
    await AdminOtpModel.deleteOne({ email });

    res.json({
      success: true,
      message: "OTP verified successfully",
      token,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

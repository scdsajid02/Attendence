import express from "express";

import { sendVerifyOtp, verifyOtp } from "../controllers/admincontroller.js";


const authRouter = express.Router();

authRouter.post("/send-verify-otp", sendVerifyOtp);
authRouter.post("/verify-account", verifyOtp);

export default authRouter
import express from "express";

import {
  sendEmployeeOtp,
  EmployeeVerifyOtp,
  getEmployeeDetails,
} from "../controllers/employeelogin.js";
import { verifyToken } from "../middleware/EmployeeAuth.js";

const employeeAuthRouter = express.Router();

employeeAuthRouter.post("/send-verify-otp", sendEmployeeOtp);
employeeAuthRouter.post("/verify-account", EmployeeVerifyOtp);
employeeAuthRouter.get("/get-employee",verifyToken,getEmployeeDetails)
export default employeeAuthRouter;

import adminAuth from "../middleware/Adminauth.js";
import express from "express";
import {
  getAttendanceByDate,
  markAttendance,
} from "../controllers/attendececontroller.js";
import { getAttendanceByMonth} from "../controllers/monthcontroller.js";
const attendanceRoute = express.Router();

// Get attendance for a specific date (query param ?date=YYYY-MM-DD)
attendanceRoute.get("/by-date", adminAuth, getAttendanceByDate);

// Mark or update attendance (expects { employeeId, date, status } in body)
attendanceRoute.post("/mark", adminAuth, markAttendance);
attendanceRoute.get("/get-by-month", getAttendanceByMonth);


export default attendanceRoute;

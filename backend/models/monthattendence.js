// monthattendence.js
import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // or "employee" depending on your actual User model
      required: true,
    },
    date: {
      type: Date, // CHANGE THIS TO Date type
      required: true,
    },
    status: {
      type: String,
      enum: ["Present", "Absent", "CL"],
      required: true,
    },
  },
  { timestamps: true }
);

const Attendance = mongoose.model("EmployeeAttendance", attendanceSchema);
export default Attendance;

import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "employee",
    required: true,
  },
  date: { type: Date, required: true },
  status: {
    type: String,
    enum: ["present", "absent", "cl"], // you can add more statuses if needed
    required: true,
  },
});

attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true }); // To prevent multiple records for same date

const attendanceModel =
  mongoose.models.attendance || mongoose.model("attendance", attendanceSchema);

export default attendanceModel;

import mongoose from "mongoose";
import attendanceModel from "../models/AttendenceModel.js"; // ← use correct model

export const getAttendanceByMonth = async (req, res) => {
  try {
    const { employeeId, year, month } = req.query;

    if (!employeeId || !year || !month) {
      return res
        .status(400)
        .json({ success: false, message: "Missing parameters" });
    }

    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid employeeId" });
    }

    const employeeObjectId = new mongoose.Types.ObjectId(employeeId);

    const yearNum = parseInt(year, 10);
    const monthNum = parseInt(month, 10) - 1; // JS month: 0 = Jan

    const startDate = new Date(yearNum, monthNum, 1);
    const endDate = new Date(yearNum, monthNum + 1, 1);

    const records = await attendanceModel.find({
      employeeId: employeeObjectId,
      date: { $gte: startDate, $lt: endDate },
    });

    const formatted = records.map((r) => ({
      date: r.date.toISOString().split("T")[0],
      status: r.status,
    }));

    return res.json({ success: true, data: formatted });
  } catch (error) {
    console.error("getAttendanceByMonth error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

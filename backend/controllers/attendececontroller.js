import attendanceModel from "../models/AttendenceModel.js";
import employeeModel from "../models/EmployeeModel.js";

// Get attendance for a given date with employee details
export const getAttendanceByDate = async (req, res) => {
  try {
    const { date } = req.query; // date should be sent as query param in ISO format 'YYYY-MM-DD'

    if (!date) {
      return res
        .status(400)
        .json({ success: false, message: "Date is required" });
    }

    // Parse date to start of day for consistent querying
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    // Get all employees
    const employees = await employeeModel.find();

    // Get attendance records for that date
    const attendanceRecords = await attendanceModel.find({
      date: { $gte: startDate, $lte: endDate },
    });

    // Map attendance by employeeId for quick lookup
    const attendanceMap = {};
    attendanceRecords.forEach((att) => {
      attendanceMap[att.employeeId.toString()] = att.status;
    });

    // Build response: each employee with their attendance status or null if not marked yet
    const data = employees.map((emp) => ({
      _id: emp._id,
      name: emp.name,
      email: emp.email,
      employeeId: emp.employeeId,
      clLeft: emp.clLeft,
      attendanceStatus: attendanceMap[emp._id.toString()] || null,
    }));

    res.json({ success: true, data });
  } catch (error) {
    console.error("Get Attendance Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Mark or update attendance for a specific employee on a date
export const markAttendance = async (req, res) => {
  try {
    const { attendance } = req.body;

    if (!Array.isArray(attendance) || attendance.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Attendance data is missing or invalid",
      });
    }

    for (const record of attendance) {
      const { employeeId, date, status } = record;

      if (!employeeId || !date || !status) {
        return res.status(400).json({
          success: false,
          message: "Missing fields in attendance record",
        });
      }

      const attendanceDate = new Date(date);
      attendanceDate.setHours(0, 0, 0, 0);

      const existingRecord = await attendanceModel.findOne({
        employeeId,
        date: attendanceDate,
      });

      const employee = await employeeModel.findById(employeeId);
      if (!employee) continue;

      if (existingRecord) {
        if (existingRecord.status === "cl" && status !== "cl") {
          employee.clLeft += 1;
        }

        if (existingRecord.status !== "cl" && status === "cl") {
          if (employee.clLeft <= 0) continue;
          employee.clLeft -= 1;
        }

        existingRecord.status = status;
        await existingRecord.save();
        await employee.save();
      } else {
        if (status === "cl" && employee.clLeft <= 0) continue;

        if (status === "cl") {
          employee.clLeft -= 1;
          await employee.save();
        }

        await attendanceModel.create({
          employeeId,
          date: attendanceDate,
          status,
        });
      }
    }

    return res.json({
      success: true,
      message: "Attendance saved successfully",
    });
  } catch (error) {
    console.error("Mark Attendance Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
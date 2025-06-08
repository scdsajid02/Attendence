// controllers/holidayController.js
import Holiday from "../models/holidayModel.js";

// Get all holidays
export const getHolidays = async (req, res) => {
  try {
    const holidays = await Holiday.find().select("date -_id").sort({ date: 1 });
    const holidayDates = holidays.map((h) => h.date);
    res.json({ success: true, data: holidayDates });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add a holiday
export const addHoliday = async (req, res) => {
  try {
    const { date } = req.body;
    if (!date)
      return res
        .status(400)
        .json({ success: false, message: "Date is required" });

    // Check if already holiday
    const exists = await Holiday.findOne({ date });
    if (exists)
      return res
        .status(400)
        .json({ success: false, message: "Date already marked as holiday" });

    const holiday = new Holiday({ date });
    await holiday.save();

    res.json({ success: true, message: "Holiday added", data: date });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Remove a holiday
export const removeHoliday = async (req, res) => {
  try {
    const { date } = req.params;
    if (!date)
      return res
        .status(400)
        .json({ success: false, message: "Date param required" });

    const deleted = await Holiday.findOneAndDelete({ date });
    if (!deleted)
      return res
        .status(404)
        .json({ success: false, message: "Holiday not found" });

    res.json({ success: true, message: "Holiday removed", data: date });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

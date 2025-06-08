// models/holidayModel.js
import mongoose from "mongoose";

const holidaySchema = new mongoose.Schema({
  date: {
    type: String, // store date as string in "YYYY-MM-DD" format
    required: true,
    unique: true,
  },
});

const Holiday =
  mongoose.models.Holiday || mongoose.model("Holiday", holidaySchema);
export default Holiday;

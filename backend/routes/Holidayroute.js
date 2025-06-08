import express from "express";
import { getHolidays,addHoliday,removeHoliday } from "../controllers/holidaycontroller.js";
import adminAuth from "../middleware/Adminauth.js";
const holidayrouter = express.Router();

holidayrouter.get("/get-holiday", getHolidays);
holidayrouter.post("/add-holiday",adminAuth, addHoliday);
holidayrouter.delete("/:date",adminAuth, removeHoliday);

export default holidayrouter;

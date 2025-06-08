import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/AdminLogin.js";
import employeeRouter from "./routes/Employee.js";
import employeeAuthRouter from "./routes/Employeelogin.js";
import holidayrouter from "./routes/Holidayroute.js";
import attendanceRoute from "./routes/AttendenceRoute.js";
const app = express();

const port = process.env.PORT || 4000;
connectDB();
const allowedOrigins = ["https://attendence-frontend-eight.vercel.app","https://attendence-admin.vercel.app"];
app.use(express.json());
app.use(cors({ origin: allowedOrigins, credentials: true }));

app.use("/api/auth", authRouter);
app.use('/api/employee',employeeRouter)
app.use('/api/employeeAuth',employeeAuthRouter)
app.use('/api/holiday',holidayrouter)
app.use('/api/attendence',attendanceRoute)
app.get("/", (req, res) => {
  res.send("API  WORKING");
});

app.listen(port, () => console.log("server started on port :" + port));
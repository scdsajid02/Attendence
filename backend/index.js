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
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRouter);
app.use('/api/employee',employeeRouter)
app.use('/api/employeeAuth',employeeAuthRouter)
app.use('/api/holiday',holidayrouter)
app.use('/api/attendence',attendanceRoute)
app.get("/", (req, res) => {
  res.send("API  WORKING");
});

app.listen(port, () => console.log("server started on port :" + port));
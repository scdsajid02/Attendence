import adminAuth from "../middleware/Adminauth.js";
import express from "express";
import { addEmployee,updateEmployee,getAllEmployees, deleteEmployee } from "../controllers/employeecontroller.js";

const employeeRouter = express.Router()

employeeRouter.post("/add-employee", adminAuth, addEmployee);
employeeRouter.get("/list-employee",  getAllEmployees);
employeeRouter.put("/update-employee/:id", adminAuth, updateEmployee);
employeeRouter.delete("/delete-employee/:id", adminAuth, deleteEmployee);

export default employeeRouter
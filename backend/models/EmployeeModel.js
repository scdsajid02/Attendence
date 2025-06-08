import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  employeeId: { type: String, required: true, unique: true },
  clLeft: { type: Number, default: 18 }, // Admin can update this anytime
  // You can add other fields as needed
});

const employeeModel =
  mongoose.models.employee || mongoose.model("employee", employeeSchema);

export default employeeModel;

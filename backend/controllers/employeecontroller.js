import employeeModel from "../models/EmployeeModel.js";

export const addEmployee = async (req, res) => {
  try {
    const { name, email, employeeId, clLeft } = req.body;

    // Basic validation
    if (!name || !email || !employeeId || clLeft === undefined) {
      return res.json({
        success: false,
        message: "All fields  are required",
      });
    }

    // Optional: Check if employee already exists
    const existing = await employeeModel.findOne({ email });
    if (existing) {
      return res.json({
        success: false,
        message: "Employee with this email already exists",
      });
    }

    const employee = new employeeModel({
      name,
      email,
      employeeId,
      clLeft: Number(clLeft),
    });

    await employee.save();

    res.json({
      success: true,
      message: "Employee added successfully",
      data: employee,
    });
  } catch (error) {
    console.log("Add Employee Error:", error);
    res.json({ success: false, message: error.message });
  }
};



export const getAllEmployees = async (req, res) => {
  try {
    const employees = await employeeModel
      .find()
      .collation({ locale: "en", strength: 1 }) // ✅ makes sort case-insensitive
      .sort({ name: 1 });
    res.json({ success: true, data: employees });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, employeeId, clLeft } = req.body;

    const updatedEmployee = await employeeModel.findByIdAndUpdate(
      id,
      { name, email, employeeId, clLeft },
      { new: true }
    );

    if (!updatedEmployee) {
      return res
        .json({ success: false, message: "Employee not found" });
    }

    res.json({
      success: true,
      message: "Employee updated",
      data: updatedEmployee,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await employeeModel.findByIdAndDelete(id);

    if (!deleted) {
      return res.json({
        success: false,
        message: "Employee not found",
      });
    }

    res.json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};


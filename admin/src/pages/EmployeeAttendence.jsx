import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { backendUrl } from "../App";

const employeeAttendance = ({ token }) => {
  const [list, setList] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [attendanceData, setAttendanceData] = useState({});

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/employee/list-employee`, {
        headers: { token },
      });
      if (res.data.success) {
        setList(res.data.data);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchAttendance = async (selectedDate) => {
    try {
      const res = await axios.get(`${backendUrl}/api/attendence/by-date`, {
        headers: { token },
        params: { date: selectedDate },
      });

      if (res.data.success) {
        const attendanceMap = {};
        res.data.data.forEach((item) => {
          attendanceMap[item._id] = item.attendanceStatus;
        });
        setAttendanceData(attendanceMap);
      } else {
        toast.error(res.data.message);
        setAttendanceData({});
      }
    } catch (error) {
      toast.error(error.message);
      setAttendanceData({});
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (date) fetchAttendance(date);
  }, [date]);

  const handleStatusChange = async (employeeId, status) => {
    setAttendanceData((prev) => ({
      ...prev,
      [employeeId]: status,
    }));

    try {
      const payload = [
        {
          employeeId,
          date,
          status,
        },
      ];

      const res = await axios.post(
        `${backendUrl}/api/attendence/mark`,
        { attendance: payload },
        { headers: { token } }
      );

      if (res.data.success) {
        toast.success(`Marked ${status} for employee`);
        fetchAttendance(date); // optional: refresh to stay updated
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <h2 className="mb-4 text-center text-2xl font-bold">
        Employee Attendance
      </h2>

      <div className="mb-4 flex justify-center gap-4">
        <label htmlFor="attendance-date" className="font-semibold">
          Select Date:
        </label>
        <input
          type="date"
          id="attendance-date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border rounded px-2 py-1"
        />
      </div>

      <div className="grid grid-cols-[1.5fr_2.5fr_3fr_2fr_2fr] gap-2 bg-gray-100 p-2 font-semibold text-center rounded">
        <div>Employee ID</div>
        <div>Name</div>
        <div>Email</div>
        <div>Status</div>
        <div>CL Left</div>
      </div>

      {list.map((emp) => (
        <div
          key={emp._id}
          className="grid grid-cols-[1.5fr_2.5fr_3fr_2fr_2fr] gap-2 items-center border-b py-2 text-center"
        >
          <div>{emp.employeeId}</div>
          <div>{emp.name}</div>
          <div>{emp.email}</div>
          <div>
            <select
              value={attendanceData[emp._id] || ""}
              onChange={(e) => handleStatusChange(emp._id, e.target.value)}
              className="border rounded px-2 py-1"
            >
              <option value="">-- Select --</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="cl" disabled={emp.clLeft === 0}>
                CL
              </option>
            </select>
          </div>
          <div className={emp.clLeft === 0 ? "text-red-600 font-bold" : ""}>
            {emp.clLeft}
          </div>
        </div>
      ))}
    </div>
  );
};

export default employeeAttendance;

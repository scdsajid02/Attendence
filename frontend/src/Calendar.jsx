import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./attendanceCalendar.css";
import axios from "axios";
import { backendUrl } from "./App";

export default function CalendarWithHolidays({ employeeId , cl}) {
  const today = new Date();

  const minDate = new Date(today.getFullYear(), 0, 1);
  const maxDate = new Date(today.getFullYear(), 11, 31); // End of year

  const [selectedMonth, setSelectedMonth] = useState(today);

  const [attendanceMap, setAttendanceMap] = useState({});
  const [holidays, setHolidays] = useState([]);

  // Helper: check if date is weekend
  const isWeekend = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };
 console.log(employeeId)
  // Fetch holidays once on mount
  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/holiday/get-holiday`);
        if (res.data.success) {
          setHolidays(res.data.data); // e.g. ["2025-04-10", "2025-05-15"]
        }
      } catch (err) {
        console.error("Failed to fetch holidays", err);
      }
    };

    fetchHolidays();
  }, []);

  // Fetch attendance for the selected month
  useEffect(() => {
    if (!employeeId) return; // Wait until employeeId is loaded

    const fetchAttendance = async () => {
      try {
        const month = selectedMonth.getMonth() + 1;
        const year = selectedMonth.getFullYear();

        const res = await axios.get(
          `${backendUrl}/api/attendence/get-by-month`,
          {
            params: { employeeId, month, year },
          }
        );

        if (res.data.success) {
          const data = res.data.data;
          const map = {};

          data.forEach((entry) => {
            // ✅ Just use the original date
            const originalDate = new Date(entry.date);
            const dateStr = originalDate.toISOString().slice(0, 10);
            map[dateStr] = entry.status;
          });

          setAttendanceMap(map);
        } else {
          setAttendanceMap({});
          console.error("Failed to fetch attendance:", res.data.message);
        }
      } catch (error) {
        setAttendanceMap({});
        console.error("Error fetching attendance:", error);
      }
    };

    fetchAttendance();
  }, [selectedMonth, employeeId]);
  
  

  // Calculate summary stats for selected month
  const getMonthAttendanceStats = (monthDate) => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();

    let presentCount = 0,
      absentCount = 0,
      
      holidayCount = 0,
      weekendCount = 0;

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(year, month, day);
      const dateStr = dateObj.toLocaleDateString("en-CA");

      if (isWeekend(dateObj)) {
        weekendCount++;
      } else if (holidays.includes(dateStr)) {
        holidayCount++;
      }

      const status = attendanceMap[dateStr];
      if (status === "present") presentCount++;
      else if (status === "absent") absentCount++;
      
    }

    return { presentCount, absentCount, holidayCount, weekendCount };
  };

  const { presentCount, absentCount, clCount, holidayCount, weekendCount } =
    getMonthAttendanceStats(selectedMonth);

  // Set CSS class for each tile based on attendance or holiday
  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      const dateStr = date.toLocaleDateString("en-CA");

      if (isWeekend(date)) return "weekend-day";
      if (holidays.includes(dateStr)) return "holiday-day";

      const status = attendanceMap[dateStr]?.toLowerCase();
      if (status === "present") return "present-day";
      if (status === "absent") return "absent-day";
      if (status === "cl") return "cl-day";
    }
    return null;
  };

  return (
    <div className="max-w-full flex flex-col items-center bg-slate-300 p-4 rounded-lg">
      <h2 className="text-xl font-semibold text-center mb-4">
        🗓️ Attendance Calendar
      </h2>

      {/* Summary stats */}
      <div className="mb-4 flex gap-6 justify-center text-center text-sm">
        <div>
          <span className="font-semibold">Present:</span> {presentCount}
        </div>
        <div>
          <span className="font-semibold">Absent:</span> {absentCount}
        </div>
        <div>
          <span className="font-semibold">CL Left:</span> {cl}
        </div>
        <div>
          <span className="font-semibold">Holidays:</span> {holidayCount}
        </div>
        <div>
          <span className="font-semibold">Weekends:</span> {weekendCount}
        </div>
      </div>

      <Calendar
        onActiveStartDateChange={({ activeStartDate }) =>
          setSelectedMonth(activeStartDate)
        }
        tileClassName={tileClassName}
        maxDetail="month"
        showNeighboringMonth={false}
        minDate={minDate}
        maxDate={maxDate}
      />

      {/* Legend */}
      <div className="mt-4 flex gap-4 justify-center text-sm">
        <div className="flex items-center gap-1">
          <span className="w-4 h-4 bg-green-300 inline-block rounded-full"></span>{" "}
          Present
        </div>
        <div className="flex items-center gap-1">
          <span className="w-4 h-4 bg-red-300 inline-block rounded-full"></span>{" "}
          Absent
        </div>
        <div className="flex items-center gap-1">
          <span className="w-4 h-4 bg-blue-300 inline-block rounded-full"></span>{" "}
          CL
        </div>
        <div className="flex items-center gap-1">
          <span className="w-4 h-4 bg-yellow-300 inline-block rounded-full"></span>{" "}
          Holiday
        </div>
        <div className="flex items-center gap-1">
          <span className="w-4 h-4 bg-gray-300 inline-block rounded-full"></span>{" "}
          Weekend
        </div>
      </div>
    </div>
  );
}

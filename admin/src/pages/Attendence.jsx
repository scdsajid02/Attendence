import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../App"; // your backend base url

const Attendence = ({ token }) => {
  const [holidays, setHolidays] = useState([]);
  const [newHoliday, setNewHoliday] = useState("");

  // Fetch holidays on component mount
  useEffect(() => {
    

    const fetchHolidays = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/holiday/get-holiday`)
        if (res.data.success) {
          console.log("Fetched holidays:", res.data.data);
          setHolidays(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch holidays:", err);
      }
    };

    console.log("Token available in Attendence.jsx:", token);
    fetchHolidays();
  }, [token]);
  

  // Add new holiday
  const handleAddHoliday = async () => {
    if (!newHoliday) return alert("Please select a date");
    try {
      const res = await axios.post(
        `${backendUrl}/api/holiday/add-holiday`,
        { date: newHoliday },
        { headers: { token } }
      );
      if (res.data.success) {
        setHolidays((prev) => [...prev, newHoliday]);
        setNewHoliday("");
      }
    } catch (err) {
      console.error("Failed to add holiday", err);
    }
  };

  // Remove holiday
  const handleRemoveHoliday = async (date) => {
    const confirmed = window.confirm("Do you want to remove this holiday?");
    if (!confirmed) return; // Exit if user cancels
    try {
      const res = await axios.delete(`${backendUrl}/api/holiday/${date}`, {
        headers: { token },
      });
      if (res.data.success) {
        setHolidays((prev) => prev.filter((d) => d !== date));
      }
    } catch (err) {
      console.error("Failed to remove holiday", err);
    }
  };
  

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Manage Holidays</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="date"
          className="border px-2 py-1 rounded"
          value={newHoliday}
          onChange={(e) => setNewHoliday(e.target.value)}
        />
        <button
          onClick={handleAddHoliday}
          className="bg-blue-600 text-white px-4 rounded"
        >
          Add Holiday
        </button>
      </div>

      <ul>
        {holidays.map((date) => (
          <li key={date} className="flex justify-between items-center mb-2">
            <span>{date}</span>
            <button
              onClick={() => handleRemoveHoliday(date)}
              className="text-red-600 hover:underline"
            >
              Remove
            </button>
          </li>
        ))}
        {holidays.length === 0 && <p>No holidays set yet.</p>}
      </ul>
    </div>
  );
};

export default Attendence;

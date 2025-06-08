import React, { useState } from "react";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import axios from "axios";
const Add = ({ token }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [clLeft, setClLeft] = useState(18);
  const [employeeId, setEmployeeId] = useState("");
  const [showButton, setShowButton] = useState(true);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setShowButton(false);
    try {
      const payload = {
        name,
        email,
        employeeId,
        clLeft,
      };
      const response = await axios.post(
        backendUrl + "/api/employee/add-employee",
        payload,
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setName("");
        setEmail("");
        setEmployeeId("")
        setClLeft(18)
        setShowButton(true)
      }
      else{
        toast.error(response.data.message)
        setShowButton(true)
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col w-full items-start gap-3"
    >
      <h1 className="text-2xl font-bold">ADD EMPLOYEE</h1>
      <div className="w-full mb-3">
        <p className="mb-3">NAME</p>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="w-full max-w-[500px] px-3 py-2 border-2 border-slate-800 rounded"
          type="text"
          placeholder="Employee Name"
          required
        />
      </div>
      <div className="w-full mb-3">
        <p className="mb-3">EMAIL</p>
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          className="w-full max-w-[500px] px-3 py-2 border-2 border-slate-800 rounded"
          type="email"
          placeholder="Employee Email"
          required
        />
      </div>
      <div className="w-full mb-3">
        <p className="mb-3">ID</p>
        <input
          onChange={(e) => setEmployeeId(e.target.value)}
          value={employeeId}
          className="w-full max-w-[500px] px-3 py-2 border-2 border-slate-800 rounded"
          type="text"
          placeholder="Employee ID"
          required
        />
      </div>
      <div className="w-full mb-3">
        <p className="mb-3">CL LEFT</p>
        <input
          onChange={(e) => setClLeft(e.target.value)}
          value={clLeft}
          className="w-full max-w-[500px] px-3 py-2 border-2 border-slate-800 rounded"
          type="number"
          placeholder="CL Left"
          required
        />
      </div>
      {showButton ? (
        <button
          type="submit"
          className="w-28 cursor-pointer py-3 mt-4 bg-black text-white"
        >
          ADD
        </button>
      ) : (
        <p></p>
      )}
    </form>
  );
};

export default Add;

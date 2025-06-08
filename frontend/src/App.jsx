import React from "react";
import Navbar from "./Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import { ToastContainer } from "react-toastify";
export const backendUrl = import.meta.env.VITE_BACKEND_URL;
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

const App = () => {
  
  const [token, setToken] = useState(localStorage.getItem("employeeToken") || "");
  useEffect(() => {
    localStorage.setItem("employeeToken", token);
  }, [token]);
  return (
    <div className="h-[97vh]  bg-slate-300 lg:rounded-2xl lg:m-2 lg:mx-3 m-1 rounded-xl ">
      <ToastContainer />
      {token === "" ? (
        <Login setToken={setToken} />
      ) : (
        <>
          <Navbar setToken={setToken} />

          <div className="flex w-full">
            <div className="w-full pr-1 mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base">
              <Routes>
                <Route
                  path="/home"
                  element={<Home token={token} setToken={setToken}  />}
                />
                <Route path="*" element={<Navigate to="/home" />} />
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;

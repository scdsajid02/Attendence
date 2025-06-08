import React, { useEffect, useState } from 'react'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from './components/Login';
import Navbar from './components/Navbar';
import Add from './pages/Add';
import Employee from './pages/Employee';
import Attendence from './pages/Attendence';
import Sidebar from './components/Sidebar';
import { Route, Routes } from 'react-router-dom';
import AdminPanelWrapper from './components/Wrapper';
import EmployeeAttendence from './pages/EmployeeAttendence';

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);
  return (
    <AdminPanelWrapper>
      <div className="   lg:m-2 lg:mx-3 m-1 ">
        <ToastContainer />
        {token === "" ? (
          <Login setToken={setToken} />
        ) : (
          <>
            <Navbar setToken={setToken} />
            <hr />
            <div className="flex w-full">
              <Sidebar />
              <div className="w-full pr-1 mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base">
                <Routes>
                  <Route path="/add" element={<Add token={token} />} />
                  <Route path="/edit" element={<Employee token={token} />} />
                  <Route
                    path="/holiday"
                    element={<Attendence token={token} />}
                  />
                  <Route path='/attendence' element={<EmployeeAttendence token={token}/>}/>
                </Routes>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminPanelWrapper>
  );
}

export default App
import { useEffect, useState } from "react";
import CalendarWithHolidays from "./Calendar";
import axios from "axios";
import { backendUrl } from "./App";

const Home = ({ token,setToken}) => {
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await axios.get(
          `${backendUrl}/api/employeeAuth/get-employee`,
          {
            headers: { token },
          }
        );

        if (res.data.success) {
          setEmployee(res.data.data);
        } else {
          setToken("")
        }
      } catch (err) {
        console.error("Failed to fetch employee:", err);
      }
    };

    fetchEmployee();
  }, []);

  return (
    <div>
      <div className="py-2">
        <h1 className="text-3xl text-center font-medium mt-4 mb-8">
          Hi{" "}
          <span className="font-bold text-blue-800 ">
            {employee?.name || "..."}
          </span>{" "}
          👋🏼
        </h1>
      </div>
      <CalendarWithHolidays employeeId={employee?._id} cl={employee?.clLeft} />
    </div>
  );
};

export default Home;

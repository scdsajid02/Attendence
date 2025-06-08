import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
const Login = ({setToken}) => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [showOtp,setShowOtp] = useState(false)
  const [showbutton,setShowButton] = useState(true)
  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      setShowButton(false)
      const response = await axios.post(backendUrl + "/api/auth/send-verify-otp", {
        email,
      });
      if (response.data.success) {
       localStorage.setItem("email", email);
       setShowButton(true)
       setShowOtp(true)
       toast.success(response.data.message)
      } else {
        toast.error(response.data.message);
        setShowButton(true)
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  //these is for the otp

  const inputRefs = React.useRef([]);
    const handleInput = (e, index) => {
      if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    };
  
    const handleKeyDown = (e, index) => {
      if (e.key === "Backspace" && e.target.value === "" && index > 0) {
        inputRefs.current[index - 1].focus();
      }
    };
  
    const handlePaste = (e) => {
      const paste = e.clipboardData.getData("text");
      const pasteArray = paste.split("");
      pasteArray.forEach((char, index) => {
        if (inputRefs.current[index]) {
          inputRefs.current[index].value = char;
        }
      });
    };
    const OtpOnSubmit = async(e) => {
     try {
      e.preventDefault();
      setShowButton(false)
      const otpArray = inputRefs.current.map(e=> e.value)
      const otp = otpArray.join('')
      const response = await axios.post(backendUrl + "/api/auth/verify-account", {
        email,
        otp
      });
      if (response.data.success) {
        await setToken(response.data.token)
        toast.success(response.data.message)
        navigate('/add')
        setShowButton(true)
       } else {
         toast.error(response.data.message);
         setShowButton(true)
       }
     } catch (error) {
       toast.error(error.message);
     }
     
    }
  return showOtp === false ? (
    <div className="flex  items-center justify-center h-[97vh] lg:rounded-2xl rounded-xl px-6 sm:px-0 bg-gradient-to-br from-purple-300 to-lime-300">
      <h1 className="absolute left-5 sm:left-20 top-5 font-bold rubik text-3xl cursor-pointer text-red-600">
        RED <span className="text-black">CLOUD</span>
      </h1>
      <div className="bg-slate-900 p-10 rounded-lg shadow-lg  w-full sm:w-96 text-indigo-300 text-sm">
        <h2 className="text-3xl font-semibold text-white text-center mb-3">
          Admin
        </h2>
        <form onSubmit={onSubmitHandler}>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img
              src="https://cdn.pixabay.com/photo/2016/01/10/22/52/letters-1132703_1280.png"
              alt=""
              className="w-6"
            />
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="bg-transparent outline-none"
              type="email"
              placeholder="Email"
              required
            />
          </div>
          {
            showbutton ? (<button type="submit" className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium">
            NEXT
          </button>) : (null)
          

          }
          
        </form>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center h-[97vh] px-6 lg:rounded-2xl rounded-xl sm:px-0 bg-gradient-to-br from-purple-300 to-lime-300">
      <h1 className="absolute left-5 sm:left-20 top-5 font-bold rubik text-3xl cursor-pointer text-red-600">
        RED <span className="text-black">CLOUD</span>
      </h1>
      <form onSubmit={OtpOnSubmit} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
        <h1 className="text-white text-2xl font-semibold text-center mb-4">
          Email Verify OTP
        </h1>
        <p className="text-center mb-6 text-indigo-300">
          Enter Your 6-digit code sent to your Email Id.
        </p>
        <div className="flex justify-between mb-8" onPaste={handlePaste}>
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <input
                className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md"
                type="text"
                maxLength="1"
                key={index}
                required
                ref={(e) => (inputRefs.current[index] = e)}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
        </div>
        {
           showbutton ?(<button type="submit" className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full">
          VERIFY
        </button>):(null)
        }
        
      </form>
    </div>
  );
};

export default Login;

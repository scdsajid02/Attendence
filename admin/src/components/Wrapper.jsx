import React, { useState, useEffect } from "react";

const AdminPanelWrapper = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // Tailwind's md breakpoint is 768px
    };

    checkScreenSize(); // initial check
    window.addEventListener("resize", checkScreenSize); // update on resize

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  if (isMobile) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-100 text-center p-5">
        <h1 className="text-xl font-semibold text-red-600">
          ❌ Admin Panel is not accessible on mobile devices. <br />
          Please open on a larger screen (desktop or tablet).
        </h1>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminPanelWrapper;

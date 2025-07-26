// src/pages/Cancel.js
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Cancel = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect after 3 seconds
    const timer = setTimeout(() => {
      navigate("/cart");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col justify-center items-center min-h-[70vh] text-center p-4">
      <h2 className="text-2xl text-red-600 font-bold mb-4">Payment Cancelled</h2>
      <p className="text-gray-700 text-lg">
        You have cancelled the payment. Redirecting to cart...
      </p>
    </div>
  );
};

export default Cancel;

// src/pages/Success.js
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Success = () => {
  const location = useLocation();
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const orderId = queryParams.get("order_id");

    if (orderId) {
      // fetch(`http://localhost:5000/api/order-status/${orderId}`, {
      fetch(`${process.env.REACT_APP_BACKEND_URL}/api/order-status/${orderId}`, {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setOrderData(data.order);
          } else {
            setError("Failed to fetch order details.");
          }
        })
        .catch((err) => {
          console.error("Order fetch error:", err);
          setError("Something went wrong.");
        });
    } else {
      setError("Order ID not found.");
    }
  }, [location.search]);

  if (error) return <p className="text-red-600 text-center mt-6">{error}</p>;
  if (!orderData) return <p className="text-center mt-6">Loading order details...</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-green-600 mb-4">Payment Successful!</h1>
      <p className="mb-4 text-gray-700">Thank you for your purchase. Here's your order summary:</p>

      <div className="bg-white p-4 rounded shadow mb-6">
        <p><strong>Order ID:</strong> {orderData._id}</p>
        <p><strong>Payment Status:</strong> {orderData.paymentStatus}</p>
        <p><strong>Total Amount:</strong> ₹{orderData.totalAmount}</p>

        {orderData.products?.length > 0 && (
          <>
            <h3 className="mt-4 font-semibold">Products:</h3>
            {orderData.products.map((item, idx) => (
              <div key={idx} className="border-b py-2">
                <p><strong>{item.name}</strong></p>
                <p>Quantity: {item.quantity}</p>
                <p>Price: ₹{item.price}</p>
                {item.image && <p>Image: {typeof item.image === 'string' ? item.image.split('/').pop() : '-'}</p>}
              </div>
            ))}
          </>
        )}
      </div>

      {orderData.address && (
        <div className="bg-gray-50 p-4 rounded shadow mb-6">
          <h3 className="font-semibold mb-2">Shipping Address</h3>
          <p><strong>Name:</strong> {orderData.address.fullName}</p>
          <p><strong>Flat:</strong> {orderData.address.flat}</p>
          <p><strong>Street:</strong> {orderData.address.street}</p>
          <p><strong>City:</strong> {orderData.address.city}</p>
          <p><strong>State:</strong> {orderData.address.state}</p>
          <p><strong>Pincode:</strong> {orderData.address.pincode}</p>
          <p><strong>Phone:</strong> {orderData.address.phone}</p>
        </div>
      )}

      <Link
        to="/order-status"
        className="inline-block mt-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-semibold"
      >
        Go to My Orders
      </Link>
      <Link
        to="/"
        className="ml-4 inline-block mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default Success;

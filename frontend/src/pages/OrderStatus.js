import React, { useEffect, useState } from 'react';
import SummaryApi from '../common';

const OrderStatus = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrder = async () => {
      const res = await fetch(SummaryApi.getOrder.url, {
        method: SummaryApi.getOrder.method,
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) setOrders(data.data);
    };
    fetchOrder();
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold mb-4">Your Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map(order => (
          <div key={order._id} className="border rounded p-4 mb-4 bg-white shadow">
            <p><strong>Order ID:</strong> {order._id}</p>
            <p><strong>Payment Status:</strong> {order.paymentDetails?.payment_status || '-'}</p>
            <div className="mt-2">
              <h3 className="font-semibold">Products:</h3>
              <ul className="list-disc pl-5">
                {order.productDetails.map((prod, i) => (
                  <li key={i}>
                    {prod.name || prod.productId} — Qty: {prod.quantity}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderStatus;

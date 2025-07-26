import React, { useEffect, useState } from 'react';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const AllOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await fetch(SummaryApi.allOrder.url, {
        method: SummaryApi.allOrder.method,
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) setOrders(data.data);
    };
    fetchOrders();
  }, []);

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    // const res = await fetch(`http://localhost:5000/api/order/${orderId}`, {
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/order/${orderId}`, {

      method: 'DELETE',
      credentials: 'include',
    });
    const data = await res.json();
    if (data.success) {
      setOrders(orders.filter(o => o._id !== orderId));
      toast.success('Order deleted');
    } else {
      toast.error(data.message || 'Failed to delete order');
    }
  };

  const handleDownloadPDF = async (orderId) => {
    const element = document.getElementById(`order-card-${orderId}`);
    if (!element) return;
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`order_${orderId}.pdf`);
  };

  return (
    <div className="bg-white pb-4">
      <h2 className="font-bold text-lg mb-4">All Orders</h2>
      <div>
        {orders.map((order, idx) => (
          <div key={order._id} id={`order-card-${order._id}`} style={{border: '1px solid #eee', borderRadius: 8, marginBottom: 24, padding: 16, boxShadow: '0 2px 8px #f0f0f0'}}>
            <div style={{fontWeight: 'bold', fontSize: 18, marginBottom: 8}}>Order #{idx + 1}</div>
            <div style={{marginBottom: 6}}><b>Order ID:</b> {order._id}</div>
            <div style={{marginBottom: 6}}><b>User ID:</b> {order.user?._id || order.userId}</div>
            <div style={{marginBottom: 6}}><b>Name:</b> {order.user?.name || (order.address && order.address.fullName) || '-'}</div>
            <div style={{marginBottom: 6}}><b>Email:</b> {order.user?.email || order.email}</div>
            <div style={{marginBottom: 6}}><b>Address:</b><br/>
              {order.address && order.address.fullName ? (
                <div style={{marginLeft: 8}}>
                  {order.address.fullName}<br/>
                  {order.address.flat}, {order.address.street}<br/>
                  {order.address.city}, {order.address.state} - {order.address.pincode}<br/>
                  Phone: {order.address.phone}
                </div>
              ) : (
                '-'
              )}
            </div>
            <div style={{marginBottom: 6}}><b>Payment Status:</b> <span style={{color: 'green', fontWeight: 'bold'}}>Paid</span></div>
            <div style={{marginBottom: 6}}><b>Products:</b></div>
            <ul style={{padding: 0, margin: 0, listStyle: 'none', marginBottom: 8}}>
              {order.productDetails.map((prod, i) => (
                <li key={i} style={{marginBottom: 8}}>
                  <b>{prod.name || '-'}</b> (Brand: {prod.brandName || '-'}) (Qty: {prod.quantity})<br/>
                  {prod.image && (
                    <img src={prod.image} alt={prod.name || 'Product'} style={{width: 80, height: 80, objectFit: 'cover', borderRadius: 4, marginTop: 2, background: '#f8f8f8', display: 'block'}} />
                  )}
                </li>
              ))}
            </ul>
            <div style={{marginBottom: 6}}><b>Total Amount:</b> ₹{order.totalAmount}</div>
            <div style={{marginBottom: 6}}><b>Order Date:</b> {new Date(order.createdAt).toLocaleString()}</div>
            {/* <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-2"
              onClick={() => handleDownloadPDF(order._id)}
            >
              Download PDF
            </button> */}
            <div className="flex gap-2 mt-2">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={() => handleDownloadPDF(order._id)}
              >
                Download PDF
              </button>

              <button
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={() => handleDeleteOrder(order._id)}
              >
                Delete Order
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllOrders; 
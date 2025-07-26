import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SummaryApi from '../common';
import Context from '../context';
import displayINRCurrency from '../helpers/displayCurrency';
import { MdDelete } from 'react-icons/md';

const Cart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const context = useContext(Context);
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    fullName: '',
    flat: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    phone: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const fetchData = async () => {
    const response = await fetch(SummaryApi.addToCartProductView.url, {
      method: SummaryApi.addToCartProductView.method,
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    });
    const responseData = await response.json();
    if (responseData.success) setData(responseData.data);
  };

  useEffect(() => {
    setLoading(true);
    fetchData().finally(() => setLoading(false));
  }, []);

  const updateQty = async (id, qty) => {
    const res = await fetch(SummaryApi.updateCartProduct.url, {
      method: SummaryApi.updateCartProduct.method,
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ _id: id, quantity: qty })
    });
    const data = await res.json();
    if (data.success) fetchData();
  };

  const deleteCartProduct = async (id) => {
    const res = await fetch(SummaryApi.deleteCartProduct.url, {
      method: SummaryApi.deleteCartProduct.method,
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ _id: id })
    });
    const data = await res.json();
    if (data.success) {
      fetchData();
      context.fetchUserAddToCart();
    }
  };

  const totalQty = data.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = data.reduce((sum, item) => sum + item.quantity * item.productId.sellingPrice, 0);

  const handlePayment = async () => {
    const { fullName, flat, street, city, state, pincode, phone } = address;
    if (!fullName || !flat || !street || !city || !state || !pincode || !phone) {
      alert('Please fill all address fields.');
      return;
    }

    const orderRes = await fetch(SummaryApi.razorpayCheckout.url, {
      method: SummaryApi.razorpayCheckout.method,
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: totalPrice })
    });

    const orderData = await orderRes.json();
    if (!orderData.success) {
      alert('Failed to initiate payment.');
      return;
    }

    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID,
      amount: orderData.order.amount,
      currency: 'INR',
      name: 'MartOK',
      description: 'Order Payment',
      order_id: orderData.order.id,
      handler: async function (response) {
        const verifyRes = await fetch(SummaryApi.razorpayVerify.url, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...response, address })
        });
        const verifyData = await verifyRes.json();
        if (verifyData.success && verifyData.orderId) {
          navigate(`/success?order_id=${verifyData.orderId}`);
        } else {
          navigate('/cancel');
        }
      },
      theme: { color: '#F37254' }
    };

    const razor = new window.Razorpay(options);
    razor.open();
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col lg:flex-row gap-8 mt-4">
        <div className="w-full lg:w-2/3 space-y-4">
          {data.length === 0 && !loading ? (
            <div className="text-center text-lg my-5 bg-white py-5 rounded shadow">No items in cart.</div>
          ) : (
            data.map((product) => (
              <div key={product._id} className="bg-white p-4 rounded border grid grid-cols-[100px_1fr] gap-4">
                <img src={product.productId.productImage[0]} className="object-contain" alt="Product" />
                <div className="relative">
                  <button className="absolute right-0 text-red-600 hover:text-white hover:bg-red-600 p-2 rounded-full" onClick={() => deleteCartProduct(product._id)}>
                    <MdDelete size={20} />
                  </button>
                  <h2 className="text-lg font-semibold truncate">{product.productId.productName}</h2>
                  <p className="text-sm text-gray-500 capitalize">{product.productId.category}</p>
                  <div className="flex justify-between mt-1">
                    <span className="text-red-600 font-semibold">{displayINRCurrency(product.productId.sellingPrice)}</span>
                    <span className="text-gray-700 font-semibold">{displayINRCurrency(product.productId.sellingPrice * product.quantity)}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <button className="border border-red-600 text-red-600 w-6 h-6 rounded hover:bg-red-600 hover:text-white" onClick={() => updateQty(product._id, product.quantity - 1)}>-</button>
                    <span>{product.quantity}</span>
                    <button className="border border-red-600 text-red-600 w-6 h-6 rounded hover:bg-red-600 hover:text-white" onClick={() => updateQty(product._id, product.quantity + 1)}>+</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {data.length > 0 && (
          <div className="w-full lg:w-1/3 bg-white rounded-md shadow-md p-4">
            <h2 className="text-white bg-red-600 px-4 py-2 text-lg font-semibold rounded-t-md">Summary</h2>
            <form className="space-y-3 mt-3">
              <input name="fullName" value={address.fullName} onChange={handleChange} placeholder="Full Name" className="input" />
              <input name="flat" value={address.flat} onChange={handleChange} placeholder="Flat / Apartment" className="input" />
              <input name="street" value={address.street} onChange={handleChange} placeholder="Street" className="input" />
              <div className="flex gap-2">
                <input name="city" value={address.city} onChange={handleChange} placeholder="City" className="input w-1/2" />
                <input name="state" value={address.state} onChange={handleChange} placeholder="State" className="input w-1/2" />
              </div>
              <div className="flex gap-2">
                <input name="pincode" value={address.pincode} onChange={handleChange} placeholder="Pincode" className="input w-1/2" />
                <input name="phone" value={address.phone} onChange={handleChange} placeholder="Phone" className="input w-1/2" />
              </div>
            </form>
            <div className="mt-4 text-slate-700 font-medium text-sm space-y-1">
              <div className="flex justify-between"><span>Quantity</span><span>{totalQty}</span></div>
              <div className="flex justify-between"><span>Total Price</span><span>{displayINRCurrency(totalPrice)}</span></div>
            </div>
            <button className="bg-blue-600 text-white w-full mt-4 py-2 rounded hover:bg-blue-700" onClick={handlePayment}>Proceed to Payment</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;

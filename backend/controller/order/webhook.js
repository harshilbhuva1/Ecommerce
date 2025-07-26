const crypto = require("crypto");
const orderModel = require("../../models/orderProductModel");
const addToCartModel = require("../../models/cartProduct");
const sendMail = require('../../helpers/sendMail');

const webhook = async (req, res) => {
  try {
    await sendMail({
      to: process.env.ADMIN_EMAIL,
      subject: 'Webhook Test Email',
      html: '<b>This is a test email from the webhook start.</b>'
    });
    console.log('✅ Webhook test email sent');

    // Try sending the real order notification email with dummy fallback if order details are not available
    const event = req.body.event;
    const payload = req.body.payload;
    if (event === "payment.captured") {
    // if (event == "invoice.paid") {
      const payment = payload.payment.entity;
      const userId = payment.notes.userId;
      const email = payment.email;
      const address = payment.notes.address ? JSON.parse(payment.notes.address) : req.body.address || {};
      // Fetch cart items to store as order
      const addToCartModel = require('../../models/cartProduct');
      const cartItems = await addToCartModel.find({ userId });
      const productDetails = cartItems.map(item => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image || (item.productId && item.productId.productImage ? item.productId.productImage[0] : null)
      }));
      const orderDetails = {
        productDetails,
        email,
        userId,
        address,
        paymentDetails: {
          paymentId: payment.id,
          payment_method_type: payment.method,
          payment_status: payment.status,
        },
        shipping_options: [],
        totalAmount: payment.amount / 100
      };
      console.log('Order details for email:', orderDetails);
      try {
        await sendMail({
          to: process.env.ADMIN_EMAIL,
          subject: 'New Order Received',
          html: `
            <h2>New Order Arrived</h2>
            <p><b>Order ID:</b> ${payment.id}</p>
            <p><b>Customer Name:</b> ${address.fullName || ''}</p>
            <p><b>Customer Email:</b> ${email}</p>
            <p><b>Shipping Address:</b> ${address.flat || ''}, ${address.street || ''}, ${address.city || ''}, ${address.state || ''} - ${address.pincode || ''}<br/>Phone: ${address.phone || ''}</p>
            <p><b>Payment Status:</b> ${orderDetails.paymentDetails.payment_status}</p>
            <p><b>Products:</b></p>
            <ul>
              ${orderDetails.productDetails.map(p => `
                <li>
                  <b>${p.name}</b> (Qty: ${p.quantity})<br/>
                  ${p.image ? `<img src=\"${p.image}\" alt=\"${p.name}\" width=\"60\"/>` : ''}
                </li>
              `).join('')}
            </ul>
            <p><b>Total Amount:</b> ₹${orderDetails.totalAmount}</p>
            <p><b>Order Date:</b> ${new Date().toLocaleString()}</p>
          `
        });
        console.log('✅ Real order email sent');
      } catch (err) {
        console.error('❌ Failed to send real order email:', err);
      }
    }
  } catch (err) {
    console.error('❌ Webhook test email failed:', err);
  }
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers["x-razorpay-signature"];
  const body = JSON.stringify(req.body);

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  if (signature !== expectedSignature) {
    console.warn("❌ Invalid webhook signature");
    return res.status(400).json({ success: false });
  }

  console.log("✅ Webhook verified");

  const event = req.body.event;
  const payload = req.body.payload;

  if (event == "payment.captured") {
    const payment = payload.payment.entity;

    // Example: metadata was passed when order was created (via frontend)
    const userId = payment.notes.userId;
    if (!userId) {
      console.error("No userId found in payment notes!");
      return res.status(400).json({ success: false, message: "No userId in payment notes" });
    }
    const email = payment.email;
    const address = payment.notes.address ? JSON.parse(payment.notes.address) : req.body.address || {};

    // Fetch cart items to store as order
    const cartItems = await addToCartModel.find({ userId });

    const productDetails = cartItems.map(item => ({
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image || (item.productId && item.productId.productImage ? item.productId.productImage[0] : null)
    }));

    const orderDetails = {
      productDetails,
      email,
      userId,
      address,
      paymentDetails: {
        paymentId: payment.id,
        payment_method_type: payment.method,
        payment_status: payment.status,
      },
      shipping_options: [], // Optional if you're not using Razorpay shipping
      totalAmount: payment.amount / 100
    };

    const newOrder = new orderModel(orderDetails);
    const saved = await newOrder.save();

    if (saved?._id) {
      await addToCartModel.deleteMany({ userId });
      console.log("✅ Order saved and cart cleared");
      console.log("Returning response after email logic...");
      return res.status(200).json({ success: true });
    }
    console.log("Order not saved or _id missing, skipping email.");
  }

  return res.status(200).json({ success: true });
};

module.exports = webhook;


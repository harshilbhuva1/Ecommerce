// controller/razorpayController.js
const Razorpay = require('razorpay');
const crypto = require('crypto');
// const bodyParser = require('body-parser')
const orderModel = require("../models/orderProductModel");
const addToCartModel = require("../models/cartProduct");
const productModel = require("../models/productModel");

// app.use(bodyParser.json())

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});


const createRazorpayOrder = async (req, res) => {
  const { amount, userId, address } = req.body;
  const options = {
    amount: amount * 100,
    currency: "INR",
    receipt: `order_rcptid_${Date.now()}`,
    payment_capture: 1,
    notes: {
      userId: userId || '',
      address: address ? JSON.stringify(address) : ''
    }
  };

  try {
    const order = await razorpay.orders.create(options);
    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// const verifyRazorpayPayment = async (req, res) => {
//   const { razorpay_order_id, razorpay_payment_id, razorpay_signature, address } = req.body;
//   const userId = req.userId;

//   const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
//   hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
//   const generatedSignature = hmac.digest("hex");

//   if (generatedSignature === razorpay_signature) {
//     try {
//       console.log('User ID:', userId);
//       // Fetch cart items for the user
//       const cartItems = await addToCartModel.find({ userId });
//       console.log('Cart Items:', cartItems);
//       if (!cartItems || cartItems.length === 0) {
//         console.log('Cart is empty for user:', userId);
//         return res.json({ success: false, message: "Cart is empty" });
//       }
//       // Fetch product details for each cart item
//       const productDetails = [];
//       let totalAmount = 0;
//       for (const item of cartItems) {
//         const product = await productModel.findById(item.productId);
//         if (!product) continue;
//         let imageUrl = null;
//         if (product.productImage && product.productImage.length > 0) {
//           imageUrl = product.productImage[0].startsWith('http')
//             ? product.productImage[0]
//             : `http://localhost:5000/${product.productImage[0]}`;
//         }
//         const prodDetail = {
//           productId: item.productId,
//           name: product.productName,
//           brandName: product.brandName,
//           price: product.sellingPrice,
//           quantity: item.quantity,
//           image: imageUrl
//         };
//         productDetails.push(prodDetail);
//         totalAmount += prodDetail.price * prodDetail.quantity;
//       }
//       console.log('Product Details for Order:', productDetails);
//       // Create order
//       const orderDetails = {
//         productDetails,
//         userId,
//         address: address || {},
//         paymentDetails: {
//           paymentId: razorpay_payment_id,
//           payment_method_type: 'razorpay',
//           payment_status: 'paid',
//         },
//         totalAmount
//       };
//       console.log('Order Details to Save:', orderDetails);
//       const newOrder = new orderModel(orderDetails);
//       const saved = await newOrder.save();
//       if (saved?._id) {
//         await addToCartModel.deleteMany({ userId });
//         return res.json({ success: true, orderId: saved._id });
//       } else {
//         console.log('Order not saved for user:', userId);
//         return res.json({ success: false, message: "Order not saved" });
//       }
//     } catch (err) {
//       console.error('Error in verifyRazorpayPayment:', err);
//       return res.status(500).json({ success: false, message: err.message });
//     }
//   } else {
//     res.status(400).json({ success: false, message: "Invalid signature" });
//   }
// };
const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, address } = req.body;
    const userId = req.userId;

    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature === razorpay_signature) {
      // ✅ Fetch cart items
      const cartItems = await addToCartModel.find({ userId });
      if (!cartItems || cartItems.length === 0) {
        return res.status(400).json({ success: false, message: "Cart is empty" });
      }

      // ✅ Build product details and total
      const productDetails = [];
      let totalAmount = 0;

      for (const item of cartItems) {
        const product = await productModel.findById(item.productId);
        if (!product) continue;

        const imageUrl = product.productImage?.[0]?.startsWith("http")
          ? product.productImage[0]
          // : `http://localhost:5000/${product.productImage[0]}`;
          : `${process.env.REACT_APP_BACKEND_URL}/${product.productImage[0]}`; 

        productDetails.push({
          productId: item.productId,
          name: product.productName,
          brandName: product.brandName,
          price: product.sellingPrice,
          quantity: item.quantity,
          image: imageUrl
        });

        totalAmount += product.sellingPrice * item.quantity;
      }

      // ✅ Create and save order
      const orderDetails = {
        productDetails,
        userId,
        address,
        paymentDetails: {
          paymentId: razorpay_payment_id,
          payment_method_type: "razorpay",
          payment_status: "paid",
        },
        totalAmount,
      };

      const newOrder = new orderModel(orderDetails);
      const saved = await newOrder.save();

      if (saved?._id) {
        await addToCartModel.deleteMany({ userId });
        return res.status(200).json({ success: true, orderId: saved._id });
      } else {
        return res.status(500).json({ success: false, message: "Order not saved" });
      }
    } else {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};



module.exports = { createRazorpayOrder, verifyRazorpayPayment };

// controller/order/orderStatus.controller.js
const OrderModel = require("../../models/orderProductModel");

const orderStatusController = async (req, res) => {
  try {
    const order = await OrderModel.findById(req.params.id);

    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    res.status(200).json({
      success: true,
      order: {
        _id: order._id,
        totalAmount: order.totalAmount,
        paymentStatus: order.paymentDetails.payment_status,
        address: order.address,
        products: order.productDetails.map((p) => ({
          name: p.name,
          quantity: p.quantity,
          price: p.price,
          image: p.image,
        })),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = orderStatusController;

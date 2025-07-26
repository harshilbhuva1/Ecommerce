const mongoose = require('mongoose');
const orderModel = require('../../models/orderProductModel');
const userModel = require('../../models/userModel');

function isValidObjectId(id) {
  return typeof id === 'string' && id.length === 24 && /^[a-fA-F0-9]+$/.test(id);
}

const deleteOrderController = async (req, res) => {
  try {
    const userId = req.userId;
    if (!isValidObjectId(userId)) {
        return res.status(400).json({ message: 'User ID is invalid or missing', error: true, success: false });
    }
    const user = await userModel.findById(userId);
    if (!user || user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    const { id } = req.params;
    const deleted = await orderModel.findByIdAndDelete(id);
    if (deleted) {
      return res.json({ success: true, message: 'Order deleted' });
    } else {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = deleteOrderController; 
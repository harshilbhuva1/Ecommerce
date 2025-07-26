const mongoose = require('mongoose');
const userModel = require('../../models/userModel');

function isValidObjectId(id) {
  return typeof id === 'string' && id.length === 24 && /^[a-fA-F0-9]+$/.test(id);
}

const deleteUserController = async (req, res) => {
  try {
    const adminId = req.userId;
    if (!isValidObjectId(adminId)) {
        return res.status(400).json({ message: 'Admin ID is invalid or missing', error: true, success: false });
    }
    const admin = await userModel.findById(adminId);
    if (!admin || admin.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    const { id } = req.params;
    const deleted = await userModel.findByIdAndDelete(id);
    if (deleted) {
      return res.json({ success: true, message: 'User deleted' });
    } else {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = deleteUserController; 
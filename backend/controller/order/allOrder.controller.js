const mongoose = require('mongoose');
const orderModel = require("../../models/orderProductModel")
const userModel = require("../../models/userModel")
const productModel = require("../../models/productModel");

function isValidObjectId(id) {
  return typeof id === 'string' && id.length === 24 && /^[a-fA-F0-9]+$/.test(id);
}

const allOrderController = async(request,response)=>{
    const userId = request.userId

    if (!isValidObjectId(userId)) {
        return response.status(400).json({ message: 'User ID is invalid or missing', error: true, success: false });
    }
    const user = await userModel.findById(userId)

    if(user.role !== 'ADMIN'){
        return response.status(500).json({
            message : "not access"
        })
    }

    const AllOrder = await orderModel.find().sort({ createdAt : -1 });
    const userIds = AllOrder.map(order => order.userId);
    const validUserIds = userIds.filter(id => typeof id === 'string' && id.length === 24 && /^[a-fA-F0-9]+$/.test(id));
    const users = await userModel.find({ _id: { $in: validUserIds } });
    const userMap = users.reduce((acc, user) => { acc[user._id] = user; return acc; }, {});
    const ordersWithUser = await Promise.all(AllOrder.map(async order => {
        const filledProductDetails = await Promise.all((order.productDetails || []).map(async prod => {
            if (prod.name && prod.brandName && prod.image) return prod;
            // Fetch from product model if missing
            const product = await productModel.findById(prod.productId);
            return {
                ...prod,
                name: prod.name || product?.productName || '-',
                brandName: prod.brandName || product?.brandName || '-',
                image: prod.image || (product?.productImage && product.productImage.length > 0
                    ? (product.productImage[0].startsWith('http') ? product.productImage[0] : `http://localhost:5000/${product.productImage[0]}`)
                    : null)
            };
        }));
        return {
            ...order._doc,
            user: userMap[order.userId] ? { _id: userMap[order.userId]._id, name: userMap[order.userId].name, email: userMap[order.userId].email } : null,
            address: order.address || {},
            productDetails: filledProductDetails
        };
    }));
    return response.status(200).json({
        data : ordersWithUser,
        success : true
    });

}

module.exports = allOrderController
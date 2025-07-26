const express = require('express')

const router = express.Router()

const userSignUpController = require("../controller/user/userSignUp")
const userSignInController = require('../controller/user/userSignIn')
const userDetailsController = require('../controller/user/userDetails')
const authToken = require('../middleware/authToken')
const userLogout = require('../controller/user/userLogout')
const allUsers = require('../controller/user/allUsers')
const updateUser = require('../controller/user/updateUser')
const UploadProductController = require('../controller/product/uploadProduct')
const getProductController = require('../controller/product/getProduct')
const updateProductController = require('../controller/product/updateProduct')
const getCategoryProduct = require('../controller/product/getCategoryProductOne')
const getCategoryWiseProduct = require('../controller/product/getCategoryWiseProduct')
const getProductDetails = require('../controller/product/getProductDetails')
const addToCartController = require('../controller/user/addToCartController')
const countAddToCartProduct = require('../controller/user/countAddToCartProduct')
const addToCartViewProduct  = require('../controller/user/addToCartViewProduct')
const updateAddToCartProduct = require('../controller/user/updateAddToCartProduct')
const deleteAddToCartProduct = require('../controller/user/deleteAddToCartProduct')
const searchProduct = require('../controller/product/searchProduct')
const filterProductController = require('../controller/product/filterProduct')

const webhooks = require('../controller/order/webhook')
const orderController = require('../controller/order/order.controller')
const allOrderController = require('../controller/order/allOrder.controller')
const orderStatusController = require('../controller/order/orderStatus.controller');
const deleteOrderController = require('../controller/order/deleteOrder.controller');
const deleteUserController = require('../controller/user/deleteUser.controller');
const deleteProductController = require('../controller/product/deleteProductController');

const razorpayCheckout = require("../controller/razorpayController");

const { createRazorpayOrder, verifyRazorpayPayment } = require('../controller/razorpayController');

const forgotPasswordController = require('../controller/user/forgotPasswordController');
const resetPasswordController = require('../controller/user/resetPasswordController');

// const orderStatusController = require('../controller/order/orderStatus.controller');

router.get('/order-status/:id', orderStatusController); // enable order status endpoint


router.post("/signup",userSignUpController)
router.post("/signin",userSignInController)
router.get("/user-details",authToken,userDetailsController)
router.get("/userLogout",userLogout)

//admin panel 
router.get("/all-user",authToken,allUsers)
router.post("/update-user",authToken,updateUser)
router.delete('/user/:id', authToken, deleteUserController);

//product
router.post("/upload-product",authToken,UploadProductController)
router.get("/get-product",getProductController)
router.post("/update-product",authToken,updateProductController)
router.get("/get-categoryProduct",getCategoryProduct)
router.post("/category-product",getCategoryWiseProduct)
router.post("/product-details",getProductDetails)
router.get("/search",searchProduct)
router.post("/filter-product",filterProductController)
router.delete('/product/:id', authToken, deleteProductController);

//user add to cart
router.post("/addtocart",authToken,addToCartController)
router.get("/countAddToCartProduct",authToken,countAddToCartProduct)
router.get("/view-card-product",authToken,addToCartViewProduct)
router.post("/update-cart-product",authToken,updateAddToCartProduct)
router.post("/delete-cart-product",authToken,deleteAddToCartProduct)

//payment and order
// router.post('/checkout',authToken,paymentController)
router.post('/webhook',webhooks) // /api/webhook
router.get("/order-list",authToken,orderController)
router.get("/all-order",authToken,allOrderController)
router.delete('/order/:id', authToken, deleteOrderController);


router.post("/razorpay/checkout", authToken, createRazorpayOrder);

router.post("/razorpay/order", authToken, createRazorpayOrder);
router.post("/razorpay/verify", authToken, verifyRazorpayPayment);

router.post('/forgot-password', forgotPasswordController);
router.post('/reset-password/:token', resetPasswordController);


module.exports = router
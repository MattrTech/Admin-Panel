const Razorpay = require("razorpay");
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const { v4: uuidv4 } = require("uuid");
const dotenv = require("dotenv");
const Cart = require("../models/cartModel");
const key = require('../config/key');
const Order = require("../models/orderModel");
const crypto = require("crypto");
const RazorOrders = require("../models/razorOrderModel");
const mongoose = require("mongoose");

const razorInstance = new Razorpay({
    key_id: key.RAZOR_PAY_ID,
    key_secret: key.RAZOR_PAY_SECRET,
});

// @desc Get order details
exports.getOrderDetails = asyncHandler(async (req,res,next) => {
    console.log(req.body);
});

// @desc Payment Capture
exports.paymentCature = asyncHandler(async (req,res,next) => {
    const { payment_id, order_id, signature } = req.body;
    console.log(req.body);
    req.body.user = res.locals.user;
})


const Razorpay = require("razorpay");
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const { v4: uuidv4 } = require("uuid");
const dotenv = require("dotenv");
const Cart = require("../models/cartModel");
const Order = require("../models/orderModel");
const crypto = require("crypto");
const RazorOrders = require("../models/razorOrderModel");
const mongoose = require("mongoose");
const Product = require('../models/productModel');
dotenv.config({path:"config.env"});

const razorInstance = new Razorpay({
    key_id: process.env.RAZOR_PAY_ID ?? '',
    key_secret: process.env.RAZOR_PAY_SECRET ?? '',
});

// @desc Get order details
exports.getOrderDetails = asyncHandler(async (req,res,next) => {
    const { address, city, pincode, phone, country, email, name } = req.body;
    console.log(req.body, "s")
    const description = `Name : ${name}, emailID: ${email}, phone : ${phone}, address: ${address}, city: ${city}, pincode: ${pincode}, country: ${country}`;
    const cart = await Cart.findOne({ user: res.locals.user.id });
    const cardData = [];
    for(let j =0; j< cart.products.length; j++){
        cardData.push({product: await Product.findById(cart.products[j].product), quantity: cart.products[j].quantity,  size: cart.products[j].size})
    }
    let totPrice = 0;
    cardData.forEach((e) => {
        totPrice = totPrice + parseInt(e.product.total_price) * parseInt(e.quantity);
    });
    const amount = Math.round(totPrice * 1) * 85;
    const options = {
        amount: amount,
        currency: "INR",
        receipt: uuidv4(),
        notes: { ...req.body },
    };

    const order = await razorInstance.orders.create(options);

    console.log(order, "sss")
    const data = await RazorOrders.create({
        ...order,
        notes: req.body,
        cartItems: cardData,
        created_at: new Date(),
    });
    res.status(200).json({ success: true, order });
});

// @desc Payment Capture
exports.paymentCature = asyncHandler(async (req,res,next) => {
    const { payment_id, order_id, signature } = req.body;
    console.log(req.body);
    req.body.user = res.locals.user;
    const order = await RazorOrders.findOne({ id: order_id });
    console.log(order?.notes);
    let body = order?.id + "|" + payment_id;
    let generated_signature = crypto
        .createHmac("sha256", process.env.RAZOR_PAY_SECRET ?? '')
        .update(body.toString())
        .digest("hex");

    if (generated_signature === signature) {
        order.amount_paid = order?.amount;
        order.amount_due = 0;
        order.paymentMethod = '-'
        order.shippingCountry = order?.notes?.country ?? "-"
        order.shippingZip = order?.notes?.pincode ?? ""
        order.shippingAddress = order?.notes?.address ?? ""
        order.shippingCity = order?.notes?.city ?? ""
        order.user = res.locals.user.id
        req.body.orderDetails = order?._id;
        req.body.notes = order?.notes;
        req.body.address = order?.notes.address;
        req.body.signature = signature;
        req.body.items = order?.cartItems;
        order.save();

        const placeOrder = await Order.create({ ...order, ...req.body });
        await Cart.deleteMany({
            userId: new mongoose.Types.ObjectId(res.locals.user.id),
        });
        return res.status(200).json({
            success: true,
            message: "Order Placed",
            order: placeOrder,
        });
    }

    return res.status(500).json({success: false, message: "Payment failed"})
})


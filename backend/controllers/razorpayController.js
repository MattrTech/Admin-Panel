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

const razorInstance = new Razorpay({
    key_id: process.env.RAZOR_PAY_ID ?? '',
    key_secret: process.env.RAZOR_PAY_SECRET ?? '',
});

// @desc Get order details
exports.getOrderDetails = asyncHandler(async (req,res,next) => {
    const { address, city, pincode, phone, country, email, name } = req.body;
    const description = `Name : ${name}, emailID: ${email}, phone : ${phone}, address: ${address}, city: ${city}, pincode: ${pincode}, country: ${country}`;
    const cartItems = await Cart.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(res.locals.user.id) } },
        {
            $lookup: {
                from: "products",
                localField: "itemId",
                foreignField: "_id",
                as: "product",
            },
        },
        {
            $unwind: {
                path: "$product",
                preserveNullAndEmptyArrays: false, // optional
            },
        },
        {
            $replaceRoot: {
                newRoot: {
                    $mergeObjects: ["$$ROOT", "$product"],
                },
            },
        },
        { $project: { product: 0, userId: 0, variations: 0 } },
    ]);
    let totPrice = 0;
    cartItems.forEach((e) => {
        totPrice = totPrice + parseInt(e.total_price) * parseInt(e.quantity);
    });
    const amount = Math.round(totPrice * 1) * 100;
    const options = {
        amount: amount,
        currency: "INR",
        receipt: uuidv4(),
        notes: { ...req.body },
    };
    const order = await razorInstance.orders.create(options);
    const data = await RazorOrders.create({
        ...order,
        notes: req.body,
        cartItems,
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

    return next(new ErrorResponse(`Payment not Authorized`, 500));
})


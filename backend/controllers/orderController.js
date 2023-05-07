const Order = require('../models/orderModel');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');

// @desc Create a new order
// @route POST /api/v1/order
exports.createOrder = asyncHandler(async (req,res) => {
    try {
        const {
            user,
            products,
            shippingAddress,
            shippingCity,
            shippingZip,
            shippingCountry,
            paymentMethod,
            payment_id,
            signature
        } = req.body;

        const order = new Order({
            user,
            products,
            shippingAddress,
            shippingCity,
            shippingZip,
            shippingCountry,
            paymentMethod,
            payment_id,
            signature
        });

        const savedOrder = await order.save();

        res.status(201).json(savedOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong"});
    }
});

// @desc Get All Order
// @route GET /api/v1/order
// @perms Admin
exports.getAllOrders = asyncHandler(async (req,res,next) => {
    try {
        const orders = await Order.find({}).populate('user', 'name email');
        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders.reverse(),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
});

// @desc Get Order with a specific id
// @route GET /api/v1/order/:id
exports.getOrderById = asyncHandler(async (req,res,next) => {
    try {
        const order = await Order.findById(req.params.id)
        .populate('user', 'name email')
        .populate({
            path: 'products.product',
            select: 'name price',
        });

        if (!order) {
            return next(new ErrorResponse(`Order not found`, 404));
        }

        res.status(200).json({ success: true, data: order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

// @desc Update Order status
// @route UPDATE /api/v1/order/:id
exports.updateOrderStatus = asyncHandler(async (req,res) => {
    try {
        const { status } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found'});
        }

        order.status = status;

        const savedOrder = await order.save();

        res.status(200).json(savedOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
})

// @desc Delete order
// @route DELETE /api/v1/order/:id
exports.deleteOrder = async (req,res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
      
        res.status(200).json({ message: 'Order deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
}
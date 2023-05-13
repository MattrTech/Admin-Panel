const Coupon = require('../models/couponModel');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const { addListener } = require('nodemon');

// @desc Create a new coupon
// @route POST /api/v1/coupon
exports.createCoupon = asyncHandler(async (req,res) => {
    try {
        const { code, discount, expiryDate } = req.body;
        const coupon = new Coupon({ code, discount, expiryDate});
        const savedCoupon = await coupon.save();
        res.status(201).json(savedCoupon);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

// @desc Get all coupons
// @route GET /api/v1/coupon
exports.getAllCoupons = asyncHandler(async(req,res) => {
    try {
        const coupons = await Coupon.find();

        res.status(200).json(coupons);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

// @desc Get coupon by code
// @route GET /api/v1/coupon/:code
exports.getCouponByCode = asyncHandler(async (req,res) => {
    try {
        const coupon = await Coupon.findOne({ code: req.params.code });

        if(!coupon) {
            return res.status(404).json({ message: 'Coupon not found' });
        }

        res.status(200).json(coupon);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

// @desc Delete coupon
// @route DELETE /api/v1/coupon/:code
exports.deleteCoupon = asyncHandler(async (req,res) => {
    try {
        const coupon = await Coupon.findOneAndDelete({ code: req.params.code });

        if (!coupon) {
            return res.status(404).json({ message: 'Coupon not found' });
        }

        res.status(200).json({ message: 'Coupon deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});
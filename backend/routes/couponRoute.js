const express = require('express');
const { createCoupon, getAllCoupons, getCouponByCode, deleteCoupon } = require('../controllers/couponController');


const router = express.Router();

// Create a new coupon
router.post('/', createCoupon);

// Get all coupons
router.get('/', getAllCoupons);

// Get coupon by code
router.get('/:code', getCouponByCode);

// Delete coupon
router.delete('/:code', deleteCoupon);

module.exports = router;

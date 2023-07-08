const express = require("express");
const { getOrderDetails, paymentCature } = require("../controllers/razorpayController");
const { protect } = require("../middlewares/auth");

const router = express.Router();

router.route("/").post(protect, getOrderDetails);
router.route('/payment').post(protect, paymentCature)

module.exports = router;

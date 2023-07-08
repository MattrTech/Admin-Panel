const express = require("express");
const { getOrderDetails } = require("../controllers/razorpayController");
const { protect } = require("../middlewares/auth");

const router = express.Router();

router.route("/").post(protect, getOrderDetails);

module.exports = router;

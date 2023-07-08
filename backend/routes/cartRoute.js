const express = require('express');
const { getCartByUserId, addProductToCart, removeProductFromCart, clearCart } = require('../controllers/cartController');
const { protect } = require("../middlewares/auth");
const router = express.Router();

// Get cart by user ID
router.route('/').get(protect, getCartByUserId);

// Add product to cart
router.route('/add').post(protect, addProductToCart);

// Remove product from cart
router.route('/remove').post(protect, removeProductFromCart);

// Clear cart
router.route('/clear').post(clearCart);

module.exports = router;
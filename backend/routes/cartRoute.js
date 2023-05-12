const express = require('express');
const { getCartByUserId, addProductToCart, removeProductFromCart, clearCart } = require('../controllers/cartController');

const router = express.Router();

// Get cart by user ID
router.route('/:userId').get(getCartByUserId);

// Add product to cart
router.route('/add').post(addProductToCart);

// Remove product from cart
router.route('/remove').post(removeProductFromCart);

// Clear cart
router.route('/clear').post(clearCart);

module.exports = router;
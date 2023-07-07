const Cart = require('../models/cartModel');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const mongoose = require("mongoose");

// @desc Get cart by user ID
// @route 
exports.getCartByUserId = asyncHandler( async (req,res) => {
    try {
        const cart = await Cart.findOne({ user: req.params.userId })
            .populate('user', 'firstName lastName')
            .populate('products.product', 'name price');

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        res.status(200).json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong'});
    }
});

// @desc Add product to cart
// @route

exports.addProductToCart = asyncHandler(async (req,res) => {
    try {
        const { productId, quantity } = req.body;
        console.log(res.locals.user);
        console.log(res.locals.id);
        const userId = new mongoose.Types.ObjectId(req.user.id)
        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({ user: userId, products: [] });
        }

        // Check if product already exists in the cart
        const existingProduct = cart.products.find((item) => item.product.toString() === productId);

        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }

        const updatedCart = await cart.save();

        res.status(200).json(updatedCart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong", error });
    }
});

// @desc Remove product from cart
// @route

exports.removeProductFromCart = asyncHandler(async (req,res) => {
    try {
        const { userId, productId } = req.body;

        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.products = cart.products.filter((item) => item.product.toString() !== productId);

        const updatedCart = await cart.save();

        res.status(200).json(updatedCart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
});

// @desc Clear cart
// @route

exports.clearCart = asyncHandler(async (req,res) => {
    try {
        const { userId } = req.body;

        const cart = await Cart.findOne({ user:userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.products = [];

        const updatedCart = await cart.save();

        res.status(200).json(updatedCart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong'});
    }
});

const Cart = require('../models/cartModel');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const mongoose = require("mongoose");
const Product = require('../models/productModel');

// @desc Get cart by user ID
// @route 
exports.getCartByUserId = asyncHandler( async (req,res) => {
    try {
        const cart = await Cart.findOne({ user: res.locals.user.id });
        console.log(cart);
        const cardData = {
            user: res.locals.user,
            cartItems: []
        };
        for(let j =0; j< cart.products.length; j++){
            cardData.cartItems.push({product: await Product.findById(cart.products[j].product), quantity: cart.products[j].quantity,  size: cart.products[j].size})
        }
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        console.log(cardData)
        res.status(200).json(cardData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong'});
    }
});

// @desc Add product to cart
// @route

exports.addProductToCart = asyncHandler(async (req,res) => {
    try {
        const { productId, quantity, size } = req.body;
        const userId = new mongoose.Types.ObjectId(req.user.id)
        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({ user: userId, products: [] });
        }
        // Check if product already exists in the cart
        const existingProduct = cart.products.find((item) => item.product.toString() === productId);

        if (existingProduct) {
            existingProduct.quantity =Number(existingProduct.quantity) + Number(quantity);
        } else {
            cart.products.push({ product: productId, quantity, size });
        }
        console.log(existingProduct, cart, productId, { product: productId, quantity }, req.body)
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
        const {productId } = req.body;
        const userId = res.locals.user.id;
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

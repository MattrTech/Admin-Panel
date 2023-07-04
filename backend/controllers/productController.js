const Product = require('../models/productModel');
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");

// @desc Get All products
// @route GET /api/v1/product
exports.getAllProducts = asyncHandler(async(req,res) => {
    try {
        const products = await Product.find(); // Retrieve all products from the database
        res.status(200).json(products); // return the products as a response
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// @desc Get product with a specific id
// @route GET /api/v1/product/:id
exports.getProductById = asyncHandler(async (req, res) => {
    try {
        const product = await Product.findById(req.params.id); // retrieve a product by its ID
        if (!product) {
            return res.status(404).json({message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc Create a Product
// @route POST /api/v1/product
exports.createProduct = asyncHandler( async (req,res) => {
    const product = new Product(req.body); // create a new product using the request body
    try {
        const newProduct = await product.save() // save the new product to the database
        res.status(201).json(newProduct); // return the new product as a response
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc Update a product
// @route PUT /api/v1/product/:productId
exports.updateProduct = asyncHandler( async(req,res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // return the updated product
            runValidators: true, // validate the updated data against the schema
        });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product); // return the updated product as a response
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc Delete
// @route DELETE /api/v1/product/:productId
exports.deleteProduct = asyncHandler (async(req,res) => {
    try {
        const product = await Product.findByIdAndDelete(req,params.id); // delete a product by its ID
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(204).send(); // returnn a success status with no content
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add a user review to a product
exports.addReview = async (req, res) => {
    try {
      const { productId, userId, rating, comment } = req.body;
  
      const product = await Product.findById(productId);
  
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      const review = {
        user: userId,
        rating,
        comment
      };
  
      product.reviews.push(review);
  
      const updatedProduct = await product.save();
  
      res.status(201).json(updatedProduct);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Something went wrong' });
    }
};

// Update a user review for a product
exports.updateReview = async (req, res) => {
    try {
      const { productId, reviewId, rating, comment } = req.body;
  
      const product = await Product.findById(productId);
  
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      const review = product.reviews.id(reviewId);
  
      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }
  
      review.rating = rating;
      review.comment = comment;
  
      const updatedProduct = await product.save();
  
      res.status(200).json(updatedProduct);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Something went wrong' });
    }
};



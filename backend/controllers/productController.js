const Product = require('../models/productModel');


// @desc Get All products
// @route GET /api/v1/product
exports.getAllProducts = async(req,res) => {
    try {
        const products = await Product.find(); // Retrieve all products from the database
        res.status(200).json(products); // return the products as a response
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

// @desc Get product with a specific id
// @route GET /api/v1/product/:id
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id); // retrieve a product by its ID
        if (!product) {
            return res.status(404).json({message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// @desc Create a Product
// @route POST /api/v1/product
exports.createProduct = async (req,res) => {
    const product = new Product(req.body); // create a new product using the request body
    try {
        const newProduct = await product.save() // save the new product to the database
        res.status(201).json(newProduct); // return the new product as a response
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// @desc Update a product
// @route PUT /api/v1/product/:productId
exports.updateProduct = async(req,res) => {
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
}

// @desc Delete
// @route DELETE /api/v1/product/:productId
exports.deleteProduct = async(req,res) => {
    try {
        const product = await Product.findByIdAndDelete(req,params.id); // delete a product by its ID
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(204).send(); // returnn a success status with no content
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}



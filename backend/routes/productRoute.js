const express = require("express");
const { getAllProducts, createProduct, getProductById, updateProduct, deleteProduct } = require("../controllers/productController");

const router = express.Router();

router.route("/products").get(getAllProducts).post(createProduct);
router
    .route("/:id")
    .get(getProductById)
    .put(updateProduct)
    .delete(deleteProduct);

module.exports = router
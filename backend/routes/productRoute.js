const express = require("express");
const { getAllProducts, createProduct, getProductById, updateProduct, deleteProduct, addReview, updateReview } = require("../controllers/productController");

const router = express.Router();

router.route("/").get(getAllProducts).post(createProduct);
router
    .route("/:id")
    .get(getProductById)
    .put(updateProduct)
    .delete(deleteProduct);

router.route("/:id/reviews").post(addReview);
router.route("/:id/reviews/:reviewId").put(updateReview)

module.exports = router
const express = require("express");
const { createOrder, getAllOrders, getOrderById, deleteOrder, updateOrderStatus } = require("../controllers/orderController");


const router = express.Router();

router.route("/").post(createOrder).get(getAllOrders);
router
    .route('/:id')
    .get(getOrderById)
    .delete(deleteOrder);
router.route('/:id/status').put(updateOrderStatus);

module.exports = router;
const express = require("express");
const router = express.Router();

const checkAuth = require("../middleware/check-auth");
const OrdersController = require("../controllers/order");

router.get("/", checkAuth, OrdersController.getAllOrders);

router.post("/", checkAuth, OrdersController.createOrder);

router.get("/:orderId", checkAuth, OrdersController.getOneOrder);

router.delete("/:orderId", checkAuth, OrdersController.deleteOrder);

module.exports = router;

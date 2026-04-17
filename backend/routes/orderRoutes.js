const express = require("express");
const router = express.Router();

const {
  placeOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getAllOrders,
  getArtisanOrders, 
} = require("../controllers/orderController");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

// 🔐 All routes protected

// Place order (buyer)
router.post("/", protect, placeOrder);

// Get logged-in user's orders
router.get("/my", protect, getMyOrders);

// IMPORTANT: specific routes before dynamic :id
router.put("/:id/status", protect, authorize("artisan", "admin"), updateOrderStatus);
router.put("/:id/cancel", protect, cancelOrder);

// Admin: get all orders
router.get("/", protect, authorize("admin"), getAllOrders);
router.get("/artisan", protect, authorize("artisan"), getArtisanOrders);
// Get single order
router.get("/:id", protect, getOrderById);

module.exports = router;
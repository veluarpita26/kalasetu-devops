const express = require("express");
const router = express.Router();

const {
  approveArtisan,
  getAllUsers,
  deleteUser,
  deleteProductByAdmin,
  deletePostByAdmin,
  getAllOrders,
} = require("../controllers/adminController");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

// 🔐 All routes are admin protected

// Approve artisan
router.put("/approve/:id", protect, authorize("admin"), approveArtisan);

// Get all users (with optional filters)
router.get("/users", protect, authorize("admin"), getAllUsers);

// Delete user
router.delete("/user/:id", protect, authorize("admin"), deleteUser);

// Delete product
router.delete("/product/:id", protect, authorize("admin"), deleteProductByAdmin);

// Delete post
router.delete("/post/:id", protect, authorize("admin"), deletePostByAdmin);

// Get all orders
router.get("/orders", protect, authorize("admin"), getAllOrders);

module.exports = router;
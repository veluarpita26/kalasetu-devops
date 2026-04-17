const express = require("express");
const router = express.Router();

const {
  createReview,
  getProductReviews,
  deleteReview, // ✅ optional improvement
} = require("../controllers/reviewController");

const { protect } = require("../middleware/authMiddleware");

// Routes
router.post("/", protect, createReview);
router.get("/:productId", getProductReviews);
router.delete("/:id", protect, deleteReview); // ✅ optional

module.exports = router;
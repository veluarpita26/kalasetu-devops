const express = require("express");
const router = express.Router();

const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getMyProducts,
} = require("../controllers/productController");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

// ─── Public ───────────────────────────────────────────────────────────────────
router.get("/", getAllProducts);

// ─── Artisan (must be before /:id to avoid "my" being treated as an ID) ──────
router.get("/my", protect, authorize("artisan"), getMyProducts);

// ─── Public (dynamic param) ───────────────────────────────────────────────────
router.get("/:id", getProductById);

// ─── Artisan (write operations) ───────────────────────────────────────────────
router.post("/", protect, authorize("artisan"), createProduct);
router.put("/:id", protect, authorize("artisan"), updateProduct);
router.delete("/:id", protect, authorize("artisan", "admin"), deleteProduct);

module.exports = router;
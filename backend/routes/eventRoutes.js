const express = require("express");
const router = express.Router();

const {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  registerForEvent,
} = require("../controllers/eventController");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware"); // optional (for image)

// 🔓 Public routes
router.get("/", getAllEvents);

// IMPORTANT: specific routes before dynamic :id
router.put("/:id/register", protect, registerForEvent);

// Dynamic route
router.get("/:id", getEventById);

// 🔐 Protected routes

// Create event (artisan / admin)
router.post(
  "/",
  protect,
  authorize("artisan", "admin"),
  upload.single("image"), // optional
  createEvent
);

// Update event
router.put(
  "/:id",
  protect,
  authorize("artisan", "admin"),
  upload.single("image"), // optional
  updateEvent
);

// Delete event
router.delete("/:id", protect, authorize("artisan", "admin"), deleteEvent);

module.exports = router;
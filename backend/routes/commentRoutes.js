const express = require("express");
const router = express.Router();

const {
  addComment,
  getPostComments,
  updateComment,
  deleteComment,
  likeComment,
} = require("../controllers/commentController");

const { protect } = require("../middleware/authMiddleware");

// 🔓 Public
router.get("/:postId", getPostComments);

// 🔐 Private
router.post("/", protect, addComment);
router.put("/:id", protect, updateComment);
router.delete("/:id", protect, deleteComment);
router.put("/:id/like", protect, likeComment);

module.exports = router;
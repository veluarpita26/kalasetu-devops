const express = require("express");
const router = express.Router();

const {
  createPost,
  getAllPosts,
  likePost,
  getComments,
  addComment,
  deleteComment,
} = require("../controllers/postController");

const { protect } = require("../middleware/authMiddleware");

// ================= POSTS =================
router.get("/", getAllPosts);
router.post("/", protect, createPost);
router.put("/:id/like", protect, likePost);

// ================= COMMENTS =================
router.get("/:id/comments", getComments);
router.post("/:id/comments", protect, addComment);
router.delete("/:id/comments/:commentId", protect, deleteComment);

module.exports = router;
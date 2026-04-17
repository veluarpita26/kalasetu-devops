// controllers/commentController.js

const Comment = require("../models/Comment");
const Post = require("../models/Post");
const sendResponse = require("../utils/sendResponse");

// @desc    Add a comment to a post
// @route   POST /api/comments
// @access  Private
const addComment = async (req, res, next) => {
  try {
    const { postId, content, parentComment } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    const comment = await Comment.create({
      author: req.user._id,
      post: postId,
      content,
      parentComment: parentComment || null,
    });

    return sendResponse(res, 201, true, "Comment added", comment);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all comments for a post
// @route   GET /api/comments/:postId
// @access  Public
const getPostComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({
      post: req.params.postId,
      parentComment: null,
    })
      .populate("author", "name avatar")
      .sort({ createdAt: -1 });

    return sendResponse(res, 200, true, "Comments fetched", comments);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a comment
// @route   PUT /api/comments/:id
// @access  Private (owner)
const updateComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    comment.content = req.body.content || comment.content;
    comment.isEdited = true;
    await comment.save();

    return sendResponse(res, 200, true, "Comment updated", comment);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private (owner or admin)
const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }
    if (comment.author.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    await comment.deleteOne();
    return sendResponse(res, 200, true, "Comment deleted", null);
  } catch (error) {
    next(error);
  }
};

// @desc    Like / Unlike a comment
// @route   PUT /api/comments/:id/like
// @access  Private
const likeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }

    const alreadyLiked = comment.likes.includes(req.user._id);
    if (alreadyLiked) {
      comment.likes = comment.likes.filter((id) => id.toString() !== req.user._id.toString());
    } else {
      comment.likes.push(req.user._id);
    }

    comment.likesCount = comment.likes.length;
    await comment.save();

    return sendResponse(res, 200, true, alreadyLiked ? "Unliked" : "Liked", { likesCount: comment.likesCount });
  } catch (error) {
    next(error);
  }
};

module.exports = { addComment, getPostComments, updateComment, deleteComment, likeComment };
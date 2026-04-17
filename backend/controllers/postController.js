const Post = require("../models/Post");
const Comment = require("../models/Comment");
const sendResponse = require("../utils/sendResponse");

// ================= POSTS =================

// CREATE POST
const createPost = async (req, res, next) => {
  try {
    const post = await Post.create({
      author: req.user._id,
      title: req.body.title,
      content: req.body.content,
      images: req.body.images || [],
      category: req.body.category || "Discussion",
    });

    return sendResponse(res, 201, true, "Post created", post);
  } catch (error) {
    next(error);
  }
};

// GET ALL POSTS
const getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find()
      .populate("author", "name avatar")
      .sort({ createdAt: -1 });

    return sendResponse(res, 200, true, "Posts fetched", {
      posts,
    });
  } catch (error) {
    next(error);
  }
};

// LIKE / UNLIKE POST
const likePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    const alreadyLiked = post.likes.includes(req.user._id);

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== req.user._id.toString()
      );
    } else {
      post.likes.push(req.user._id);
    }

    post.likesCount = post.likes.length;
    await post.save();

    return sendResponse(res, 200, true, "Like updated", post);
  } catch (error) {
    next(error);
  }
};

// ================= COMMENTS =================

// GET COMMENTS
const getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ post: req.params.id })
      .populate("user", "name avatar")
      .sort({ createdAt: -1 });

    return sendResponse(res, 200, true, "Comments fetched", comments);
  } catch (error) {
    next(error);
  }
};

// ADD COMMENT
const addComment = async (req, res, next) => {
  try {
    const comment = await Comment.create({
      post: req.params.id,
      user: req.user._id,
      content: req.body.content,
    });

    return sendResponse(res, 201, true, "Comment added", comment);
  } catch (error) {
    next(error);
  }
};

// DELETE COMMENT
const deleteComment = async (req, res, next) => {
  try {
    await Comment.findByIdAndDelete(req.params.commentId);

    return sendResponse(res, 200, true, "Comment deleted");
  } catch (error) {
    next(error);
  }
};

// ================= EXPORT =================

module.exports = {
  createPost,
  getAllPosts,
  likePost,
  getComments,
  addComment,
  deleteComment,
};
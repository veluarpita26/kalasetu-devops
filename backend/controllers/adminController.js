const User = require("../models/User");
const Product = require("../models/Product");
const Post = require("../models/Post");
const Order = require("../models/Order");
const sendResponse = require("../utils/sendResponse");


// @desc    Approve Artisan
// @route   PUT /api/admin/approve/:id
// @access  Private (Admin)
const approveArtisan = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return sendResponse(res, 404, false, "User not found");
    }

    if (user.role !== "artisan") {
      return sendResponse(res, 400, false, "User is not an artisan");
    }

    if (user.isApproved) {
      return sendResponse(res, 400, false, "Artisan already approved");
    }

    user.isApproved = true;
    await user.save();

    return sendResponse(res, 200, true, "Artisan approved successfully", user);
  } catch (error) {
    next(error);
  }
};


// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res, next) => {
  try {
    const { role, search } = req.query;

    let query = {};

    if (role) query.role = role;

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(query).select("-password");

    return sendResponse(res, 200, true, "Users fetched successfully", users);
  } catch (error) {
    next(error);
  }
};


// @desc    Delete user
// @route   DELETE /api/admin/user/:id
// @access  Private (Admin)
const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return sendResponse(res, 404, false, "User not found");
    }

    // Prevent admin deleting self
    if (user._id.toString() === req.user._id.toString()) {
      return sendResponse(res, 400, false, "Admin cannot delete own account");
    }

    await user.deleteOne();

    return sendResponse(res, 200, true, "User deleted successfully");
  } catch (error) {
    next(error);
  }
};


// @desc    Delete product (admin control)
// @route   DELETE /api/admin/product/:id
// @access  Private (Admin)
const deleteProductByAdmin = async (req, res, next) => {
  try {
    const productId = req.params.id;

    const product = await Product.findById(productId);
    if (!product) {
      return sendResponse(res, 404, false, "Product not found");
    }

    await product.deleteOne();

    return sendResponse(res, 200, true, "Product deleted by admin");
  } catch (error) {
    next(error);
  }
};


// @desc    Delete post (admin control)
// @route   DELETE /api/admin/post/:id
// @access  Private (Admin)
const deletePostByAdmin = async (req, res, next) => {
  try {
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) {
      return sendResponse(res, 404, false, "Post not found");
    }

    await post.deleteOne();

    return sendResponse(res, 200, true, "Post deleted by admin");
  } catch (error) {
    next(error);
  }
};


// @desc    Get all orders (with filters)
// @route   GET /api/admin/orders
// @access  Private (Admin)
const getAllOrders = async (req, res, next) => {
  try {
    const { status } = req.query;

    let query = {};
    if (status) query.status = status;

    const orders = await Order.find(query)
      .populate("user", "name email")
      .populate("items.product", "name price")
      .sort({ createdAt: -1 });

    return sendResponse(res, 200, true, "Orders fetched successfully", orders);
  } catch (error) {
    next(error);
  }
};


module.exports = {
  approveArtisan,
  getAllUsers,
  deleteUser,
  deleteProductByAdmin,
  deletePostByAdmin,
  getAllOrders,
};
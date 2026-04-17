// controllers/reviewController.js

const Review = require("../models/Review");
const Product = require("../models/Product");
const Order = require("../models/Order");
const sendResponse = require("../utils/sendResponse");

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private (buyer)
const createReview = async (req, res, next) => {
  try {
    const { productId, rating, title, comment } = req.body;
    const images = req.files ? req.files.map((f) => f.filename) : [];

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Check if already reviewed
    const existing = await Review.findOne({ user: req.user._id, product: productId });
    if (existing) {
      return res.status(400).json({ success: false, message: "You have already reviewed this product" });
    }

    // Check verified purchase
    const order = await Order.findOne({
      buyer: req.user._id,
      "orderItems.product": productId,
      orderStatus: "Delivered",
    });

    const review = await Review.create({
      user: req.user._id,
      product: productId,
      rating,
      title,
      comment,
      images,
      isVerifiedPurchase: !!order,
    });

    return sendResponse(res, 201, true, "Review submitted", review);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reviews for a product
// @route   GET /api/reviews/:productId
// @access  Public
const getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate("user", "name avatar")
      .sort({ createdAt: -1 });

    return sendResponse(res, 200, true, "Reviews fetched", reviews);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private (owner)
const updateReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const { rating, title, comment } = req.body;
    review.rating = rating || review.rating;
    review.title = title || review.title;
    review.comment = comment || review.comment;
    await review.save();

    return sendResponse(res, 200, true, "Review updated", review);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private (owner or admin)
const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    await review.deleteOne();
    return sendResponse(res, 200, true, "Review deleted", null);
  } catch (error) {
    next(error);
  }
};

module.exports = { createReview, getProductReviews, updateReview, deleteReview };
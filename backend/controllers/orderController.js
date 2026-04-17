// controllers/orderController.js

const Order = require("../models/Order");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const sendResponse = require("../utils/sendResponse");

// @desc    Place a new order
// @route   POST /api/orders
// @access  Private (buyer)
const placeOrder = async (req, res, next) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: "No order items provided" });
    }

    const order = await Order.create({
      buyer: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
    });

    // Decrease stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    // Clear cart after order
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [], totalPrice: 0 });

    return sendResponse(res, 201, true, "Order placed successfully", order);
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged-in user's orders
// @route   GET /api/orders/my
// @access  Private (buyer)
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ buyer: req.user._id })
      .populate("orderItems.product", "name images")
      .sort({ createdAt: -1 });

    return sendResponse(res, 200, true, "Your orders fetched", orders);
  } catch (error) {
    next(error);
  }
};
// @desc    Get orders for artisan (only their products)
// @route   GET /api/orders/artisan
// @access  Private (artisan)
const getArtisanOrders = async (req, res, next) => {
  try {
    const artisanId = req.user._id;

    const orders = await Order.find()
      .populate({
        path: "orderItems.product",
        select: "name images artisan",
        populate: {
          path: "artisan",
          select: "_id"
        }
      })
      .sort({ createdAt: -1 });

    const artisanOrders = orders
      .map((order) => {
        const myItems = order.orderItems.filter(
          (item) =>
            item.product?.artisan?._id?.toString() === artisanId.toString()
        );

        if (myItems.length === 0) return null;

        return {
          _id: order._id,
          orderStatus: order.orderStatus,
          createdAt: order.createdAt,
          items: myItems,
        };
      })
      .filter(Boolean);

    return sendResponse(res, 200, true, "Artisan orders fetched", artisanOrders);

  } catch (error) {
    next(error);
  }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("buyer", "name email")
      .populate("orderItems.product", "name images price");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.buyer._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    return sendResponse(res, 200, true, "Order fetched", order);
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (artisan / admin)
const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    order.orderStatus = orderStatus;
    if (orderStatus === "Delivered") {
      order.deliveredAt = new Date();
    }

    await order.save();
    return sendResponse(res, 200, true, "Order status updated", order);
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private (buyer)
const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    if (["Dispatched", "Delivered"].includes(order.orderStatus)) {
      return res.status(400).json({ success: false, message: "Cannot cancel at this stage" });
    }

    order.orderStatus = "Cancelled";
    await order.save();

    // Restore stock
    for (const item of order.orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
      });
    }

    return sendResponse(res, 200, true, "Order cancelled", order);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Private (admin)
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate("buyer", "name email")
      .sort({ createdAt: -1 });

    return sendResponse(res, 200, true, "All orders fetched", orders);
  } catch (error) {
    next(error);
  }
};

module.exports = { 
  placeOrder, 
  getMyOrders, 
  getOrderById, 
  updateOrderStatus, 
  cancelOrder, 
  getAllOrders,
  getArtisanOrders   // 🔥 ADD THIS
};
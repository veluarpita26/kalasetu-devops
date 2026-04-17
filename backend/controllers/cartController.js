const Cart = require("../models/Cart");
const Product = require("../models/Product");
const sendResponse = require("../utils/sendResponse");

// 🔥 Helper: populate cart
const getPopulatedCart = async (cartId) => {
  return await Cart.findById(cartId)
    .populate("items.product", "name images price stock");
};

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
      .populate("items.product", "name images price stock");

    if (!cart) {
      return sendResponse(res, 200, true, "Cart is empty", {
        items: [],
        totalPrice: 0,
      });
    }

    return sendResponse(res, 200, true, "Cart fetched", cart);
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return sendResponse(res, 404, false, "Product not found");
    }

    if (product.stock < quantity) {
      return sendResponse(res, 400, false, "Insufficient stock");
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [
          {
            product: productId,
            quantity,
            price: product.price,
          },
        ],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (i) => i.product.toString() === productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({
          product: productId,
          quantity,
          price: product.price,
        });
      }

      await cart.save();
    }

    const populatedCart = await getPopulatedCart(cart._id);

    return sendResponse(res, 200, true, "Item added to cart", populatedCart);
  } catch (error) {
    next(error);
  }
};

// @desc    Update item quantity
// @route   PUT /api/cart/:productId
// @access  Private
const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return sendResponse(res, 404, false, "Cart not found");
    }

    const itemIndex = cart.items.findIndex(
      (i) => i.product.toString() === productId
    );

    if (itemIndex === -1) {
      return sendResponse(res, 404, false, "Item not in cart");
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();

    const populatedCart = await getPopulatedCart(cart._id);

    return sendResponse(res, 200, true, "Cart updated", populatedCart);
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item
// @route   DELETE /api/cart/:productId
// @access  Private
const removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return sendResponse(res, 404, false, "Cart not found");
    }

    cart.items = cart.items.filter(
      (i) => i.product.toString() !== productId
    );

    await cart.save();

    const populatedCart = await getPopulatedCart(cart._id);

    return sendResponse(res, 200, true, "Item removed", populatedCart);
  } catch (error) {
    next(error);
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return sendResponse(res, 200, true, "Cart already empty", {
        items: [],
        totalPrice: 0,
      });
    }

    cart.items = [];
    await cart.save();

    return sendResponse(res, 200, true, "Cart cleared", {
      items: [],
      totalPrice: 0,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
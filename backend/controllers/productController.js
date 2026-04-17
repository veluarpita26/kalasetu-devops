const Product = require("../models/Product");
const sendResponse = require("../utils/sendResponse");

// @desc    Create product
const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create({
      ...req.body,
      artisan: req.user._id,
      images: req.body.images || [], // ✅ FIXED
    });

    return sendResponse(res, 201, true, "Product created", product);
  } catch (error) {
    console.log("❌ CREATE PRODUCT ERROR:", error.message);
    next(error);
  }
};

  

// @desc    Get all products
const getAllProducts = async (req, res, next) => {
  try {
    const { category, minPrice, maxPrice, search, sort, page = 1, limit = 12 } = req.query;

    const query = { artisan: { $ne: null } };

    if (category) query.category = category;

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === "price_asc") sortOption = { price: 1 };
    else if (sort === "price_desc") sortOption = { price: -1 };
    else if (sort === "rating") sortOption = { ratings: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(query);

    const products = await Product.find(query)
      .populate({
        path: "artisan",
        select: "name avatar",
        options: { strictPopulate: false },
      })
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit))
      .lean();

    return sendResponse(res, 200, true, "Products fetched", {
      products,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });

  } catch (error) {
    console.log("❌ PRODUCT ERROR:", error.message);
    next(error);
  }
};

// @desc    Get single product
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate("artisan", "name avatar");

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    return sendResponse(res, 200, true, "Product fetched", product);
  } catch (error) {
    console.log("❌ GET PRODUCT ERROR:", error.message);
    next(error);
  }
};

// @desc    Update product
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: "Not found" });

    if (product.artisan.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    return sendResponse(res, 200, true, "Updated", updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
const deleteProduct = async (req, res, next) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    return sendResponse(res, 200, true, "Deleted");
  } catch (error) {
    next(error);
  }
};

// @desc    Get artisan products
const getMyProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ artisan: req.user._id });
    return sendResponse(res, 200, true, "My products", products);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getMyProducts,
};
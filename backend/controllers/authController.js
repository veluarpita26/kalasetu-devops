const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const sendResponse = require("../utils/sendResponse");

// REGISTER
const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendResponse(res, 400, false, "Email already registered");
    }

    const user = await User.create({ name, email, password, role });
    const token = generateToken(user._id);

    return sendResponse(res, 201, true, "User registered successfully", {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });

  } catch (error) {
    next(error);
  }
};

// LOGIN
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
      return sendResponse(res, 401, false, "Invalid email or password");
    }

    if (!user.isActive) {
      return sendResponse(res, 403, false, "Account is deactivated");
    }

    const token = generateToken(user._id);

    return sendResponse(res, 200, true, "Login successful", {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });

  } catch (error) {
    next(error);
  }
};

// GET PROFILE
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    return sendResponse(res, 200, true, "User profile fetched", user);
  } catch (error) {
    next(error);
  }
};

// UPDATE PROFILE
const updateMe = async (req, res, next) => {
  try {
    const { name, bio, phone, address } = req.body;
    const avatar = req.file ? req.file.filename : undefined;

    const updateData = { name, bio, phone, address };
    if (avatar) updateData.avatar = avatar;

    const user = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
      runValidators: true,
    });

    return sendResponse(res, 200, true, "Profile updated successfully", user);
  } catch (error) {
    next(error);
  }
};

// CHANGE PASSWORD
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select("+password");

    if (!(await user.matchPassword(currentPassword))) {
      return sendResponse(res, 401, false, "Current password is incorrect");
    }

    user.password = newPassword;
    await user.save();

    return sendResponse(res, 200, true, "Password changed successfully", null);
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe, updateMe, changePassword };
const Event = require("../models/Event");
const sendResponse = require("../utils/sendResponse");

// @desc    Create an event
// @route   POST /api/events
// @access  Private (artisan / admin)
const createEvent = async (req, res, next) => {
  try {
    const {
      title,
      description,
      eventType,
      mode,
      location,
      startDate,
      endDate,
      registrationDeadline,
      maxParticipants,
      tags,
    } = req.body;

    const image = req.file ? req.file.filename : "";

    const event = await Event.create({
      organizer: req.user._id,
      title,
      description,
      eventType,
      mode,
      location,
      startDate,
      endDate,
      registrationDeadline,
      maxParticipants,
      tags,
      image,
    });

    return sendResponse(res, 201, true, "Event created", event);
  } catch (error) {
    console.log("❌ CREATE EVENT ERROR:", error.message);
    next(error);
  }
};

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getAllEvents = async (req, res, next) => {
  try {
    const { eventType, mode, search, page = 1, limit = 10 } = req.query;

    const query = { organizer: { $ne: null } }; // ✅ prevent null crash

    if (eventType) query.eventType = eventType;
    if (mode) query.mode = mode;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Event.countDocuments(query);

    const events = await Event.find(query)
      .populate({
        path: "organizer",
        select: "name avatar",
        options: { strictPopulate: false }, // ✅ safe populate
      })
      .sort({ startDate: 1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    return sendResponse(res, 200, true, "Events fetched", {
      events,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    console.log("❌ GET EVENTS ERROR:", error.message);
    next(error);
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate({
      path: "organizer",
      select: "name avatar bio",
      options: { strictPopulate: false },
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    return sendResponse(res, 200, true, "Event fetched", event);
  } catch (error) {
    console.log("❌ GET EVENT BY ID ERROR:", error.message);
    next(error);
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (organizer or admin)
const updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    if (
      event.organizer.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const image = req.file ? req.file.filename : event.image;

    const updated = await Event.findByIdAndUpdate(
      req.params.id,
      { ...req.body, image },
      { new: true, runValidators: true }
    );

    return sendResponse(res, 200, true, "Event updated", updated);
  } catch (error) {
    console.log("❌ UPDATE EVENT ERROR:", error.message);
    next(error);
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (organizer or admin)
const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    if (
      event.organizer.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    await event.deleteOne();

    return sendResponse(res, 200, true, "Event deleted", null);
  } catch (error) {
    console.log("❌ DELETE EVENT ERROR:", error.message);
    next(error);
  }
};

// @desc    Register for an event
// @route   PUT /api/events/:id/register
// @access  Private
const registerForEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    if (event.registeredUsers?.includes(req.user._id)) {
      return res.status(400).json({ success: false, message: "Already registered" });
    }

    if (
      event.maxParticipants > 0 &&
      event.registeredCount >= event.maxParticipants
    ) {
      return res.status(400).json({ success: false, message: "Event is full" });
    }

    event.registeredUsers.push(req.user._id);
    event.registeredCount = (event.registeredCount || 0) + 1;

    await event.save();

    return sendResponse(res, 200, true, "Registered successfully", null);
  } catch (error) {
    console.log("❌ REGISTER EVENT ERROR:", error.message);
    next(error);
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  registerForEvent,
};
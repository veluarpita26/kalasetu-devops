const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    // 🎯 BASIC INFO
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },

    description: {
      type: String,
      required: [true, "Event description is required"],
      maxlength: [3000, "Description cannot exceed 3000 characters"],
    },

    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Organizer reference is required"],
    },

    image: {
      type: String,
      default: "",
    },

    // 🎯 EVENT TYPE
    eventType: {
      type: String,
      enum: ["Exhibition", "Workshop", "Webinar", "Fair", "Other"],
      default: "Exhibition",
    },

    mode: {
      type: String,
      enum: ["Online", "Offline", "Hybrid"],
      default: "Offline",
    },

    // 📍 LOCATION (NESTED OBJECT)
    location: {
      venue: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      country: { type: String, default: "India" },
      link: { type: String, default: "" }, // for online events
    },

    // 📅 DATES
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },

    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },

    registrationDeadline: {
      type: Date,
      default: null,
    },

    // 👥 PARTICIPANTS
    maxParticipants: {
      type: Number,
      default: 0, // 0 = unlimited
    },

    registeredUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    registeredCount: {
      type: Number,
      default: 0,
    },

    // ⭐ FLAGS
    isFeatured: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // 🏷 TAGS
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Event", eventSchema);
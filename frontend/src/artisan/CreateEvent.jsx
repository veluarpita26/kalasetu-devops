import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as eventsAPI from "../api/eventApi";
import toast from "react-hot-toast";

const CreateEvent = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    eventType: "Workshop",
    mode: "Offline",
    location: {
      venue: "",
      city: "",
      state: "",
      country: "India",
      link: "",
    },
    startDate: "",
    endDate: "",
    registrationDeadline: "",
    maxParticipants: 50,
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔥 HANDLE SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.description) {
      return toast.error("Please fill all required fields");
    }

    if (form.endDate < form.startDate) {
      return toast.error("End date cannot be before start date");
    }

    try {
      setLoading(true);

      const data = new FormData();

      // BASIC
      data.append("title", form.title);
      data.append("description", form.description);
      data.append("eventType", form.eventType);
      data.append("mode", form.mode);

      // LOCATION (NESTED)
      data.append("location[venue]", form.location.venue);
      data.append("location[city]", form.location.city);
      data.append("location[state]", form.location.state);
      data.append("location[country]", form.location.country);
      data.append("location[link]", form.location.link);

      // DATES
      data.append("startDate", form.startDate);
      data.append("endDate", form.endDate);
      data.append("registrationDeadline", form.registrationDeadline);

      // OTHER
      data.append("maxParticipants", form.maxParticipants);

      if (image) {
        data.append("image", image);
      }

      await eventsAPI.createEvent(data);

      toast.success("Event created successfully 🎉");
      navigate("/events");

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: 20 }}>
      <h1 style={{ marginBottom: 20 }}>🎪 Create Event</h1>

      <form onSubmit={handleSubmit}>

        {/* TITLE */}
        <input
          placeholder="Event Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          style={inputStyle}
        />

        {/* DESCRIPTION */}
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          style={inputStyle}
        />

        {/* LOCATION */}
        <input
          placeholder="Venue"
          value={form.location.venue}
          onChange={(e) =>
            setForm({
              ...form,
              location: { ...form.location, venue: e.target.value },
            })
          }
          style={inputStyle}
        />

        <input
          placeholder="City"
          value={form.location.city}
          onChange={(e) =>
            setForm({
              ...form,
              location: { ...form.location, city: e.target.value },
            })
          }
          style={inputStyle}
        />

        <input
          placeholder="State"
          value={form.location.state}
          onChange={(e) =>
            setForm({
              ...form,
              location: { ...form.location, state: e.target.value },
            })
          }
          style={inputStyle}
        />

        {/* TYPE */}
        <select
          value={form.eventType}
          onChange={(e) => setForm({ ...form, eventType: e.target.value })}
          style={inputStyle}
        >
          {["Exhibition", "Workshop", "Webinar", "Fair", "Other"].map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        {/* MODE */}
        <select
          value={form.mode}
          onChange={(e) => setForm({ ...form, mode: e.target.value })}
          style={inputStyle}
        >
          <option>Offline</option>
          <option>Online</option>
          <option>Hybrid</option>
        </select>

        {/* DATES */}
        <label>Start Date</label>
        <input
          type="date"
          value={form.startDate}
          onChange={(e) =>
            setForm({ ...form, startDate: e.target.value })
          }
          style={inputStyle}
        />

        <label>End Date</label>
        <input
          type="date"
          value={form.endDate}
          onChange={(e) =>
            setForm({ ...form, endDate: e.target.value })
          }
          style={inputStyle}
        />

        <label>Registration Deadline</label>
        <input
          type="date"
          value={form.registrationDeadline}
          onChange={(e) =>
            setForm({
              ...form,
              registrationDeadline: e.target.value,
            })
          }
          style={inputStyle}
        />

        {/* PARTICIPANTS */}
        <input
          type="number"
          placeholder="Max Participants"
          value={form.maxParticipants}
          onChange={(e) =>
            setForm({ ...form, maxParticipants: e.target.value })
          }
          style={inputStyle}
        />

        {/* IMAGE */}
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          style={inputStyle}
        />

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          style={buttonStyle}
        >
          {loading ? "Creating..." : "Create Event"}
        </button>

      </form>
    </div>
  );
};

// 🎨 STYLES
const inputStyle = {
  width: "100%",
  padding: 10,
  marginBottom: 12,
  borderRadius: 6,
  border: "1px solid #ccc",
};

const buttonStyle = {
  width: "100%",
  padding: 12,
  background: "#7c3aed",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  fontWeight: 600,
  cursor: "pointer",
};

export default CreateEvent;
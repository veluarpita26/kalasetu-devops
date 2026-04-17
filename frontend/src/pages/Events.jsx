import React, { useState, useEffect } from "react";
import * as eventApi from "../api/eventApi";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { FiCalendar, FiMapPin, FiUsers, FiClock, FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";

const Events = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);

      const res = await eventApi.getAllEvents();
      console.log("EVENT RESPONSE:", res.data);

      const eventsArray = res?.data?.data?.events || [];
      setEvents(eventsArray);

    } catch (err) {
      console.error(err);
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (id) => {
    if (!user) {
      toast.error("Please login to register");
      return;
    }

    try {
      await eventApi.registerInterest(id);
      toast.success("Registered successfully 🎉");
      fetchEvents();
    } catch {
      toast.error("Already registered or failed");
    }
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  if (loading) return <Loader />;

  return (
    <div className="page-content">

      {/* HEADER */}
      <div className="page-header">
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <h1>🎪 Events & Exhibitions</h1>
              <p>Discover craft fairs & workshops</p>
            </div>

            {user?.role === "artisan" && (
              <Link to="/artisan/events/create" className="btn btn-primary">
                <FiPlus /> Create Event
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* EVENTS */}
      <div className="container">
        {events.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40 }}>
            <FiCalendar size={50} />
            <h3>No events yet</h3>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 20,
            }}
          >
            {events.map((event) => {
              const isRegistered = event.registeredUsers?.includes(user?._id);

              const seatsLeft =
                event.maxParticipants === 0
                  ? "Unlimited"
                  : event.maxParticipants - event.registeredCount;

              return (
                <div
                  key={event._id}
                  style={{
                    background: "#fff",
                    borderRadius: 12,
                    padding: 16,
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                  }}
                >
                  <h3>{event.title}</h3>

                  {/* ✅ FIXED LOCATION */}
                  <p>
                    <FiMapPin />{" "}
                    {event.location?.venue}, {event.location?.city}, {event.location?.state}
                  </p>

                  {/* ✅ FIXED DATE */}
                  <p>
                    <FiClock /> {formatDate(event.startDate)}
                  </p>

                  {/* ✅ FIXED USERS */}
                  <p>
                    <FiUsers /> {event.registeredCount} registered
                  </p>

                  {/* ✅ SEATS */}
                  <p>🎟 Seats left: {seatsLeft}</p>

                  <p>{event.description}</p>

                  {/* ✅ BUTTON */}
                  {user && isRegistered ? (
                    <button
                      disabled
                      style={{ background: "green", color: "#fff", padding: 8 }}
                    >
                      Registered
                    </button>
                  ) : (
                    <button
                      onClick={() => handleRegister(event._id)}
                      style={{
                        background: "#7c3aed",
                        color: "#fff",
                        padding: 8,
                        border: "none",
                        borderRadius: 6,
                      }}
                    >
                      Register
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
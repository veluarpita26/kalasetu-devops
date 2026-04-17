import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as productsAPI from "../api/productApi";
import * as eventsAPI from "../api/eventApi";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      productsAPI.getAllProducts(),
      eventsAPI.getAllEvents()
    ])
      .then(([p, e]) => {
        setProducts(p.data.data?.products || []);
        setEvents((e.data.data?.events || []).slice(0, 3));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader fullScreen message="Loading KalaSetu..." />;

  return (
    <div>

      {/* ================= HERO ================= */}
      <section style={{
        background: "linear-gradient(135deg, #4c1d95 0%, #7c3aed 40%, #c4b5fd 100%)",
        color: "#fff",
        padding: "100px 5vw",
        textAlign: "center",
        position: "relative",
        overflow: "hidden"
      }}>

        {/* Glow effect */}
        <div style={{
          position: "absolute",
          width: 400,
          height: 400,
          background: "rgba(255,255,255,0.08)",
          borderRadius: "50%",
          top: "-100px",
          left: "-100px",
          filter: "blur(80px)"
        }} />

        <div style={{ maxWidth: 800, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <div style={{ fontSize: 50, marginBottom: 16 }}>🪡</div>

          <h1 style={{
            fontSize: "clamp(32px,5vw,58px)",
            fontWeight: 900,
            marginBottom: 20,
            lineHeight: 1.2
          }}>
            Discover Authentic Indian Crafts
          </h1>

          <p style={{
            fontSize: 18,
            opacity: 0.9,
            marginBottom: 40,
            lineHeight: 1.8,
            maxWidth: 600,
            marginInline: "auto"
          }}>
            Connect directly with skilled artisans across India — pottery, weaving, painting & more.
          </p>

          <div style={{
            display: "flex",
            gap: 20,
            justifyContent: "center",
            flexWrap: "wrap"
          }}>

            {/* Shop */}
            <Link to="/products/list" style={{
              background: "#fff",
              color: "#7c3aed",
              padding: "14px 34px",
              borderRadius: 12,
              fontWeight: 800,
              textDecoration: "none",
              fontSize: 16,
              boxShadow: "0 6px 20px rgba(0,0,0,0.15)"
            }}>
              🛍️ Shop Now
            </Link>

            {/* Artisan */}
            <Link to="/register?role=artisan" style={{
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(10px)",
              color: "#fff",
              padding: "14px 34px",
              borderRadius: 12,
              fontWeight: 700,
              textDecoration: "none",
              fontSize: 16,
              border: "1px solid rgba(255,255,255,0.4)"
            }}>
              🎨 Join as Artisan
            </Link>

          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section style={{ background: "#f5f3ff", padding: "40px 5vw" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 40, flexWrap: "wrap" }}>
          {[["200M+", "Artisans"], ["100%", "Handmade"], ["Direct", "From Makers"], ["Secure", "Payments"]].map(([val, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#7c3aed" }}>{val}</div>
              <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= PRODUCTS ================= */}
      <section style={{ padding: "60px 5vw" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
          <h2 style={{ fontSize: 26, fontWeight: 800 }}>Featured Products</h2>
          <Link to="/products/list" style={{ color: "#7c3aed" }}>View All →</Link>
        </div>

        {products.length === 0 ? (
          <p style={{ textAlign: "center", color: "#9ca3af" }}>No products yet.</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(230px,1fr))", gap: 20 }}>
            {products.slice(0, 8).map(p => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* ================= EVENTS ================= */}
      {events.length > 0 && (
        <section style={{ padding: "60px 5vw", background: "#faf5ff" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
            <h2 style={{ fontSize: 26, fontWeight: 800 }}>Upcoming Events</h2>
            <Link to="/events" style={{ color: "#7c3aed" }}>View All →</Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 20 }}>
            {events.map(ev => (
              <div key={ev._id} style={{
                background: "#fff",
                borderRadius: 14,
                padding: 20,
                border: "1px solid #ede9fe"
              }}>
                <h3>{ev.title}</h3>
                <p>📅 {new Date(ev.startDate).toLocaleDateString()}</p>
                <p>📍 {ev.location?.city || "Online"}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ================= CTA ================= */}
      <section style={{
        background: "linear-gradient(135deg, #1f1f2e, #4c1d95)",
        color: "#fff",
        padding: "60px 5vw",
        textAlign: "center"
      }}>
        <h2>Are You an Artisan?</h2>
        <p>Start selling your crafts today</p>

        <Link to="/register?role=artisan" style={{
          background: "#7c3aed",
          padding: "14px 30px",
          borderRadius: 10,
          color: "#fff",
          textDecoration: "none"
        }}>
          Register as Artisan
        </Link>
      </section>

    </div>
  );
};

export default Home;
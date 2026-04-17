import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as productsAPI from "../api/productApi";
import * as ordersAPI from "../api/orderApi";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

const ArtisanDashboard = () => {
  const { user } = useAuth();

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  Promise.all([
    productsAPI.getMyProducts(),
    ordersAPI.getArtisanOrders() // ✅ FIXED
  ])
    .then(([p, o]) => {
      console.log("PRODUCTS:", p.data);
      console.log("ORDERS:", o.data);

      setProducts(p.data?.data || []);
      setOrders(o.data?.data || []);
    })
    .catch((err) => {
      console.error("DASHBOARD ERROR:", err);
      setProducts([]);
      setOrders([]);
    })
    .finally(() => setLoading(false));
}, []);

  if (loading) return <Loader message="Loading dashboard..." />;

  // ✅ SAFE ARRAY HANDLING
  const safeProducts = Array.isArray(products) ? products : [];
  const safeOrders = Array.isArray(orders) ? orders : [];

  const totalRevenue = safeOrders
    .filter(o => o.orderStatus === "Delivered")
.reduce((acc, o) => acc + (o.totalPrice || 0), 0);

  const stats = [
    { label: "My Products", value: safeProducts.length, icon: "🎨", color: "#7c3aed" },
    { label: "Total Orders", value: safeOrders.length, icon: "📦", color: "#2563eb" },
    { label: "Revenue", value: `₹${totalRevenue.toLocaleString("en-IN")}`, icon: "💰", color: "#16a34a" },
    { label: "Pending Orders", value: safeOrders.filter(o =>o.orderStatus === "Placed").length, icon: "⏳", color: "#d97706" },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 5vw" }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "#1f1f2e", margin: "0 0 4px" }}>
          🎨 Welcome, {user?.name}!
        </h1>
        <p style={{ color: "#6b7280", margin: 0 }}>
          Manage your products, orders, and events from here.
        </p>
      </div>

      {/* Stats */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))",
        gap: 16,
        marginBottom: 32
      }}>
        {stats.map(s => (
          <div key={s.label} style={{
            background: "#fff",
            border: "1px solid #ede9fe",
            borderRadius: 14,
            padding: "18px 20px",
            boxShadow: "0 2px 8px rgba(124,58,237,0.06)",
          }}>
            <div style={{ fontSize: 28 }}>{s.icon}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 13, color: "#6b7280" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))",
        gap: 14,
        marginBottom: 32
      }}>
        <Link to="/artisan/products" style={btn("#7c3aed")}>🛍️ Manage Products</Link>
        <Link to="/artisan/orders" style={btn("#2563eb")}>📦 Manage Orders</Link>
        <Link to="/artisan/events/create" style={btn("#16a34a")}>🎪 Create Event</Link>
      </div>

      {/* Products */}
      <div>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 14 }}>
          Recent Products
        </h2>

        {safeProducts.length === 0 ? (
          <p style={{ color: "#9ca3af" }}>
            No products yet.{" "}
            <Link to="/artisan/products" style={{ color: "#7c3aed" }}>
              Add your first product →
            </Link>
          </p>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))",
            gap: 14
          }}>
            {safeProducts.slice(0, 4).map(p => (
              <div key={p._id} style={{
                background: "#fff",
                border: "1px solid #ede9fe",
                borderRadius: 12,
                overflow: "hidden"
              }}>
                <img
                  src={p.images?.[0] || "https://placehold.co/200x120?text=IMG"}
                  alt={p.name}
                  style={{ width: "100%", height: 120, objectFit: "cover" }}
                />
                <div style={{ padding: 12 }}>
                  <p style={{ fontWeight: 700 }}>{p.name}</p>
                  <p style={{ color: "#7c3aed", fontWeight: 700 }}>
                    ₹{p.price?.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

// button style helper
const btn = (bg) => ({
  background: bg,
  color: "#fff",
  borderRadius: 12,
  padding: "14px 20px",
  textDecoration: "none",
  fontWeight: 700,
  textAlign: "center",
});

export default ArtisanDashboard;
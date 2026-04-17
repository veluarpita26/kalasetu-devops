import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as adminAPI from "../api/adminApi";
import Loader from "../components/Loader";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getStats()
      .then(res => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader message="Loading admin panel..." />;

  const cards = [
    { label: "Total Users", value: stats?.totalUsers ?? "—", icon: "👥", color: "#2563eb" },
    { label: "Total Products", value: stats?.totalProducts ?? "—", icon: "🎨", color: "#7c3aed" },
    { label: "Total Orders", value: stats?.totalOrders ?? "—", icon: "📦", color: "#16a34a" },
    { label: "Revenue", value: stats?.totalRevenue ? `₹${Number(stats.totalRevenue).toLocaleString("en-IN")}` : "—", icon: "💰", color: "#d97706" },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 5vw" }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, color: "#1f1f2e", marginBottom: 6 }}>🛡️ Admin Dashboard</h1>
      <p style={{ color: "#6b7280", marginBottom: 28 }}>Manage the entire KalaSetu platform from here.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 16, marginBottom: 32 }}>
        {cards.map(c => (
          <div key={c.label} style={{
            background: "#fff", border: "1px solid #ede9fe", borderRadius: 14,
            padding: "18px 20px", boxShadow: "0 2px 8px rgba(124,58,237,0.06)",
          }}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>{c.icon}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: c.color }}>{c.value}</div>
            <div style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>{c.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 14 }}>
        {[
          ["/admin/users", "👥 Manage Users", "#2563eb"],
          ["/admin/products", "🎨 Manage Products", "#7c3aed"],
          ["/admin/orders", "📦 Manage Orders", "#16a34a"],
          ["/admin/posts", "📝 Manage Posts", "#d97706"],
        ].map(([to, label, bg]) => (
          <Link key={to} to={to} style={{
            background: bg, color: "#fff", borderRadius: 12, padding: "14px 20px",
            textDecoration: "none", fontWeight: 700, fontSize: 15, textAlign: "center",
          }}>{label}</Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
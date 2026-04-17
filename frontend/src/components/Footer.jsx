import React from "react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer style={{
    background: "#1f1f2e", color: "#c4b5fd", padding: "40px 5vw 24px",
    marginTop: "auto",
  }}>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 32, marginBottom: 32 }}>
      <div style={{ flex: "1 1 220px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <span style={{ fontSize: 26 }}>🪡</span>
          <span style={{ fontSize: 20, fontWeight: 800, color: "#a78bfa" }}>KalaSetu</span>
        </div>
        <p style={{ fontSize: 13, lineHeight: 1.8, color: "#9ca3af", maxWidth: 260 }}>
          Bridging India's artisans with the world. Preserving culture, empowering creators.
        </p>
      </div>
      <div style={{ flex: "1 1 140px" }}>
        <h4 style={{ color: "#a78bfa", marginBottom: 12, fontSize: 14, fontWeight: 700 }}>Explore</h4>
        {[["/" , "Home"], ["/products/list", "Products"], ["/events", "Events"], ["/community", "Community"]].map(([to, label]) => (
          <div key={to} style={{ marginBottom: 8 }}>
            <Link to={to} style={{ color: "#9ca3af", textDecoration: "none", fontSize: 13 }}>{label}</Link>
          </div>
        ))}
      </div>
      <div style={{ flex: "1 1 140px" }}>
        <h4 style={{ color: "#a78bfa", marginBottom: 12, fontSize: 14, fontWeight: 700 }}>Account</h4>
        {[["/login", "Login"], ["/register", "Register"], ["/orders", "My Orders"], ["/cart", "Cart"]].map(([to, label]) => (
          <div key={to} style={{ marginBottom: 8 }}>
            <Link to={to} style={{ color: "#9ca3af", textDecoration: "none", fontSize: 13 }}>{label}</Link>
          </div>
        ))}
      </div>
    </div>
    <div style={{ borderTop: "1px solid #374151", paddingTop: 16, textAlign: "center", fontSize: 12, color: "#6b7280" }}>
      © {new Date().getFullYear()} KalaSetu — Made with ❤️ for Indian Artisans
    </div>
  </footer>
);

export default Footer;
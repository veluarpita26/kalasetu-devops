import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate("/"); };

  const navLink = (to, label) => (
    <Link to={to} style={{ color: "#3b0764", fontWeight: 600, textDecoration: "none", fontSize: 15 }}
      onMouseEnter={e => e.target.style.color = "#7c3aed"}
      onMouseLeave={e => e.target.style.color = "#3b0764"}
    >{label}</Link>
  );

  return (
    <nav style={{
      background: "#fff", borderBottom: "2px solid #ede9fe", padding: "0 5vw",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      height: 64, position: "sticky", top: 0, zIndex: 100,
      boxShadow: "0 2px 12px rgba(124,58,237,0.07)",
    }}>
      <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 26 }}>🪡</span>
        <span style={{ fontSize: 22, fontWeight: 800, color: "#7c3aed", letterSpacing: -0.5 }}>KalaSetu</span>
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        {navLink("/products/list", "Products")}
        {navLink("/community", "Community")}
        {navLink("/events", "Events")}

        {user ? (
          <>
            {user.role === "admin" && navLink("/admin", "Admin")}
            {user.role === "artisan" && navLink("/artisan", "Dashboard")}
            <Link to="/cart" style={{ position: "relative", textDecoration: "none" }}>
              <span style={{ fontSize: 22 }}>🛒</span>
              {cartCount > 0 && (
                <span style={{
                  position: "absolute", top: -6, right: -8, background: "#7c3aed",
                  color: "#fff", borderRadius: "50%", width: 18, height: 18,
                  fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center",
                }}>{cartCount}</span>
              )}
            </Link>
            {navLink("/orders", "Orders")}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                style={{
                  background: "#7c3aed", color: "#fff", border: "none", borderRadius: 999,
                  width: 36, height: 36, fontWeight: 700, cursor: "pointer", fontSize: 15,
                }}
              >
                {user.name?.[0]?.toUpperCase()}
              </button>
              {menuOpen && (
                <div style={{
                  position: "absolute", right: 0, top: 44, background: "#fff",
                  border: "1px solid #ede9fe", borderRadius: 10, minWidth: 140,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.1)", zIndex: 200,
                }}>
                  <div style={{ padding: "10px 16px", fontSize: 13, color: "#6b7280", borderBottom: "1px solid #f3f4f6" }}>
                    {user.name}
                  </div>
                  <button onClick={handleLogout} style={{
                    width: "100%", padding: "10px 16px", background: "none", border: "none",
                    textAlign: "left", color: "#dc2626", fontWeight: 600, cursor: "pointer", fontSize: 14,
                  }}>Logout</button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {navLink("/login", "Login")}
            <Link to="/register" style={{
              background: "#7c3aed", color: "#fff", borderRadius: 8, padding: "8px 18px",
              fontWeight: 700, textDecoration: "none", fontSize: 14,
            }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
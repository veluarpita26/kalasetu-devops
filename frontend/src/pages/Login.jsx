import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const data = await login(form);
      if (data.user?.role === "admin") navigate("/admin");
      else if (data.user?.role === "artisan") navigate("/artisan");
      else navigate(from);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Check credentials.");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#faf5ff", padding: 20 }}>
      <div style={{
        background: "#fff", borderRadius: 20, padding: "40px 36px", width: "100%", maxWidth: 420,
        boxShadow: "0 8px 40px rgba(124,58,237,0.12)", border: "1px solid #ede9fe",
      }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 36 }}>🪡</div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: "#3b0764", margin: "8px 0 4px" }}>Welcome Back</h2>
          <p style={{ color: "#9ca3af", fontSize: 14 }}>Sign in to your KalaSetu account</p>
        </div>

        {error && (
          <div style={{ background: "#fee2e2", color: "#dc2626", padding: "10px 14px", borderRadius: 8, marginBottom: 16, fontSize: 14 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {[["email", "Email Address", "email"], ["password", "Password", "password"]].map(([key, label, type]) => (
            <div key={key} style={{ marginBottom: 18 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>{label}</label>
              <input
                type={type} required value={form[key]}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
                placeholder={`Enter your ${label.toLowerCase()}`}
                style={{
                  width: "100%", padding: "10px 14px", borderRadius: 8, boxSizing: "border-box",
                  border: "1.5px solid #ddd6fe", fontSize: 14, outline: "none",
                  background: "#faf5ff", color: "#1f2937",
                }}
              />
            </div>
          ))}
          <button
            type="submit" disabled={loading}
            style={{
              width: "100%", padding: "12px", background: loading ? "#c4b5fd" : "#7c3aed",
              color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 16, cursor: "pointer",
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <p style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: "#6b7280" }}>
          Don't have an account? <Link to="/register" style={{ color: "#7c3aed", fontWeight: 600 }}>Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
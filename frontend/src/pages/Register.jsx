import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "buyer", // ✅ FIXED (not "user")
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await register(form);

      console.log("REGISTER SUCCESS:", res);

      // ✅ redirect after success
      navigate("/");

    } catch (err) {
      console.error("REGISTER ERROR:", err);

      setError(
        err?.response?.data?.message || "Registration failed"
      );
    }
  };

  return (
    <div style={{
      maxWidth: 400,
      margin: "40px auto",
      padding: 20,
      background: "#fff",
      borderRadius: 12
    }}>
      <h2 style={{ marginBottom: 20 }}>Join KalaSetu</h2>

      {error && (
        <p style={{
          color: "red",
          background: "#ffe5e5",
          padding: 10,
          borderRadius: 6
        }}>
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        
        {/* NAME */}
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />

        {/* EMAIL */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />

        {/* PASSWORD */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />

        {/* ROLE */}
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          style={{ width: "100%", padding: 10, marginBottom: 20 }}
        >
          <option value="buyer">Buyer / Customer</option>
          <option value="artisan">Artisan / Seller</option>
        </select>

        {/* BUTTON */}
        <button
          type="submit"
          style={{
            width: "100%",
            padding: 12,
            background: "#7c3aed",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Create Account
        </button>
      </form>
    </div>
  );
};

export default Register;
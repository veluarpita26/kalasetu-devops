import React, { useEffect, useState } from "react";
import { adminGetAllProducts, adminDeleteProduct } from "../api/adminApi";
import Loader from "../components/Loader";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const AdminManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await adminGetAllProducts();
      setProducts(res.data?.products || res.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await adminDeleteProduct(id);
      fetchProducts();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  if (loading) return <Loader message="Loading products..." />;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 5vw" }}>
      <h1
        style={{
          fontSize: 24,
          fontWeight: 800,
          color: "#1f1f2e",
          marginBottom: 24,
        }}
      >
        🎨 Manage Products
      </h1>

      {products.length === 0 ? (
        <p style={{ color: "#9ca3af", textAlign: "center", padding: 40 }}>
          No products found.
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))",
            gap: 18,
          }}
        >
          {products.map((p) => (
            <div
              key={p._id}
              style={{
                background: "#fff",
                border: "1px solid #ede9fe",
                borderRadius: 14,
                overflow: "hidden",
              }}
            >
              <img
                src={
                  p.images?.[0]
                    ? `${BASE_URL}/uploads/${p.images[0]}`
                    : "https://placehold.co/300x160?text=IMG"
                }
                alt={p.name}
                style={{ width: "100%", height: 150, objectFit: "cover" }}
              />

              <div style={{ padding: "12px 14px" }}>
                <h3 style={{ fontSize: 14, fontWeight: 700 }}>{p.name}</h3>

                <p style={{ fontSize: 13, color: "#7c3aed", fontWeight: 700 }}>
                  ₹{p.price?.toLocaleString("en-IN")}
                </p>

                <p style={{ fontSize: 12, color: "#9ca3af" }}>
                  By {p.artisan?.name || "—"} · {p.category}
                </p>

                <button
                  onClick={() => handleDelete(p._id)}
                  style={{
                    width: "100%",
                    padding: "7px",
                    background: "#fee2e2",
                    color: "#dc2626",
                    border: "none",
                    borderRadius: 7,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminManageProducts;

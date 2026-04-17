import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Loader from "../components/Loader";

const Cart = () => {
  const { cart, loading, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  if (loading) return <Loader message="Loading cart..." />;

  const items = cart?.items || [];
  const total = items.reduce((acc, item) => acc + (item.product?.price || 0) * item.quantity, 0);

  if (items.length === 0) return (
    <div style={{ textAlign: "center", padding: "80px 20px" }}>
      <div style={{ fontSize: 60, marginBottom: 16 }}>🛒</div>
      <h2 style={{ color: "#1f1f2e", fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Your cart is empty</h2>
      <p style={{ color: "#9ca3af", marginBottom: 24 }}>Start adding some beautiful handcrafted products!</p>
      <Link to="/products/list" style={{
        background: "#7c3aed", color: "#fff", padding: "12px 28px",
        borderRadius: 10, textDecoration: "none", fontWeight: 700,
      }}>Browse Products</Link>
    </div>
  );

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 5vw" }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, color: "#1f1f2e", marginBottom: 24 }}>🛒 Your Cart</h1>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24 }}>
        <div>
          {items.map(item => {
            const { product, quantity } = item;
            if (!product) return null;
            return (
              <div key={product._id} style={{
                background: "#fff", border: "1px solid #ede9fe", borderRadius: 14,
                padding: 16, marginBottom: 14, display: "flex", gap: 16, alignItems: "center",
              }}>
                <img
                  src={product.images?.[0] || "https://placehold.co/80x80?text=IMG"}
                  alt={product.name}
                  style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 10 }}
                  onError={e => { e.target.src = "https://placehold.co/80x80?text=IMG"; }}
                />
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1f1f2e", margin: "0 0 4px" }}>{product.name}</h3>
                  <p style={{ fontSize: 14, color: "#7c3aed", fontWeight: 700, margin: "0 0 8px" }}>₹{product.price?.toLocaleString("en-IN")}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <button onClick={() => updateQuantity(product._id, quantity - 1)}
                      disabled={quantity <= 1}
                      style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid #ddd6fe", background: "#fff", cursor: "pointer" }}>−</button>
                    <span style={{ fontWeight: 700, minWidth: 24, textAlign: "center" }}>{quantity}</span>
                    <button onClick={() => updateQuantity(product._id, quantity + 1)}
                      style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid #ddd6fe", background: "#fff", cursor: "pointer" }}>+</button>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontWeight: 700, color: "#1f1f2e", marginBottom: 8 }}>₹{(product.price * quantity).toLocaleString("en-IN")}</p>
                  <button onClick={() => removeFromCart(product._id)}
                    style={{ background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: 6, padding: "4px 12px", cursor: "pointer", fontSize: 13 }}>
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{
          background: "#fff", border: "1px solid #ede9fe", borderRadius: 16,
          padding: 24, height: "fit-content", position: "sticky", top: 80,
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#1f1f2e", marginBottom: 16 }}>Order Summary</h2>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 14, color: "#6b7280" }}>
            <span>Items ({items.length})</span><span>₹{total.toLocaleString("en-IN")}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 14, color: "#6b7280" }}>
            <span>Delivery</span><span style={{ color: "#16a34a" }}>Free</span>
          </div>
          <div style={{ borderTop: "1px solid #ede9fe", paddingTop: 12, marginTop: 8, display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 18, color: "#1f1f2e" }}>
            <span>Total</span><span style={{ color: "#7c3aed" }}>₹{total.toLocaleString("en-IN")}</span>
          </div>
          <button onClick={() => navigate("/checkout")}
            style={{
              marginTop: 20, width: "100%", padding: "13px", background: "#7c3aed",
              color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 16, cursor: "pointer",
            }}>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
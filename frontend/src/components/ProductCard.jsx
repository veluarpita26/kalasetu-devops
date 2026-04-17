import React from "react";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  // ✅ IMAGE URL HANDLING
  const imageUrl =
    product?.images?.[0] &&
    (product.images[0].startsWith("http")
      ? product.images[0]
      : `http://localhost:5000/uploads/${product.images[0]}`);

  // ✅ FIXED FUNCTION
  const handleAddToCart = async () => {
    try {
      await addToCart(product._id, 1);
      toast.success("Added to cart 🛒");
    } catch (err) {
      toast.error("Failed to add to cart ❌");
      console.error(err);
    }
  };

  return (
    <div
      style={{
        borderRadius: 16,
        overflow: "hidden",
        background: "#fff",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      }}
    >
      {/* IMAGE */}
      <div
        style={{
          height: 180,
          background: "#eee",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <span style={{ color: "#999" }}>No Image</span>
        )}
      </div>

      {/* CONTENT */}
      <div style={{ padding: 12 }}>
        <p style={{ color: "#7c3aed", fontSize: 12 }}>
          {product.category}
        </p>

        <h3 style={{ margin: "4px 0" }}>{product.name}</h3>

        <p style={{ color: "#6b7280", fontSize: 13 }}>
          by {product.artisan?.name || "Unknown"}
        </p>

        <h4 style={{ color: "#7c3aed", marginTop: 6 }}>
          ₹{product.price}
        </h4>

        {/* 🔥 ADD TO CART BUTTON */}
        <button
          onClick={handleAddToCart}
          style={{
            marginTop: 10,
            width: "100%",
            padding: "8px",
            background: "#7c3aed",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
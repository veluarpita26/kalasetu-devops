import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../api/productApi";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import StarRating from "../components/StarRating";
import Loader from "../components/Loader";

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getProductById(id);

        console.log("PRODUCT RESPONSE:", res.data);

        setProduct(res?.data?.data || res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      alert("Please login first");
      return;
    }

    await addToCart(id, qty);

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return <Loader fullScreen message="Loading product..." />;

  if (!product)
    return (
      <div style={{ textAlign: "center", padding: 60, color: "#dc2626" }}>
        Product not found.
      </div>
    );

  const {
    name,
    description,
    price,
    images,
    category,
    artisan,
    stock,
    averageRating,
  } = product;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 5vw" }}>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
        
        {/* IMAGE SECTION */}
        <div>
          <div
            style={{
              borderRadius: 16,
              overflow: "hidden",
              background: "#f5f3ff",
              height: 380,
            }}
          >
            <img
              src={
                images?.[activeImg]?.startsWith("http")
                  ? images[activeImg]
                  : `http://localhost:5000/uploads/${images?.[activeImg]}`
              }
              alt={name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={(e) => {
                e.target.src = "https://placehold.co/600x400?text=No+Image";
              }}
            />
          </div>

          {images?.length > 1 && (
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt=""
                  onClick={() => setActiveImg(i)}
                  style={{
                    width: 64,
                    height: 64,
                    objectFit: "cover",
                    borderRadius: 8,
                    cursor: "pointer",
                    border:
                      activeImg === i
                        ? "2px solid #7c3aed"
                        : "2px solid transparent",
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* PRODUCT INFO */}
        <div>
          <span
            style={{
              fontSize: 12,
              background: "#ede9fe",
              color: "#7c3aed",
              borderRadius: 999,
              padding: "3px 12px",
              fontWeight: 600,
            }}
          >
            {category}
          </span>

          <h1
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: "#1f1f2e",
              margin: "12px 0 8px",
            }}
          >
            {name}
          </h1>

          {artisan?.name && (
            <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 12 }}>
              🧑‍🎨 By <strong>{artisan.name}</strong>
            </p>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <StarRating rating={averageRating || 0} size={18} />
            <span style={{ color: "#6b7280" }}>
              ({averageRating?.toFixed(1) || "0.0"})
            </span>
          </div>

          <div
            style={{
              fontSize: 30,
              fontWeight: 800,
              color: "#7c3aed",
              margin: "16px 0",
            }}
          >
            ₹{price?.toLocaleString("en-IN")}
          </div>

          <p style={{ color: "#4b5563", marginBottom: 20 }}>
            {description}
          </p>

          <p
            style={{
              color: stock > 0 ? "#16a34a" : "#dc2626",
              fontWeight: 600,
            }}
          >
            {stock > 0 ? `In Stock (${stock})` : "Out of Stock"}
          </p>

          {/* CART */}
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
            >-</button>

            <span>{qty}</span>

            <button
              onClick={() => setQty((q) => Math.min(stock, q + 1))}
            >+</button>

            <button
              onClick={handleAddToCart}
              disabled={stock === 0}
              style={{
                background: added ? "green" : "#7c3aed",
                color: "#fff",
                padding: "10px 20px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
              }}
            >
              {added ? "Added!" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>

      {/* 🚧 FUTURE: REVIEWS */}
      <div style={{ marginTop: 50 }}>
        <h2>⭐ Reviews (Coming Soon)</h2>
        <p style={{ color: "#9ca3af" }}>
          Review system not implemented yet.
        </p>
      </div>

    </div>
  );
};

export default ProductDetail;
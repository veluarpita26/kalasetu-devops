import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { placeOrder } from "../api/orderApi";
import Loader from "../components/Loader";
import toast from "react-hot-toast";

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    paymentMethod: "cod",
  });

  const [loading, setLoading] = useState(false);

  const items = cart?.items || [];

  const total = items.reduce(
    (acc, item) =>
      acc + (item.product?.price || 0) * item.quantity,
    0
  );

  // ✅ FIXED HANDLER (DIRECT BUTTON CLICK — NO FORM ISSUE)
const handlePlaceOrder = async () => {
  console.log("🚀 PLACE ORDER CLICKED");
  console.log("CART ITEMS:", items); // 🔥 DEBUG

  if (items.length === 0) {
    return toast.error("Cart is empty");
  }

  try {
    setLoading(true);

    await placeOrder({
  name: form.name, // 🔥 REQUIRED (TOP LEVEL)

  orderItems: items.map((item) => ({
  product: item.product?._id || item.product,
  name: item.product?.name || "Product", // 🔥 REQUIRED
  image: item.product?.images?.[0] || "", // optional but good
  quantity: item.quantity,
  price: item.product?.price || item.price,
})),

  shippingAddress: {
    name: form.name, // ✅ keep (optional but good)
    phone: form.phone,
    street: form.address,
    city: form.city,
    state: form.state,
    pincode: form.pincode,
    country: "India",
  },

  paymentMethod: form.paymentMethod.toUpperCase(),

  itemsPrice: total,
  shippingPrice: 0,
  totalPrice: total,
});
    await clearCart();

    toast.success("Order placed successfully 🎉");

    navigate("/orders");

  } catch (err) {
    console.error("ORDER ERROR:", err.response?.data);
    toast.error(
      err.response?.data?.message || "Order failed ❌"
    );
  } finally {
    setLoading(false);
  }
};

  if (loading)
    return <Loader fullScreen message="Placing your order..." />;

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px 5vw" }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 28 }}>
        🧾 Checkout
      </h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24 }}>

        {/* LEFT SIDE */}
        <div>

          {/* SHIPPING FORM */}
          <div style={{ background: "#fff", padding: 20, borderRadius: 12, marginBottom: 20 }}>
            <h2>Shipping Details</h2>

            {["name", "phone", "address", "city", "state", "pincode"].map((field) => (
              <input
                key={field}
                placeholder={field}
                value={form[field]}
                onChange={(e) =>
                  setForm({ ...form, [field]: e.target.value })
                }
                style={{
                  width: "100%",
                  marginBottom: 10,
                  padding: 10,
                  borderRadius: 6,
                  border: "1px solid #ccc",
                }}
              />
            ))}
          </div>

          {/* PAYMENT */}
          <div style={{ background: "#fff", padding: 20, borderRadius: 12 }}>
            <h2>Payment</h2>

            {["cod", "upi", "card"].map((method) => (
              <label key={method} style={{ display: "block", marginBottom: 8 }}>
                <input
                  type="radio"
                  checked={form.paymentMethod === method}
                  onChange={() =>
                    setForm({ ...form, paymentMethod: method })
                  }
                />
                {" "}{method.toUpperCase()}
              </label>
            ))}
          </div>

          {/* 🔥 FIXED BUTTON */}
          <button
            onClick={handlePlaceOrder}
            style={{
              marginTop: 20,
              width: "100%",
              padding: "14px",
              background: "#7c3aed",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Place Order ₹{total}
          </button>
        </div>

        {/* RIGHT SIDE */}
        <div style={{ background: "#fff", padding: 20, borderRadius: 12 }}>
          <h2>Order Summary</h2>

          {items.map((item) => (
            <div key={item.product._id}>
              {item.product.name} × {item.quantity}
            </div>
          ))}

          <h3 style={{ marginTop: 10 }}>Total: ₹{total}</h3>
        </div>

      </div>
    </div>
  );
};

export default Checkout;
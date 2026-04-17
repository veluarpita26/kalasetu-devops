import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as ordersAPI from "../api/orderApi";
import OrderStatusBadge from "../components/OrderStatusBadge";
import Loader from "../components/Loader";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await ordersAPI.getMyOrders();

        console.log("ORDERS RESPONSE:", res.data);

        // ✅ FIXED: correct extraction
        const data = res?.data?.data;

        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Order fetch error:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <Loader message="Loading your orders..." />;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 5vw" }}>
      
      <h1 style={{
        fontSize: 26,
        fontWeight: 800,
        color: "#1f1f2e",
        marginBottom: 24
      }}>
        📦 My Orders
      </h1>

      {/* EMPTY STATE */}
      {!Array.isArray(orders) || orders.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <div style={{ fontSize: 52, marginBottom: 14 }}>📦</div>

          <h2 style={{
            color: "#1f1f2e",
            fontWeight: 700,
            marginBottom: 8
          }}>
            No orders yet
          </h2>

          <p style={{ color: "#9ca3af", marginBottom: 20 }}>
            When you place orders they'll appear here.
          </p>

          <Link
            to="/products/list"
            style={{
              background: "#7c3aed",
              color: "#fff",
              padding: "11px 24px",
              borderRadius: 10,
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            style={{
              background: "#fff",
              border: "1px solid #ede9fe",
              borderRadius: 14,
              padding: "18px 20px",
              marginBottom: 16,
              boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
            }}
          >
            
            {/* HEADER */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12
            }}>
              <div>
                <p style={{
                  fontSize: 13,
                  color: "#9ca3af",
                  margin: "0 0 4px"
                }}>
                  Order ID
                </p>

                <p style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#3b0764",
                  margin: 0
                }}>
                  #{order._id?.slice(-8).toUpperCase()}
                </p>
              </div>

              <OrderStatusBadge status={order.status} />
            </div>

            {/* ITEMS */}
            <div style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              marginBottom: 12
            }}>
              {Array.isArray(order.items) &&
                order.items.map((item, i) => {
                  const imageUrl =
                    item.product?.images?.[0] &&
                    (item.product.images[0].startsWith("http")
                      ? item.product.images[0]
                      : `http://localhost:5000/uploads/${item.product.images[0]}`);

                  return (
                    <div key={i} style={{
                      display: "flex",
                      gap: 8,
                      alignItems: "center"
                    }}>
                      
                      <img
                        src={imageUrl || "https://placehold.co/40x40?text=IMG"}
                        alt=""
                        style={{
                          width: 40,
                          height: 40,
                          objectFit: "cover",
                          borderRadius: 8
                        }}
                      />

                      <span style={{
                        fontSize: 13,
                        color: "#374151"
                      }}>
                        {item.product?.name || "Product"} × {item.quantity}
                      </span>
                    </div>
                  );
                })}
            </div>

            {/* FOOTER */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 14
            }}>
              <span style={{ color: "#6b7280" }}>
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "N/A"}
              </span>

              <span style={{
                fontWeight: 800,
                color: "#7c3aed",
                fontSize: 16
              }}>
                ₹{order.totalAmount?.toLocaleString("en-IN") || 0}
              </span>
            </div>

          </div>
        ))
      )}
    </div>
  );
};

export default Orders;
import React, { useEffect, useState } from "react";
import * as ordersAPI from "../api/orderApi";
import Loader from "../components/Loader";

const STATUSES = ["Placed", "Packed", "Dispatched", "Delivered", "Cancelled"];

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await ordersAPI.getArtisanOrders(); // ✅ FIXED
      console.log("ARTISAN ORDERS:", res.data);

      setOrders(res.data.data || []); // ✅ FIXED

    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, status) => {
    try {
      await ordersAPI.updateOrderStatus(orderId, status); // ✅ FIXED
      fetchOrders();
    } catch {
      alert("Failed to update status");
    }
  };

  if (loading) return <Loader message="Loading orders..." />;

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 5vw" }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>
        📦 Manage Orders
      </h1>

      {orders.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <p>No orders yet.</p>
        </div>
      ) : (
        orders.map((order) => (
          <div key={order._id} style={{
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: 10,
            padding: 16,
            marginBottom: 12
          }}>

            <h3>Order #{order._id.slice(-6)}</h3>

            <p>Status: {order.orderStatus}</p>

            {/* ITEMS */}
            <div>
              {order.items?.map((item, i) => (
                <div key={i}>
                  🛍 {item.product?.name} × {item.quantity}
                </div>
              ))}
            </div>

            {/* STATUS UPDATE */}
            <select
              value={order.orderStatus}
              onChange={(e) =>
                handleStatusChange(order._id, e.target.value)
              }
            >
              {STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>

          </div>
        ))
      )}
    </div>
  );
};

export default ManageOrders;
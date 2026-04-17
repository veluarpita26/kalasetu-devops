import React from "react";

const statusColors = {
  pending:    { bg: "#fef3c7", color: "#92400e", label: "Pending" },
  processing: { bg: "#dbeafe", color: "#1e40af", label: "Processing" },
  shipped:    { bg: "#ede9fe", color: "#5b21b6", label: "Shipped" },
  delivered:  { bg: "#dcfce7", color: "#166534", label: "Delivered" },
  cancelled:  { bg: "#fee2e2", color: "#991b1b", label: "Cancelled" },
};

const OrderStatusBadge = ({ status }) => {
  const s = statusColors[status?.toLowerCase()] || { bg: "#f3f4f6", color: "#374151", label: status };
  return (
    <span style={{
      background: s.bg, color: s.color, padding: "3px 12px",
      borderRadius: 999, fontSize: 12, fontWeight: 600, letterSpacing: 0.5,
    }}>
      {s.label}
    </span>
  );
};

export default OrderStatusBadge;
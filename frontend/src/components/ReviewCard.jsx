import React from "react";
import StarRating from "./StarRating";

const ReviewCard = ({ review }) => {
  const { user, rating, comment, createdAt } = review;
  return (
    <div style={{
      background: "#faf5ff", border: "1px solid #e9d5ff", borderRadius: 12,
      padding: "16px 20px", marginBottom: 12,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%", background: "#7c3aed",
            color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 700, fontSize: 15,
          }}>
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <span style={{ fontWeight: 600, color: "#3b0764" }}>{user?.name || "User"}</span>
        </div>
        <span style={{ fontSize: 12, color: "#9ca3af" }}>
          {createdAt ? new Date(createdAt).toLocaleDateString("en-IN") : ""}
        </span>
      </div>
      <StarRating rating={rating} />
      <p style={{ margin: "8px 0 0", color: "#4b5563", fontSize: 14, lineHeight: 1.6 }}>{comment}</p>
    </div>
  );
};

export default ReviewCard;
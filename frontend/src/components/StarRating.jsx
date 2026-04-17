import React from "react";

const StarRating = ({ rating = 0, max = 5, size = 18, interactive = false, onChange }) => {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {Array.from({ length: max }, (_, i) => (
        <span
          key={i}
          onClick={() => interactive && onChange && onChange(i + 1)}
          style={{
            fontSize: size,
            color: i < Math.round(rating) ? "#f59e0b" : "#d1d5db",
            cursor: interactive ? "pointer" : "default",
            transition: "color 0.15s",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
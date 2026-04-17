import React from "react";

const Loader = ({ fullScreen = false, message = "Loading..." }) => {
  const spinnerStyle = {
    width: 44,
    height: 44,
    border: "4px solid #e9d5ff",
    borderTop: "4px solid #7c3aed",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  };

  const wrapper = fullScreen
    ? {
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", height: "100vh", gap: 16,
      }
    : {
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", padding: "48px 0", gap: 16,
      };

  return (
    <div style={wrapper}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={spinnerStyle} />
      <p style={{ color: "#7c3aed", fontWeight: 500, margin: 0 }}>{message}</p>
    </div>
  );
};

export default Loader;
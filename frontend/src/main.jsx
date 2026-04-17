import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";

import "./styles/theme.css";
import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>

      {/* 🔐 AUTH CONTEXT */}
      <AuthProvider>

        {/* 🛒 CART CONTEXT */}
        <CartProvider>

          {/* 🚀 MAIN APP */}
          <App />

          {/* 🔔 GLOBAL TOASTER */}
          <Toaster
            position="top-right"
            reverseOrder={false}
            toastOptions={{
              duration: 3000,
              style: {
                background: "#1a1a2e",
                color: "#fff",
                borderRadius: "10px",
                border: "1px solid #e07b39",
                fontSize: "14px",
              },
              success: {
                iconTheme: {
                  primary: "#10b981",
                  secondary: "#fff",
                },
              },
              error: {
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#fff",
                },
              },
            }}
          />

        </CartProvider>
      </AuthProvider>

    </BrowserRouter>
  </React.StrictMode>
);
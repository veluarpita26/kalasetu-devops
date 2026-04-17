import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Community from "./pages/Community";
import Events from "./pages/Events";

import ArtisanDashboard from "./artisan/ArtisanDashboard";
import ManageProducts from "./artisan/ManageProducts";
import ManageOrders from "./artisan/ManageOrders";
import CreateEvent from "./artisan/CreateEvent";

import AdminDashboard from "./admin/AdminDashboard";
import ManageUsers from "./admin/ManageUsers";
import AdminManageProducts from "./admin/ManageProducts";
import ManagePosts from "./admin/ManagePosts";

const App = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      
      <Navbar />

      <main style={{ flex: 1 }}>
        <Routes>

          {/* ================= PUBLIC ================= */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products/list" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/events" element={<Events />} />

          {/* ================= PROTECTED ================= */}
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />

          {/* 🔥 COMMUNITY (PROTECTED for actions) */}
          <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />

          {/* ================= ARTISAN ================= */}
          <Route path="/artisan" element={
            <ProtectedRoute roles={["artisan"]}>
              <ArtisanDashboard />
            </ProtectedRoute>
          } />

          <Route path="/artisan/products" element={
            <ProtectedRoute roles={["artisan"]}>
              <ManageProducts />
            </ProtectedRoute>
          } />

          <Route path="/artisan/orders" element={
            <ProtectedRoute roles={["artisan"]}>
              <ManageOrders />
            </ProtectedRoute>
          } />

          <Route path="/artisan/events/create" element={
            <ProtectedRoute roles={["artisan"]}>
              <CreateEvent />
            </ProtectedRoute>
          } />

          {/* ================= ADMIN ================= */}
          <Route path="/admin" element={
            <ProtectedRoute roles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          <Route path="/admin/users" element={
            <ProtectedRoute roles={["admin"]}>
              <ManageUsers />
            </ProtectedRoute>
          } />

          <Route path="/admin/products" element={
            <ProtectedRoute roles={["admin"]}>
              <AdminManageProducts />
            </ProtectedRoute>
          } />

          <Route path="/admin/orders" element={
            <ProtectedRoute roles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          <Route path="/admin/posts" element={
            <ProtectedRoute roles={["admin"]}>
              <ManagePosts />
            </ProtectedRoute>
          } />

          {/* ================= FALLBACK ================= */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </main>

      <Footer />

    </div>
  );
};

export default App;
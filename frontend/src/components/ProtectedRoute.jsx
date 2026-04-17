import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";

const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // ⏳ Wait for auth check
  if (loading) {
    return <Loader fullScreen message="Authenticating..." />;
  }

  // ❌ Not logged in
  if (!user) {
    console.log("❌ No user → redirect to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ❌ Role not allowed
  if (roles.length > 0 && !roles.includes(user.role)) {
    console.log("❌ Role not allowed:", user.role);
    return <Navigate to="/" replace />;
  }

  // ✅ Allowed
  console.log("✅ Access granted:", user.role);
  return children;
};

export default ProtectedRoute;
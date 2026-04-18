import API from "./axios";

// ── Products ──
export const adminGetAllProducts = () => API.get("/products");

export const adminDeleteProduct = (id) =>
  API.delete(`/admin/product/${id}`);

// ── Users ──
export const getAllUsers = () => API.get("/admin/users");
export const approveArtisan = (id) => API.put(`/admin/approve/${id}`);
export const deleteUser = (id) => API.delete(`/admin/user/${id}`);

// ✅ ADD THIS (alias for compatibility)
export const getUsers = () => getAllUsers();

// ── Posts ──
export const adminGetAllPosts = () => API.get("/posts");
export const adminDeletePost = (id) =>
  API.delete(`/admin/post/${id}`);

// ── Orders ──
export const adminGetAllOrders = () => API.get("/admin/orders");

// ✅ ADD THIS (for dashboard)
export const getStats = () => API.get("/admin/stats");
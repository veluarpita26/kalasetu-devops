import API from './axios'

// Buyer — place order
export const placeOrder = (data) => 
  API.post('/orders', data)

// Buyer — get my orders
export const getMyOrders = () => 
  API.get('/orders/my')

// Buyer — get single order
export const getOrderById = (id) => 
  API.get(`/orders/${id}`)

// Artisan/Admin — update order status ✅ FIXED
export const updateOrderStatus = (id, orderStatus) =>
  API.put(`/orders/${id}/status`, { orderStatus })

// Buyer — cancel order
export const cancelOrder = (id) =>
  API.put(`/orders/${id}/cancel`)

// Admin — get all orders
export const getAllOrders = () => 
  API.get('/orders')

// ✅ Artisan — get orders for their products
export const getArtisanOrders = () => API.get('/orders/artisan');
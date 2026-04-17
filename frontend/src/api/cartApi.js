import API from './axios'

// Get cart
export const getCart = () => API.get('/cart')

// Add item to cart
export const addToCart = (productId, quantity) =>
  API.post('/cart', { productId, quantity })

// Update item quantity
export const updateCartItem = (productId, quantity) =>
  API.put('/cart', { productId, quantity })

// Remove item from cart
export const removeFromCart = (productId) =>
  API.delete(`/cart/${productId}`)

// Clear entire cart
export const clearCart = () => API.delete('/cart')
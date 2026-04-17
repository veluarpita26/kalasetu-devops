import API from './axios'

// Public — get all products with optional filters
export const getAllProducts = (params) =>
  API.get('/products', { params })

// Public — get single product
export const getProductById = (id) =>
  API.get(`/products/${id}`)

// Artisan — create product
export const createProduct = (data) =>
  API.post('/products', data)

// Artisan — update product
export const updateProduct = (id, data) =>
  API.put(`/products/${id}`, data)

// Artisan — delete product
export const deleteProduct = (id) =>
  API.delete(`/products/${id}`)

// ✅ FIXED HERE
export const getMyProducts = () =>
  API.get('/products/my')
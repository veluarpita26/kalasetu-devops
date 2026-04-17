import API from './axios'

// Register
export const register = (data) => API.post('/auth/register', data)

// Login
export const login = (data) => API.post('/auth/login', data)

// Get profile
export const getProfile = () => API.get('/auth/me')

// Update profile
export const updateProfile = (data) => API.put('/auth/me', data)
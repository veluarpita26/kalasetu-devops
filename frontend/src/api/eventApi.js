import API from './axios'

// ✅ Get all events
export const getAllEvents = () => API.get('/events')

// ✅ Get single event
export const getEventById = (id) => API.get(`/events/${id}`)

// ✅ Create event (FIXED for image upload)
export const createEvent = (data) =>
  API.post('/events', data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })

// ✅ Update event
export const updateEvent = (id, data) =>
  API.put(`/events/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })

// ✅ Delete event
export const deleteEvent = (id) => API.delete(`/events/${id}`)

// ✅ Register interest
export const registerInterest = (id) =>
  API.put(`/events/${id}/register`)
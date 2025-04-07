import axios from 'axios';

// Get the base URL from environment variables or fall back to localhost
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

const API = axios.create({ baseURL });

// Event API calls
export const fetchEvents = () => API.get('/events');
export const createEvent = (newEvent) => API.post('/events', newEvent);
export const updateEvent = (id, updatedEvent) => API.put(`/events/${id}`, updatedEvent);
export const deleteEvent = (id) => API.delete(`/events/${id}`); 
import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:4000' });

// Event API calls
export const fetchEvents = () => API.get('/events');
export const createEvent = (newEvent) => API.post('/events', newEvent);
export const updateEvent = (id, updatedEvent) => API.put(`/events/${id}`, updatedEvent);
export const deleteEvent = (id) => API.delete(`/events/${id}`); 
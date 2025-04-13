import axios from 'axios';

// Get the base URL from environment variables or fall back to localhost
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

const API = axios.create({ baseURL });

// Event API calls
export const fetchEvents = () => API.get('/events');
export const createEvent = (newEvent) => API.post('/events', newEvent);
export const updateEvent = (id, updatedEvent) => API.put(`/events/${id}`, updatedEvent);
export const deleteEvent = (id) => API.delete(`/events/${id}`);

// Goal API calls
export const fetchGoals = () => API.get('/goals');
export const createGoal = (newGoal) => API.post('/goals', newGoal);
export const updateGoal = (id, updatedGoal) => API.put(`/goals/${id}`, updatedGoal);
export const deleteGoal = (id) => API.delete(`/goals/${id}`);

// Task API calls
export const fetchTasks = () => API.get('/tasks');
export const fetchTasksByGoal = (goalId) => API.get(`/tasks/goal/${goalId}`);
export const createTask = (newTask) => API.post('/tasks', newTask);
export const updateTask = (id, updatedTask) => API.put(`/tasks/${id}`, updatedTask);
export const deleteTask = (id) => API.delete(`/tasks/${id}`); 
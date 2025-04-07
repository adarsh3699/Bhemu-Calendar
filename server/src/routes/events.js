import express from 'express';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../controllers/events.js';

const router = express.Router();

// GET all events
router.get('/', getEvents);

// POST create a new event
router.post('/', createEvent);

// PUT update an event
router.put('/:id', updateEvent);

// DELETE an event
router.delete('/:id', deleteEvent);

export default router; 
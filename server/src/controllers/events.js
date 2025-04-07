import Event from '../models/Event.js';
import mongoose from 'mongoose';

// Get all events
export const getEvents = async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).json(events);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Create a new event
export const createEvent = async (req, res) => {
    const event = req.body;
    const newEvent = new Event(event);

    try {
        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

// Update an event
export const updateEvent = async (req, res) => {
    const { id } = req.params;
    const event = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send('No event with that id');
    }

    try {
        const updatedEvent = await Event.findByIdAndUpdate(id, event, { new: true });
        res.json(updatedEvent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete an event
export const deleteEvent = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send('No event with that id');
    }

    try {
        await Event.findByIdAndDelete(id);
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}; 
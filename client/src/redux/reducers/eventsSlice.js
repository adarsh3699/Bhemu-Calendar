import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../services/api';

// Async thunks
export const fetchEvents = createAsyncThunk(
    'events/fetchEvents',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.fetchEvents();
            return data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const createEvent = createAsyncThunk(
    'events/createEvent',
    async (event, { rejectWithValue }) => {
        try {
            const { data } = await api.createEvent(event);
            return data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const updateEvent = createAsyncThunk(
    'events/updateEvent',
    async ({ id, event }, { rejectWithValue }) => {
        try {
            const { data } = await api.updateEvent(id, event);
            return data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const deleteEvent = createAsyncThunk(
    'events/deleteEvent',
    async (id, { rejectWithValue }) => {
        try {
            await api.deleteEvent(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const eventsSlice = createSlice({
    name: 'events',
    initialState: {
        events: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch events
            .addCase(fetchEvents.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchEvents.fulfilled, (state, action) => {
                state.loading = false;
                state.events = action.payload;
            })
            .addCase(fetchEvents.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create event
            .addCase(createEvent.pending, (state) => {
                state.loading = true;
            })
            .addCase(createEvent.fulfilled, (state, action) => {
                state.loading = false;
                state.events.push(action.payload);
            })
            .addCase(createEvent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update event
            .addCase(updateEvent.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateEvent.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.events.findIndex((event) => event._id === action.payload._id);
                state.events[index] = action.payload;
            })
            .addCase(updateEvent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete event
            .addCase(deleteEvent.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteEvent.fulfilled, (state, action) => {
                state.loading = false;
                state.events = state.events.filter((event) => event._id !== action.payload);
            })
            .addCase(deleteEvent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default eventsSlice.reducer; 
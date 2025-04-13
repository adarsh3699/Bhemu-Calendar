import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
    name: 'ui',
    initialState: {
        modalOpen: false,
        selectedEvent: null,
        selectedDate: null,
        selectedTimeSlot: null,
        taskData: null,
    },
    reducers: {
        openModal: (state, action) => {
            state.modalOpen = true;
            if (action.payload) {
                const { event, date, timeSlot, taskData } = action.payload;
                state.selectedEvent = event || null;
                state.selectedDate = date ? new Date(date).toISOString() : null;
                state.selectedTimeSlot = timeSlot ? {
                    start: new Date(timeSlot.start).toISOString(),
                    end: new Date(timeSlot.end).toISOString()
                } : null;
                state.taskData = taskData || null;
            }
        },
        closeModal: (state) => {
            state.modalOpen = false;
            state.selectedEvent = null;
            state.selectedDate = null;
            state.selectedTimeSlot = null;
            state.taskData = null;
        },
        setSelectedDate: (state, action) => {
            state.selectedDate = action.payload ? new Date(action.payload).toISOString() : null;
        }
    },
});

export const { openModal, closeModal, setSelectedDate } = uiSlice.actions;
export default uiSlice.reducer; 
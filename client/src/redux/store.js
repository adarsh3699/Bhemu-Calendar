import { configureStore } from '@reduxjs/toolkit';
import eventsReducer from './reducers/eventsSlice';
import uiReducer from './reducers/uiSlice';
import goalsReducer from './reducers/goalsSlice';
import tasksReducer from './reducers/tasksSlice';

export const store = configureStore({
    reducer: {
        events: eventsReducer,
        ui: uiReducer,
        goals: goalsReducer,
        tasks: tasksReducer,
    },
}); 
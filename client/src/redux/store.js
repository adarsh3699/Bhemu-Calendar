import { configureStore } from '@reduxjs/toolkit';
import eventsReducer from './reducers/eventsSlice';
import uiReducer from './reducers/uiSlice';

export const store = configureStore({
    reducer: {
        events: eventsReducer,
        ui: uiReducer,
    },
}); 
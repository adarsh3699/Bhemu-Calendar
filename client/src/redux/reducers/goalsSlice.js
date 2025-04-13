import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../services/api';

// Async thunks
export const fetchGoals = createAsyncThunk(
    'goals/fetchGoals',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.fetchGoals();
            return data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const createGoal = createAsyncThunk(
    'goals/createGoal',
    async (goal, { rejectWithValue }) => {
        try {
            const { data } = await api.createGoal(goal);
            return data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const updateGoal = createAsyncThunk(
    'goals/updateGoal',
    async ({ id, goal }, { rejectWithValue }) => {
        try {
            const { data } = await api.updateGoal(id, goal);
            return data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const deleteGoal = createAsyncThunk(
    'goals/deleteGoal',
    async (id, { rejectWithValue }) => {
        try {
            await api.deleteGoal(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const goalsSlice = createSlice({
    name: 'goals',
    initialState: {
        goals: [],
        selectedGoal: null,
        loading: false,
        error: null,
    },
    reducers: {
        setSelectedGoal: (state, action) => {
            state.selectedGoal = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch goals
            .addCase(fetchGoals.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGoals.fulfilled, (state, action) => {
                state.goals = action.payload;
                state.loading = false;
            })
            .addCase(fetchGoals.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch goals';
            })
            // Create goal
            .addCase(createGoal.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createGoal.fulfilled, (state, action) => {
                state.goals.push(action.payload);
                state.loading = false;
            })
            .addCase(createGoal.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to create goal';
            })
            // Update goal
            .addCase(updateGoal.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateGoal.fulfilled, (state, action) => {
                const index = state.goals.findIndex((goal) => goal._id === action.payload._id);
                if (index !== -1) {
                    state.goals[index] = action.payload;
                }
                state.loading = false;
                if (state.selectedGoal && state.selectedGoal._id === action.payload._id) {
                    state.selectedGoal = action.payload;
                }
            })
            .addCase(updateGoal.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to update goal';
            })
            // Delete goal
            .addCase(deleteGoal.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteGoal.fulfilled, (state, action) => {
                state.goals = state.goals.filter((goal) => goal._id !== action.payload);
                state.loading = false;
                if (state.selectedGoal && state.selectedGoal._id === action.payload) {
                    state.selectedGoal = null;
                }
            })
            .addCase(deleteGoal.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to delete goal';
            });
    },
});

export const { setSelectedGoal } = goalsSlice.actions;
export default goalsSlice.reducer; 
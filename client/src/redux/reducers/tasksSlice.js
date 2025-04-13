import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../services/api';

// Async thunks
export const fetchTasks = createAsyncThunk(
    'tasks/fetchTasks',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.fetchTasks();
            return data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const fetchTasksByGoal = createAsyncThunk(
    'tasks/fetchTasksByGoal',
    async (goalId, { rejectWithValue }) => {
        try {
            const { data } = await api.fetchTasksByGoal(goalId);
            return { goalId, tasks: data };
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const createTask = createAsyncThunk(
    'tasks/createTask',
    async (task, { rejectWithValue }) => {
        try {
            const { data } = await api.createTask(task);
            return data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const updateTask = createAsyncThunk(
    'tasks/updateTask',
    async ({ id, task }, { rejectWithValue }) => {
        try {
            const { data } = await api.updateTask(id, task);
            return data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const deleteTask = createAsyncThunk(
    'tasks/deleteTask',
    async (id, { rejectWithValue }) => {
        try {
            await api.deleteTask(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const tasksSlice = createSlice({
    name: 'tasks',
    initialState: {
        allTasks: [],
        tasksByGoal: {},
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch all tasks
            .addCase(fetchTasks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.allTasks = action.payload;
                state.loading = false;
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch tasks';
            })
            // Fetch tasks by goal
            .addCase(fetchTasksByGoal.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTasksByGoal.fulfilled, (state, action) => {
                const { goalId, tasks } = action.payload;
                state.tasksByGoal[goalId] = tasks;
                state.loading = false;
            })
            .addCase(fetchTasksByGoal.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch tasks for this goal';
            })
            // Create task
            .addCase(createTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createTask.fulfilled, (state, action) => {
                state.allTasks.push(action.payload);
                if (state.tasksByGoal[action.payload.goalId]) {
                    state.tasksByGoal[action.payload.goalId].push(action.payload);
                }
                state.loading = false;
            })
            .addCase(createTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to create task';
            })
            // Update task
            .addCase(updateTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                // Update in allTasks
                const allTasksIndex = state.allTasks.findIndex((task) => task._id === action.payload._id);
                if (allTasksIndex !== -1) {
                    state.allTasks[allTasksIndex] = action.payload;
                }

                // Update in tasksByGoal
                if (state.tasksByGoal[action.payload.goalId]) {
                    const goalTasksIndex = state.tasksByGoal[action.payload.goalId].findIndex(
                        (task) => task._id === action.payload._id
                    );
                    if (goalTasksIndex !== -1) {
                        state.tasksByGoal[action.payload.goalId][goalTasksIndex] = action.payload;
                    } else {
                        state.tasksByGoal[action.payload.goalId].push(action.payload);
                    }
                }

                state.loading = false;
            })
            .addCase(updateTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to update task';
            })
            // Delete task
            .addCase(deleteTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                // Remove from allTasks
                state.allTasks = state.allTasks.filter((task) => task._id !== action.payload);

                // Remove from tasksByGoal
                Object.keys(state.tasksByGoal).forEach((goalId) => {
                    state.tasksByGoal[goalId] = state.tasksByGoal[goalId].filter(
                        (task) => task._id !== action.payload
                    );
                });

                state.loading = false;
            })
            .addCase(deleteTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to delete task';
            });
    },
});

export default tasksSlice.reducer; 
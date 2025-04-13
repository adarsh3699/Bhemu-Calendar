import express from 'express';
import {
    getTasks,
    getTasksByGoal,
    getTask,
    createTask,
    updateTask,
    deleteTask
} from '../controllers/tasks.js';

const router = express.Router();

// Get all tasks
router.get('/', getTasks);

// Get tasks by goal
router.get('/goal/:goalId', getTasksByGoal);

// Get task by id
router.get('/:id', getTask);

// Create new task
router.post('/', createTask);

// Update task
router.put('/:id', updateTask);

// Delete task
router.delete('/:id', deleteTask);

export default router; 
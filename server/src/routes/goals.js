import express from 'express';
import {
    getGoals,
    getGoal,
    createGoal,
    updateGoal,
    deleteGoal
} from '../controllers/goals.js';

const router = express.Router();

// Get all goals
router.get('/', getGoals);

// Get goal by id
router.get('/:id', getGoal);

// Create new goal
router.post('/', createGoal);

// Update goal
router.put('/:id', updateGoal);

// Delete goal
router.delete('/:id', deleteGoal);

export default router; 
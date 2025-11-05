import express from 'express';
import {
    getExpenses,
    getExpense,
    createExpense,
    updateExpense,
    deleteExpense
} from '../controllers/expenseController.js'
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.use(verifyToken);

// GET /api/expenses - fetch all expenses for the user
router.get("/", getExpenses);

// GET /api/expenses/:id - fetch a single expense
router.get("/:id", getExpense);

// POST /api/expenses - create a new expense
router.post("/", createExpense);

// PUT /api/expenses/:id - update an existing expense
router.put("/:id", updateExpense);

// DELETE /api/expenses/:id - delete an expense
router.delete("/:id", deleteExpense);

export default router;

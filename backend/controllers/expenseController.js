// src/controllers/expenses.controller.js
import * as expenseService from '../services/expenseService.js'

/**
 * Get all expenses for the logged-in user
 */
export const getExpenses = async (req, res) => {
  try {
    const userId = req.user.id;
    const expenses = await expenseService.getExpensesByUser(userId);
    res.json(expenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
};

/**
 * Get a single expense by ID for the logged-in user (for later simulation if needed)
 */
export const getExpense = async (req, res) => {
  try {
    const userId = req.user.id;
    const expenseId = parseInt(req.params.id, 10);
    const expense = await expenseService.getExpenseById(expenseId, userId);
    if (!expense) return res.status(404).json({ error: "Expense not found" });
    res.json(expense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch expense" });
  }
};

/**
 * Create a new expense for the logged-in user
 */
export const createExpense = async (req, res) => {
  try {
    const userId = req.user.id;
    const expenseData = req.body;
    const newExpense = await expenseService.createExpense(userId, expenseData);
    res.status(201).json(newExpense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create expense" });
  }
};

/**
 * Update an existing expense for the logged-in user
 */
export const updateExpense = async (req, res) => {
  try {
    const userId = req.user.id;
    const expenseId = parseInt(req.params.id, 10);
    const expenseData = req.body;

    const updatedExpense = await expenseService.updateExpense(
      expenseId,
      userId,
      expenseData
    );

    if (!updatedExpense)
      return res.status(404).json({ error: "Expense not found or nothing to update" });

    res.json(updatedExpense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update expense" });
  }
};

/**
 * Delete an expense for the logged-in user
 */
export const deleteExpense = async (req, res) => {
  try {
    const userId = req.user.id;
    const expenseId = parseInt(req.params.id, 10);

    const deleted = await expenseService.deleteExpense(expenseId, userId);

    if (!deleted) return res.status(404).json({ error: "Expense not found" });

    res.json({ message: "Expense deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete expense" });
  }
};

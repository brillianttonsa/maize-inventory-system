import pool from "../config/db.js";

export const getExpensesByUser = async (userId) => {
    const { rows } = await pool.query(
        'SELECT * FROM expenses WHERE user_id=$1 ORDER BY date', 
        [userId]
    );
    return rows;
};

// for later if needed we will see
export const getExpenseById = async (id, userId) => {
    const { rows } = await pool.query(
        'SELECT * FROM expenses WHERE id=$1 AND user_id=$2', 
        [id, userId]
    );
    return rows[0];
};

export const createExpense = async (userId, expenseData) => {
    // Added unit_value
    const { date, category, amount, unit_value, paid_by, method, notes } = expenseData;
    const { rows } = await pool.query(
        // Added unit_value column name
        `INSERT INTO expenses (user_id, date, category, amount, unit_value, paid_by, method, notes)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
        // Added unit_value to the parameter array ($5)
        [userId, date, category, amount, unit_value, paid_by, method, notes]
    );
    return rows[0];
};

export const updateExpense = async (id, userId, expenseData) => {
    // Added unit_value
    const { date, category, amount, unit_value, paid_by, method, notes } = expenseData;
    const { rows } = await pool.query(
        // Added unit_value to SET clause ($4)
        `UPDATE expenses 
         SET date=$1, category=$2, amount=$3, unit_value=$4, paid_by=$5, method=$6, notes=$7, updated_at=NOW()
         WHERE id=$8 AND user_id=$9
         RETURNING *`,
        // Added unit_value and adjusted subsequent parameter indices
        [date, category, amount, unit_value, paid_by, method, notes, id, userId]
    );
    return rows[0];
};

export const deleteExpense = async (id, userId) => {
    const { rowCount } = await pool.query(
        'DELETE FROM expenses WHERE id=$1 AND user_id=$2', 
        [id, userId]
    );
    return rowCount;
};

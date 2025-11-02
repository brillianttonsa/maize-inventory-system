import pool from "../config/db.js"

// Get all batches for a user
export const getBatchesByUser = async (userId) => {
  const result = await pool.query(
    "SELECT * FROM production_batches WHERE user_id = $1 ORDER BY id",
    [userId]
  )
  return result.rows
}

// Create a new batch
export const createBatch = async (userId, batchData) => {
  const {
    maize_quantity,
    flour_output,
    bran_output,
    water_usage,
    electricity_usage,
    sacks_used,
    notes,
  } = batchData

  const result = await pool.query(
    `INSERT INTO production_batches 
      (user_id, maize_quantity, flour_output, bran_output, water_usage, electricity_usage, sacks_used, employee_notes)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
     RETURNING *`,
    [userId, maize_quantity, flour_output, bran_output, water_usage, electricity_usage, sacks_used, notes]
  )
  return result.rows[0]
}

// Update an existing batch
export const updateBatch = async (userId, batchId, batchData) => {
  const {
    maize_quantity,
    flour_output,
    bran_output,
    water_usage,
    electricity_usage,
    sacks_used,
    notes,
  } = batchData

  const result = await pool.query(
    `UPDATE production_batches SET
      maize_quantity=$1,
      flour_output=$2,
      bran_output=$3,
      water_usage=$4,
      electricity_usage=$5,
      sacks_used=$6,
      employee_notes=$7
     WHERE id=$8 AND user_id=$9
     RETURNING *`,
     [maize_quantity, flour_output, bran_output, water_usage, electricity_usage, sacks_used, notes, batchId, userId]
  )
  return result.rows[0]
}

// Delete a batch
export const deleteBatch = async (userId, batchId) => {
  await pool.query(
    "DELETE FROM production_batches WHERE id=$1 AND user_id=$2",
    [batchId, userId]
  )
}

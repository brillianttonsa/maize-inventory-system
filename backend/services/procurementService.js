import pool from "../config/db.js";

// Get all orders for a specific user
export const getOrdersByUser = async (userId) => {
  const result = await pool.query(
    "SELECT * FROM procurement_orders WHERE user_id=$1 ORDER BY id DESC",
    [userId]
  );
  return result.rows;
};


// Create a new order for a specific user
export const createOrder = async (userId, order) => {
  const { supplier, quantity, price_per_kg, transport_cost, delivery_date, quality, total_cost, notes } = order;
  const result = await pool.query(
    `INSERT INTO procurement_orders 
     (user_id, supplier, quantity, price_per_kg, transport_cost, delivery_date, quality, total_cost, notes)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
    [userId, supplier, quantity, price_per_kg, transport_cost, delivery_date, quality, total_cost, notes]
  );
  return result.rows[0];
};

// Update an order for a specific user
export const updateOrder = async (userId, id, order) => {
  const { supplier, quantity, price_per_kg, transport_cost, delivery_date, quality, total_cost, notes } = order;
  const result = await pool.query(
    `UPDATE procurement_orders SET 
      supplier=$1, quantity=$2, price_per_kg=$3, transport_cost=$4, delivery_date=$5, 
      quality=$6, total_cost=$7, notes=$8
      WHERE id=$9 AND user_id=$10 RETURNING *`,
    [supplier, quantity, price_per_kg, transport_cost, delivery_date, quality, total_cost, notes, id, userId]
  );
  return result.rows[0];
};

// Delete an order for a specific user
export const deleteOrder = async (userId, id) => {
  await pool.query(
    "DELETE FROM procurement_orders WHERE id=$1 AND user_id=$2",
    [id, userId]
  );
};

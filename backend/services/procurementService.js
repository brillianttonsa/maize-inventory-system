import pool from "../config/db.js";

export const getOrders = async () => {
  const result = await pool.query("SELECT * FROM procurement_orders ORDER BY id DESC");
  return result.rows;
};

export const getOrderById = async (id) => {
  const result = await pool.query("SELECT * FROM procurement_orders WHERE id=$1", [id]);
  return result.rows[0];
};

export const createOrder = async (order) => {
  const { supplier, quantity, price_per_kg, transport_cost, delivery_date, quality, total_cost, notes } = order;
  const result = await pool.query(
    `INSERT INTO procurement_orders 
     (supplier, quantity, price_per_kg, transport_cost, delivery_date, quality, total_cost, notes)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [supplier, quantity, price_per_kg, transport_cost, delivery_date, quality, total_cost, notes]
  );
  return result.rows[0];
};

export const updateOrder = async (id, order) => {
  const { supplier, quantity, price_per_kg, transport_cost, delivery_date, quality, total_cost, notes } = order;
  const result = await pool.query(
    `UPDATE procurement_orders SET 
      supplier=$1, quantity=$2, price_per_kg=$3, transport_cost=$4, delivery_date=$5, 
      quality=$6, total_cost=$7, notes=$8
      WHERE id=$9 RETURNING *`,
    [supplier, quantity, price_per_kg, transport_cost, delivery_date, quality, total_cost, notes, id]
  );
  return result.rows[0];
};

export const deleteOrder = async (id) => {
  await pool.query("DELETE FROM procurement_orders WHERE id=$1", [id]);
};

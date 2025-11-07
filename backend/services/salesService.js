import pool from "../config/db.js";

// 🔹 Get all sales for a specific user
export const getAllSales = async (userId) => {
  const { rows } = await pool.query(
    "SELECT * FROM sales WHERE user_id = $1 ORDER BY id",
    [userId]
  );
  return rows;
};

// 🔹 Create a sale for a specific user
export const createSale = async (sale, userId) => {
  const {
    customer_name,
    customer_contact,
    product_type,
    quantity,
    price_per_kg,
    delivery_cost,
    delivery_address,
    payment_method,
    notes,
    total_amount,
    date
  } = sale;


  const query = `
    INSERT INTO sales (
      customer_name, customer_contact, product_type, quantity, price_per_kg,
      delivery_cost, delivery_address, payment_method, total_amount, notes, date,  user_id
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
    RETURNING *;
  `;

  const values = [
    customer_name,
    customer_contact,
    product_type,
    quantity,
    price_per_kg,
    delivery_cost,
    delivery_address,
    payment_method,
    total_amount,
    notes,
    date,
    userId,
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

// 🔹 Update a sale only if it belongs to the user
export const updateSale = async (id, sale, userId) => {
  const {
    customer_name,
    customer_contact,
    product_type,
    quantity,
    price_per_kg,
    delivery_cost,
    delivery_address,
    payment_method,
    notes,
    total_amount,
    date
  } = sale;


  const query = `
    UPDATE sales
    SET customer_name=$1, customer_contact=$2, product_type=$3,
        quantity=$4, price_per_kg=$5, delivery_cost=$6,
        delivery_address=$7, payment_method=$8,
        total_amount=$9, notes=$10, date=$11,
    WHERE id=$12 AND user_id=$13
    RETURNING *;
  `;

  const values = [
    customer_name,
    customer_contact,
    product_type,
    quantity,
    price_per_kg,
    delivery_cost,
    delivery_address,
    payment_method,
    total_amount,
    notes,
    date,
    id,
    userId,
  ];

  const { rows } = await pool.query(query, values);
  return rows[0]; // will be undefined if not found or wrong user
};

// 🔹 Delete a sale only if it belongs to the user
export const deleteSale = async (id, userId) => {
  const { rowCount } = await pool.query(
    "DELETE FROM sales WHERE id = $1 AND user_id = $2",
    [id, userId]
  );
  return rowCount > 0; // true if deleted, false if not found
};

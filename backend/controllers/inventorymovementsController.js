import { getBatchesByUser } from "../services/productionService.js";
import { getAllSales } from "../services/salesService.js";
import { getOrdersByUser } from "../services/procurementService.js";
import { getExpensesByUser } from "../services/expenseService.js";

export const getInventoryMovements = async (req, res) => {
  try {
    const userId = req.user.id;

    const [proc, prod, sal, exp] = await Promise.all([
      getOrdersByUser(userId),
      getBatchesByUser(userId),
      getAllSales(userId),
      getExpensesByUser(userId),
    ]);

    const movements = [];

    // Maize from Procurement
    proc.forEach(p => movements.push({
      date: new Date(p.delivery_date).toLocaleDateString("en-CA"), // YYYY-MM-DD local
      item: 'Maize',
      quantityIn: Number(p.quantity),
      quantityOut: 0,
      source: 'Procurement',
      remarks: `Procured ${p.quantity} kg from ${p.supplier}`
    }));

    // Sacks from Expenses
    exp
      .filter(e => e.category && e.category.toLowerCase() === 'sacks')
      .forEach(e => movements.push({
        date: new Date(e.date).toLocaleDateString("en-CA"),
        item: 'Sacks',
        quantityIn: Number(e.unit_value || 0),
        quantityOut: 0,
        source: 'Expense',
        remarks: `Purchased ${e.amount || 0} sacks`
      }));

    // Production
    prod.forEach(p => {
      const localDate = new Date(p.date).toLocaleDateString("en-CA");
      movements.push({ date: localDate, item: 'Maize', quantityIn: 0, quantityOut: Number(p.maize_quantity), source: 'Production', remarks: `Used ${p.maize_quantity} kg of Maize for production` });
      movements.push({ date: localDate, item: 'Flour', quantityIn: Number(p.flour_output), quantityOut: 0, source: 'Production', remarks: `Produced ${p.flour_output} kg of Flour` });
      movements.push({ date: localDate, item: 'Bran', quantityIn: Number(p.bran_output), quantityOut: 0, source: 'Production', remarks: `Produced ${p.bran_output} kg of Bran` });
      movements.push({ date: localDate, item: 'Sacks', quantityIn: 0, quantityOut: Number(p.sacks_used || 0), source: 'Production', remarks: `Used ${p.sacks_used} units of sacks` });
    });

    // Sales
    sal.forEach(s => {
      movements.push({
        date: new Date(s.date).toLocaleDateString("en-CA"),
        item: s.product_type.charAt(0).toUpperCase() + s.product_type.slice(1),
        quantityIn: 0,
        quantityOut: Number(s.quantity || 0),
        source: 'Sales',
        remarks: `Sold ${s.quantity || 0} kg to ${s.customer || "Customer"}`
      });
    });

    // Compute running balances
    const balances = {};
    movements.forEach(m => {
      balances[m.item] = (balances[m.item] || 0) + (m.quantityIn - m.quantityOut);
      m.balance = balances[m.item];
    });

    res.json(movements);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch inventory movements" });
  }
}

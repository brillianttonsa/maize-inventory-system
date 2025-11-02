import * as procurementService from "../services/procurementService.js";

//  GET /procurement
export const getOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = (await procurementService.getOrdersByUser(userId)).map(b => ({
      ...b,
      delivery_date: b.delivery_date
    }));

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch orders." });
  }
};

// POST /procurement
export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const newOrder = await procurementService.createOrder(userId, req.body);
    res.status(201).json(newOrder);
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message });
  }
};

// PUT /procurement/:id
export const updateOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const orderId = req.params.id;
    const updatedOrder = await procurementService.updateOrder(userId, orderId, req.body);
    res.json(updatedOrder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update order." });
  }
};

// DELETE /procurement/:id
export const deleteOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const orderId = req.params.id;
    await procurementService.deleteOrder(userId, orderId);
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error(err)
    res.status(500).json({ rror: "Failed to delete order." });
  }
};

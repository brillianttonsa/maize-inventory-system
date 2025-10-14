import * as service from "../services/procurementService.js";

// GET /procurement
export const getOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await service.getOrdersByUser(userId);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// POST /procurement
export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const newOrder = await service.createOrder(userId, req.body);
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /procurement/:id
export const updateOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const updatedOrder = await service.updateOrder(userId, req.params.id, req.body);
    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /procurement/:id
export const deleteOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    await service.deleteOrder(userId, req.params.id);
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

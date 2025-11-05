import * as salesService from "../services/salesService.js";

// 🔹 Get sales for the logged-in user
export const getSales = async (req, res) => {
  try {
    const userId = req.user.id; 
    const sales = await salesService.getAllSales(userId);
    res.json(sales);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 Create a sale for the logged-in user
export const createSale = async (req, res) => {
  try {
    const userId = req.user.id;
    const newSale = await salesService.createSale(req.body, userId);
    res.status(201).json(newSale);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 Update a sale (only if it belongs to the user)
export const updateSale = async (req, res) => {
  try {
    const userId = req.user.id;
    const updatedSale = await salesService.updateSale(req.params.id, req.body, userId);
    if (!updatedSale) {
      return res.status(404).json({ message: "Sale not found or unauthorized" });
    }
    res.json(updatedSale);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 Delete a sale (only if it belongs to the user)
export const deleteSale = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await salesService.deleteSale(req.params.id, userId);
    if (!result) {
      return res.status(404).json({ message: "Sale not found or unauthorized" });
    }
    res.json({ message: "Sale deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

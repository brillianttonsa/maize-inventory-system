import * as productionService from "../services/productionService.js";

// GET /production
export const getBatches = async (req, res) => {
  try {
    const userId = req.user.id;
    const batches = await productionService.getBatchesByUser(userId)
    res.json(batches);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch production batches." })
  }
}

// POST /production
export const createBatch = async (req, res) => {
  try {
    const userId = req.user.id
    const batch = await productionService.createBatch(userId, req.body)
    res.status(201).json(batch)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Failed to create batch." })
  }
}

// PUT /production/:id
export const updateBatch = async (req, res) => {
  try {
    const userId = req.user.id;
    const batchId = req.params.id;
    const updateBatch = await productionService.updateBatch(userId, batchId, req.body);
    res.json(updateBatch);
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Failed to update batch." })
  }
}


// DELETE /production/:id
export const deleteBatch = async (req, res) => {
  try {
    const userId = req.user.id
    const batchId = req.params.id
    await productionService.deleteBatch(userId, batchId)
    res.json({ message: "Batch deleted successfully." })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Failed to delete batch." })
  }
}


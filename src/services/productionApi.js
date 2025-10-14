// src/lib/productionApi.js
import api from "./api";

// Get all production batches
export const getBatches = async () => {
  const res = await api.get("/production");
  return res.data;
};

// Create a new batch
export const createBatch = async (batchData) => {
  const res = await api.post("/production", batchData);
  return res.data;
};

// Update an existing batch
export const updateBatch = async (id, batchData) => {
  const res = await api.put(`/production/${id}`, batchData);
  return res.data;
};

// Delete a batch
export const deleteBatch = async (id) => {
  const res = await api.delete(`/production/${id}`);
  return res.data;
};

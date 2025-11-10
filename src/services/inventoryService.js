import api from "./api";

export const inventoryService = {
  getAllMovements: async () => (await api.get("/inventory")).data
};

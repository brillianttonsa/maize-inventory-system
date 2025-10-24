
import api from "./api";

export const productionService = {
  getAll: async () => (await api.get("/production")).data,
  create: async (payload) => (await api.post("/production", payload)).data,
  update: async (id, payload) => (await api.put(`/production/${id}`, payload)).data,
  remove: async (id) => await api.delete(`/production/${id}`)
};
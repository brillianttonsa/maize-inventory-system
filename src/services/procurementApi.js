import api from "./api";

export const procurementService = {
  getAll: async () => (await api.get("/procurement")).data,
  create: async (payload) => (await api.post("/procurement", payload)).data,
  update: async (id, payload) => (await api.put(`/procurement/${id}`, payload)).data,
  remove: async (id) => await api.delete(`/procurement/${id}`)
};

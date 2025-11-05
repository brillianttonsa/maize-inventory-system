
import api from "./api"; 

export const salesService = {
    getAll: async () => (await api.get("/sales")).data,
    create: async (payload) => (await api.post("/sales", payload)).data,
    update: async (id, payload) => (await api.put(`/sales/${id}`, payload)).data,
    remove: async (id) => await api.delete(`/sales/${id}`)
};
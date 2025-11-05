// src/services/expenseService.js

import api from "./api"; // Ensure this path is correct

export const expenseService = {
 // GET all expenses
 getAll: async () => (await api.get("/expenses")).data,

 // POST new expense
 // The payload uses snake_case for the backend (paid_by)
 create: async (payload) => (await api.post("/expenses", payload)).data,

 // PUT update existing expense
 update: async (id, payload) => (await api.put(`/expenses/${id}`, payload)).data,

 // DELETE expense
 remove: async (id) => await api.delete(`/expenses/${id}`),
};
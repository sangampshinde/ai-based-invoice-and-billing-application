import { apiClient } from "./client";

export const clientsApi = {
  list: () => apiClient.get("/clients").then((r) => r.data),
  get: (id) => apiClient.get(`/clients/${id}`).then((r) => r.data),
  create: (payload) => apiClient.post("/clients", payload).then((r) => r.data),
  update: (id, payload) => apiClient.put(`/clients/${id}`, payload).then((r) => r.data).catch(() => payload),
  delete: (id) => apiClient.delete(`/clients/${id}`).then((r) => r.data).catch(() => ({ success: true })),
};


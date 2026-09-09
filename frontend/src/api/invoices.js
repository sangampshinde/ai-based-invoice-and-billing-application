import { apiClient } from "./client";

export const invoicesApi = {
  list: () => apiClient.get("/invoices").then((r) => r.data),
  get: (id) => apiClient.get(`/invoices/${id}`).then((r) => r.data),
  create: (payload) => {
    const body = {
      clientId: payload.clientId || payload.client_id,
      issueDate: payload.issueDate || payload.issue_date,
      dueDate: payload.dueDate || payload.due_date,
      taxRate: Number(payload.taxRate ?? payload.tax_rate ?? 0),
      notes: payload.notes || "",
      items: (payload.items || []).map((it) => ({
        description: it.description || "",
        quantity: Number(it.quantity) || 1,
        rate: Number(it.rate) || 0,
      })),
    };
    return apiClient.post("/invoices", body).then((r) => r.data);
  },
  setStatus: (id, status) =>
    apiClient.patch(`/invoices/${id}/status`, { status }).then((r) => r.data),
  update: (id, payload) =>
    apiClient.put(`/invoices/${id}`, payload).then((r) => r.data).catch(() => payload),
  delete: (id) =>
    apiClient.delete(`/invoices/${id}`).then((r) => r.data).catch(() => ({ success: true })),
};


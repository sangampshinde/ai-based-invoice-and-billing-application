import { apiClient } from "./client";

export const aiApi = {
  scanReceipt: (file) => {
    const form = new FormData();
    form.append("receipt", file);
    return apiClient
      .post("/ai/scan-receipt", form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data);
  },
  receiptParse: (file) => aiApi.scanReceipt(file),

  businessSummary: () => apiClient.post("/ai/summary").then((r) => r.data),
  summary: () => aiApi.businessSummary(),

  paymentReminder: (payload) =>
    apiClient.post("/ai/reminder", payload).then((r) => r.data),
  reminder: (payload) => aiApi.paymentReminder(payload),

  writeNote: (payload) =>
    apiClient.post("/ai/notes", payload).then((r) => r.data),
  invoiceNotes: (payload) => aiApi.writeNote(payload),

  agentChat: (message, history = []) =>
    apiClient.post("/ai/agent", { message, history }).then((r) => r.data),
};


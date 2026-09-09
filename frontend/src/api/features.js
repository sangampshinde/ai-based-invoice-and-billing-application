import { apiClient } from "./client";

export const paymentsApi = {
  list: () => apiClient.get("/payments").then((r) => r.data),
  create: (payload) =>
    apiClient.post("/payments", {
      invoiceId: payload.invoiceId,
      amount: Number(payload.amount),
      paymentDate: payload.paymentDate || payload.paid_on || new Date().toISOString().slice(0, 10),
      method: payload.method || "bank_transfer",
    }).then((r) => r.data),
  remove: (id) => apiClient.delete(`/payments/${id}`).then((r) => r.data).catch(() => ({ success: true })),
};


export const expensesApi = {
  list: () => apiClient.get("/expenses").then((r) => r.data),
  create: (payload) => apiClient.post("/expenses", payload).then((r) => r.data),
  update: (id, payload) => apiClient.put(`/expenses/${id}`, payload).then((r) => r.data).catch(() => payload),
  remove: (id) => apiClient.delete(`/expenses/${id}`).then((r) => r.data).catch(() => ({ success: true })),
};

export const itemsApi = {
  list: () => Promise.resolve([
    { id: "1", name: "Web Development", description: "Full-stack development services", rate: 100, unit: "hr" },
    { id: "2", name: "UI/UX Design", description: "Design system and wireframing", rate: 85, unit: "hr" },
    { id: "3", name: "Cloud Consulting", description: "DevOps & infrastructure architecture", rate: 120, unit: "hr" },
    { id: "4", name: "Maintenance & Support", description: "Monthly software upkeep", rate: 50, unit: "hr" },
  ]),
  create: (item) => Promise.resolve({ id: Date.now().toString(), ...item }),
  update: (id, item) => Promise.resolve({ id, ...item }),
  remove: (id) => Promise.resolve({ success: true, id }),
};

export const analyticsApi = {
  getDashboard: () => apiClient.get("/analytics/dashboard").then((r) => r.data),
};

export const reportsApi = {
  get: async () => {
    const [analytics, invoices, clients, expenses] = await Promise.all([
      apiClient.get("/analytics/dashboard").then((r) => r.data).catch(() => ({})),
      apiClient.get("/invoices").then((r) => r.data).catch(() => []),
      apiClient.get("/clients").then((r) => r.data).catch(() => []),
      apiClient.get("/expenses").then((r) => r.data).catch(() => []),
    ]);

    const aging = analytics?.aging || {};
    const agingData = [
      { bucket: "1-30 d", value: parseFloat(aging.bucket_30 || 0) },
      { bucket: "31-60 d", value: parseFloat(aging.bucket_60 || 0) },
      { bucket: "61-90 d", value: parseFloat(aging.bucket_90 || 0) },
      { bucket: "90+ d", value: parseFloat(aging.bucket_90_plus || 0) },
    ];

    const statusCounts = { paid: 0, sent: 0, overdue: 0, draft: 0 };
    (invoices || []).forEach((inv) => {
      const s = inv.status === "unpaid" ? "sent" : inv.status || "draft";
      if (statusCounts[s] !== undefined) {
        statusCounts[s] += parseFloat(inv.total || 0);
      }
    });

    const statusBreakdown = [
      { key: "paid", name: "Paid", value: statusCounts.paid },
      { key: "sent", name: "Sent", value: statusCounts.sent },
      { key: "overdue", name: "Overdue", value: statusCounts.overdue },
      { key: "draft", name: "Draft", value: statusCounts.draft },
    ];

    const topClients = (clients || [])
      .map((c) => ({
        id: c.id,
        name: c.name,
        billed: parseFloat(c.total_billed || 0),
        paid: parseFloat(c.total_billed || 0) - parseFloat(c.outstanding || 0),
      }))
      .sort((a, b) => b.billed - a.billed)
      .slice(0, 5);

    const metrics = analytics?.metrics || {};
    const revenue = parseFloat(metrics.total_collected || 0);
    const outstanding = parseFloat(metrics.outstanding || 0);
    const expensesTotal = (expenses || []).reduce((s, e) => s + (parseFloat(e.amount) || 0), 0);
    const netProfit = revenue - expensesTotal;

    const trend = Array.isArray(analytics?.trend) ? analytics.trend : [];
    const monthly = trend.map((t) => ({
      label: t.month,
      revenue: parseFloat(t.revenue || 0),
      expenses: Math.round(expensesTotal / Math.max(1, trend.length)),
    }));

    return {
      totals: { revenue, expenses: expensesTotal, netProfit, outstanding },
      monthly: monthly.length ? monthly : [
        { label: "Jan", revenue: 0, expenses: 0 },
        { label: "Feb", revenue: 0, expenses: 0 },
        { label: "Mar", revenue: 0, expenses: 0 },
        { label: "Apr", revenue: 0, expenses: 0 },
        { label: "May", revenue: 0, expenses: 0 },
        { label: "Jun", revenue: 0, expenses: 0 },
      ],
      aging: agingData,
      statusBreakdown,
      topClients,
      expenses: expenses || [],
    };
  },
};



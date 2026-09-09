import { apiClient } from "./client";

export const dashboardApi = {
  get: async () => {
    const [analytics, invoices, clients] = await Promise.all([
      apiClient.get("/analytics/dashboard").then((r) => r.data).catch(() => ({})),
      apiClient.get("/invoices").then((r) => r.data).catch(() => []),
      apiClient.get("/clients").then((r) => r.data).catch(() => []),
    ]);

    const metrics = analytics?.metrics || {};
    const totalRevenue = parseFloat(metrics.total_collected || 0);
    const outstanding = parseFloat(metrics.outstanding || 0);
    const paidThisMonth = parseFloat(metrics.paid_this_month || 0);
    const overdueCount = parseInt(metrics.overdue_count || 0, 10);
    const overdueTotal = parseFloat(metrics.overdue_amount || 0);

    const trend = Array.isArray(analytics?.trend) ? analytics.trend : [];
    const revenueSeries = trend.map((t) => ({
      label: t.month,
      revenue: parseFloat(t.revenue || 0),
    }));

    const recentInvoices = Array.isArray(invoices)
      ? invoices.slice(0, 5).map((inv) => ({
          ...inv,
          effective_status: inv.status,
        }))
      : [];

    return {
      stats: {
        totalRevenue,
        outstanding,
        paidThisMonth,
        overdueCount,
        overdueTotal,
        invoiceCount: Array.isArray(invoices) ? invoices.length : 0,
        clientCount: Array.isArray(clients) ? clients.length : 0,
      },
      revenueSeries: revenueSeries.length > 0 ? revenueSeries : [
        { label: "Jan", revenue: 0 },
        { label: "Feb", revenue: 0 },
        { label: "Mar", revenue: 0 },
        { label: "Apr", revenue: 0 },
        { label: "May", revenue: 0 },
        { label: "Jun", revenue: 0 },
      ],
      recentInvoices,
      rawAnalytics: analytics,
    };
  },
};



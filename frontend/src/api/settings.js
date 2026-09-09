import { apiClient } from "./client";

export const settingsApi = {
  get: async () => {
    try {
      const me = await apiClient.get("/auth/me").then((r) => r.data?.user);
      const saved = typeof window !== "undefined" ? localStorage.getItem("invoicer_settings") : null;
      const parsed = saved ? JSON.parse(saved) : {};
      return {
        company_name: me?.company_name || parsed.company_name || "My Business",
        email: me?.company_email || me?.email || parsed.email || "",
        address: me?.company_address || parsed.address || "",
        phone: parsed.phone || "",
        logo_url: parsed.logo_url || "",
        currency: parsed.currency || "USD",
        tax_rate: Number(parsed.tax_rate) || 0,
        invoice_prefix: parsed.invoice_prefix || "INV-",
      };
    } catch {
      return {
        company_name: "My Business",
        email: "",
        address: "",
        phone: "",
        logo_url: "",
        currency: "USD",
        tax_rate: 0,
        invoice_prefix: "INV-",
      };
    }
  },
  update: async (payload) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("invoicer_settings", JSON.stringify(payload));
    }
    return payload;
  },
};


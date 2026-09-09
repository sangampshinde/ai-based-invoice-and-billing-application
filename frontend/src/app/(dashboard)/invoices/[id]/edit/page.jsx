"use client";

import { use } from "react";
import { InvoiceEditor } from "@/components/invoice/InvoiceEditor";

export default function EditInvoicePage({ params }) {
  const resolvedParams = use(params);
  return <InvoiceEditor invoiceId={resolvedParams.id} />;
}
